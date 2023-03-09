import { User } from "@supabase/supabase-js";
import { ColumnDef } from "@tanstack/solid-table";
import { Accessor } from "solid-js";
import { useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { ProfileAvatar } from "~/components/avatars/profile-avatar";
import { Button } from "~/components/buttons/button";
import { ButtonMenu } from "~/components/buttons/button-menu";
import { EllipsisHorizontalIcon } from "~/components/icons/ellipsis-horizontal-icon";
import { SearchInput } from "~/components/inputs/search-input";
import { MenuItem } from "~/components/menus/menu-item";
import { PageContent } from "~/components/page/page-content";
import { PageHeader } from "~/components/page/page-header";
import { HStack } from "~/components/stacks/h-stack";
import { VStack } from "~/components/stacks/v-stack";
import { DateAndTimeCell } from "~/components/tables/date-and-time-cell";
import { Table } from "~/components/tables/table";
import { TableContainer } from "~/components/tables/table-container";
import { Heading } from "~/components/text/heading";
import { UserProfileData } from "~/lib/schemas/user-profile-schema";
import { getAuthenticatedServerContext } from "~/lib/util/get-page-context";
import { camelizeObject } from "~/lib/util/util";

export function routeData() {
  return createServerData$(async (_, event) => {
    const { supabase } = getAuthenticatedServerContext(event);

    const { data, error } = await supabase.from("user_profiles").select("*");
    if (error) console.log(error);

    return data?.map(camelizeObject<UserProfileData>);
  });
}

const userColumns: ColumnDef<UserProfileData>[] = [
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
        content={<EllipsisHorizontalIcon />}
      >
        <MenuItem href="#">Edit...</MenuItem>
        <MenuItem href="#">Assign Roles...</MenuItem>
      </ButtonMenu>
    ),
    cell: () => (
      <ButtonMenu
        placement="left-end"
        size="xs"
        color="ghost"
        content={<EllipsisHorizontalIcon />}
      >
        <MenuItem href="#">Edit...</MenuItem>
        <MenuItem href="#">Assign Roles...</MenuItem>
      </ButtonMenu>
    ),
  },
];

export function UsersPage() {
  const data = useRouteData() as unknown as Accessor<User[]>;
  console.log(data());
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
              <Button>Send Invite</Button>
            </HStack>
            <p class="max-w-md">
              View all users of your application. Invite new users by clicking
              on the button to the right, or enable, disable, or assign roles to
              existing users with the Actions menu.
            </p>
          </div>
          <Table
            columns={userColumns}
            data={data()}
            class="-mb-[2px] [&_th:last-child]:w-[0.1%]"
          />
        </TableContainer>
      </PageContent>
    </>
  );
}

export default UsersPage;
