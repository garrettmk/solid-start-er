import clsx from "clsx";
import { JSX, Match, Show, splitProps, Switch } from "solid-js";
import { CloudArrowUpIcon } from "../icons/cloud-arrow-up-icon";
import { VStack } from "../stacks/v-stack";

export interface DropzoneProps
  extends JSX.InputHTMLAttributes<HTMLInputElement> {
  container?: JSX.HTMLAttributes<HTMLLabelElement>;
  description?: JSX.Element;
}

export function Dropzone(props: DropzoneProps) {
  const [, inputProps] = splitProps(props, [
    "container",
    "description",
    "class",
    "id",
    "children",
  ]);

  const inputId = () => props.id ?? props.name;

  return (
    <label
      for={inputId()}
      class={clsx(
        "block border-2 border-dashed border-slate-400 p-8 flex items-center justify-center bg-slate-200 hover:bg-slate-200 cursor-pointer [&_input]:hidden",
        props.class
      )}
      {...(props.container ?? {})}
    >
      <Switch fallback={props.children}>
        <Match when={!props.children}>
          <VStack
            align="center"
            spacing="xs"
            class="text-center text-slate-600"
          >
            <CloudArrowUpIcon class="w-12 h-12" />
            <p class="text-sm">
              <span class="font-medium">Click to upload</span> or drag and drop
            </p>
            <Show when={props.description}>
              <p class="text-xs">{props.description}</p>
            </Show>
          </VStack>
        </Match>
      </Switch>
      <input id={inputId()} ref={props.ref} type="file" {...inputProps} />
    </label>
  );
}
