import { createStore } from "solid-js/store";

export type Toggle = {
  value: boolean;
  on: () => void;
  off: () => void;
  toggle: () => void;
};

export function createToggle(initialValue?: boolean): Toggle {
  const [toggle, setState] = createStore({
    value: initialValue ?? false,
    on: () => {
      setState("value", true);
    },
    off: () => {
      setState("value", false);
    },
    toggle: () => {
      setState("value", (c) => !c);
    },
  });

  return toggle;
}
