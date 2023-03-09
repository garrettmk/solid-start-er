import { Icon, IconProps } from "./icon";

export function PlusIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </Icon>
  );
}
