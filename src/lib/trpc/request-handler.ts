import { AuthUser, SupabaseClient } from "@supabase/supabase-js";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { APIEvent } from "solid-start";
import { apiRouter } from "@/lib/trpc/router";

export const apiRequestHandler = (event: APIEvent) =>
  fetchRequestHandler({
    endpoint: "/api",
    req: event.request,
    router: apiRouter,
    createContext: async () => {
      return {
        supabase: event.locals.supabase as SupabaseClient,
        user: event.locals.user as AuthUser,
      };
    },
  });
