import clsx from "clsx";
import { splitProps } from "solid-js";
import { useAuthContext } from "~/lib/contexts/auth-context";
import { createFloatingUI } from "~/lib/util/create-floating-ui";
import { UserCircleIcon } from "../icons/user-circle-icon";
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

  const handleClick = (e: MouseEvent) => {
    e.stopImmediatePropagation();
    menu.toggle();
  };

  return (
    <>
      <Button
        icon
        ref={menu.anchorRef}
        onClick={handleClick}
        description="Open user menu"
        aria-expanded="false"
        data-dropdown-toggle="user-dropdown"
        data-dropdown-placement="right-end"
        {...buttonProps}
      >
        <UserCircleIcon />
      </Button>
      <Menu
        ref={menu.floatingRef}
        class={clsx(!menu.isOpen && "hidden")}
        onClickOutside={menu.close}
        onClickItem={menu.close}
      >
        <MenuItem class="py-2">
          <span class="block text-sm">Garrett Myrick</span>
          <span class="block font-medium">{auth.user?.email}</span>
        </MenuItem>
        <MenuItem href="/app/profile">Profile</MenuItem>
        <MenuItem href="/app/settings">Settings</MenuItem>
        <MenuItem onClick={auth.signOut}>Sign out</MenuItem>
      </Menu>
    </>
  );
}
