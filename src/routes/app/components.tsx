import { Outlet } from "solid-start";
import { Button } from "@/components/buttons/button";
import { BuildingStorefrontIcon } from "@/components/icons/building-storefront-icon";
import { ModuleSidebar } from "@/components/module/module-sidebar";
import { NavMenu } from "@/components/navigation/nav-menu";
import { NavMenuHeader } from "@/components/navigation/nav-menu-header";
import { NavMenuItem } from "@/components/navigation/nav-menu-item";
import { PageHeader } from "@/components/page/page-header";

export function ComponentsLayout() {
  return (
    <>
      <ModuleSidebar>
        <PageHeader class="-mx-5 -my-3 mb-6">
          <h1 class="text-lg text-slate-800 dark:text-slate-200">Components</h1>
        </PageHeader>
        <NavMenu>
          <NavMenuHeader class="!border-t-0 !mt-0">Alerts</NavMenuHeader>
          <NavMenuItem href="/app/components/alerts/alert">Alert</NavMenuItem>

          <NavMenuHeader>Avatars</NavMenuHeader>
          <NavMenuItem href="/app/components/avatars/alert">Avatar</NavMenuItem>

          <NavMenuHeader>Breadcrumbs</NavMenuHeader>
          <NavMenuItem href="/app/components/breadcrumbs/breadcrumbs">
            Breadcrumbs
          </NavMenuItem>
          <NavMenuItem href="/app/components/breadcrumbs/breadcrumb-item">
            BreadrumbItem
          </NavMenuItem>

          <NavMenuHeader>Buttons</NavMenuHeader>
          <NavMenuItem href="/app/components/buttons/button">
            Button
          </NavMenuItem>
          <NavMenuItem href="/app/components/buttons/button-menu">
            ButtonMenu
          </NavMenuItem>

          <NavMenuHeader>Tabs</NavMenuHeader>
          <NavMenuItem href="/app/components/tabs/tabs">Tabs</NavMenuItem>

          <NavMenuHeader>Progress</NavMenuHeader>
          <NavMenuItem href="/app/components/progress/progress">
            Progress
          </NavMenuItem>
        </NavMenu>
      </ModuleSidebar>
      <div class="ml-64">
        <Outlet />
      </div>
    </>
  );
}

export default ComponentsLayout;
