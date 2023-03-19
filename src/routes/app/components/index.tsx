import { PageContent } from "@/components/page/page-content";
import { PageHeader } from "@/components/page/page-header";
import { Panel } from "@/components/panels/panel";
import { Heading } from "@/components/text/heading";

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
