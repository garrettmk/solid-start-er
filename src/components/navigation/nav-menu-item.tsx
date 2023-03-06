import { JSX, splitProps } from "solid-js";
import clsx from "clsx";
import { A, useLocation } from "solid-start";
import { Dynamic } from "solid-js/web";

const styles = {
  base: `
    flex flex-col
  `,

  item: `
    -mx-2 px-2 py-1
    rounded-md
    text-sm font-medium
    text-slate-700 hover:text-blue-500
    dark:text-slate-400 dark:hover:text-white
    cursor-pointer
  `,

  active: `
    text-blue-500 dark:text-white
    bg-slate-100 dark:bg-slate-700
  `,
};

export interface NavMenuItemProps extends JSX.HTMLAttributes<HTMLLIElement> {
  href?: string;
  exact?: boolean;
  active?: boolean;
}

export function NavMenuItem(props: NavMenuItemProps) {
  const location = useLocation();
  const [itemProps, otherProps] = splitProps(props, [
    "class",
    "href",
    "exact",
    "children",
    "active",
  ]);

  const isActivePath = props.href
    ? props.exact
      ? location.pathname === props.href
      : location.pathname.startsWith(props.href)
    : false;

  return (
    <li
      class={clsx(
        styles.item,
        {
          [styles.active]: itemProps.active || isActivePath,
        },
        itemProps.class
      )}
      {...otherProps}
    >
      <Dynamic
        component={props.href?.startsWith("/") ? A : "a"}
        class="block"
        href={itemProps.href}
      >
        {itemProps.children}
      </Dynamic>
    </li>
  );
}
