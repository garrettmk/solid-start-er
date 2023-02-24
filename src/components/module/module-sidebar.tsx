import { JSX } from "solid-js";
import clsx from "clsx";

const styles = {
  base: `
    fixed top-0 left-[calc(3.25rem+1px)] h-screen w-64 px-5 py-3
    border-r border-slate-200 dark:border-slate-700 
    bg-white dark:bg-slate-900
    dark:text-white
  `,
};

export interface ModuleSidebarProps {
  class?: string;
  children?: JSX.Element;
}

export function ModuleSidebar(props: ModuleSidebarProps) {
  return <aside class={clsx(styles.base, props.class)}>{props.children}</aside>;
}
