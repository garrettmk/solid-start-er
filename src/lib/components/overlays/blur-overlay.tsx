import clsx from "clsx";
import { JSX, splitProps } from "solid-js";

export interface BlurOverlayProps extends JSX.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
  position?: "fixed" | "absolute";
}

export function BlurOverlay(props: BlurOverlayProps) {
  const [, divProps] = splitProps(props, [
    "ref",
    "class",
    "isOpen",
    "position",
  ]);

  return (
    <div
      ref={props.ref}
      class={clsx(
        props.position === "absolute" ? "absolute" : "fixed",
        "fixed inset-0 overflow-x-hidden overflow-y-auto backdrop-blur-sm bg-slate-900/50",
        !props.isOpen && "hidden",
        props.class
      )}
      {...divProps}
    />
  );
}
