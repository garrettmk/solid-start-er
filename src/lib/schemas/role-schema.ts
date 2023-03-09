import { z } from "zod";

export const roleSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(3),
});

export type RoleData = z.input<typeof roleSchema>;
