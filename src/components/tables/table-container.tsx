import clsx from "clsx";
import { JSX, splitProps } from "solid-js";

export function TableContainer(props: JSX.HTMLAttributes<HTMLDivElement>) {
  const [, divProps] = splitProps(props, ["class"]);

  return (
    <div
      class={clsx(
        "overflow-hidden rounded-t-lg border border-slate-200 dark:border-slate-700",
        props.class
      )}
      {...divProps}
    />
  );
}
