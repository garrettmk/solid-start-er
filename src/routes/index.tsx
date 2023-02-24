import "flowbite";
import { createSignal } from "solid-js";
import { createRouteData, useRouteData } from "solid-start";
import { Button } from "~/components/buttons/button";
import { HStack } from "~/components/stacks/h-stack";
import { supabase } from "~/lib/supabase/supabase";

export function routeData() {
  return createRouteData(async () => {
    const countries = await supabase.from("countries").select();
    return "hello there";
  });
}

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = createSignal(false);
  const data = useRouteData();

  return (
    <>
      <main class="sm:ml-64 pt-20">
        <Button onClick={() => setSidebarOpen(true)}>Show</Button>
        <HStack spacing="xs">
          <Button>Default</Button>
          <Button color="alternative">Alternative</Button>
          <Button color="dark">Dark</Button>
          <Button color="light">Light</Button>
          <Button color="green">Green</Button>
          <Button color="red">Red</Button>
        </HStack>
        <HStack spacing="xs" align="end" class="mt-3">
          <Button size="xs">X-Small</Button>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">X-Large</Button>
        </HStack>
      </main>
    </>
  );
}
