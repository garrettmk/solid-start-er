import clsx from "clsx";
import { JSX, splitProps } from "solid-js";
import { onClickOutside } from "~/lib/directives/click-outside";
import { Panel } from "../panels/panel";
onClickOutside;

export interface MenuProps extends JSX.HTMLAttributes<HTMLUListElement> {
  isOpen?: boolean;
  onClickItem?: () => void;
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
    <Panel
      as="ul"
      ref={props.ref}
      class={clsx(
        "fixed z-[5000] list-none bg-white divide-y divide-slate-100 dark:bg-slate-700 dark:divide-slate-600 shadow",
        props.class
      )}
      onClick={handleClick}
      {...elementProps}
    >
      {props.children}
    </Panel>
  );
}
