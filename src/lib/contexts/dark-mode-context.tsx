import { createContext, JSX, useContext } from "solid-js";
import { createStore } from "solid-js/store";

export type DarkMode = [DarkModeState, DarkModeMethods];

export type DarkModeState = {
  isDark: boolean;
};

export type DarkModeMethods = {
  setDark: () => void;
  setLight: () => void;
  toggleDarkMode: () => void;
};

export const defaultDarkModeState: DarkModeState = {
  isDark: false,
};

export const defaultDarkModeMethods: DarkModeMethods = {
  setDark: () => {},
  setLight: () => {},
  toggleDarkMode: () => {},
};

export const DarkModeContext = createContext<[DarkModeState, DarkModeMethods]>([
  defaultDarkModeState,
  defaultDarkModeMethods,
]);

export function useDarkMode() {
  return useContext(DarkModeContext);
}

export function createDarkMode(
  initialState: DarkModeState = defaultDarkModeState
): DarkMode {
  const [state, setState] = createStore<DarkModeState>({ ...initialState });
  const methods: DarkModeMethods = {
    setDark: () => setState({ isDark: true }),
    setLight: () => setState({ isDark: false }),
    toggleDarkMode: () => setState(({ isDark }) => ({ isDark: !isDark })),
  };

  return [state, methods];
}

export type DarkModeProviderProps = {
  initialState?: DarkModeState;
  children?: JSX.Element;
};

export function DarkModeProvider(props: DarkModeProviderProps) {
  const { initialState } = props;
  const darkMode = createDarkMode(initialState);

  return (
    <DarkModeContext.Provider value={darkMode}>
      {props.children}
    </DarkModeContext.Provider>
  );
}
