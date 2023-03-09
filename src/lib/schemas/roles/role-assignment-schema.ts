import { z } from "zod";
import { userProfileSchema } from "../user-profile-schema";
import { roleAssignmentRowSchema } from "./role-assignment-row-schema";

export const roleAssignmentSchema = roleAssignmentRowSchema.extend({
  user: userProfileSchema,
  role: z.string(),
});

export type RoleAssignment = z.input<typeof roleAssignmentSchema>;
