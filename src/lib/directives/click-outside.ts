import { Accessor, onCleanup } from "solid-js";
import { isServer } from "solid-js/web";

export function onClickOutside(
  el: Element,
  accessor: Accessor<(event: MouseEvent) => void>
) {
  if (!isServer) {
    const onClick = (e: MouseEvent) =>
      !el.contains(e.target as Node) && accessor()(e);
    document.addEventListener("click", onClick);

    onCleanup(() => document.removeEventListener("click", onClick));
  }
}
