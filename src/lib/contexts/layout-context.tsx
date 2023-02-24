import { createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { noop } from "../util/util";

export type LayoutState = {
  headerHeight: number;
  sidebarOpen: boolean;
  sidebarWidth: number;
};

export type LayoutMethods = {
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
};

export const defaultLayoutState: LayoutState = {
  headerHeight: 0,
  sidebarOpen: false,
  sidebarWidth: 0,
};

export const defaultLayoutMethods: LayoutMethods = {
  openSidebar: noop,
  closeSidebar: noop,
  toggleSidebar: noop,
};

export type LayoutContextValue = [LayoutState, LayoutMethods];

export const LayoutContext = createContext<LayoutContextValue>([
  defaultLayoutState,
  defaultLayoutMethods,
]);

export function useLayoutContext() {
  return useContext(LayoutContext);
}

export function createLayout(
  initialState?: Partial<LayoutState>
): LayoutContextValue {
  const [state, setState] = createStore<LayoutState>({
    ...defaultLayoutState,
    ...initialState,
  });

  const methods: LayoutMethods = {
    openSidebar: () => setState((c) => ({ ...c, sidebarOpen: true })),
    closeSidebar: () => setState((c) => ({ ...c, sidebarOpen: false })),
    toggleSidebar: () =>
      setState((c) => ({ ...c, sidebarOpen: !c.sidebarOpen })),
  };

  return [state, methods];
}
