import { A } from "solid-start";
import { ButtonToggleTheme } from "../buttons/button-toggle-theme";
import { ButtonUserMenu } from "../buttons/button-user-menu";
import { AppIcon } from "../icons/app-icon";
import { BuildingStorefrontIcon } from "../icons/building-storefront-icon";
import { Cog6ToothIcon } from "../icons/cog-6-tooth-icon";
import { HomeIcon } from "../icons/home-icon";
import { UsersIcon } from "../icons/users-icon";

const styles = {
  base: `
    fixed top-0 left-0 h-screen w-14 p-3 z-2000
    border-r border-slate-200 dark:border-slate-700 
    bg-white dark:bg-slate-900 
    flex flex-col
    [&>:not(:last-child)]:mb-3
    [&>hr]:dark:border-gray-700
  `,

  link: `
    -m-1.5 p-1.5
    flex items-center justify-center
    block rounded-md
    text-slate-700 dark:text-slate-300
    hover:bg-slate-100 active:bg-slate-200
    dark:hover:bg-slate-700 dark:active:bg-slate-600
  `,
};

export function NavSidebar() {
  return (
    <nav class={styles.base}>
      <div class="text-blue-700 h-10 flex items-center justify-center">
        <AppIcon />
      </div>

      {/* <hr class="-my-[1px]" /> */}

      <A class={styles.link + " mt-10"} href="/app">
        <HomeIcon />
      </A>

      <A class={styles.link} href="/app/tenants">
        <BuildingStorefrontIcon />
      </A>

      <A class={styles.link} href="/app/users">
        <UsersIcon />
      </A>

      <hr />

      <A class={styles.link} href="/app/settings">
        <Cog6ToothIcon />
      </A>

      <ButtonToggleTheme color="ghost" size="xs" class="-m-1.5 mt-auto" />

      <ButtonUserMenu color="ghost" size="xs" class="-m-1.5" />
    </nav>
  );
}
