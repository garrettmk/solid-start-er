import { Accessor, onCleanup } from "solid-js";

export function onClickOutside(
  el: Element,
  accessor: Accessor<(event: MouseEvent) => void>
) {
  const onClick = (e: MouseEvent) =>
    !el.contains(e.target as Node) && accessor()(e);
  document.addEventListener("click", onClick);

  onCleanup(() => document.removeEventListener("click", onClick));
}
