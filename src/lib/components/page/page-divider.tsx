import clsx from "clsx";
import { JSX, splitProps } from "solid-js";

export type PageDividerProps = JSX.HTMLAttributes<HTMLHRElement>;

export function PageDivider(props: PageDividerProps) {
  const [, hrProps] = splitProps(props, ["class"]);

  return (
    <hr
      class={clsx("border-slate-300 dark:border-slate-700", props.class)}
      {...hrProps}
    />
  );
}
