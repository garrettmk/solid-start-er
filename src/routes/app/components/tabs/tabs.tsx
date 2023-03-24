import { PageContent } from "@/lib/components/page/page-content";
import { PageHeader } from "@/lib/components/page/page-header";
import { Panel } from "@/lib/components/panels/panel";
import { Tab } from "@/lib/components/tabs/tab";
import { TabList } from "@/lib/components/tabs/tab-list";
import { TabTrigger } from "@/lib/components/tabs/tab-trigger";
import { Tabs } from "@/lib/components/tabs/tabs";
import { Heading } from "@/lib/components/text/heading";
import { TabsProvider } from "@/lib/contexts/tabs-context";

export default function TabsPage() {
  return (
    <>
      <PageHeader>
        <Heading class="text-lg font-medium">Tabs</Heading>
      </PageHeader>
      <PageContent>
        <Panel class="p-6">
          <Heading class="text-2xl mb-6">Tabs</Heading>

          <TabsProvider>
            <Tabs>
              <TabList>
                <TabTrigger value="one">One</TabTrigger>
                <TabTrigger value="two">Two</TabTrigger>
                <TabTrigger value="three">Three</TabTrigger>
              </TabList>

              <Tab value="one">Tab One</Tab>
              <Tab value="two">Tab Two</Tab>
              <Tab value="three">Tab Three</Tab>
            </Tabs>
          </TabsProvider>
        </Panel>
      </PageContent>
    </>
  );
}
