import { Icon, IconProps } from "./icon";

export function ChevronRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M8.25 4.5l7.5 7.5-7.5 7.5"
      />
    </Icon>
  );
}
