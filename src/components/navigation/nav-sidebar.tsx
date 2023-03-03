import clsx from "clsx";
import { Show } from "solid-js";
import { A } from "solid-start";
import { useDarkMode } from "~/lib/contexts/dark-mode-context";
import { ButtonUserMenu } from "../buttons/button-user-menu";
import { HomeIcon } from "../icons/home-icon";
import { BuildingStorefrontIcon } from "../icons/building-storefront-icon";
import { UsersIcon } from "../icons/users-icon";

const styles = {
  base: `
    fixed top-0 left-0 h-screen w-14 p-3
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
    [&>svg]:w-6 [&>svg]:h-6
  `,
};

export function NavSidebar() {
  const darkMode = useDarkMode();

  return (
    <nav class={styles.base}>
      <div class="text-blue-700 h-10 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-7 h-7"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
          />
        </svg>
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

      <a class={styles.link} href="#">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4.867 19.125h.008v.008h-.008v-.008z"
          />
        </svg>
      </a>

      <button class={clsx(styles.link, "mt-auto")} onClick={darkMode.toggle}>
        <Show when={darkMode.isDark}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
            />
          </svg>
        </Show>
        <Show when={!darkMode.isDark}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
            />
          </svg>
        </Show>
      </button>

      <ButtonUserMenu size="xs" class="-m-1.5" />
    </nav>
  );
}
