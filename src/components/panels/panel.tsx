import clsx from "clsx";
import { JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

export interface PanelProps<E extends HTMLElement = HTMLDivElement>
  extends JSX.HTMLAttributes<E> {
  as?: string;
}

export function Panel<E extends HTMLElement = HTMLDivElement>(
  props: PanelProps<E>
) {
  const [, elementProps] = splitProps(props, ["as", "class", "ref"]);

  return (
    <Dynamic
      component={props.as ?? "div"}
      ref={props.ref}
      class={clsx(
        "text-base rounded-lg overflow-hidden bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-500",
        props.class
      )}
      {...elementProps}
    >
      {props.children}
    </Dynamic>
  );
}
