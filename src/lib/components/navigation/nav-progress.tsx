import clsx from "clsx";
import { createEffect, createSignal } from "solid-js";
import { useIsRouting } from "solid-start";
import { Progress } from "../progress/progress";

export function NavProgress() {
  const isRouting = useIsRouting();
  const [id, setId] = createSignal<any>();
  const [value, setValue] = createSignal(0);

  createEffect(() => {
    if (isRouting()) {
      setValue(50);

      const id = setInterval(() => {
        setValue((prev) => prev + (100 - prev) / 2);
      }, 1200);

      setId(id);
    } else {
      setValue(0);
      clearInterval(id());
    }
  });

  return (
    <Progress
      class={clsx("fixed top-0 left-0 right-0", !isRouting() && "opacity-0")}
      value={value()}
      size="xs"
      background="none"
    />
  );
}
