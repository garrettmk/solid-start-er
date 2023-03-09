import { z } from "zod";

export const roleSchema = z.object({
  id: z.number(),
  name: z.string().min(3),
  description: z.string().min(3).optional(),
  subjects: z.record(z.array(z.string())),
});

export type Role = z.input<typeof roleSchema>;
