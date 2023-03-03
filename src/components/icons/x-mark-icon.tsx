import { Icon, IconProps } from "./icon";

export function XMarkIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </Icon>
  );
}
