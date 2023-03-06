import clsx from "clsx";
import { JSX, splitProps } from "solid-js";

export interface BlurOverlayProps extends JSX.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
}

export function BlurOverlay(props: BlurOverlayProps) {
  const [, divProps] = splitProps(props, ["class", "isOpen"]);

  return (
    <div
      class={clsx(
        "fixed inset-0 z-[10000] overflow-x-hidden overflow-y-auto backdrop-blur-sm",
        {
          hidden: !props.isOpen,
        }
      )}
      {...divProps}
    />
  );
}
