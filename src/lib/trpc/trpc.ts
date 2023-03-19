import { AuthUser, SupabaseClient } from "@supabase/supabase-js";
import { initTRPC, TRPCError } from "@trpc/server";
import { ZodError } from "zod";
import { delay } from "../util/util";

export type ApiContext = {
  supabase: SupabaseClient;
  user?: AuthUser;
};

const t = initTRPC.context<ApiContext>().create({
  errorFormatter: ({ shape, error }) => {
    console.log(error);

    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === "BAD_REQUEST" && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    };
  },
});

const isAuthed = t.middleware(({ next, ctx }) => {
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
