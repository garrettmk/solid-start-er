import { JSX, splitProps } from "solid-js";
import clsx from "clsx";
import { sizeClasses, SizeProp } from "@/lib/design/props";

export interface IconProps extends JSX.HTMLAttributes<SVGSVGElement> {
  size?: SizeProp;
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
      class={clsx(sizeClasses(props.size), props.class)}
      {...svgProps}
    />
  );
}
