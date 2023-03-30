import { RolePermissionRow } from "@/features/roles/schema/role-permissions-row-schema";
import { RoleRow } from "@/features/roles/schema/role-row-schema";
import { Role, roleSchema } from "@/features/roles/schema/role-schema";
import { roleUpdateInputSchema } from "@/features/roles/schema/role-update-input-schema";
import { makeResponseSchema } from "@/lib/schemas/postgrest-response.schema";
import { camelizeObject, snakeifyObject } from "@/lib/util/objects.util";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { group, mapValues, pick, shake } from "radash";
import { z } from "zod";
import { protectedProcedure, makeRouter } from "../../../lib/trpc/trpc";
import {
  RoleAssignment,
  roleAssignmentSchema,
} from "../schema/role-assignment-schema";

export const rolesRouter = makeRouter({
  getRolesAndPermissions: protectedProcedure
    .output(makeResponseSchema(z.array(roleSchema)))
    .query(async ({ ctx }) => {
      const { supabase } = ctx;

      const result = (await supabase
        .from("roles_and_permissions")
        .select("*")) as PostgrestSingleResponse<Role[]>;

      return result;
    }),

  findRoles: protectedProcedure
    .output(makeResponseSchema(z.array(z.any())))
    .query(async ({ ctx }) => {
      const { supabase } = ctx;

      const result = await supabase.from("application_roles").select(`
          id,
          name,
          description,
          subjects:application_role_permissions(
            subject,
            action
          )
        `);

      console.log(result.data?.[0]);
      return result;
    }),

  createRole: protectedProcedure
    .input(roleSchema.omit({ id: true, permissions: true }))
    .mutation(async ({ input, ctx }) => {
      const { supabase, user } = ctx;
      console.log("createRole");
      return supabase.from("application_roles").insert(input);
    }),

  getRole: protectedProcedure
    .input(z.number())
    .output(roleSchema)
    .query(async ({ input, ctx }) => {
      const { supabase } = ctx;
      const roleRow = await supabase
        .from("application_roles")
        .select("*")
        .eq("id", input)
        .single<RoleRow>();

      if (roleRow.error) {
        throw roleRow.error;
      }

      const permissionsRows = await supabase
        .from("application_role_permissions")
        .select<"*", RolePermissionRow>("*")
        .eq("role_id", roleRow.data.id);

      if (permissionsRows.error) throw permissionsRows.error;

      const role: Role = {
        ...roleRow.data,
        permissions: mapValues(
          group(permissionsRows.data!, (row) => row.subject),
          (permissionRows) => permissionRows!.map((row) => row.action)
        ),
      };

      return role;
    }),

  updateRole: protectedProcedure
    .input(roleUpdateInputSchema)
    // .output(roleSchema)
    .mutation(async ({ input, ctx }) => {
      const { supabase } = ctx;
      const { id, name, description, permissions } = input;

      if (name || description) {
        const update = shake({ name, description });
        const roleUpdate = await supabase
          .from("application_roles")
          .update(update)
          .eq("id", id);

        if (roleUpdate.error) throw roleUpdate.error;
      }

      if (permissions) {
        const rows = Object.values(
          mapValues(permissions, (actions, subject) =>
            actions.map((action) => ({
              role_id: id,
              subject,
              action,
            }))
          )
        ).flat();

        await supabase
          .from("application_role_permissions")
          .delete()
          .eq("role_id", id);

        const permissionsUpdate = await supabase
          .from("application_role_permissions")
          .insert(rows);

        if (permissionsUpdate.error) throw permissionsUpdate.error;
      }

      return "It worked!";
    }),

  deleteRole: protectedProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      const { supabase } = ctx;

      const result = await supabase
        .from("application_roles")
        .delete()
        .eq("id", input);

      if (result.error) throw result.error;

      return result.data;
    }),

  getRolePermissions: protectedProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      const { supabase } = ctx;
      return supabase
        .from("application_role_permissions")
        .select("*")
        .filter("role_id", "eq", input);
    }),

  setSubjectPermissions: protectedProcedure
    .input(
      z.object({
        roleId: z.number(),
        subject: z.string().min(3),
        actions: z.array(z.string().min(3)),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { supabase } = ctx;
      const { roleId, subject, actions } = input;

      await supabase
        .from("application_role_permissions")
        .delete()
        .eq("role_id", roleId)
        .eq("subject", subject);

      const insertResult = await supabase
        .from("application_role_permissions")
        .insert(
          actions.map((action) => ({
            role_id: roleId,
            subject,
            action,
          }))
        );

      if (insertResult.error) {
        console.log(insertResult.error);
        throw insertResult.error;
      }

      return insertResult.data;
    }),

  assignRole: protectedProcedure
    .input(
      z.object({
        role_id: z.number(),
        user_id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { supabase } = ctx;
      const result = await supabase.from("application_users").insert(input);

      if (result.error) throw result.error;

      return result.data;
    }),

  assignRoles: protectedProcedure
    .input(
      z.object({
        userIds: z.array(z.string()),
        roleIds: z.array(z.number()),
      })
    )
    .output(z.boolean())
    .mutation(async ({ input, ctx }) => {
      const { supabase } = ctx;
      const { userIds, roleIds } = input;
      const rows = userIds.flatMap((user_id) =>
        roleIds.map((role_id) => ({ user_id, role_id }))
      );

      const result = await supabase.from("application_users").upsert(rows, {
        ignoreDuplicates: true,
      });

      if (result.error) throw result.error;
      return true;
    }),

  getRoleAssignments: protectedProcedure
    .output(z.array(roleAssignmentSchema))
    .mutation(async ({ input, ctx }) => {
      const { supabase } = ctx;
      const result = await supabase
        .from("application_role_assignments")
        .select("*");

      if (result.error) throw result.error;
      return result.data.map(camelizeObject) as RoleAssignment[];
    }),

  deleteRoleAssignments: protectedProcedure
    .input(z.array(roleAssignmentSchema))
    .mutation(async ({ input, ctx }) => {
      const { supabase } = ctx;
      const conditions = input
        .map((i) => pick(i, ["userId", "roleId"]))
        .map(snakeifyObject);

      const result = await supabase
        .from("application_users")
        .delete()
        .in("user_id, role_id", conditions);

      if (result.error) throw result.error;
      return result.data;
    }),
});
