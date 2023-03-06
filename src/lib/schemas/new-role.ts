import { z } from "zod";

export const newRoleSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(3),
});

export type NewRoleData = z.input<typeof newRoleSchema>;
