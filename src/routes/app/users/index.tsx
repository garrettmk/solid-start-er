import { InviteUsersDrawer } from "@/features/users/components/invite-user.drawer";
import { UpdateUserDrawer } from "@/features/users/components/update-user-drawer";
import { UserProfile } from "@/features/users/schema/user-profile.schema";
import { ProfileAvatar } from "@/lib/components/avatars/profile-avatar";
import { Button } from "@/lib/components/buttons/button";
import { ButtonMenu } from "@/lib/components/buttons/button-menu";
import { EllipsisHorizontalIcon } from "@/lib/components/icons/ellipsis-horizontal-icon";
import { SearchInput } from "@/lib/components/inputs/search-input";
import { MenuItem } from "@/lib/components/menus/menu-item";
import { PageContent } from "@/lib/components/page/page-content";
import { PageHeader } from "@/lib/components/page/page-header";
import { HStack } from "@/lib/components/stacks/h-stack";
import { VStack } from "@/lib/components/stacks/v-stack";
import { DateAndTimeCell } from "@/lib/components/tables/date-and-time-cell";
import { Table } from "@/lib/components/tables/table";
import { TableContainer } from "@/lib/components/tables/table-container";
import { Heading } from "@/lib/components/text/heading";
import { createToggle } from "@/lib/util/create-toggle";
import { getAuthenticatedServerContext } from "@/lib/util/get-page-context";
import { usingDataAttribute } from "@/lib/util/util";
import { ColumnDef } from "@tanstack/solid-table";
import { createSignal } from "solid-js";
import { RouteDataArgs, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";

export function routeData(params: RouteDataArgs) {
  return createServerData$(async (_, event) => {
    const { api } = getAuthenticatedServerContext(event);
    const { data, error } = await api.users.findUsers();

    if (error) console.log(error);
    return data ?? undefined;
  });
}

const userColumns: ColumnDef<UserProfile>[] = [
  {
    accessorKey: "fullName",
    header: "Name",
    cell: (info) => (
      <HStack spacing="sm">
        <ProfileAvatar profile={info.row.original} />
        <VStack>
          <span class="text-base font-medium text-slate-700 dark:text-slate-300">
            {info.row.original.fullName}
          </span>
          <span class="text-sm">"{info.row.original.preferredName}"</span>
        </VStack>
      </HStack>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: (info) => <DateAndTimeCell value={info.getValue<string>()} />,
  },
  {
    accessorKey: "lastSignInAt",
    header: "Last signed in",
    cell: (info) => <DateAndTimeCell value={info.getValue<string>()} />,
  },
  {
    id: "actions",
    header: () => (
      <ButtonMenu
        placement="left-end"
        size="xs"
        color="ghost"
        content={<EllipsisHorizontalIcon size="xs" />}
        class="-my-1.5"
        icon
      >
        <MenuItem>Edit...</MenuItem>
        <MenuItem>Assign Roles...</MenuItem>
      </ButtonMenu>
    ),
    cell: ({ row }) => (
      <ButtonMenu
        placement="left-end"
        size="xs"
        color="ghost"
        content={<EllipsisHorizontalIcon size="xs" />}
        icon
      >
        <MenuItem data-action="edit" data-id={row.original.id}>
          Edit...
        </MenuItem>
        <MenuItem data-action="assignRoles" data-id={row.original.id} inactive>
          Assign Roles...
        </MenuItem>
      </ButtonMenu>
    ),
  },
];

export function UsersPage() {
  const users = useRouteData<typeof routeData>();
  const [userToUpdate, setUserToUpdate] = createSignal<UserProfile>();
  const isInviteOpen = createToggle();
  const isUpdateOpen = createToggle();

  const handleTableClick = usingDataAttribute("action", {
    edit: ({ id }) => {
      const user = users()?.find((u) => u.id === id);
      setUserToUpdate(user);
      isUpdateOpen.on();
    },

    assignRoles: ({ id }) => {
      console.log("assignRoles", id);
    },
  });

  return (
    <>
      <PageHeader>
        <h2 class="text-sm text-slate-800 dark:text-slate-200">All Users</h2>
        <SearchInput placeholder="Search users..." class="w-64" />
      </PageHeader>
      <PageContent>
        <TableContainer>
          <div class="bg-white dark:bg-slate-800 p-6">
            <HStack justify="between" align="start">
              <Heading level="1" class="text-xl font-medium mb-6">
                All Users
              </Heading>
              <Button onClick={isInviteOpen.on}>Invite User...</Button>
            </HStack>
            <p class="max-w-md">
              View all users of your application. Invite new users by clicking
              on the button to the right, or enable, disable, or assign roles to
              existing users with the Actions menu.
            </p>
          </div>
          <Table
            columns={userColumns}
            data={users}
            class="-mb-[2px] [&_th:last-child]:w-[0.1%]"
            onClick={handleTableClick}
          />
        </TableContainer>
      </PageContent>
      <InviteUsersDrawer
        isOpen={isInviteOpen.value}
        onClose={isInviteOpen.off}
      />
      <UpdateUserDrawer
        user={userToUpdate()}
        isOpen={isUpdateOpen.value}
        onClose={isUpdateOpen.off}
      />
    </>
  );
}

export default UsersPage;
