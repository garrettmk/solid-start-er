import { ColumnDef, Updater } from "@tanstack/solid-table";
import { createEffect, createMemo, createSignal, For } from "solid-js";
import { createRouteAction, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { BreadcrumbItem } from "@/components/breadcrumbs/breadcrumb-item";
import { Breadcrumbs } from "@/components/breadcrumbs/breadcrumbs";
import { Button } from "@/components/buttons/button";
import { CheckIcon } from "@/components/icons/check-icon";
import { ChevronLeftIcon } from "@/components/icons/chevron-left-icon";
import { ChevronRightIcon } from "@/components/icons/chevron-right-icon";
import { Checkbox } from "@/components/inputs/check-box";
import { PageContent } from "@/components/page/page-content";
import { PageHeader } from "@/components/page/page-header";
import { Panel } from "@/components/panels/panel";
import { HStack } from "@/components/stacks/h-stack";
import { VStack } from "@/components/stacks/v-stack";
import { Step, Steps } from "@/components/steps/steps";
import { Table, TableProps } from "@/components/tables/table";
import { TableContainer } from "@/components/tables/table-container";
import { TabContent } from "@/components/tabs/tab-content";
import { Heading } from "@/components/text/heading";
import { createIndex, IndexProvider } from "@/lib/contexts/index-context";
import { Role } from "@/features/roles/schema/role-schema";
import { UserProfile } from "@/features/users/schema/user-profile-schema";
import { getAuthenticatedServerContext } from "@/lib/util/get-page-context";
import { api } from "@/lib/trpc/client";

export function routeData() {
  return createServerData$(async (_, event) => {
    const { api } = getAuthenticatedServerContext(event);
    const [users, roles] = await Promise.all([
      api.users.findUsersWithRoles(),
      api.roles.findRoles(),
    ]);

    return { users, roles };
  });
}

const userColumns: ColumnDef<UserProfile>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomePageRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        indeterminate={row.getIsSomeSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  },
  {
    accessorKey: "fullName",
    header: "User",
    cell: ({ getValue }) => <span>{getValue<string>()}</span>,
  },
  {
    accessorKey: "roles",
    header: "Current roles",
    cell: ({ getValue }) => (
      <span>
        {getValue<Role[]>()
          ?.map((role) => role.name)
          .join(", ")}
      </span>
    ),
  },
];

const roleColumns: ColumnDef<Role>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomePageRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        indeterminate={row.getIsSomeSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ getValue }) => <span>{getValue<string>()}</span>,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ getValue }) => <span>{getValue<string>()}</span>,
  },
];

export default function AssignPage() {
  const data = useRouteData<typeof routeData>();
  const users = () => data()?.users;
  const roles = () => data()?.roles;
  const index = createIndex();

  //
  // User selection
  //
  const [selectedUserRows, setSelectedUserRows] = createSignal({});
  const selectedUsers = createMemo(() => {
    const selected = selectedUserRows();
    const userData = users()?.data;
    if (!userData) return [];

    return Object.entries(selected)
      .filter(([, isSelected]) => isSelected)
      .map(([idx]) => userData[parseInt(idx)]);
  });

  const usersTableOptions: TableProps["options"] = {
    state: {
      get rowSelection() {
        return selectedUserRows();
      },
    },
    enableRowSelection: true,
    onRowSelectionChange: setSelectedUserRows,
  };

  //
  // Role selection
  //
  const [selectedRoleRows, setSelectedRoleRows] = createSignal({});
  const selectedRoles = createMemo(() => {
    const selected = selectedRoleRows();
    const roleData = roles()?.data;
    if (!roleData) return [];

    return Object.entries(selected)
      .filter(([, isSelected]) => isSelected)
      .map(([idx]) => roleData[parseInt(idx)]);
  });

  const roleTableOptions: TableProps["options"] = {
    state: {
      get rowSelection() {
        return selectedRoleRows();
      },
    },
    enableRowSelection: true,
    onRowSelectionChange: setSelectedRoleRows,
  };

  //
  // Assignment
  //
  const [assignment, assignRoles] = createRouteAction(async () => {
    return api.roles.assignRoles.mutate({
      userIds: selectedUsers().map((user) => user.id),
      roleIds: selectedRoles().map((role) => role.id),
    });
  });

  createEffect(() => {
    if (assignment.error) index.set(4);
    else if (assignment.result) index.set(3);
  });

  return (
    <>
      <PageHeader>
        <Breadcrumbs>
          <BreadcrumbItem href="/app/users/roles">Roles</BreadcrumbItem>
          <BreadcrumbItem>/</BreadcrumbItem>
          <BreadcrumbItem href="/app/users/roles/assignments">
            Assignments
          </BreadcrumbItem>
          <BreadcrumbItem>/</BreadcrumbItem>
          <BreadcrumbItem>Assign Roles</BreadcrumbItem>
        </Breadcrumbs>
      </PageHeader>
      <IndexProvider index={index}>
        <PageContent>
          <Panel class="p-6 mb-6">
            <Steps class="justify-center">
              <Step index={0}>Select Users</Step>
              <Step index={1}>Select Roles</Step>
              <Step index={2}>Confirmation</Step>
            </Steps>
          </Panel>

          {/**
           * Select Users
           */}
          <TabContent index={0}>
            <TableContainer>
              <div class="p-6 bg-white dark:bg-slate-800">
                <HStack align="start" justify="between">
                  <VStack align="start" justify="start">
                    <Heading level="2" class="text-3xl font-medium mb-6">
                      Select Users
                    </Heading>
                    <p>Select the users you would like to assign roles to.</p>
                  </VStack>
                  <Button
                    class="block"
                    onClick={index.next}
                    disabled={!selectedUsers().length}
                  >
                    Next
                    <ChevronRightIcon class="ml-2" />
                  </Button>
                </HStack>
              </div>
              <Table
                columns={userColumns}
                data={users()?.data ?? []}
                options={usersTableOptions}
                class="[&_th:first-child]:w-[0.1%]"
              />
            </TableContainer>
          </TabContent>

          {/**
           * Select Roles
           */}
          <TabContent index={1}>
            <TableContainer>
              <div class="p-6 bg-white dark:bg-slate-800">
                <HStack align="start" justify="between">
                  <VStack align="start" justify="start">
                    <Heading level="2" class="text-3xl font-medium mb-6">
                      Select Roles
                    </Heading>
                    <p>Choose the roles you want to assign to these users.</p>
                  </VStack>
                  <HStack spacing="sm">
                    <Button class="block" onClick={index.prev}>
                      Back
                      <ChevronLeftIcon class="mr-2" />
                    </Button>
                    <Button
                      class="block"
                      onClick={index.next}
                      disabled={!selectedRoles().length}
                    >
                      Next
                      <ChevronRightIcon class="ml-2" />
                    </Button>
                  </HStack>
                </HStack>
              </div>
              <Table
                columns={roleColumns}
                data={roles()?.data ?? []}
                options={roleTableOptions}
                class="[&_th:first-child]:w-[0.1%]"
              />
            </TableContainer>
          </TabContent>

          {/**
           * Confirmation
           */}
          <TabContent index={2}>
            <Panel class="p-6">
              <HStack align="start" justify="between">
                <Heading level="2" class="text-3xl font-medium mb-6">
                  Confirmation
                </Heading>
                <HStack spacing="sm">
                  <Button class="block" onClick={index.prev}>
                    <ChevronLeftIcon class="mr-2" />
                    Back
                  </Button>

                  <Button
                    class="block"
                    color="green"
                    onClick={() => assignRoles()}
                    disabled={assignment.pending}
                  >
                    <CheckIcon class="mr-2" />
                    Assign Roles
                  </Button>
                </HStack>
              </HStack>
              <p class="mt-6">
                You are about to give potentially destructive powers to these
                users. Are you sure you want to do this?
              </p>
              <HStack justify="center" spacing="lg" class="mt-12">
                <VStack class="w-64" spacing="sm">
                  <Heading
                    level="3"
                    class="text-lg font-medium border-b border-slate-300 dark:border-slate-700"
                  >
                    Users
                  </Heading>
                  <ul>
                    <For each={selectedUsers()}>
                      {(user) => <li>{user.fullName}</li>}
                    </For>
                  </ul>
                </VStack>

                <VStack spacing="sm" class="w-64">
                  <Heading
                    level="3"
                    class="text-lg font-medium border-b border-slate-300 dark:border-slate-700"
                  >
                    Roles
                  </Heading>
                  <ul class="mt-0">
                    <For each={selectedRoles()}>
                      {(role) => <li>{role.name}</li>}
                    </For>
                  </ul>
                </VStack>
              </HStack>
            </Panel>
          </TabContent>

          {/**
           * Success
           */}
          <TabContent index={3}>
            <Panel class="p-6">
              <Heading level="2" class="text-3xl font-medium mb-6">
                Success!
              </Heading>
              <p>The roles were assignedd succesfully.</p>
            </Panel>
          </TabContent>

          {/**
           * Error
           */}
          <TabContent index={4}>
            <Panel class="p-6">
              <HStack align="start" justify="between">
                <Heading level="2" class="text-3xl font-medium mb-6">
                  Error
                </Heading>
                <Button onClick={index.prev}>
                  <ChevronLeftIcon class="ml-2" />
                  Back
                </Button>
              </HStack>
              <pre>{JSON.stringify(assignment.error, null, "  ")}</pre>
            </Panel>
          </TabContent>
        </PageContent>
      </IndexProvider>
    </>
  );
}
