import clsx from "clsx";
import { JSX, splitProps } from "solid-js";
import { formatDate, formatTime } from "~/lib/util/format";

export interface DateAndTimeCellProps
  extends JSX.HTMLAttributes<HTMLDivElement> {
  value?: Date | string | number;
}

export function DateAndTimeCell(props: DateAndTimeCellProps) {
  const [, divProps] = splitProps(props, ["value", "class"]);

  return (
    <div
      class={clsx("inline-flex flex-col items-center", props.class)}
      {...divProps}
    >
      <span class="block font-medium">{formatDate(props.value)}</span>
      <span class="block text-xs">{formatTime(props.value)}</span>
    </div>
  );
}
