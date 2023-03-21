import { BreadcrumbItem } from "@/components/breadcrumbs/breadcrumb-item";
import { Breadcrumbs } from "@/components/breadcrumbs/breadcrumbs";
import { Button } from "@/components/buttons/button";
import { Drawer } from "@/components/drawers/drawer";
import { TrashIcon } from "@/components/icons/trash-icon";
import { Checkbox } from "@/components/inputs/check-box";
import { BlurOverlay } from "@/components/overlays/blur-overlay";
import { PageContent } from "@/components/page/page-content";
import { PageHeader } from "@/components/page/page-header";
import { HStack } from "@/components/stacks/h-stack";
import { Table, TableProps } from "@/components/tables/table";
import { TableContainer } from "@/components/tables/table-container";
import { Code } from "@/components/text/code";
import { Heading } from "@/components/text/heading";
import { RoleAssignment } from "@/features/roles/schema/role-assignment-schema";
import { createToggle } from "@/lib/util/create-toggle";
import { getAuthenticatedServerContext } from "@/lib/util/get-page-context";
import { ColumnDef, Row, TableOptions } from "@tanstack/solid-table";
import { createMemo, createSignal, Show } from "solid-js";
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
  const isSidebarOpen = createToggle();
  const [selectedRows, setSelectedRows] = createSignal({});
  const selectedAssignments = createMemo(() => {
    const selected = selectedRows();
    const assignments = data();
    if (!assignments) return [];

    return Object.entries(selected)
      .filter(([, isSelected]) => isSelected)
      .map(([idx]) => assignments[parseInt(idx)]);
  });

  const handleDelete = (assignment: Row<RoleAssignment>) => {
    setSelectedRows([assignment]);
    isSidebarOpen.on();
  };

  const tableOptions: TableProps["options"] = {
    state: {
      get rowSelection() {
        return selectedRows();
      },
    },
    enableRowSelection: true,
    onRowSelectionChange: setSelectedRows,
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
          onClick={isSidebarOpen.on}
          disabled={!selectedAssignments().length}
        >
          <TrashIcon size="xs" />
        </Button>
      ),
      cell: (p) => (
        <Button color="ghost" size="xs" onClick={() => handleDelete(p.row)}>
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
      <BlurOverlay isOpen={isSidebarOpen.value} onClick={isSidebarOpen.off} />
      <Drawer placement="right" isOpen={isSidebarOpen.value} class="p-6">
        <Heading level="2" class="text-2xl font-medium">
          Remove Role?
        </Heading>
        <Show when={selectedAssignments().length === 1}>
          <p class="mt-6">
            Are you sure you want to remove the role{" "}
            <Code>{selectedAssignments()[0].name}</Code> from the user{" "}
            {selectedAssignments()[0].fullName}?
          </p>
        </Show>
        <Show when={selectedAssignments().length !== 1}>
          <p class="mt-6">
            Are you sure you want to remove these {selectedAssignments().length}{" "}
            role assignments?
          </p>
        </Show>
        <HStack justify="end" spacing="xs" class="mt-6">
          <Button onClick={isSidebarOpen.off}>Cancel</Button>
          <Button color="red">Remove Role</Button>
        </HStack>
      </Drawer>
    </>
  );
}

export default RoleAssignmentsPage;
