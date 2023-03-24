import { Outlet } from "solid-start";
import { Button } from "@/lib/components/buttons/button";
import { BuildingStorefrontIcon } from "@/lib/components/icons/building-storefront-icon";
import { ModuleSidebar } from "@/lib/components/module/module-sidebar";
import { NavMenu } from "@/lib/components/navigation/nav-menu";
import { NavMenuHeader } from "@/lib/components/navigation/nav-menu-header";
import { NavMenuItem } from "@/lib/components/navigation/nav-menu-item";
import { PageHeader } from "@/lib/components/page/page-header";

export function TenantsLayout() {
  return (
    <>
      <ModuleSidebar>
        <PageHeader class="-mx-5 -my-3 mb-6">
          <h1 class="text-lg text-slate-800 dark:text-slate-200">Tenants</h1>
        </PageHeader>
        <NavMenu>
          <Button size="xs" class="w-full mb-6">
            <BuildingStorefrontIcon size="xs" class="mr-2" />
            New Tenant
          </Button>
          <NavMenuHeader>Manage</NavMenuHeader>
          <NavMenuItem active>Tenants</NavMenuItem>
        </NavMenu>
      </ModuleSidebar>
      <div class="ml-64">
        <Outlet />
      </div>
    </>
  );
}

export default TenantsLayout;
