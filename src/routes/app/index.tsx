import { createSignal, Resource } from "solid-js";
import { createRouteAction, RouteDataArgs, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { PageContent } from "~/components/page/page-content";
import { PageHeader } from "~/components/page/page-header";
import { Panel } from "~/components/panels/panel";
import { SubjectPermissionsInput } from "~/components/inputs/subject-permissions-input";
import { Heading } from "~/components/text/heading";
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
          <Heading class="text-2xl mb-6">Components</Heading>

          <SubjectPermissionsInput
            subject="application_roles"
            actions={["create", "read", "update", "delete", "assign"]}
            permissions={permissions()}
            onChangePermissions={handleChange}
          />
        </Panel>
      </PageContent>
    </>
  );
}

export default AppPage;
