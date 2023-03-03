import { signUpSchema } from "~/lib/schemas/sign-up";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const publicRouter = router({
  signUp: publicProcedure
    .input(signUpSchema)
    .mutation(async ({ input, ctx }) => {
      const { email, password, confirmPassword, ...otherData } = input;

      console.log(otherData);

      return ctx.supabase.auth.signUp({
        email,
        password,
        options: { data: otherData },
      });
    }),

  greeting: protectedProcedure.query(async () => {
    throw new Error("Noooooo!");
    return "Hello there!";
  }),
});
