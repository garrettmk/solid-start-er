import { User } from "@supabase/supabase-js";
import { Resource } from "solid-js";
import { createRouteAction, RouteDataArgs, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { Button } from "~/components/buttons/button";
import { api } from "~/lib/api/client";

export function routeData(args: RouteDataArgs) {
  return createServerData$((source, event) => {
    return {
      user: event.locals.user,
    };
  });
}

export function AppPage() {
  const data = useRouteData<Resource<any>>();
  const [greeting, greet] = createRouteAction(async () => {
    return await api.public.greeting.query();
  });

  return (
    <section>
      <Button onClick={() => greet()}>Greet</Button>
      <pre>{greeting.result}</pre>
      <pre class="text-red-600">{greeting.error?.message}</pre>
      <pre>Hello, {data()?.user.email}</pre>
    </section>
  );
}

export default AppPage;
