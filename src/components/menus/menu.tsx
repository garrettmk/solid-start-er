import clsx from "clsx";
import { JSX, splitProps } from "solid-js";
import { onClickOutside } from "~/lib/directives/click-outside";
onClickOutside;

export interface MenuProps extends JSX.HTMLAttributes<HTMLUListElement> {
  isOpen?: boolean;
  onClickItem?: () => void;
  onClickOutside?: () => void;
}

export function Menu(props: MenuProps) {
  const [, elementProps] = splitProps(props, [
    "ref",
    "class",
    "children",
    "isOpen",
    "onClickItem",
  ]);

  const handleClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.tagName === "A") props.onClickItem?.();
  };

  return (
    <ul
      ref={props.ref}
      class={clsx(
        "list-none bg-white divide-y divide-slate-100 dark:bg-slate-700 dark:divide-slate-600",
        props.class
      )}
      onClick={handleClick}
      use:onClickOutside={props.onClickOutside}
      {...elementProps}
    >
      {props.children}
    </ul>
  );
}
