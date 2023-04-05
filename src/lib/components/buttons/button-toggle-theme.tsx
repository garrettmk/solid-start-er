import { useDarkMode } from "@/lib/contexts/dark-mode-context";
import { Show } from "solid-js";
import { MoonIcon } from "../icons/moon-icon";
import { SunIcon } from "../icons/sun-icon";
import { Button, ButtonProps } from "./button";

export type ButtonToggleThemeProps = Omit<ButtonProps, "onClick">;

export function ButtonToggleTheme(props: ButtonToggleThemeProps) {
  const darkMode = useDarkMode();

  return (
    <Button icon onClick={darkMode.toggle} {...props}>
      <Show when={darkMode.isDark}>
        <SunIcon />
      </Show>
      <Show when={!darkMode.isDark}>
        <MoonIcon />
      </Show>
    </Button>
  );
}
