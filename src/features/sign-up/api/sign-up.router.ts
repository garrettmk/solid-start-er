import { publicProcedure, makeRouter } from "@/lib/trpc/trpc";
import { signUpInputSchema } from "../schema/sign-up-input.schema";

export const signUpRouter = makeRouter({
  signUp: publicProcedure
    .input(signUpInputSchema)
    .mutation(async ({ input, ctx }) => {
      const { profession, account } = input;
      const { email, password, confirmPassword, ...otherData } = account;

      return ctx.supabase.auth.signUp({
        email,
        password,
        options: { data: otherData },
      });
    }),
});
