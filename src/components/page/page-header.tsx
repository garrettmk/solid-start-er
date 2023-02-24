import { JSX, splitProps } from "solid-js";
import { HStack, HStackProps } from "../stacks/h-stack";

export interface PageHeaderProps extends HStackProps {
  title?: string;
}

export function PageHeader(props: PageHeaderProps) {
  const [headerProps, stackProps] = splitProps(props, [
    "class",
    "title",
    "children",
  ]);

  return (
    <HStack
      class="px-5 py-3 bg-white dark:bg-slate-900 dark:text-white border-b border-gray-200 dark:border-slate-700"
      {...stackProps}
    >
      <h1 class="text-xl mr-auto">{headerProps.title}</h1>
      {headerProps.children}
    </HStack>
  );
}
