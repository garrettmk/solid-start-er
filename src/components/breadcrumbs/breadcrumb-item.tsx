import clsx from "clsx";
import { JSX, Match, splitProps, Switch } from "solid-js";

export interface BreadcrumbItemProps extends JSX.HTMLAttributes<HTMLLIElement> {
  href?: string;
}

export function BreadcrumbItem(props: BreadcrumbItemProps) {
  const [, liProps] = splitProps(props, ["href", "class", "children"]);

  return (
    <li
      class={clsx(
        "inline-flex items-center text-slate-600 last:text-slate-900 dark:text-slate-400 dark:last:text-white text-sm",
        props.class
      )}
      {...liProps}
    >
      <Switch fallback={props.children}>
        <Match when={props.href}>
          <a
            href={props.href}
            class="inline-flex items-center font-medium hover:text-blue-600 dark:text-slate-400 dark:hover:text-white"
          >
            {props.children}
          </a>
        </Match>
      </Switch>
    </li>
  );
}
