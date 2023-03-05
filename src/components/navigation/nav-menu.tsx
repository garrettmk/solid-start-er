import { JSX, splitProps } from "solid-js";
import clsx from "clsx";

export interface NavMenuProps extends JSX.HTMLAttributes<HTMLUListElement> {}

export function NavMenu(props: NavMenuProps) {
  const [styleProps, otherProps] = splitProps(props, ["class"]);

  return <ul class={clsx("flex flex-col", styleProps.class)} {...otherProps} />;
}
