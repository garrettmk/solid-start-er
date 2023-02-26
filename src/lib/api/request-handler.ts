import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { APIEvent } from "solid-start";
import { appRouter } from "~/lib/api/router";
import { supabase } from "~/lib/supabase/supabase";
import { parseCookieString } from "../util/util";

export const apiRequestHandler = (event: APIEvent) =>
  fetchRequestHandler({
    endpoint: "/api",
    req: event.request,
    router: appRouter,
    createContext: async (options) => {
      const cookieString = options.req.headers.get("cookie");
      const cookies = parseCookieString(cookieString ?? "");
      const accessToken = cookies.get("access-token");
      const { data } = await supabase.auth.getUser(accessToken);

      return {
        supabase,
        user: data.user ?? undefined,
      };
    },
  });
