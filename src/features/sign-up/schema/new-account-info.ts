import { z } from "zod";

export const newAccountInfoSchema = z
  .object({
    fullName: z
      .string()
      .min(3, "Please enter at least 3 characters")
      .max(30, "Please, no more than 30 characters")
      .regex(
        /^[a-zA-Z' \p{L}\-]+$/,
        "Names can include any Unicode letter, hyphen, or apostrophe"
      ),

    casualName: z
      .string()
      .min(3, "Please enter at least 3 characters")
      .max(30, "Please, no more than 30 characters")
      .regex(
        /^[a-zA-Z' \p{L}\-]+$/,
        "Names can include any Unicode letter, hyphen, or apostrophe"
      )
      .optional(),

    avatarUrl: z.string().optional(),

    email: z
      .string({ description: "Please enter your email address" })
      .email("Please enter a valid email address"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(30, "Password must be less than 30 characters")
      .regex(/^.*[a-z]+.*$/, "Must include at least one lowercase letter")
      .regex(/^.*[A-Z]+.*$/, "Must include at least one uppercase letter")
      .regex(/^.*[0-9]+.*$/, "Must include at least one number")
      .regex(
        /^.*[#?!@$%^&*@_^&*(){}[\]\-]+.*$/,
        "Must include at least one special character (#?!@$%^&*-@_^&*(){}[])"
      ),

    confirmPassword: z.string(),
    agreesToTerms: z.literal(true),
    wantsMarketing: z.boolean(),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password)
      ctx.addIssue({
        code: "custom",
        message: "Must match your password",
      });
  });

export type NewAccountInfoData = z.input<typeof newAccountInfoSchema>;
