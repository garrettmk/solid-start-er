import { paddingClass, SizeProp, textSizeClass } from "@/lib/design/props";
import clsx from "clsx";
import { createMemo, JSX, Show, splitProps } from "solid-js";
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
  size?: SizeProp;
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
    const paddingScale = props.icon
      ? styles.iconPaddingScale
      : styles.paddingScale;

    return clsx(
      styles.base,
      props.disabled && styles.disabled,
      paddingClass(size, { scale: paddingScale }),
      textSizeClass(size),
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
