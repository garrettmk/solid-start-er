import { User } from "@supabase/supabase-js";
import { ColumnDef } from "@tanstack/solid-table";
import { Accessor } from "solid-js";
import { useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { ProfileAvatar } from "~/components/avatars/profile-avatar";
import { SearchInput } from "~/components/inputs/search-input";
import { PageContent } from "~/components/page/page-content";
import { PageHeader } from "~/components/page/page-header";
import { HStack } from "~/components/stacks/h-stack";
import { VStack } from "~/components/stacks/v-stack";
import { DateAndTimeCell } from "~/components/tables/date-and-time-cell";
import { Table } from "~/components/tables/table";
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
          <span class="font-medium">{info.row.original.fullName}</span>
          <span class="text-xs">"{info.row.original.preferredName}"</span>
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
        <div class="overflow-hidden rounded-t-lg border border-slate-200 dark:border-slate-700">
          <Table columns={userColumns} data={data()} class="-mb-[2px]" />
        </div>
      </PageContent>
    </>
  );
}

export default UsersPage;
