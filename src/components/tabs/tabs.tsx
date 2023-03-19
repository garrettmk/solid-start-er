import { JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";
import { useTabsContext } from "@/lib/contexts/tabs-context";
import { mergeProps } from "@zag-js/solid";

export interface TabsProps<E extends HTMLElement = HTMLDivElement>
  extends JSX.HTMLAttributes<E> {
  as?: string;
}

export function Tabs<E extends HTMLElement = HTMLDivElement>(
  props: TabsProps<E>
) {
  const tabs = useTabsContext();
  const [, elementProps] = splitProps(props, ["as", "ref"]);

  return (
    <Dynamic
      component={props.as ?? "div"}
      ref={props.ref}
      {...mergeProps(tabs.rootProps, elementProps)}
    />
  );
}
