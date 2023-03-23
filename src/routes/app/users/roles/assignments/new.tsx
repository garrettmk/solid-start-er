import { BreadcrumbItem } from "@/components/breadcrumbs/breadcrumb-item";
import { Breadcrumbs } from "@/components/breadcrumbs/breadcrumbs";
import { Button } from "@/components/buttons/button";
import { CheckIcon } from "@/components/icons/check-icon";
import { ChevronLeftIcon } from "@/components/icons/chevron-left-icon";
import { ChevronRightIcon } from "@/components/icons/chevron-right-icon";
import { PageContent } from "@/components/page/page-content";
import { PageHeader } from "@/components/page/page-header";
import { Panel } from "@/components/panels/panel";
import { HStack } from "@/components/stacks/h-stack";
import { VStack } from "@/components/stacks/v-stack";
import { Step, Steps } from "@/components/steps/steps";
import { TableContainer } from "@/components/tables/table-container";
import { Heading } from "@/components/text/heading";
import { SelectRolesTable } from "@/features/roles/components/select-roles-table";
import { SelectUsersTable } from "@/features/roles/components/select-users-table";
import { newRoleAssignmentsMachine } from "@/features/roles/machines/new-assignments.machine";
import { Role } from "@/features/roles/schema/role-schema";
import { UserAndRoles } from "@/features/roles/schema/user-and-roles-schema";
import { IndexProvider } from "@/lib/contexts/index-context";
import { getAuthenticatedServerContext } from "@/lib/util/get-page-context";
import { useStateIndex } from "@/lib/util/use-state-index";
import { useMachine } from "@xstate/solid";
import { For, Show } from "solid-js";
import { useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";

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

export default function AssignPage() {
  const data = useRouteData<typeof routeData>();
  const users = () => data()?.users.data ?? [];
  const roles = () => data()?.roles.data ?? [];

  const [state, send] = useMachine(newRoleAssignmentsMachine);

  const handleSelectUsers = (users: UserAndRoles[]) =>
    send({ type: "SELECT", payload: users });
  const handleSelectRoles = (roles: Role[]) =>
    send({ type: "SELECT", payload: roles });

  const index = useStateIndex(state, [
    "selectingUsers",
    "selectingRoles",
    "assigningRoles",
    "success",
  ]);

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
              <Step index={2}>Assign Roles</Step>
            </Steps>
          </Panel>

          {/**
           * Select Users
           */}
          <Show when={state.matches("selectingUsers")}>
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
                    onClick={() => send("NEXT")}
                    disabled={!state.can("NEXT")}
                  >
                    Next
                    <ChevronRightIcon class="ml-2" />
                  </Button>
                </HStack>
              </div>
              <SelectUsersTable
                users={users}
                onChangeSelection={handleSelectUsers}
              />
            </TableContainer>
          </Show>

          {/**
           * Select Roles
           */}
          <Show when={state.matches("selectingRoles")}>
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
                    <Button class="block" onClick={() => send("BACK")}>
                      Back
                      <ChevronLeftIcon class="mr-2" />
                    </Button>
                    <Button
                      class="block"
                      disabled={!state.can("NEXT")}
                      onClick={() => send("NEXT")}
                    >
                      Next
                      <ChevronRightIcon class="ml-2" />
                    </Button>
                  </HStack>
                </HStack>
              </div>
              <SelectRolesTable
                roles={roles}
                onChangeSelection={handleSelectRoles}
              />
            </TableContainer>
          </Show>

          {/**
           * Confirmation
           */}
          <Show when={state.matches("assigningRoles")}>
            <Panel class="p-6">
              <HStack align="start" justify="between">
                <Heading level="2" class="text-3xl font-medium mb-6">
                  Assign Roles
                </Heading>
                <HStack spacing="sm">
                  <Button class="block" onClick={() => send("BACK")}>
                    <ChevronLeftIcon class="mr-2" />
                    Back
                  </Button>

                  <Button
                    class="block"
                    color="green"
                    onClick={() => send("CONFIRM")}
                    disabled={state.matches("assigningRoles.sending")}
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
                    <For each={state.context.users}>
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
                    <For each={state.context.roles}>
                      {(role) => <li>{role.name}</li>}
                    </For>
                  </ul>
                </VStack>
              </HStack>
            </Panel>
          </Show>

          {/**
           * Success
           */}
          <Show when={state.matches("success")}>
            <Panel class="p-6">
              <Heading level="2" class="text-3xl font-medium mb-6">
                Success!
              </Heading>
              <p>The roles were assignedd succesfully.</p>
            </Panel>
          </Show>

          {/**
           * Error
           */}
          {/* <TabContent index={4}>
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
          </TabContent> */}
        </PageContent>
      </IndexProvider>
    </>
  );
}
