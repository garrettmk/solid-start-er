import { PageContent } from "@/lib/components/page/page-content";
import { PageHeader } from "@/lib/components/page/page-header";
import { Panel } from "@/lib/components/panels/panel";
import { Heading } from "@/lib/components/text/heading";

export default function ComponentsPage() {
  return (
    <>
      <PageHeader>
        <Heading class="text-lg font-medium">Components</Heading>
      </PageHeader>
      <PageContent>
        <Panel class="p-6">
          <Heading class="text-2xl mb-6">Components</Heading>
        </Panel>
      </PageContent>
    </>
  );
}
