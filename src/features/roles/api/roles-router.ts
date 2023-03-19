import { RolePermissionRow } from "@/features/roles/schema/role-permissions-row-schema";
import { RoleRow } from "@/features/roles/schema/role-row-schema";
import { Role, roleSchema } from "@/features/roles/schema/role-schema";
import { roleUpdateInputSchema } from "@/features/roles/schema/role-update-input-schema";
import { group, mapValues, shake } from "radash";
import { z } from "zod";
import { protectedProcedure, router } from "../../../lib/trpc/trpc";

export const rolesRouter = router({
  findRoles: protectedProcedure.query(async ({ ctx }) => {
    const { supabase } = ctx;

    return supabase.from("application_roles").select("*");
  }),

  createRole: protectedProcedure
    .input(roleSchema.omit({ id: true, subjects: true }))
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
        subjects: mapValues(
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
      const { id, name, description, subjects } = input;

      if (name || description) {
        const update = shake({ name, description });
        const roleUpdate = await supabase
          .from("application_roles")
          .update(update)
          .eq("id", id);

        if (roleUpdate.error) throw roleUpdate.error;
      }

      if (subjects) {
        const rows = Object.values(
          mapValues(subjects, (actions, subject) =>
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

  getRoleAssignments: protectedProcedure.mutation(async ({ input, ctx }) => {
    const { supabase } = ctx;
    const result = await supabase
      .from("application_role_assignments")
      .select("*");

    if (result.error) throw result.error;
    return result.data;
  }),
});
