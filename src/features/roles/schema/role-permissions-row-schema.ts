import { z } from "zod";

export const rolePermissionRowSchema = z.object({
  role_id: z.number(),
  subject: z.string().min(3),
  action: z.string().min(3),
});

export type RolePermissionRow = z.input<typeof rolePermissionRowSchema>;
