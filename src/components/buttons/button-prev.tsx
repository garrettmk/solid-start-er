import { splitProps } from "solid-js";
import { useIndexContext } from "~/lib/contexts/index-context";
import { Button, ButtonProps } from "./button";

export function ButtonPrev(props: ButtonProps) {
  const [, { setPrevIndex }] = useIndexContext();
  const [, buttonProps] = splitProps(props, ["onClick"]);

  return <Button onClick={setPrevIndex} {...buttonProps} />;
}
