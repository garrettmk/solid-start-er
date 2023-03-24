import { JSX, Match, splitProps, Switch } from "solid-js";
import { UserIcon } from "../icons/user-icon";
import clsx from "clsx";

export interface AvatarProps extends JSX.HTMLAttributes<HTMLDivElement> {
  src?: string;
  initials?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "huge";
  shape?: "round" | "square";
}

const styles = {
  base: "p-2 inline-block overflow-hidden bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300 aspect-square",

  shape: {
    round: "rounded-full",
    square: "rounded",
  },

  size: {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-14 h-14",
    "2xl": "w-16 h-16",
    "3xl": "w-20 h-20",
    "4xl": "w-24 h-24",
    huge: "w-64 h-64",
  },

  fontSize: {
    sm: "text-sm",
    md: "text-md",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
    huge: "text-[7rem]",
  },
};

export function Avatar(props: AvatarProps) {
  const [, elementProps] = splitProps(props, [
    "src",
    "initials",
    "shape",
    "class",
  ]);

  return (
    <div
      class={clsx(
        styles.base,
        styles.size[props.size ?? "md"],
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
          <span
            class={clsx("font-medium", styles.fontSize[props.size ?? "md"])}
          >
            {props.initials}
          </span>
        </Match>
        <Match when={true}>
          <div class={styles.size[props.size ?? "md"]}>
            <UserIcon
              class={clsx(styles.size[props.size ?? "md"], "translate-y-[15%]")}
            />
          </div>
        </Match>
      </Switch>
    </div>
  );
}
