import { User } from "@supabase/supabase-js";
import { ColumnDef } from "@tanstack/solid-table";
import { Accessor, Show } from "solid-js";
import { useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
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
import { UserProfile } from "@/features/users/schema/user-profile.schema";
import { getAuthenticatedServerContext } from "@/lib/util/get-page-context";
import { camelizeObject } from "@/lib/util/util";
import { useMachine } from "@xstate/solid";
import { allUsersMachine } from "@/features/users/machines/all-users.machine";
import { BlurOverlay } from "@/lib/components/overlays/blur-overlay";
import { Drawer } from "@/lib/components/drawers/drawer";
import { TextInput } from "@/lib/components/inputs/text-input";
import { createForm } from "@modular-forms/solid";
import { InviteUserForm } from "@/features/users/components/invite-user-form";

export function routeData() {
  return createServerData$(async (_, event) => {
    const { supabase } = getAuthenticatedServerContext(event);

    const { data, error } = await supabase.from("user_profiles").select("*");
    if (error) console.log(error);

    return data?.map(camelizeObject<UserProfile>);
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
        content={<EllipsisHorizontalIcon />}
      >
        <MenuItem href="#">Edit...</MenuItem>
        <MenuItem href="#">Assign Roles...</MenuItem>
      </ButtonMenu>
    ),
    cell: ({ row }) => (
      <ButtonMenu
        placement="left-end"
        size="xs"
        color="ghost"
        content={<EllipsisHorizontalIcon />}
      >
        <MenuItem href={`/app/users/${row.original.id}`}>Edit...</MenuItem>
        <MenuItem href="#">Assign Roles...</MenuItem>
      </ButtonMenu>
    ),
  },
];

export function UsersPage() {
  const data = useRouteData<typeof routeData>();
  const [state, send] = useMachine(allUsersMachine, {
    context: {
      users: data(),
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
              <Button onClick={() => send("START_INVITE")}>Send Invite</Button>
            </HStack>
            <p class="max-w-md">
              View all users of your application. Invite new users by clicking
              on the button to the right, or enable, disable, or assign roles to
              existing users with the Actions menu.
            </p>
          </div>
          <Table
            columns={userColumns}
            data={state.context.users}
            class="-mb-[2px] [&_th:last-child]:w-[0.1%]"
          />
        </TableContainer>
      </PageContent>
      <BlurOverlay
        isOpen={state.matches("invitingUsers")}
        onClick={() => send("CANCEL")}
      />
      <Drawer
        isOpen={state.matches("invitingUsers")}
        placement="right"
        class="p-6"
      >
        <Heading level="1" class="text-2xl font-medium mb-6">
          Invite User
        </Heading>
        <p>
          Enter the email address where you would like to send an invitation.
        </p>
        <InviteUserForm
          class="mt-4"
          onSubmit={(invite) =>
            send({ type: "SEND_INVITES", payload: [invite.email] })
          }
        >
          <HStack class="mt-4" spacing="xs" justify="end">
            <Button onClick={() => send("CANCEL")}>Cancel</Button>
            <Button type="submit">Send Invite</Button>
          </HStack>
        </InviteUserForm>
        <Show when={Boolean(state.context.error)}>
          <p class="text-red-500 mt-4">
            {JSON.stringify(state.context.error, null, "  ")}
          </p>
        </Show>
      </Drawer>
    </>
  );
}

export default UsersPage;
