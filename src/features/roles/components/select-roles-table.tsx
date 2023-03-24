import { Checkbox } from "@/lib/components/inputs/check-box";
import { Table, TableProps } from "@/lib/components/tables/table";
import { useRowSelection } from "@/lib/util/make-selection-handler";
import { ColumnDef } from "@tanstack/solid-table";
import clsx from "clsx";
import { Accessor, splitProps } from "solid-js";
import { Role } from "../schema/role-schema";

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

export interface SelectRolesTableProps
  extends Omit<TableProps, "data" | "columns"> {
  roles: Role[] | Accessor<Role[] | undefined>;
  onChangeSelection?: (roles: Role[]) => void;
}

export function SelectRolesTable(props: SelectRolesTableProps) {
  const [, tableProps] = splitProps(props, [
    "roles",
    "class",
    "onChangeSelection",
  ]);
  const [selectedUserRows, setSelectedUserRows] = useRowSelection(
    props.roles,
    (s) => props.onChangeSelection?.(s)
  );
  const usersTableOptions: TableProps["options"] = {
    state: {
      get rowSelection() {
        return selectedUserRows();
      },
    },
    enableRowSelection: true,
    onRowSelectionChange: setSelectedUserRows,
  };

  return (
    <Table
      columns={roleColumns}
      data={props.roles}
      options={usersTableOptions}
      class={clsx("[&_th:first-child]:w-[0.1%]", props.class)}
      {...tableProps}
    />
  );
}
