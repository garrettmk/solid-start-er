import { createMemo, JSX, Show, splitProps } from "solid-js";
import clsx from "clsx";

export interface ButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {
  color?:
    | "default"
    | "alternative"
    | "dark"
    | "light"
    | "ghost"
    | "green"
    | "red"
    | "none";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "none";
  description?: string;
  icon?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
}

const styles = {
  base: `
    rounded-lg
    font-medium
    focus:ring-4 focus:outline-none
    flex justify-center items-center
  `,

  disabled: `
    cursor-not-allowed
  `,

  size: {
    xs: `
    px-2.5 py-1
    text-xs
    `,
    sm: `
      px-3 py-2
      text-sm
    `,
    md: `
      px-5 py-2.5
      text-sm
    `,
    lg: `
      px-5 py-3
      text-base
    `,

    xl: `
      px-6 py-3.5
      text-base
    `,

    none: "",
  },

  icon: {
    none: "",
    xs: "px-1.5 py-1.5",
    sm: "px-3 py-3",
    md: "px-5 py-5",
    lg: "px-5 py-5",
    xl: "px-6 py-6",
  },

  color: {
    disabled: {
      none: "",
      default: `
        text-white
        bg-blue-400 dark:bg-blue-500
    `,

      alternative: `
        border border-slate-200 dark:border-gray-600
        bg-white
        dark:bg-gray-800
        text-gray-900
        dark:text-gray-400
      `,

      dark: `
        text-white  
        bg-gray-800
        dark:bg-gray-800
        dark:border-gray-700
      `,

      light: `
        border border-gray-300 dark:border-gray-600
        text-gray-900 dark:text-white
        bg-white
        dark:bg-gray-800 
    `,

      ghost: `
        text-gray-500 dark:text-gray-400 
    `,

      green: `
      text-white 
      bg-green-700
      dark:bg-green-600
    `,

      red: `
      text-white 
      bg-red-700
      dark:bg-red-600
    `,
    },
    active: {
      none: "",

      default: `
        text-white
        bg-blue-700 hover:bg-blue-800
        dark:bg-blue-600 dark:hover:bg-blue-700
        focus:ring-blue-300 dark:focus:ring-blue-800
      `,

      alternative: `
        border border-slate-200 dark:border-slate-600
        bg-white hover:bg-slate-100
        dark:bg-slate-800 dark:hover:bg-slate-700
        text-slate-900 hover:text-blue-700
        dark:text-slate-400 dark:hover:text-white
        focus:z-10 focus:ring-slate-200 dark:focus:ring-slate-700
      `,

      dark: `
        text-white  
        bg-slate-800 hover:bg-slate-900
        dark:bg-slate-800 dark:hover:bg-slate-700
        focus:ring-slate-300
        dark:focus:ring-slate-700
        dark:border-slate-700
      `,

      light: `
        border border-slate-300 dark:border-slate-600 dark:hover:border-slate-600 
        text-slate-900 dark:text-white
        bg-white hover:bg-slate-100 
        dark:bg-slate-800 dark:hover:bg-slate-700
        focus:ring-slate-200 dark:focus:ring-slate-700
      `,

      ghost: `
        text-slate-500 dark:text-slate-400 
        hover:bg-slate-100 dark:hover:bg-slate-700 
        focus:ring-slate-200 dark:focus:ring-slate-700
      `,

      green: `
        text-white 
        bg-green-700 hover:bg-green-800
        dark:bg-green-600 dark:hover:bg-green-700
        focus:ring-green-300 dark:focus:ring-green-800
      `,

      red: `
        text-white 
        bg-red-700 hover:bg-red-800
        dark:bg-red-600 dark:hover:bg-red-700
        focus:ring-red-300 dark:focus:ring-red-800
      `,
    },
  },
};

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

  const state = createMemo(() => (props.disabled ? "disabled" : "active"));

  return (
    <button
      ref={props.ref}
      type={props.type}
      class={clsx(
        styles.base,
        styles.color[state()][props.color ?? "default"],
        props.icon ? undefined : styles.size[props.size ?? "md"],
        props.icon ? styles.icon[props.size ?? "none"] : undefined,
        props.disabled ? styles.disabled : undefined,
        props.class
      )}
      {...buttonProps}
    >
      {props.children}
      <Show when={props.description}>
        <span class="sr-only">{props.description}</span>
      </Show>
    </button>
  );
}
