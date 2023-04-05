import { JSX, splitProps } from "solid-js";

export type BreadcrumbsProps = JSX.HTMLAttributes<HTMLDivElement>;

export function Breadcrumbs(props: BreadcrumbsProps) {
  const [, elementProps] = splitProps(props, ["children"]);

  return (
    //@ts-expect-error props mismatch with nav element vs. div
    <nav class="flex" aria-label="Breadcrumb" {...elementProps}>
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
        {props.children}
      </ol>
    </nav>
  );
}
