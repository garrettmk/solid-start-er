import { z } from "zod";

export const postgrestErrorSchema = z.object({
  message: z.string(),
  details: z.string(),
  hint: z.string(),
  code: z.string(),
});

export const postgrestResponseBaseSchema = z.object({
  status: z.number(),
  statusText: z.string(),
});

export const postgrestResponseSuccessSchema =
  postgrestResponseBaseSchema.extend({
    data: z.any(),
    count: z.number().or(z.null()),
    error: z.null(),
  });

export const postgrestResponseFailureSchema =
  postgrestResponseBaseSchema.extend({
    data: z.null(),
    count: z.null(),
    error: postgrestErrorSchema,
  });

export const postgrestSingleResponseSchema = z.union([
  postgrestResponseSuccessSchema,
  postgrestResponseFailureSchema,
]);

export function makeResponseSchema<T>(type: z.Schema<T>) {
  return postgrestResponseSuccessSchema
    .extend({ data: type })
    .or(postgrestResponseFailureSchema);
}
