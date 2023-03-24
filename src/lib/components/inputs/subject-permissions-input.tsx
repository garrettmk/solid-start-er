import { splitProps } from "solid-js";
import { SwitchInput, SwitchInputProps } from "./switch-input";

export interface SubjectPermissionsInputProps extends SwitchInputProps {
  action?: string;
}

export function SubjectPermissionsInput(props: SubjectPermissionsInputProps) {
  const [, inputProps] = splitProps(props, ["ref", "action", "class"]);

  return (
    <SwitchInput
      ref={props.ref}
      container={{
        class:
          "justify-between !flex flex-row-reverse space-x-reverse px-4 py-3 bg-white dark:bg-slate-800 font-mono text-sm border-b last:border-none border-slate-200 dark:border-slate-700",
      }}
      value={props.action}
      {...inputProps}
    >
      {props.action}
    </SwitchInput>
  );
}
