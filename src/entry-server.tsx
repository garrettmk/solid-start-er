import { redirect } from "solid-start";
import {
  createHandler,
  renderAsync,
  StartServer,
} from "solid-start/entry-server";
import { appRouter } from "./lib/api/router";
import { createSupabaseFrom } from "./lib/supabase/supabase";
import { parseCookieString } from "./lib/util/util";

export default createHandler(
  ({ forward }) =>
    async (event) => {
      const url = new URL(event.request.url);
      const cookies = parseCookieString(
        event.request.headers.get("Cookie") ?? ""
      );

      // Redirect unauthenticated users to the sign in page
      // if (url.pathname.startsWith("/app") && !cookies.has("session"))
      //   return redirect("/sign-in");

      // Create authenticated context
      const supabase = await createSupabaseFrom(event.request);
      const { data, error } = await supabase.auth.getUser();
      const user = data.user ?? undefined;

      // Redirect to sign-in if there is an error
      if (error) console.log(error);

      event.locals.user = user;
      event.locals.supabase = supabase;

      // We don't need to create the caller if this is an API request
      if (!url.pathname.startsWith("/api"))
        event.locals.api = appRouter.createCaller({ supabase, user });

      return forward(event);
    },
  renderAsync((event) => <StartServer event={event} />)
);
