import { clamp } from "@/lib/util/util";
import clsx from "clsx";
import { JSX, splitProps } from "solid-js";

const styles = {
  base: "w-full bg-gray-200 rounded-full dark:bg-gray-700",

  size: {
    xs: "h-1",
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
    xl: "h-6",
  },
};

export interface ProgressProps extends JSX.HTMLAttributes<HTMLDivElement> {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  value?: number;
}

export function Progress(props: ProgressProps) {
  const [, divProps] = splitProps(props, ["size", "class", "value"]);
  const style = () =>
    `width: ${clamp(props.value ?? 0, { min: 0, max: 100 })}%`;

  return (
    <div
      class={clsx(styles.base, styles.size[props.size ?? "md"], props.class)}
      {...divProps}
    >
      <div
        class={clsx(
          "bg-blue-600 rounded-full transition-all ease-in-out duration-1000",
          styles.size[props.size ?? "md"]
        )}
        style={style()}
      ></div>
    </div>
  );
}
