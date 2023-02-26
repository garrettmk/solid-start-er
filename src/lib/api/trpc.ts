import { AuthUser, SupabaseClient } from "@supabase/supabase-js";
import { initTRPC, TRPCError } from "@trpc/server";

export type ApiContext = {
  supabase: SupabaseClient;
  user?: AuthUser;
};

const t = initTRPC.context<ApiContext>().create();

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });

  return next({ ctx });
});

export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
