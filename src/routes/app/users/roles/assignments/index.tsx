import { BreadcrumbItem } from "@/lib/components/breadcrumbs/breadcrumb-item";
import { Breadcrumbs } from "@/lib/components/breadcrumbs/breadcrumbs";
import { Button } from "@/lib/components/buttons/button";
import { Drawer } from "@/lib/components/drawers/drawer";
import { TrashIcon } from "@/lib/components/icons/trash-icon";
import { Checkbox } from "@/lib/components/inputs/check-box";
import { BlurOverlay } from "@/lib/components/overlays/blur-overlay";
import { PageContent } from "@/lib/components/page/page-content";
import { PageHeader } from "@/lib/components/page/page-header";
import { HStack } from "@/lib/components/stacks/h-stack";
import { Table, TableProps } from "@/lib/components/tables/table";
import { TableContainer } from "@/lib/components/tables/table-container";
import { Code } from "@/lib/components/text/code";
import { Heading } from "@/lib/components/text/heading";
import { roleAssignmentsMachines } from "@/features/roles/machines/role-assignments.machine";
import { RoleAssignment } from "@/features/roles/schema/role-assignment-schema";
import { getAuthenticatedServerContext } from "@/lib/util/get-page-context";
import { useRowSelection } from "@/lib/util/make-selection-handler";
import { ColumnDef } from "@tanstack/solid-table";
import { useMachine } from "@xstate/solid";
import { Show } from "solid-js";
import { A, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";

export function routeData() {
  return createServerData$(async (_, event) => {
    const { api } = getAuthenticatedServerContext(event);
    return await api.roles.getRoleAssignments();
  });
}

export function RoleAssignmentsPage() {
  const data = useRouteData<typeof routeData>();
  const [state, send] = useMachine(roleAssignmentsMachines);
  const [selectionState, setSelectionState] = useRowSelection(data, (s) => {
    send({ type: "SELECT", payload: s });
  });

  const tableOptions: TableProps["options"] = {
    state: {
      get rowSelection() {
        return selectionState();
      },
    },
    enableRowSelection: true,
    onRowSelectionChange: setSelectionState,
  };

  const columns: ColumnDef<RoleAssignment>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllRowsSelected()}
          indeterminate={table.getIsSomeRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
    },
    {
      accessorKey: "fullName",
      header: "User",
    },
    {
      accessorKey: "name",
      header: "Role",
    },
    {
      id: "delete",
      header: (p) => (
        <Button
          color="ghost"
          size="xs"
          onClick={() => send("DELETE")}
          disabled={!state.context.selection.length}
        >
          <TrashIcon size="xs" />
        </Button>
      ),
      cell: (p) => (
        <Button
          color="ghost"
          size="xs"
          onClick={() => send({ type: "DELETE", payload: [p.row.original] })}
        >
          <TrashIcon size="xs" />
        </Button>
      ),
    },
  ];

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
            options={tableOptions}
            columns={columns}
            data={data()}
            class="[&_th:first-child]:w-[0.1%] [&_th:last-child]:w-[0.1%]"
          />
        </TableContainer>
      </PageContent>
      <BlurOverlay
        isOpen={state.matches("deleting")}
        onClick={() => send("CANCEL")}
      />
      <Drawer placement="right" isOpen={state.matches("deleting")} class="p-6">
        <Heading level="2" class="text-2xl font-medium">
          Remove Role?
        </Heading>
        <Show when={state.context.selection.length === 1}>
          <p class="mt-6">
            Are you sure you want to remove the role{" "}
            <Code>{state.context.selection[0].name}</Code> from the user{" "}
            {state.context.selection[0].fullName}?
          </p>
        </Show>
        <Show when={state.context.selection.length !== 1}>
          <p class="mt-6">
            Are you sure you want to remove these{" "}
            {state.context.selection.length} role assignments?
          </p>
        </Show>
        <HStack justify="end" spacing="xs" class="mt-6">
          <Button onClick={() => send("CANCEL")}>Cancel</Button>
          <Button color="red" onClick={() => send("CONFIRM")}>
            Remove
          </Button>
        </HStack>

        <p class="text-red-600 mt-6">{state.context.error}</p>
      </Drawer>
    </>
  );
}

export default RoleAssignmentsPage;
