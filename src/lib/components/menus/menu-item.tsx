import clsx from "clsx";
import { JSX, Match, splitProps, Switch } from "solid-js";
import { A } from "solid-start";

export interface MenuItemProps extends JSX.HTMLAttributes<HTMLLIElement> {
  href?: string;
  inactive?: boolean;
}

export function MenuItem(props: MenuItemProps) {
  const [, elementProps] = splitProps(props, [
    "ref",
    "class",
    "href",
    "children",
    "inactive",
  ]);
  const isLink = Boolean(props.href);
  const isRelative = isLink && props.href?.startsWith("/");

  return (
    <li
      ref={props.ref}
      class={clsx(
        "block text-sm text-slate-700 dark:text-slate-200",
        {
          "cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 dark:hover:text-white":
            !props.inactive,
          "px-4 py-2": !isLink,
        },
        props.class
      )}
      data-inactive={props.inactive}
      {...elementProps}
    >
      <Switch fallback={props.children}>
        <Match when={isLink && isRelative}>
          <A class="block w-full h-full px-4 py-2" href={props.href!}>
            {props.children}
          </A>
        </Match>
        <Match when={isLink}>
          <a class="block w-full h-full px-4 py-2" href={props.href}>
            {props.children}
          </a>
        </Match>
      </Switch>
    </li>
  );
}
