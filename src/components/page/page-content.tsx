import clsx from "clsx";
import { JSX, splitProps, ValidComponent } from "solid-js";
import { Dynamic } from "solid-js/web";

export interface PageContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
  component?: ValidComponent;
}

export function PageContent(props: PageContentProps) {
  const [, divProps] = splitProps(props, ["class", "component"]);

  return (
    // @ts-ignore
    <Dynamic
      component={props.component ?? "main"}
      class={clsx("p-12 text-slate-800 dark:text-slate-200", props.class)}
      {...divProps}
    />
  );
}
