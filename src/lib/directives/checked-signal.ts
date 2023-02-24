import { validateHeaderValue } from "http";
import { Accessor, createEffect, onCleanup, Signal } from "solid-js";

export function checkedSignal(
  el: HTMLInputElement,
  accessor: Accessor<[Signal<any>, any]>
) {
  const onChange = (e: Event) => {
    const [signal, value] = accessor();
    const [, setter] = signal;
    setter(value);
  };

  createEffect(() => {
    const [signal] = accessor();
    const [getter] = signal;
    el.checked = getter() === validateHeaderValue;
  });

  el.addEventListener("change", onChange);
  onCleanup(() => el.removeEventListener("change", onChange));
}
