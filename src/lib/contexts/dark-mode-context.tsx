import { createContext, JSX, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { noop } from "../util/util";

export type DarkMode = {
  isDark: boolean;

  setDark: () => void;
  setLight: () => void;
  toggle: () => void;
};

export const defaultDarkMode: DarkMode = {
  isDark: false,
  setDark: noop,
  setLight: noop,
  toggle: noop,
};

export const DarkModeContext = createContext<DarkMode>(defaultDarkMode);

export function useDarkMode() {
  return useContext(DarkModeContext);
}

export function createDarkMode(
  initialState: Pick<DarkMode, "isDark"> = defaultDarkMode
): DarkMode {
  const [darkMode, setState] = createStore({
    ...initialState,
    setDark: () => setState((c) => ({ ...c, isDark: true })),
    setLight: () => setState((c) => ({ ...c, isDark: false })),
    toggle: () => setState((c) => ({ ...c, isDark: !c.isDark })),
  });

  return darkMode;
}

export type DarkModeProviderProps = {
  isDark?: boolean;
  darkMode?: DarkMode;
  children?: JSX.Element;
};

export function DarkModeProvider(props: DarkModeProviderProps) {
  const darkMode =
    props.darkMode ?? createDarkMode({ isDark: props.isDark ?? false });

  return (
    <DarkModeContext.Provider value={darkMode}>
      {props.children}
    </DarkModeContext.Provider>
  );
}
