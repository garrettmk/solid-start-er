import { OnChangeFn, RowSelectionState } from "@tanstack/solid-table";
import { Signal } from "solid-js";
import { Accessor, createEffect, createSignal } from "solid-js";

export function makeRowSelectionHandler<T>(
  data: Accessor<T[] | undefined>,
  handler: (selection: T[]) => void
): OnChangeFn<RowSelectionState> {
  return (updaterOrValue) => {
    const state =
      typeof updaterOrValue === "function"
        ? updaterOrValue({})
        : updaterOrValue;
    const items = data() ?? [];

    const selection = Object.entries(state)
      .filter(([, isSelected]) => isSelected)
      .map(([idx]) => items[parseInt(idx)]);

    handler(selection);
  };
}

export function getSelectedItems<T>(
  items: T[],
  selectionState: RowSelectionState
): T[] {
  return (
    Object.entries(selectionState)
      .filter(([, isSelected]) => isSelected)
      .map(([idx]) => items[parseInt(idx)]) ?? []
  );
}

export function useRowSelection<T>(
  data: T[] | Accessor<T[] | undefined>,
  handler: (selection: T[]) => void
): Signal<RowSelectionState> {
  const [selectionState, setSelectionState] = createSignal<RowSelectionState>(
    {}
  );
  createEffect(() => {
    const items = typeof data === "function" ? data() ?? [] : data;
    const state = selectionState();

    const selection = getSelectedItems(items, state);
    handler(selection);
  });

  return [selectionState, setSelectionState];
}
