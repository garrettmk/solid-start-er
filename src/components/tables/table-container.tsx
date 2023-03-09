import clsx from "clsx";
import { JSX, splitProps } from "solid-js";

export interface TableContainerProps
  extends JSX.HTMLAttributes<HTMLDivElement> {}

export function TableContainer(props: TableContainerProps) {
  const [, divProps] = splitProps(props, ["class"]);

  return (
    <div
      class={clsx(
        "overflow-hidden rounded-t-lg border border-slate-200 dark:border-slate-700 [&_table]:-mb-[2px]",
        props.class
      )}
      {...divProps}
    />
  );
}
