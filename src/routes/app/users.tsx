import { Outlet } from "solid-start";
import { Button } from "~/components/buttons/button";
import { BuildingStorefrontIcon } from "~/components/icons/building-storefront-icon";
import { ModuleSidebar } from "~/components/module/module-sidebar";
import { NavMenu } from "~/components/navigation/nav-menu";
import { NavMenuHeader } from "~/components/navigation/nav-menu-header";
import { NavMenuItem } from "~/components/navigation/nav-menu-item";
import { PageHeader } from "~/components/page/page-header";

export function UsersLayout() {
  return (
    <>
      <ModuleSidebar>
        <PageHeader class="-mx-5 -my-3 mb-6">
          <h1 class="text-lg text-slate-800 dark:text-slate-200">Users</h1>
        </PageHeader>
        <NavMenu>
          <Button size="xs" class="w-full">
            <BuildingStorefrontIcon size="xs" class="mr-2" />
            New User
          </Button>

          <NavMenuHeader class="mt-6">Manage</NavMenuHeader>
          <NavMenuItem href="/app/users" exact>
            All Users
          </NavMenuItem>

          <NavMenuHeader class="mt-6">Application Users</NavMenuHeader>
          <NavMenuItem href="/app/users/roles">Roles</NavMenuItem>
          <NavMenuItem href="/app/users/assignments">Assignments</NavMenuItem>
        </NavMenu>
      </ModuleSidebar>
      <div class="ml-64">
        <Outlet />
      </div>
    </>
  );
}

export default UsersLayout;
