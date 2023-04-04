import {
  adjustSize,
  sizeClasses,
  SizeProp,
  textSizeClass,
} from "@/lib/design/props";
import clsx from "clsx";
import { createMemo, JSX, Match, splitProps, Switch } from "solid-js";
import { UserIcon } from "../icons/user-icon";

export interface AvatarProps extends JSX.HTMLAttributes<HTMLDivElement> {
  src?: string;
  initials?: string;
  size?: SizeProp;
  shape?: "round" | "square";
}

const styles = {
  base: "inline-block overflow-hidden bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300 aspect-square",

  shape: {
    round: "rounded-full",
    square: "rounded",
  },
};

export function Avatar(props: AvatarProps) {
  const [, elementProps] = splitProps(props, [
    "src",
    "initials",
    "size",
    "shape",
    "class",
  ]);

  const size = createMemo(() =>
    adjustSize(props.size ?? "md", {
      min: "xs",
    })
  );

  return (
    <div
      class={clsx(
        styles.base,
        sizeClasses(size()),
        styles.shape[props.shape ?? "round"],
        props.class
      )}
      {...elementProps}
    >
      <Switch>
        <Match when={props.src}>
          <img
            class="min-w-[calc(100%+theme(space.4))] min-h-[calc(100%+theme(space.4))] object-cover"
            src={props.src}
          />
        </Match>
        <Match when={props.initials}>
          <span class={clsx("font-medium", textSizeClass(size()))}>
            {props.initials}
          </span>
        </Match>
        <Match when={true}>
          <UserIcon size={size()} class="translate-y-[18%]" />
        </Match>
      </Switch>
    </div>
  );
}
