import {
  createHandler,
  renderAsync,
  StartServer,
} from "solid-start/entry-server";
import {
  createSupabaseClient,
  getAuthTokens,
  useAuthTokens,
} from "./lib/supabase/supabase";
import { apiRouter } from "./lib/trpc/router";

export default createHandler(
  ({ forward }) =>
    async (event) => {
      const url = new URL(event.request.url);
      const tokens = getAuthTokens(event.request);

      // Create a supabase client for the request
      const supabase = await createSupabaseClient();
      event.locals.supabase = supabase;

      // If tokens were sent, sign in the client and add the user to locals
      const user = tokens && (await useAuthTokens(supabase, tokens));
      event.locals.user = user;

      // We don't need to create the caller if this is an API request
      if (!url.pathname.startsWith("/api"))
        event.locals.api = apiRouter.createCaller({ supabase, user });

      return forward(event);
    },
  renderAsync((event) => <StartServer event={event} />)
);
