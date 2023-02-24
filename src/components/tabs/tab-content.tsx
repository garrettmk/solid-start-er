import { JSX, Show, splitProps } from "solid-js";
import { useIndexContext } from "~/lib/contexts/index-context";
import clsx from "clsx";

export interface TabContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
  index?: number;
  children?: JSX.Element;
  keepMounted?: boolean;
}

export function TabContent(props: TabContentProps) {
  const [index] = useIndexContext();
  const [, divProps] = splitProps(props, ["keepMounted", "class"]);

  return (
    <Show when={props.keepMounted || index.value === props.index}>
      <div
        class={clsx({
          hidden: props.keepMounted && index.value !== props.index,
        })}
        {...divProps}
      />
    </Show>
  );
}
