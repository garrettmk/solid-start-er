import { ButtonProps } from "./button";

export const base =
  "rounded-lg font-medium focus:ring-4 focus:outline-none flex justify-center items-center basis-grow-0 basis-shrink-0";
export const disabled = "cursor-not-allowed";

export const padding: Record<NonNullable<ButtonProps["size"]>, string> = {
  none: "",
  xs: "px-2.5 py-0.5",
  sm: "px-3.5 py-2",
  md: "px-5 py-2.5",
  lg: "px-6 py-3",
  xl: "px-7 py-4",
};

export const iconPadding: Record<NonNullable<ButtonProps["size"]>, string> = {
  none: "",
  xs: "px-1.5 py-1.5",
  sm: "px-2 py-2",
  md: "px-3 py-3",
  lg: "px-4 py-4",
  xl: "px-5 py-5",
};

export const textSize: Record<NonNullable<ButtonProps["size"]>, string> = {
  none: "",
  xs: "text-xs",
  sm: "text-sm",
  md: "text-md",
  lg: "text-lg",
  xl: "text-xl",
};

export const colors: Record<NonNullable<ButtonProps["color"]>, any> = {
  none: {
    enabled: "",
    disabled: "",
  },

  dark: {
    enabled: `
      text-white            dark:text-white
      bg-slate-800          dark:bg-slate-900
      hover:bg-slate-900    dark:hover:bg-slate-700
      focus:ring-slate-300  dark:focus:ring-slate-700
    `,
    disabled: `
      text-slate-300            dark:border-slate-600
      bg-slate-700          dark:bg-slate-700
    `,
  },

  light: {
    enabled: `
      text-slate-900        dark:text-slate-100
      bg-white              dark:bg-slate-800
      hover:bg-slate-100    dark:hover:bg-slate-700
      border-slate-300      dark:border-slate-600       border
      focus:ring-slate-800  dark:focus:ring-slate-600
    `,
    disabled: `
      text-slate-600        dark:text-slate-100
      bg-white              dark:bg-slate-800
      border-slate-300      dark:border-slate-600       border
    `,
  },

  alternative: {
    enabled: `
      text-slate-900        dark:text-slate-400
      hover:text-blue-700   dark:hover:text-white
      bg-white              dark:bg-slate-800
      hover:bg-slate-100    dark:hover:bg-slate-700
      border-slate-200      dark:border-slate-600       border
      focus:ring-slate-200  dark:focus:ring-slate-700   focus:z-10
    `,

    disabled: `
      text-slate-600        dark:text-slate-400
      bg-white              dark:bg-slate-400
      border-slate-200      dark:border-slate-600       border
    `,
  },

  ghost: {
    enabled: `
      text-slate-600        dark:text-slate-400
      hover:bg-slate-100    dark:hover:bg-slate-700
      focus:ring-slate-200  dark:focus:ring-slate-700
    `,

    disabled: `
      text-slate-500        dark:text-slate-400
    `,
  },

  blue: {
    enabled: `
      text-white
      bg-blue-700           dark:bg-blue-600
      hover:bg-blue-800     dark:hover:bg-blue-700
      focus:ring-blue-300   dark:focus:ring-blue-800
    `,
    disabled: `
      text-white
      bg-blue-400           dark:bg-blue-500
    `,
  },

  red: {
    enabled: `
      text-white
      bg-red-700           dark:bg-red-600
      hover:bg-red-800     dark:hover:bg-red-700
      focus:ring-red-300   dark:focus:ring-red-800
    `,
    disabled: `
      text-white
      bg-red-400           dark:bg-red-500
    `,
  },

  green: {
    enabled: `
      text-white
      bg-green-700           dark:bg-green-600
      hover:bg-green-800     dark:hover:bg-green-700
      focus:ring-green-300   dark:focus:ring-green-800
    `,
    disabled: `
      text-white
      bg-green-400           dark:bg-green-500
    `,
  },
};
