import { z } from "zod";

export const roleAssignmentSchema = z.object({
  userId: z.string(),
  fullName: z.string(),
  roleId: z.number(),
  name: z.string(),
  description: z.string(),
});

export type RoleAssignment = z.input<typeof roleAssignmentSchema>;
