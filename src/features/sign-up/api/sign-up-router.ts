import { supabaseServiceRole } from "@/lib/supabase/supabase";
import { publicProcedure, router } from "@/lib/trpc/trpc";
import { signUpSchema } from "../schema/sign-up";

export const signUpRouter = router({
  signUp: publicProcedure
    .input(signUpSchema)
    .mutation(async ({ input, ctx }) => {
      const { email, password, confirmPassword, ...otherData } = input;

      return ctx.supabase.auth.signUp({
        email,
        password,
        options: { data: otherData },
      });
    }),
});
