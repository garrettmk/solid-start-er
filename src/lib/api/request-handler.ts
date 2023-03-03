import { AuthUser, SupabaseClient } from "@supabase/supabase-js";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { APIEvent } from "solid-start";
import { appRouter } from "~/lib/api/router";

export const apiRequestHandler = (event: APIEvent) =>
  fetchRequestHandler({
    endpoint: "/api",
    req: event.request,
    router: appRouter,
    createContext: async () => {
      return {
        supabase: event.locals.supabase as SupabaseClient,
        user: event.locals.user as AuthUser,
      };
    },
  });
