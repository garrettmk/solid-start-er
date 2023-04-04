import { Avatar, AvatarProps } from "@/lib/components/avatars/avatar";
import { BreadcrumbItem } from "@/lib/components/breadcrumbs/breadcrumb-item";
import { Breadcrumbs } from "@/lib/components/breadcrumbs/breadcrumbs";
import { PageContent } from "@/lib/components/page/page-content";
import { PageHeader } from "@/lib/components/page/page-header";
import { Panel } from "@/lib/components/panels/panel";
import { Heading } from "@/lib/components/text/heading";
import { sizePropValues } from "@/lib/design/props";
import { For } from "solid-js";

export default function AvatarPage() {
  const initials: AvatarProps["initials"][] = [undefined, "JD", "J", ""];
  const shapes: AvatarProps["shape"][] = ["round", "square"];

  return (
    <>
      <PageHeader>
        <Breadcrumbs>
          <BreadcrumbItem href="/app/components/avatars">
            Avatars
          </BreadcrumbItem>
          <BreadcrumbItem>/</BreadcrumbItem>
          <BreadcrumbItem>Avatar</BreadcrumbItem>
        </Breadcrumbs>
      </PageHeader>
      <PageContent>
        <Panel class="p-6">
          <div class="grid auto-rows-min grid-cols-10 gap-4 items-end justify-items-center justify-start">
            <span />
            <For each={sizePropValues}>
              {(size) => (
                <Heading level="6" class="text-base font-medium">
                  {size}
                </Heading>
              )}
            </For>

            <For each={shapes}>
              {(shape) => (
                <>
                  <Heading level="4" class="text-base font-medium">
                    {shape}
                  </Heading>
                  <For each={sizePropValues}>
                    {(size) => <Avatar size={size} shape={shape} />}
                  </For>
                  <span />
                  <For each={sizePropValues}>
                    {(size) => (
                      <Avatar size={size} shape={shape} initials="GM" />
                    )}
                  </For>
                </>
              )}
            </For>
          </div>
        </Panel>
      </PageContent>
    </>
  );
}
