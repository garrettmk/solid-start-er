import { z } from "zod";

export const rolePermissionsSchema = z.object({
  roleId: z.number(),
  subject: z.string(),
  action: z.string(),
});

export type RolePermissionsData = z.input<typeof rolePermissionsSchema>;
