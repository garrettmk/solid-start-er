import { JSX, splitProps } from "solid-js";
import clsx from "clsx";

export interface AlertProps extends JSX.HTMLAttributes<HTMLDivElement> {
  color?: "blue" | "red";
}

const styles = {
  base: `p-4 mb-4 text-sm rounded-lg bg-blue-50 dark:bg-gray-800`,
  color: {
    blue: `text-blue-800 dark:text-blue-400`,
    red: `text-red-800 dark:text-red-400`,
  },
};

export function Alert(props: AlertProps) {
  const [, divProps] = splitProps(props, ["class", "children"]);

  return (
    <div
      class={clsx(
        styles.base,
        styles.color[props.color ?? "blue"],
        props.class
      )}
      role="alert"
      {...divProps}
    >
      {props.children}
    </div>
  );
}
