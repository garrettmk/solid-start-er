import { Checkbox } from "@/components/inputs/check-box";
import { Table, TableProps } from "@/components/tables/table";
import { useRowSelection } from "@/lib/util/make-selection-handler";
import { ColumnDef } from "@tanstack/solid-table";
import clsx from "clsx";
import { Accessor, splitProps } from "solid-js";
import { Role } from "../schema/role-schema";
import { UserAndRoles } from "../schema/user-and-roles-schema";

const userColumns: ColumnDef<UserAndRoles>[] = [
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

export interface SelectUsersTableProps
  extends Omit<TableProps, "data" | "columns"> {
  users: UserAndRoles[] | Accessor<UserAndRoles[] | undefined>;
  onChangeSelection?: (users: UserAndRoles[]) => void;
}

export function SelectUsersTable(props: SelectUsersTableProps) {
  const [, tableProps] = splitProps(props, [
    "users",
    "class",
    "onChangeSelection",
  ]);
  const [selectedUserRows, setSelectedUserRows] = useRowSelection(
    props.users,
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
      columns={userColumns}
      data={props.users}
      options={usersTableOptions}
      class={clsx("[&_th:first-child]:w-[0.1%]", props.class)}
      {...tableProps}
    />
  );
}
