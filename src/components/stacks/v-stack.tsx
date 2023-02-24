import { JSX, splitProps } from "solid-js";
import clsx from "clsx";
import { Dynamic } from "solid-js/web";

export interface VStackProps<E extends HTMLElement = HTMLDivElement>
  extends JSX.HTMLAttributes<E> {
  spacing?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end" | "stretch";
  as?: keyof JSX.HTMLElementTags;
}

const styles = {
  base: "flex flex-col",

  spacing: {
    none: "",
    xs: "[&>:not(:last-child)]:mb-2",
    sm: "[&>:not(:last-child)]:mb-4",
    md: "[&>:not(:last-child)]:mb-6",
    lg: "[&>:not(:last-child)]:mb-6",
    xl: "[&>:not(:last-child)]:mb-8",
  },

  align: {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  },
};

export function VStack<E extends HTMLElement = HTMLDivElement>(
  props: VStackProps<E>
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
