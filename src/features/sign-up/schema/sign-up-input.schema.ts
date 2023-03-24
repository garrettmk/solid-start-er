import { z } from "zod";
import { chooseProfessionInputSchema } from "./choose-profession-input.schema";
import { newAccountInputSchema } from "./new-account-input.schema";

export const signUpInputSchema = z.object({
  profession: chooseProfessionInputSchema,
  account: newAccountInputSchema,
});

export type SignUpInput = z.input<typeof signUpInputSchema>;
