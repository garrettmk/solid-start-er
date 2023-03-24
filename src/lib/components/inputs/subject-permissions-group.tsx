import clsx from "clsx";
import { JSX, splitProps } from "solid-js";
import { HStack } from "../stacks/h-stack";
import { VStack } from "../stacks/v-stack";
import { TableContainer } from "../tables/table-container";

export interface SubjectPermissionsGroupProps
  extends JSX.HTMLAttributes<HTMLDivElement> {
  subject?: string;
  description?: string;
  onChangeEnabled?: (enabled: boolean) => void;
}

export function SubjectPermissionsGroup(props: SubjectPermissionsGroupProps) {
  const [, divProps] = splitProps(props, [
    "ref",
    "subject",
    "class",
    "children",
    "onChangeEnabled",
  ]);

  return (
    <TableContainer
      ref={props.ref}
      class={clsx(
        "inline-block min-w-[theme(spacing.64)] bg-white dark:bg-slate-800",
        props.class
      )}
      {...divProps}
    >
      <VStack align="start" spacing="xs" class="px-4 py-4">
        <h1 class="flex flex-col items-start">
          <span class="uppercase text-xs font-semibold text-slate-500 dark:text-slate-400">
            Subject:{" "}
          </span>
          <span class="text-base font-mono dark:text-white">
            {props.subject ?? "--"}
          </span>
        </h1>
        <p class="text-[.8rem] text-slate-600 dark:text-slate-300 max-w-[theme(spacing.64)]">
          {props.description}
        </p>
      </VStack>
      <HStack
        justify="between"
        class="px-4 py-1 bg-slate-100 dark:bg-slate-700 text-xs uppercase font-medium text-slate-500 dark:text-slate-400"
      >
        <span>Action</span>
        <span>Enabled</span>
      </HStack>
      {props.children}
    </TableContainer>
  );
}
