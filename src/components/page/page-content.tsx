import clsx from "clsx";
import { JSX, splitProps } from "solid-js";

export interface PageContentProps extends JSX.HTMLAttributes<HTMLDivElement> {}

export function PageContent(props: PageContentProps) {
  const [, divProps] = splitProps(props, ["class"]);

  return (
    // @ts-ignore
    <main
      class={clsx("p-12 text-slate-800 dark:text-slate-200", props.class)}
      {...divProps}
    />
  );
}
