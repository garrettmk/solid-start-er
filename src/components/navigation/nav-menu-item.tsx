import { JSX, splitProps } from "solid-js";
import clsx from "clsx";

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
  active?: boolean;
}

export function NavMenuItem(props: NavMenuItemProps) {
  const [itemProps, otherProps] = splitProps(props, [
    "class",
    "href",
    "children",
    "active",
  ]);

  return (
    <li
      class={clsx(
        styles.item,
        {
          [styles.active]: itemProps.active,
        },
        itemProps.class
      )}
      {...otherProps}
    >
      <a class="block" href={itemProps.href}>
        {itemProps.children}
      </a>
    </li>
  );
}
