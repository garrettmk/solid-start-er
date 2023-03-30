import { BreadcrumbItem } from "@/lib/components/breadcrumbs/breadcrumb-item";
import { Breadcrumbs } from "@/lib/components/breadcrumbs/breadcrumbs";
import { PageContent } from "@/lib/components/page/page-content";
import { PageHeader } from "@/lib/components/page/page-header";
import { getAuthenticatedServerContext } from "@/lib/util/get-page-context";
import { RouteDataArgs, useParams, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";

export function routeData({ params }: RouteDataArgs) {
  return createServerData$(
    async (id, event) => {
      const { api } = getAuthenticatedServerContext(event);

      return api.users.getUser(id);
    },
    {
      key: () => params.id,
    }
  );
}

export function UserProfilePage() {
  const { id } = useParams();
  const user = useRouteData<typeof routeData>();

  return (
    <>
      <PageHeader title="User Profile">
        <Breadcrumbs>
          <BreadcrumbItem href="/app/users/">Users</BreadcrumbItem>
          <BreadcrumbItem>/</BreadcrumbItem>
          <BreadcrumbItem>{user()?.data?.fullName}</BreadcrumbItem>
        </Breadcrumbs>
      </PageHeader>
      <PageContent>
        <pre>{JSON.stringify(user()?.data, null, 2)}</pre>
      </PageContent>
    </>
  );
}

export default UserProfilePage;
