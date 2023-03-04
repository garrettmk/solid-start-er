import { Accessor, onCleanup, onMount } from "solid-js";
import { isServer } from "solid-js/web";

export function useOnClickOutside(
  ref: Accessor<HTMLElement | undefined>,
  handler: (event: MouseEvent) => void
) {
  if (!isServer) {
    const onClick = (event: Event) => {
      const isNotRefElement = !(event.target === ref());
      const isOutsideRefElement = !ref()?.contains(event.target as Node);

      if (isNotRefElement && isOutsideRefElement) handler(event as MouseEvent);
    };

    onMount(() => document.addEventListener("click", onClick));
    onCleanup(() => document.removeEventListener("click", onClick));
  }
}
