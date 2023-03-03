import { JSX, splitProps } from "solid-js";
import clsx from "clsx";

export interface TextInputProps
  extends JSX.InputHTMLAttributes<HTMLInputElement> {
  container?: JSX.HTMLAttributes<HTMLDivElement>;
  label?: string;
  error?: string;
}

export function TextInput(props: TextInputProps) {
  const [, inputProps] = splitProps(props, [
    "container",
    "class",
    "label",
    "ref",
    "error",
    "id",
  ]);

  const inputId = () => props.id ?? props.name;
  const errorId = () => inputId() && inputId() + "-error";

  return (
    <div {...(props.container ?? {})}>
      <label
        for={inputId()}
        class="block mb-2 text-sm font-medium text-slate-600 dark:text-slate-400"
      >
        {props.label}
      </label>
      <input
        id={inputId()}
        type="text"
        ref={props.ref}
        class={clsx(
          "w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
          props.class
        )}
        aria-describedby={errorId()}
        {...inputProps}
      />
      <p id={errorId()} class="mt-2 text-xs text-red-600 dark:text-red-400">
        {props.error}
      </p>
    </div>
  );
}
