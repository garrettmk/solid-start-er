import { Outlet } from "solid-start";
import { ModuleSidebar } from "@/lib/components/module/module-sidebar";
import { NavMenu } from "@/lib/components/navigation/nav-menu";
import { NavMenuHeader } from "@/lib/components/navigation/nav-menu-header";
import { NavMenuItem } from "@/lib/components/navigation/nav-menu-item";

const styles = {
  sidebar: `
  `,
};

export function UsersLayout() {
  return (
    <>
      <ModuleSidebar class={styles.sidebar}>
        <h1 class="text-xl mb-3">Users</h1>
        <hr class="-mx-5 mb-4 dark:border-gray-700" />
        <NavMenu>
          <NavMenuHeader>User</NavMenuHeader>
          <NavMenuItem active>Profile</NavMenuItem>
          <NavMenuItem>Settings</NavMenuItem>

          <NavMenuHeader class="mt-5">Tenants</NavMenuHeader>
          <NavMenuItem>Tenants</NavMenuItem>
        </NavMenu>
      </ModuleSidebar>
      <Outlet />
    </>
  );
}

export default UsersLayout;
