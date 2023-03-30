import { initTRPC, TRPCError } from "@trpc/server";
import { ZodError } from "zod";
import { delay } from "../util/util";
import { APIContext, isAuthenticatedAPIContext } from "./context";

const t = initTRPC.context<APIContext>().create({
  errorFormatter: ({ shape, error }) => {
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
  if (!isAuthenticatedAPIContext(ctx))
    throw new TRPCError({ code: "UNAUTHORIZED" });

  return next({ ctx });
});

const isDelayed = t.middleware(async ({ next, ctx }) => {
  await delay(2000);
  return next({ ctx });
});

export const makeRouter = t.router;
export const publicProcedure = t.procedure.use(isDelayed);
export const protectedProcedure = t.procedure.use(isDelayed).use(isAuthed);
