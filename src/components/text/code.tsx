import clsx from "clsx";
import { JSX, splitProps } from "solid-js";

export function Code(props: JSX.HTMLAttributes<HTMLSpanElement>) {
  const [, spanProps] = splitProps(props, ["class"]);

  return (
    <span
      class={clsx(
        "font-mono p-1 bg-slate-200 dark:bg-slate-700 rounded-sm",
        props.class
      )}
      {...spanProps}
    />
  );
}
