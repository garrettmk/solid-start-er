import { ButtonProps } from "@/components/buttons/button";
import { BreadcrumbItem } from "@/components/breadcrumbs/breadcrumb-item";
import { Breadcrumbs } from "@/components/breadcrumbs/breadcrumbs";
import { Button } from "@/components/buttons/button";
import { PageContent } from "@/components/page/page-content";
import { PageHeader } from "@/components/page/page-header";
import { Panel } from "@/components/panels/panel";
import { Heading } from "@/components/text/heading";
import { For } from "solid-js";
import { UserIcon } from "@/components/icons/user-icon";

export default function ButtonPage() {
  const sizes: ButtonProps["size"][] = ["xs", "sm", "md", "lg", "xl"];
  const colors: ButtonProps["color"][] = [
    undefined,
    "none",
    "alternative",
    "ghost",
    "light",
    "dark",
    "green",
    "red",
  ];

  return (
    <>
      <PageHeader>
        <Breadcrumbs>
          <BreadcrumbItem href="/app/components/buttons">
            Buttons
          </BreadcrumbItem>
          <BreadcrumbItem>/</BreadcrumbItem>
          <BreadcrumbItem>Button</BreadcrumbItem>
        </Breadcrumbs>
      </PageHeader>
      <PageContent>
        <Panel class="p-6">
          <Heading level="2" class="text-2xl mb-6">
            Sizes & Colors
          </Heading>
          <div class="grid auto-rows-min grid-cols-6 gap-4 items-end justify-items-center justify-start">
            <Heading level="6" class="text-base font-medium"></Heading>
            <For each={sizes}>
              {(size) => (
                <Heading level="6" class="text-base font-medium">
                  {size}
                </Heading>
              )}
            </For>

            <For each={colors}>
              {(color) => (
                <>
                  <Heading
                    level="4"
                    class="text-base font-medium justify-self-end"
                  >
                    {color ?? "default"}
                  </Heading>
                  <For each={sizes}>
                    {(size) => (
                      <>
                        <Button size={size} color={color}>
                          Button
                        </Button>
                      </>
                    )}
                  </For>
                  <Heading
                    level="4"
                    class="text-base font-medium justify-self-end"
                  >
                    {(color ?? "default") + " (disabled)"}
                  </Heading>
                  <For each={sizes}>
                    {(size) => (
                      <>
                        <Button size={size} color={color} disabled>
                          Button
                        </Button>
                      </>
                    )}
                  </For>
                  <Heading
                    level="4"
                    class="text-base font-medium justify-self-end"
                  >
                    {(color ?? "default") + " (icon)"}
                  </Heading>
                  <For each={sizes}>
                    {(size) => (
                      <>
                        <Button size={size} color={color} icon>
                          <UserIcon size={size} />
                        </Button>
                      </>
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
