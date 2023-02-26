import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Please enter your email address")
    .email("Must be a valid email address"),

  password: z.string().min(1, "Please enter your password"),

  rememberMe: z.boolean().optional(),
});

export type SignInData = z.input<typeof signInSchema>;
