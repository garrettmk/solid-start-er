import { JSX, splitProps } from "solid-js";

export interface BreadcrumbsProps extends JSX.HTMLAttributes<HTMLDivElement> {}

export function Breadcrumbs(props: BreadcrumbsProps) {
  const [, elementProps] = splitProps(props, ["children"]);

  return (
    // @ts-expect-error
    <nav class="flex" aria-label="Breadcrumb" {...elementProps}>
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
        {props.children}
      </ol>
    </nav>
  );
}
