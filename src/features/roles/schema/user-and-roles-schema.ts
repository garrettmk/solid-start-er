import { z } from "zod";
import { roleSchema } from "./role-schema";

export const userAndRolesSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  roles: z.array(roleSchema.omit({ subjects: true })),
});

export type UserAndRoles = z.input<typeof userAndRolesSchema>;
