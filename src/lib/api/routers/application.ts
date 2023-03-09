import { group, mapValues, shake } from "radash";
import { z } from "zod";
import { rolePermissionsSchema } from "~/lib/schemas/role-permissions-schema";
import { roleUpdateInputSchema } from "~/lib/schemas/roles/role-update-input-schema";
import { roleSchema } from "~/lib/schemas/roles/role-schema";
import { RolePermissionRow } from "~/lib/schemas/roles/role-permissions-row-schema";
import { RoleRow } from "~/lib/schemas/roles/role-row-schema";
import { Role } from "~/lib/schemas/roles/role-schema";
import { protectedProcedure, router } from "../trpc";
import { equal } from "assert";
import { roleAssignmentSchema } from "~/lib/schemas/roles/role-assignment-schema";

export const applicationRouter = router({
  findManyRoles: protectedProcedure.query(async ({ ctx }) => {
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

  getRoleAssignments: protectedProcedure.mutation(async ({ input, ctx }) => {
    const { supabase } = ctx;
    const result = await supabase
      .from("application_role_assignments")
      .select("*");

    if (result.error) throw result.error;
    return result.data;
  }),
});
