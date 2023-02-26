import { computePosition, offset } from "@floating-ui/core";
import { platform } from "@floating-ui/dom";
import clsx from "clsx";
import { createEffect, createSignal, splitProps } from "solid-js";
import { useAuthContext } from "~/lib/contexts/auth-context";
import { onClickOutside } from "../../lib/directives/click-outside";
import { Button, ButtonProps } from "./button";
onClickOutside;

export interface ButtonUserMenuProps extends ButtonProps {}

export function ButtonUserMenu(props: ButtonUserMenuProps) {
  const [, buttonProps] = splitProps(props, ["onClick"]);
  const [isOpen, setIsOpen] = createSignal(false);
  const toggleOpen = (event: Event) => {
    event.stopImmediatePropagation();
    setIsOpen(!isOpen());
  };

  const auth = useAuthContext();

  let buttonRef: HTMLButtonElement | undefined;
  let menuRef: HTMLDivElement | undefined;

  createEffect(() => {
    if (buttonRef && menuRef && isOpen())
      computePosition(buttonRef, menuRef, {
        platform,
        placement: "right-end",
        middleware: [offset({ mainAxis: 10, crossAxis: -15 })],
      }).then(({ x, y }) => {
        Object.assign(menuRef!.style, {
          left: `${x}px`,
          top: `${y}px`,
        });
      });
  });

  return (
    <Button
      icon
      ref={buttonRef}
      color="ghost"
      class={props.class}
      onClick={toggleOpen}
      description="Open user menu"
      aria-expanded="false"
      data-dropdown-toggle="user-dropdown"
      data-dropdown-placement="right-end"
      {...buttonProps}
    >
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
          d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>

      <div
        ref={menuRef}
        use:onClickOutside={() => setIsOpen(false)}
        class={clsx(
          "fixed z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600",
          {
            hidden: !isOpen(),
          }
        )}
        id="user-dropdown"
      >
        <div class="px-4 py-3">
          {/* <span class="block text-sm text-gray-900 dark:text-white">
            Bonnie Green
          </span> */}
          <span class="block text-sm font-medium text-gray-500 truncate dark:text-gray-400">
            {auth.session?.user.email}
          </span>
        </div>
        <ul class="py-2" aria-labelledby="user-menu-button">
          <li>
            <a
              href="#"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
            >
              Dashboard
            </a>
          </li>
          <li>
            <a
              href="#"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
            >
              Settings
            </a>
          </li>
          <li>
            <a
              href="#"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
            >
              Earnings
            </a>
          </li>
          <li>
            <a
              href="#"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
              onClick={auth.signOut}
            >
              Sign out
            </a>
          </li>
        </ul>
      </div>
    </Button>
  );
}
