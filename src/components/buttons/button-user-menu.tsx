import clsx from "clsx";
import { splitProps } from "solid-js";
import { useAuthContext } from "~/lib/contexts/auth-context";
import { createFloatingUI } from "~/lib/util/create-floating-ui";
import { UserCircleIcon } from "../icons/user-circle";
import { Menu } from "../menus/menu";
import { MenuItem } from "../menus/menu-item";
import { Panel } from "../panels/panel";
import { Button, ButtonProps } from "./button";

export interface ButtonUserMenuProps extends ButtonProps {}

export function ButtonUserMenu(props: ButtonUserMenuProps) {
  const [, buttonProps] = splitProps(props, ["onClick"]);
  const auth = useAuthContext();
  const menu = createFloatingUI({
    placement: "right-end",
    offset: { mainAxis: 10 },
  });

  return (
    <>
      <Button
        icon
        ref={menu.anchorRef}
        color="ghost"
        class={props.class}
        onClick={menu.toggle}
        description="Open user menu"
        aria-expanded="false"
        data-dropdown-toggle="user-dropdown"
        data-dropdown-placement="right-end"
        {...buttonProps}
      >
        <UserCircleIcon />
      </Button>
      <Panel
        ref={menu.floatingRef}
        class={clsx("fixed z-50", {
          hidden: !menu.isOpen,
        })}
      >
        <Menu>
          <MenuItem class="py-2">
            <span class="block text-sm">Garrett Myrick</span>
            <span class="block font-medium">{auth.user?.email}</span>
          </MenuItem>
          <MenuItem href="/app/settings">Settings</MenuItem>
          <MenuItem href="/app/profile">Profile</MenuItem>
          <MenuItem>Sign out</MenuItem>
        </Menu>
      </Panel>
    </>
  );
}
