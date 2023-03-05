import { SearchInput } from "~/components/inputs/search-input";
import { PageHeader } from "~/components/page/page-header";
import { HStack } from "~/components/stacks/h-stack";

export function UsersPage() {
  return (
    <>
      <PageHeader>
        <h2 class="text-sm text-slate-800 dark:text-slate-200">All Users</h2>
        <SearchInput placeholder="Search users..." class="w-64" />
      </PageHeader>
    </>
  );
}

export default UsersPage;
