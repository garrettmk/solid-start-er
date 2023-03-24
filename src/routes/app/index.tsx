import { PageContent } from "@/lib/components/page/page-content";
import { PageHeader } from "@/lib/components/page/page-header";
import { Panel } from "@/lib/components/panels/panel";
import { Heading } from "@/lib/components/text/heading";
import { createSignal } from "solid-js";

export function AppPage() {
  const [permissions, setPermissions] = createSignal<string[]>(["assign"]);

  const handleChange = (newPermissions: string[]) => {
    setPermissions(newPermissions);
    setTimeout(() => {
      setPermissions(["assign"]);
    }, 3000);
  };

  return (
    <>
      <PageHeader>
        <Heading class="text-lg font-medium">Solid SaaS</Heading>
      </PageHeader>
      <PageContent>
        <Panel class="p-6">
          <Heading class="text-2xl mb-6">Bonk</Heading>
        </Panel>
      </PageContent>
    </>
  );
}

export default AppPage;
