import { JSX, Show, splitProps } from "solid-js";
import clsx from "clsx";

export interface SwitchInputProps
  extends JSX.InputHTMLAttributes<HTMLInputElement> {
  container?: JSX.HTMLAttributes<HTMLLabelElement>;
  children?: JSX.Element;
}

export function SwitchInput(props: SwitchInputProps) {
  const [, otherProps] = splitProps(props, [
    "ref",
    "children",
    "container",
    "ref",
    "id",
  ]);

  const [, containerProps] = splitProps(props.container ?? {}, ["class"]);
  const [, inputProps] = splitProps(otherProps, ["class"]);

  const inputId = () => props.id ?? props.name;

  return (
    <label
      class={clsx(
        "relative inline-flex items-center cursor-pointer space-x-3",
        props.container?.class
      )}
      for={inputId()}
      {...containerProps}
    >
      <div>
        <input
          ref={props.ref}
          id={inputId()}
          type="checkbox"
          class={clsx("sr-only peer", props.class)}
          {...inputProps}
        />
        <div class="relative w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
      </div>
      <Show when={props.children}>
        <span
          class={clsx("text-sm font-medium", {
            "text-slate-900 dark:text-slate-300": !props.disabled,
            "text-slate-400 dark:text-slate-600": props.disabled,
          })}
        >
          {props.children}
        </span>
      </Show>
    </label>
  );
}
