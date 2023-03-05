import { JSX, splitProps } from "solid-js";
import clsx from "clsx";

export interface NavMenuHeaderProps
  extends JSX.HTMLAttributes<HTMLHeadingElement> {}

export function NavMenuHeader(props: NavMenuHeaderProps) {
  const [headerProps, otherProps] = splitProps(props, ["class"]);

  return (
    <h3
      class={clsx(
        "mb-3 mt-6 -mx-5 px-5 pt-3 border-t border-slate-200 dark:border-slate-700 text-sm uppercase font-medium text-slate-500 dark:text-slate-500",
        headerProps.class
      )}
      {...otherProps}
    />
  );
}
