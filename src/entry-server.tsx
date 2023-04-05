import {
  createHandler,
  renderAsync,
  StartServer,
} from "solid-start/entry-server";
import { createSupabaseClient } from "./lib/supabase/supabase";
import {
  getAuthTokensFromRequest,
  useAuthTokens,
} from "./lib/util/auth-tokens.util";
import { apiRouter } from "./lib/trpc/router";
import { redirect } from "solid-start";

export default createHandler(
  ({ forward }) =>
    async (event) => {
      const url = new URL(event.request.url);
      const tokens = getAuthTokensFromRequest(event.request);

      // Create a supabase client for the request
      const supabase = await createSupabaseClient();
      event.locals.supabase = supabase;

      // If tokens were sent, sign in the client and add the user to locals
      const user = tokens && (await useAuthTokens(supabase, tokens));
      event.locals.user = user;

      // Redirect to login if the user is not authenticated
      if (!user && url.pathname.startsWith("/app")) return redirect("/sign-in");

      // Create an API caller for the page routes to use
      if (!url.pathname.startsWith("/api"))
        event.locals.api = apiRouter.createCaller({ supabase, user });

      return forward(event);
    },
  renderAsync((event) => <StartServer event={event} />)
);
