import clsx from "clsx";
import { JSX, splitProps } from "solid-js";

export interface MenuProps extends JSX.HTMLAttributes<HTMLUListElement> {
  isOpen?: boolean;
}

export function Menu(props: MenuProps) {
  const [, elementProps] = splitProps(props, [
    "ref",
    "class",
    "children",
    "isOpen",
  ]);

  return (
    <ul
      ref={props.ref}
      class={clsx(
        "list-none bg-white divide-y divide-gray-100 dark:bg-gray-700 dark:divide-gray-600",
        props.class
      )}
      {...elementProps}
    >
      {props.children}
    </ul>
  );
}
