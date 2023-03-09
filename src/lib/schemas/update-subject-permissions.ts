import { z } from "zod";

export const updateSubjectPermissionsSchema = z.object({
  roleId: z.number(),
  subject: z.string(),
  actions: z.array(z.string()),
});

export type UpdateSubjectPermissionsData = z.input<
  typeof updateSubjectPermissionsSchema
>;
