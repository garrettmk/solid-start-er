import { z } from "zod";

export const roleAssignmentRowSchema = z.object({
  role_id: z.number(),
  user_id: z.string(),
});

export type RoleAssignmentRow = z.input<typeof roleAssignmentRowSchema>;
