import clsx from "clsx";
import { JSX, splitProps } from "solid-js";

export type DividerProps = JSX.HTMLAttributes<HTMLHRElement>;

export function Divider(props: DividerProps) {
  const [, hrProps] = splitProps(props, ["class"]);

  return (
    <hr
      class={clsx("mb-6 border-slate-300 dark:border-slate-600", props.class)}
      {...hrProps}
    />
  );
}
