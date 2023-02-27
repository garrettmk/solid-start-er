import { JSX, splitProps } from "solid-js";
import clsx from "clsx";
import { Dynamic } from "solid-js/web";

export interface PanelProps<
  E extends HTMLElement = HTMLDivElement,
  N extends E["tagName"] = E["tagName"]
> extends JSX.HTMLAttributes<E> {
  as?: N;
}

export function Panel(props: PanelProps) {
  const [, elementProps] = splitProps(props, ["class", "ref"]);

  return (
    <Dynamic
      component={props.as ?? "div"}
      ref={props.ref}
      class={clsx(
        "text-base bg-white rounded-lg shadow dark:bg-gray-700 overflow-hidden",
        props.class
      )}
      {...elementProps}
    >
      {props.children}
    </Dynamic>
  );
}
