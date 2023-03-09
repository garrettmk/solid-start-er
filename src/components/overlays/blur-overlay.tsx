import clsx from "clsx";
import { JSX, splitProps } from "solid-js";

export interface BlurOverlayProps extends JSX.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
  position?: "fixed" | "absolute";
}

export function BlurOverlay(props: BlurOverlayProps) {
  const [, divProps] = splitProps(props, ["class", "isOpen", "position"]);

  return (
    <div
      class={clsx(
        props.position === "absolute" ? "absolute" : "fixed",
        "fixed inset-0 overflow-x-hidden overflow-y-auto backdrop-blur-sm",
        {
          hidden: !props.isOpen,
        },
        props.class
      )}
      {...divProps}
    />
  );
}
