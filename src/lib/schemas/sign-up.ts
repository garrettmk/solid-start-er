import { z } from "zod";
import { selectProfessionSchema } from "./choose-profession";
import { newAccountInfoSchema } from "./new-account-info";

export const signUpSchema = newAccountInfoSchema.and(selectProfessionSchema);

export type SignUpData = z.input<typeof signUpSchema>;
