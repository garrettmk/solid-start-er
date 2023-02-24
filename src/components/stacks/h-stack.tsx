import { JSX, splitProps } from "solid-js";
import clsx from "clsx";
import { Dynamic } from "solid-js/web";

export interface HStackProps<
  E extends HTMLElement = HTMLDivElement,
  N extends E["tagName"] = E["tagName"]
> extends JSX.HTMLAttributes<E> {
  spacing?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end" | "stretch";
  as?: N;
}

const styles = {
  base: "flex",

  spacing: {
    none: "",
    xs: "[&>:not(:last-child)]:mr-2",
    sm: "[&>:not(:last-child)]:mr-4",
    md: "[&>:not(:last-child)]:mr-6",
    lg: "[&>:not(:last-child)]:mr-6",
    xl: "[&>:not(:last-child)]:mr-8",
  },

  align: {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
    baseline: "items-baseline",
  },
};

export function HStack<E extends HTMLElement = HTMLDivElement>(
  props: HStackProps<E>
) {
  const [stackProps, elementProps] = splitProps(props, [
    "as",
    "class",
    "spacing",
    "align",
  ]);

  return (
    <Dynamic
      component={stackProps.as ?? "div"}
      class={clsx(
        styles.base,
        styles.spacing[stackProps.spacing ?? "none"],
        styles.align[stackProps.align ?? "stretch"],
        stackProps.class
      )}
      {...(elementProps as any)}
    />
  );
}
