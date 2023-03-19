import { mergeProps } from "@zag-js/solid";
import { JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";
import { useTabsContext } from "@/lib/contexts/tabs-context";

export interface TabListProps<E extends HTMLElement = HTMLDivElement>
  extends JSX.HTMLAttributes<E> {
  as?: string;
}

export function TabList<E extends HTMLElement = HTMLDivElement>(
  props: TabListProps<E>
) {
  const tabs = useTabsContext();
  const [, elementProps] = splitProps(props, ["as", "ref"]);

  return (
    <Dynamic
      component={props.as ?? "div"}
      ref={props.ref}
      {...mergeProps(tabs.tablistProps, elementProps)}
    />
  );
}
