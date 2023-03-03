import { AuthUser, SupabaseClient } from "@supabase/supabase-js";
import { initTRPC, TRPCError } from "@trpc/server";
import { delay } from "../util/util";

export type ApiContext = {
  supabase: SupabaseClient;
  user?: AuthUser;
};

const t = initTRPC.context<ApiContext>().create();

const isAuthed = t.middleware(({ next, ctx }) => {
  console.log("isAuthed");
  if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });

  return next({ ctx });
});

const isDelayed = t.middleware(async ({ next, ctx }) => {
  await delay(2000);
  return next({ ctx });
});

export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure.use(isDelayed);
export const protectedProcedure = t.procedure.use(isDelayed).use(isAuthed);
