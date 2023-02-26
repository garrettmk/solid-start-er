import { signUpSchema } from "~/lib/schemas/sign-up";
import { delay } from "~/lib/util/util";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const publicRouter = router({
  signUp: publicProcedure
    .input(signUpSchema)
    .mutation(async ({ input, ctx }) => {
      await delay(2000);

      const { email, password, confirmPassword, ...otherData } = input;
      return ctx.supabase.auth.signUp({
        email,
        password,
        options: { data: otherData },
      });
    }),

  greeting: protectedProcedure.query(async () => {
    return "Hello there!";
  }),
});
