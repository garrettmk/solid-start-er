import { Accessor, onCleanup } from "solid-js";

export function onClickOutside(el: Element, accessor: Accessor<() => void>) {
  const onClick = (e: Event) => !el.contains(e.target as Node) && accessor()();
  document.addEventListener("click", onClick);

  onCleanup(() => document.removeEventListener("click", onClick));
}
