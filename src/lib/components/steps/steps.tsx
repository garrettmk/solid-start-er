import { JSX, Match, splitProps, Switch } from "solid-js";
import { HStack } from "../stacks/h-stack";
import clsx from "clsx";
import { CheckCircleSolidIcon } from "@/lib/components/icons/check-circle-solid-icon";
import { useIndexContext } from "@/lib/contexts/index-context";

export type StepsProps = JSX.HTMLAttributes<HTMLUListElement>;

export function Steps(props: StepsProps) {
  const [stepsProps, listProps] = splitProps(props, ["class", "children"]);

  return (
    <HStack<HTMLUListElement>
      as="ul"
      align="center"
      class={clsx("text-gray-400", stepsProps.class)}
      {...listProps}
    >
      {stepsProps.children}
    </HStack>
  );
}

export interface StepProps extends JSX.HTMLAttributes<HTMLLIElement> {
  index: number;
  currentIndex?: number;

  current?: boolean;
  complete?: boolean;
}

export function Step(props: StepProps) {
  const [stepProps, itemProps] = splitProps(props, [
    "children",
    "class",
    "index",
    "currentIndex",
    "current",
    "complete",
  ]);
  const index = useIndexContext();

  const isCurrent = () => props.current || index.value === stepProps.index;
  const isComplete = () => props.complete || index.value > stepProps.index;

  return (
    <>
      <li
        class={clsx(
          "flex flex-col items-center font-medium",
          {
            "text-slate-800 dark:text-white": isCurrent(),
            "text-blue-500": isComplete(),
          },
          stepProps.class
        )}
        {...itemProps}
      >
        <Switch>
          <Match when={isComplete()}>
            <CheckCircleSolidIcon class="w-6 h-6 mx-auto text-blue-600 mb-2" />
          </Match>
          <Match when={!isComplete()}>
            <span class="mb-2">{stepProps.index + 1}</span>
          </Match>
        </Switch>
        {stepProps.children}
      </li>
      <hr class="border-slate-700 w-16 mx-8 [&:last-child]:hidden" />
    </>
  );
}
