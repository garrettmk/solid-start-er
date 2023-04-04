import { createMemo, JSX, Show, splitProps } from "solid-js";
import clsx from "clsx";
import * as styles from "./button-styles";

export interface ButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {
  color?:
    | "none"
    | "light"
    | "dark"
    | "alternative"
    | "ghost"
    | "blue"
    | "red"
    | "green";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "none";
  description?: string;
  icon?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function Button(props: ButtonProps) {
  const [, buttonProps] = splitProps(props, [
    "children",
    "class",
    "color",
    "size",
    "description",
    "icon",
    "ref",
  ]);

  const classes = createMemo(() => {
    const state = props.disabled ? "disabled" : "enabled";
    const size = props.size ?? "md";
    const color = props.color ?? "blue";

    return clsx(
      styles.base,
      props.disabled && styles.disabled,
      !props.icon && styles.padding[size],
      props.icon && styles.iconPadding[size],
      styles.textSize[size],
      styles.colors[color][state],
      props.class
    );
  });

  return (
    <button
      ref={props.ref}
      type={props.type ?? "button"}
      class={classes()}
      {...buttonProps}
    >
      {props.children}
      <Show when={props.description}>
        <span class="sr-only">{props.description}</span>
      </Show>
    </button>
  );
}
