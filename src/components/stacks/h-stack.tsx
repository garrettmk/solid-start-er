import { JSX, splitProps } from "solid-js";
import clsx from "clsx";
import { Dynamic } from "solid-js/web";

export interface HStackProps<
  E extends HTMLElement = HTMLDivElement,
  N extends E["tagName"] = E["tagName"]
> extends JSX.HTMLAttributes<E> {
  spacing?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "overlap";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "end" | "center" | "between" | "around" | "evenly";
  as?: N;
}

const styles = {
  base: "flex",

  spacing: {
    none: "",
    xs: "space-x-2",
    sm: "space-x-4",
    md: "space-x-6",
    lg: "space-x-6",
    xl: "space-x-8",
    overlap: "-space-x-4",
  },

  align: {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
    baseline: "items-baseline",
  },

  justify: {
    start: "justify-start",
    end: "justify-end",
    center: "justify-center",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
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
        props.spacing && styles.spacing[props.spacing],
        props.align && styles.align[props.align],
        props.justify && styles.justify[props.justify],
        stackProps.class
      )}
      {...(elementProps as any)}
    />
  );
}
