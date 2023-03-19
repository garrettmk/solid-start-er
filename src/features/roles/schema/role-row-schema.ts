import { z } from "zod";

export const roleRowSchema = z.object({
  id: z.number(),
  name: z.string().min(3),
  description: z.string().min(3).optional(),
});

export type RoleRow = z.input<typeof roleRowSchema>;
