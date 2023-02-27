import clsx from "clsx";
import { JSX, splitProps } from "solid-js";

export interface MenuItemProps extends JSX.HTMLAttributes<HTMLLIElement> {
  href?: string;
}

export function MenuItem(props: MenuItemProps) {
  const [, elementProps] = splitProps(props, [
    "ref",
    "class",
    "children",
    "href",
  ]);

  return (
    <li
      ref={props.ref}
      class={clsx(
        "block text-sm text-gray-700 dark:text-gray-200",
        {
          "hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white":
            props.href || props.onClick,
        },
        props.class
      )}
      {...elementProps}
    >
      <a class="block w-full h-full px-4 py-2" href={props.href}>
        {props.children}
      </a>
    </li>
  );
}
