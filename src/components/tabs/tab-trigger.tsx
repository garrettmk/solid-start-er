import { createMemo, JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";
import { useTabsContext } from "~/lib/contexts/tabs-context";
import { mergeProps } from "@zag-js/solid";

export interface TabTriggerProps<E extends HTMLElement = HTMLDivElement>
  extends JSX.HTMLAttributes<E> {
  as?: string;
  value: string;
}

export function TabTrigger<E extends HTMLElement = HTMLDivElement>(
  props: TabTriggerProps<E>
) {
  const tabs = useTabsContext();
  const [, elementProps] = splitProps(props, ["as", "ref", "value"]);
  const triggerProps = createMemo(() =>
    tabs.getTriggerProps({ value: props.value })
  );

  return (
    <Dynamic
      component={props.as ?? "div"}
      ref={props.ref}
      {...mergeProps(triggerProps(), elementProps)}
    />
  );
}
