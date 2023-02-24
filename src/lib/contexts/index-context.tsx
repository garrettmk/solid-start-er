import { createContext, JSX, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { clamp } from "../util/util";

export type IndexState = {
  value: number;
  max: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type IndexMethods = {
  setIndexValue: (value: number) => void;
  setNextIndex: () => void;
  setPrevIndex: () => void;
};

export type IndexContextValue = [IndexState, IndexMethods];

export const IndexContext = createContext<IndexContextValue>([
  {},
  {},
] as IndexContextValue);

export function createIndex(initial?: {
  value?: number;
  max?: number;
}): IndexContextValue {
  const range = { min: 0, max: initial?.max };

  const toState: (index: number) => IndexState = (index: number) => {
    const value = clamp(index, range);
    const max = initial?.max ?? Infinity;
    return {
      value,
      max,
      hasNext: value < max,
      hasPrev: value > 0,
    };
  };

  const [state, setState] = createStore<IndexState>(
    toState(initial?.value ?? 0)
  );

  const methods: IndexMethods = {
    setIndexValue: (value: number) => setState(toState(value)),
    setNextIndex: () => setState(toState(state.value + 1)),
    setPrevIndex: () => setState(toState(state.value - 1)),
  };

  return [state, methods];
}

export function useIndexContext() {
  return useContext(IndexContext);
}

export interface IndexProviderProps {
  initial?: Pick<Partial<IndexState>, "value" | "max">;
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
