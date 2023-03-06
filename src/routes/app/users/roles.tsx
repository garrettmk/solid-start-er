import { ColumnDef } from "@tanstack/solid-table";
import { createEffect } from "solid-js";
import { Button } from "~/components/buttons/button";
import { Drawer } from "~/components/drawers/drawer";
import { NewRoleForm } from "~/components/forms/new-role-form";
import { BlurOverlay } from "~/components/overlays/blur-overlay";
import { PageContent } from "~/components/page/page-content";
import { PageHeader } from "~/components/page/page-header";
import { HStack } from "~/components/stacks/h-stack";
import { Table } from "~/components/tables/table";
import { TableContainer } from "~/components/tables/table-container";
import { Code } from "~/components/text/code";
import { Heading } from "~/components/text/heading";
import { createToggle } from "~/lib/util/create-toggle";

const columns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
];

const roles = [
  {
    name: "Admin",
    description:
      "Admins can create new application users, assign and remove roles.",
  },
];

export function UserRolesPage() {
  const isCreateOpen = createToggle(false);

  const handleClickCreate = (event: Event) => {
    event.stopImmediatePropagation();
    isCreateOpen.on();
  };

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
          <Table columns={columns} data={roles} class="-mb-[2px]" />
        </TableContainer>
      </PageContent>
      <Drawer
        isOpen={isCreateOpen.value}
        onClickOutside={isCreateOpen.off}
        placement="right"
        backdrop
      >
        <PageHeader>
          <Heading class="font-medium">New Role</Heading>
        </PageHeader>
        <NewRoleForm class="mt-6 px-6">
          <Button type="submit" class="ml-auto">
            Create Role
          </Button>
        </NewRoleForm>
      </Drawer>
    </>
  );
}

export default UserRolesPage;
