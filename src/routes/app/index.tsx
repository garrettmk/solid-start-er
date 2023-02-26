import { createResource } from "solid-js";
import { createRouteAction } from "solid-start";
import { Button } from "~/components/buttons/button";
import { api } from "~/lib/api/client";

export function AppPage() {
  const [greeting, greet] = createRouteAction(async () => {
    return await api.public.greeting.query();
  });

  return (
    <section class="ml-14">
      This is the app landing page.
      <Button onClick={() => greet()}>Greet</Button>
      <pre>{greeting.result}</pre>
    </section>
  );
}

export default AppPage;
