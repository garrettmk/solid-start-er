import { JSX, splitProps } from "solid-js";
import clsx from "clsx";

const styles = {
  size: {
    xs: "w-4 h-4",
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
    xl: "w-12 h-12",
    none: "",
  },
};

export interface IconProps extends JSX.HTMLAttributes<SVGSVGElement> {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "none";
}

export function Icon(props: IconProps) {
  const [, svgProps] = splitProps(props, ["class", "size"]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class={clsx(styles.size[props.size ?? "sm"], props.class)}
      {...svgProps}
    />
  );
}
