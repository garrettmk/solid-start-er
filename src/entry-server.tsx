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

      // Redirect unauthenticated users to the sign in page
      // if (url.pathname.startsWith("/app") && !cookies.has("session"))
      //   return redirect("/sign-in");

      // Create a supabase client for the request
      const supabase = await createSupabaseClient();
      const user = tokens && (await useAuthTokens(supabase, tokens));

      event.locals.supabase = supabase;
      event.locals.user = user;

      // We don't need to create the caller if this is an API request
      if (!url.pathname.startsWith("/api"))
        event.locals.api = apiRouter.createCaller({ supabase, user });

      return forward(event);
    },
  renderAsync((event) => <StartServer event={event} />)
);
