import { redirect } from "solid-start";
import {
  createHandler,
  renderAsync,
  StartServer,
} from "solid-start/entry-server";
import { getRequestUser } from "./lib/util/util";

export default createHandler(
  ({ forward }) =>
    async (event) => {
      const url = new URL(event.request.url);
      const user = await getRequestUser(event.request);

      if (url.pathname.startsWith("/app") && !user) return redirect("/sign-in");

      event.locals.user = user;
      return forward(event);
    },
  renderAsync((event) => <StartServer event={event} />)
);
