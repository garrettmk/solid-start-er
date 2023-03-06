import clsx from "clsx";
import { JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

export interface HeadingProps extends JSX.HTMLAttributes<HTMLHeadingElement> {
  level?: "1" | "2" | "3" | "4" | "5" | "6";
}

export function Heading(props: HeadingProps) {
  const [, hProps] = splitProps(props, ["level", "class"]);
  const component = {
    "1": "h1",
    "2": "h2",
    "3": "h3",
    "4": "h4",
    "5": "h5",
    "6": "h6",
  }[props.level ?? "1"];

  return (
    <Dynamic
      component={component}
      class={clsx("text-slate-600 dark:text-slate-300", props.class)}
      {...hProps}
    />
  );
}
