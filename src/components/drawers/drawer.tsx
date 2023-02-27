import { JSX, splitProps } from "solid-js";
import clsx from "clsx";

export interface DrawerProps extends JSX.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
  placement?: "left" | "right" | "top" | "bottom";
}

const styles = {
  base: "fixed z-40 p-4 transition-transform bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 dark:text-slate-100",

  placement: {
    left: "top-0 left-0 h-screen overflow-y-auto w-80 border-r ",
    right: "top-0 right-0 h-screen overflow-y-auto w-80 border-l",
    top: "top-0 left-0 w-screen overlow-x-auto h-80 border-b",
    bottom: "bottom-0 left-0 w-screen overflow-x-auto h-80 border-t",
  },

  closed: {
    left: "-translate-x-full",
    right: "translate-x-full",
    top: "-translate-y-full",
    bottom: "translate-y-full",
  },
};

export function Drawer(props: DrawerProps) {
  const [, elementProps] = splitProps(props, ["isOpen", "children"]);

  return (
    <div
      id="drawer-left-example"
      class={clsx(
        styles.base,
        styles.placement[props.placement ?? "left"],
        props.isOpen ? null : styles.closed[props.placement ?? "left"],
        props.class
      )}
      tabindex="-1"
      {...elementProps}
    >
      {props.children}
    </div>
  );
}
