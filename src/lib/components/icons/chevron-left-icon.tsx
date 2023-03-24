import { Icon, IconProps } from "./icon";

export function ChevronLeftIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M15.75 19.5L8.25 12l7.5-7.5"
      />
    </Icon>
  );
}
