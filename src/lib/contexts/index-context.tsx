import { createContext, JSX, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { clamp } from "../util/util";

export type Index = {
  value: number;
  max: number;
  hasNext: boolean;
  hasPrev: boolean;

  set: (value: number) => void;
  next: () => void;
  prev: () => void;
};

export const IndexContext = createContext<Index>({} as Index);

export function createIndex(initial?: { value?: number; max?: number }): Index {
  const range = { min: 0, max: initial?.max };

  const toState = (index: number) => {
    const value = clamp(index, range);
    const max = initial?.max ?? Infinity;

    return {
      value,
      max,
      hasNext: value < max,
      hasPrev: value > 0,
    };
  };

  const [index, setState] = createStore({
    ...toState(initial?.value ?? 0),
    set: (value: number) => setState((c) => ({ ...c, ...toState(value) })),
    next: () => setState((c) => ({ ...c, ...toState(c.value + 1) })),
    prev: () => setState((c) => ({ ...c, ...toState(c.value - 1) })),
  });

  return index;
}

export function useIndexContext() {
  return useContext(IndexContext);
}

export interface IndexProviderProps {
  initial?: Pick<Partial<Index>, "value" | "max">;
  children?: JSX.Element;
}

export function IndexProvider(props: IndexProviderProps) {
  const value = createIndex(props.initial);

  return (
    <IndexContext.Provider value={value}>
      {props.children}
    </IndexContext.Provider>
  );
}
