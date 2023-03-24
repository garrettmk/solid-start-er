import { PageContent } from "@/lib/components/page/page-content";
import { PageHeader } from "@/lib/components/page/page-header";
import { Panel } from "@/lib/components/panels/panel";
import { Progress } from "@/lib/components/progress/progress";
import { VStack } from "@/lib/components/stacks/v-stack";
import { Heading } from "@/lib/components/text/heading";

export function ProgressComponentPage() {
  return (
    <>
      <PageHeader>
        <Heading class="text-lg font-medium">Progress</Heading>
      </PageHeader>
      <PageContent>
        <Panel class="p-6">
          <Heading class="text-2xl mb-6">Progress</Heading>
          <VStack>
            <Progress value={25} size="sm" />
          </VStack>
        </Panel>
      </PageContent>
    </>
  );
}

export default ProgressComponentPage;
