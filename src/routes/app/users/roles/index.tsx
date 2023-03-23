import { Button } from "@/components/buttons/button";
import { Drawer } from "@/components/drawers/drawer";
import { BlurOverlay } from "@/components/overlays/blur-overlay";
import { PageContent } from "@/components/page/page-content";
import { PageHeader } from "@/components/page/page-header";
import { HStack } from "@/components/stacks/h-stack";
import { Table } from "@/components/tables/table";
import { TableContainer } from "@/components/tables/table-container";
import { Code } from "@/components/text/code";
import { Heading } from "@/components/text/heading";
import { NewRoleForm } from "@/features/roles/components/new-role-form";
import { Role } from "@/features/roles/schema/role-schema";
import { api } from "@/lib/trpc/client";
import { createToggle } from "@/lib/util/create-toggle";
import { getAuthenticatedServerContext } from "@/lib/util/get-page-context";
import { ColumnDef } from "@tanstack/solid-table";
import { Match, Switch } from "solid-js";
import { A, createRouteAction, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";

const columns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    id: "editRole",
    header: "Edit Role",
    cell: ({ table, row }) => (
      <A href={`/app/users/roles/${row.original.id}`}>
        <Button color="ghost" size="sm">
          Edit
        </Button>
      </A>
    ),
  },
];

export function routeData() {
  return createServerData$(async (_, event) => {
    const { api } = getAuthenticatedServerContext(event);
    return api.roles.getRolesAndPermissions();
  });
}

export function UserRolesPage() {
  const data = useRouteData<typeof routeData>();
  const roles = () => data()?.data ?? [];
  const isCreateOpen = createToggle(false);

  const handleClickCreate = (event: Event) => {
    event.stopImmediatePropagation();
    isCreateOpen.on();
  };

  const [create, createRole] = createRouteAction((data: Role) =>
    api.roles.createRole.mutate(data)
  );

  return (
    <>
      <PageHeader>
        <h2 class="text-sm text-slate-800 dark:text-slate-200">
          Application Roles
        </h2>
      </PageHeader>
      <PageContent>
        <TableContainer>
          <div class="p-6 bg-white dark:bg-slate-800">
            <HStack align="start" justify="between">
              <h3 class="text-lg font-medium text-slate-600 dark:text-slate-400 mb-6">
                Application Roles
              </h3>
              <Button onClick={handleClickCreate}>New Role</Button>
            </HStack>
            <p class="text-sm">
              Application roles give users permissions at the application level.
              These roles are used for managing tenants and other users.
            </p>
            <p class="text-sm mt-3">
              Only superusers can create, delete, or modify application roles
              and their permissions. However, users with the
              <Code class="mx-1">application:assign</Code>
              permission can assign or remove these roles from other users.
            </p>
          </div>
          <Table columns={columns} data={roles() ?? []} />
          <Switch>
            <Match when={roles()?.length === 0}>
              <div class="bg-white dark:bg-slate-800 text-center text-sm p-4">
                Click "New Role" to create a role.
              </div>
            </Match>
          </Switch>
        </TableContainer>
      </PageContent>
      <BlurOverlay isOpen={isCreateOpen.value} onClick={isCreateOpen.off} />
      <Drawer isOpen={isCreateOpen.value} placement="right" backdrop>
        <PageHeader>
          <Heading class="font-medium">New Role</Heading>
        </PageHeader>
        <NewRoleForm class="mt-6 px-6" onSubmit={createRole}>
          <Button type="submit" class="ml-auto">
            Create Role
          </Button>
        </NewRoleForm>
      </Drawer>
    </>
  );
}

export default UserRolesPage;
