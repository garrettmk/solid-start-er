import { Show, splitProps } from "solid-js";
import { useDarkMode } from "~/lib/contexts/dark-mode-context";
import { MoonIcon } from "../icons/moon-icon";
import { SunIcon } from "../icons/sun-icon";
import { Button, ButtonProps } from "./button";

export interface ButtonToggleThemeProps extends ButtonProps {}

export function ButtonToggleTheme(props: ButtonToggleThemeProps) {
  const [, buttonProps] = splitProps(props, ["onClick"]);
  const darkMode = useDarkMode();

  return (
    <Button icon onClick={darkMode.toggle} {...buttonProps}>
      <Show when={darkMode.isDark}>
        <SunIcon />
      </Show>
      <Show when={!darkMode.isDark}>
        <MoonIcon />
      </Show>
    </Button>
  );
}
