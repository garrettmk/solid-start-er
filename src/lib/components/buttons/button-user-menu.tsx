import { useAuthContext } from "@/lib/contexts/auth-context";
import { createFloatingUI } from "@/lib/util/create-floating-ui";
import { useOnClickOutside } from "@/lib/util/use-click-outside";
import clsx from "clsx";
import { UserCircleIcon } from "../icons/user-circle-icon";
import { Menu } from "../menus/menu";
import { MenuItem } from "../menus/menu-item";
import { Button, ButtonProps } from "./button";

export type ButtonUserMenuProps = Omit<ButtonProps, "onClick">;

export function ButtonUserMenu(props: ButtonUserMenuProps) {
  const auth = useAuthContext();
  const menu = createFloatingUI({
    placement: "right-end",
    offset: { mainAxis: 10 },
  });

  const handleClick = (e: MouseEvent) => {
    e.stopImmediatePropagation();
    menu.toggle();
  };

  useOnClickOutside(menu.floatingEl, menu.close);

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
        {...props}
      >
        <UserCircleIcon />
      </Button>
      <Menu
        ref={menu.floatingRef}
        class={clsx(!menu.isOpen && "hidden")}
        onClickItem={menu.close}
      >
        <MenuItem class="py-2" inactive>
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
