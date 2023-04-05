import { JSX, splitProps } from "solid-js";
import clsx from "clsx";

export type NavMenuProps = JSX.HTMLAttributes<HTMLUListElement>;

export function NavMenu(props: NavMenuProps) {
  const [styleProps, otherProps] = splitProps(props, ["class"]);

  return <ul class={clsx("flex flex-col", styleProps.class)} {...otherProps} />;
}
