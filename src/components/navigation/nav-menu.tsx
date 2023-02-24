import { JSX, splitProps } from "solid-js";
import clsx from "clsx";

export interface NavMenuProps extends JSX.HTMLAttributes<HTMLUListElement> {}

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

  header: `
    mb-2
    text-sm uppercase font-medium
    text-gray-500 dark:text-slate-500
  `,
};

export function NavMenu(props: NavMenuProps) {
  const [styleProps, otherProps] = splitProps(props, ["class"]);

  return <ul class={clsx(styles.base, styleProps.class)} {...otherProps} />;
}

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

export interface NavMenuHeaderProps
  extends JSX.HTMLAttributes<HTMLHeadingElement> {}

export function NavMenuHeader(props: NavMenuHeaderProps) {
  const [headerProps, otherProps] = splitProps(props, ["class"]);

  return <h3 class={clsx(styles.header, headerProps.class)} {...otherProps} />;
}
