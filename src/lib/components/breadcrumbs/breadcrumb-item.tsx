import clsx from "clsx";
import { JSX, Match, splitProps, Switch } from "solid-js";
import { Dynamic } from "solid-js/web";
import { A } from "solid-start";

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
          <Dynamic
            component={props.href?.startsWith("/") ? A : "a"}
            href={props.href}
            class="inline-flex items-center font-medium hover:text-blue-600 dark:text-slate-400 dark:hover:text-white"
          >
            {props.children}
          </Dynamic>
        </Match>
      </Switch>
    </li>
  );
}
