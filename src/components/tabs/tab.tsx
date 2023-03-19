import { createMemo, JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";
import { useTabsContext } from "@/lib/contexts/tabs-context";
import { mergeProps } from "@zag-js/solid";

export interface TabProps<E extends HTMLElement = HTMLDivElement>
  extends JSX.HTMLAttributes<E> {
  as?: string;
  value: string;
}

export function Tab<E extends HTMLElement = HTMLDivElement>(
  props: TabProps<E>
) {
  const tabs = useTabsContext();
  const [, elementProps] = splitProps(props, ["as", "ref", "value"]);
  const tabProps = createMemo(() =>
    tabs.getContentProps({ value: props.value })
  );

  return (
    <Dynamic
      component={props.as ?? "div"}
      ref={props.ref}
      {...mergeProps(tabProps(), elementProps)}
    />
  );
}
