import { splitProps } from "solid-js";
import { useIndexContext } from "~/lib/contexts/index-context";
import { Button, ButtonProps } from "./button";

export function ButtonNext(props: ButtonProps) {
  const index = useIndexContext();
  const [, buttonProps] = splitProps(props, ["onClick"]);
  const onClick = (e: Event) => {
    // @ts-ignore
    // props.onClick?.(e);
    index.set();
  };

  return <Button onClick={onClick} {...buttonProps} />;
}
