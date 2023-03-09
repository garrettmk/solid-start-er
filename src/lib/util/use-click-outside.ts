import { Accessor, onCleanup, onMount } from "solid-js";
import { isServer } from "solid-js/web";

export function useOnClickOutside(
  ...args: [
    ...refs: Accessor<HTMLElement | undefined>[],
    handler: (event: MouseEvent) => void
  ]
) {
  if (!isServer) {
    const [handler, ...refs] = args.reverse() as [
      handler: (event: MouseEvent) => void,
      ...refs: Accessor<HTMLElement | undefined>[]
    ];

    const onClick = (event: Event) => {
      const isInsideRefElement = refs.some((ref) =>
        ref()?.contains(event.target as Node)
      );

      if (!isInsideRefElement) handler(event as MouseEvent);
    };

    onMount(() => document.addEventListener("click", onClick));
    onCleanup(() => document.removeEventListener("click", onClick));
  }
}
