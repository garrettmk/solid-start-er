import { Accessor } from "solid-js";
import { useOnClickOutside } from "../util/use-click-outside";

export function onClickOutside(
  el: HTMLElement,
  accessor: Accessor<(event: MouseEvent) => void>
) {
  useOnClickOutside(() => el, accessor());
}
