import { createEffect } from "solid-js";
import { StateFrom } from "xstate";
import { createIndex, Index } from "../contexts/index-context";

export function useStateIndex(state: StateFrom<any>, order: string[]): Index {
  const index = createIndex();
  createEffect(() => {
    index.set(order.findIndex((value) => state.matches(value)));
  });

  return index;
}
