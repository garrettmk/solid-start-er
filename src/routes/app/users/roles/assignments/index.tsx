import { BreadcrumbItem } from "@/components/breadcrumbs/breadcrumb-item";
import { Breadcrumbs } from "@/components/breadcrumbs/breadcrumbs";
import { Button } from "@/components/buttons/button";
import { TrashIcon } from "@/components/icons/trash-icon";
import { PageContent } from "@/components/page/page-content";
import { PageHeader } from "@/components/page/page-header";
import { HStack } from "@/components/stacks/h-stack";
import { Table } from "@/components/tables/table";
import { TableContainer } from "@/components/tables/table-container";
import { getAuthenticatedServerContext } from "@/lib/util/get-page-context";
import { ColumnDef } from "@tanstack/solid-table";
import { A, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";

const columns: ColumnDef<any>[] = [
  {
    accessorKey: "full_name",
    header: "User",
  },
  {
    accessorKey: "name",
    header: "Role",
  },
  {
    id: "delete",
    header: "Delete",
    cell: () => (
      <Button color="ghost" size="sm">
        <TrashIcon size="sm" />
      </Button>
    ),
  },
];

export function routeData() {
  return createServerData$(async (_, event) => {
    const { api } = getAuthenticatedServerContext(event);
    return await api.roles.getRoleAssignments();
  });
}

export function RoleAssignmentsPage() {
  const data = useRouteData<typeof routeData>();

  return (
    <>
      <PageHeader>
        <Breadcrumbs>
          <BreadcrumbItem href="/app/users/roles">Roles</BreadcrumbItem>
          <BreadcrumbItem>/</BreadcrumbItem>
          <BreadcrumbItem>Assignments</BreadcrumbItem>
        </Breadcrumbs>
      </PageHeader>
      <PageContent>
        <TableContainer>
          <div class="p-6 bg-white dark:bg-slate-800">
            <HStack align="start" justify="between">
              <h3 class="text-lg font-medium text-slate-600 dark:text-slate-400 mb-6">
                Role Assignments
              </h3>
              <A href="/app/users/roles/assignments/new">
                <Button>New Assignment</Button>
              </A>
            </HStack>
            <p class="text-sm max-w-md">
              View and manage application role assignments here. Remember,
              application roles can do damage to your system if not used
              properly. Be careful!
            </p>
          </div>
          <Table
            columns={columns}
            data={data()}
            class="[&_th:last-child]:w-[0.1%]"
          />
        </TableContainer>
      </PageContent>
    </>
  );
}

export default RoleAssignmentsPage;
