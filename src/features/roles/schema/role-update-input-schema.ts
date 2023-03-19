import { z } from "zod";
import { roleSchema } from "./role-schema";

export const roleUpdateInputSchema = roleSchema
  .partial()
  .omit({ id: true })
  .extend({ id: z.number() });

export type RoleUpdateInput = z.input<typeof roleUpdateInputSchema>;
