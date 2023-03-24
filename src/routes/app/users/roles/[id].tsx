import { createForm, Field, Form, reset } from "@modular-forms/solid";
import { useParams, useRouteData } from "@solidjs/router";
import { For, onMount } from "solid-js";
import { createRouteAction, RouteDataArgs } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { BreadcrumbItem } from "@/lib/components/breadcrumbs/breadcrumb-item";
import { Breadcrumbs } from "@/lib/components/breadcrumbs/breadcrumbs";
import { Button } from "@/lib/components/buttons/button";
import { Divider } from "@/lib/components/dividers/divider";
import { SubjectPermissionsGroup } from "@/lib/components/inputs/subject-permissions-group";
import { SubjectPermissionsInput } from "@/lib/components/inputs/subject-permissions-input";
import { TextInput } from "@/lib/components/inputs/text-input";
import { PageContent } from "@/lib/components/page/page-content";
import { PageHeader } from "@/lib/components/page/page-header";
import { Panel } from "@/lib/components/panels/panel";
import { HStack } from "@/lib/components/stacks/h-stack";
import { VStack } from "@/lib/components/stacks/v-stack";
import { Heading } from "@/lib/components/text/heading";
import { api } from "@/lib/trpc/client";
import { getAuthenticatedServerContext } from "@/lib/util/get-page-context";

export function routeData({ params }: RouteDataArgs) {
  return createServerData$(
    async (id, event) => {
      const { api } = getAuthenticatedServerContext(event);
      return await api.roles.getRole(id);
    },
    { key: () => parseInt(params.id) }
  );
}

export function RolePage() {
  const { id } = useParams();
  const role = useRouteData<typeof routeData>();

  const [update, updateSubject] = createRouteAction(
    async ({ application_roles, tenants, users }: Record<string, string[]>) => {
      await api.roles.updateRole.mutate({
        id: parseInt(id),
        subjects: { application_roles, tenants, users },
      });
    }
  );

  const form = createForm<any>();
  const canSave = () => !form.dirty || form.validating || form.submitting;

  onMount(() => {
    reset(form, {
      initialValues: {
        ...role()?.subjects,
        name: role()?.name,
        description: role()?.description,
      },
    });
  });

  return (
    <Form of={form} onSubmit={updateSubject}>
      <PageHeader>
        <Breadcrumbs>
          <BreadcrumbItem href="/app/users/roles">Roles</BreadcrumbItem>
          <BreadcrumbItem>/</BreadcrumbItem>
          <BreadcrumbItem>{role()?.name}</BreadcrumbItem>
        </Breadcrumbs>
        <Button type="submit" disabled={canSave()}>
          Save
        </Button>
      </PageHeader>
      <PageContent>
        <HStack justify="between" align="end" class="mb-2">
          <Heading level="1" class="text-2xl font-medium">
            Role Details
          </Heading>
        </HStack>
        <Divider />
        <Panel class="p-6 pb-7">
          <VStack spacing="md" class="max-w-[theme(spacing.96)]">
            <Field of={form} name="name">
              {(field) => (
                <TextInput
                  {...field.props}
                  label="Name"
                  value={field.value}
                  error={field.error}
                />
              )}
            </Field>
            <Field of={form} name="description">
              {(field) => (
                <TextInput
                  {...field.props}
                  label="Description"
                  value={field.value}
                  error={field.error}
                />
              )}
            </Field>
          </VStack>
        </Panel>

        <HStack justify="between" align="end" class="mt-12 mb-2">
          <Heading level="1" class="text-2xl font-medium">
            Permissions
          </Heading>
        </HStack>
        <Divider />

        <HStack align="start" spacing="md" class="mt-6">
          <SubjectPermissionsGroup
            subject="application_roles"
            description="Application roles are groups of application-level privileges. Use with care!"
          >
            <For each={["create", "read", "update", "delete", "assign"]}>
              {(action) => (
                <Field of={form} name="application_roles">
                  {(field) => {
                    return (
                      <SubjectPermissionsInput
                        id={`application_roles:${action}`}
                        action={action}
                        checked={field.value?.includes(action)}
                        {...field.props}
                      />
                    );
                  }}
                </Field>
              )}
            </For>
          </SubjectPermissionsGroup>

          <SubjectPermissionsGroup
            subject="tenants"
            description="Tenants are a way to group users and share resources among those users."
          >
            <For
              each={[
                "create",
                "read",
                "update",
                "delete",
                "assign",
                "set_status",
              ]}
            >
              {(action) => (
                <Field of={form} name="tenants">
                  {(field) => {
                    return (
                      <SubjectPermissionsInput
                        id={`tenants:${action}`}
                        action={action}
                        checked={field.value?.includes(action)}
                        {...field.props}
                      />
                    );
                  }}
                </Field>
              )}
            </For>
          </SubjectPermissionsGroup>

          <SubjectPermissionsGroup
            subject="users"
            description="This represents the individual users of the application."
          >
            <For each={["invite", "read", "update", "delete", "set_status"]}>
              {(action) => (
                <Field of={form} name="users">
                  {(field) => {
                    return (
                      <SubjectPermissionsInput
                        id={`users:${action}`}
                        action={action}
                        checked={field.value?.includes(action)}
                        {...field.props}
                      />
                    );
                  }}
                </Field>
              )}
            </For>
          </SubjectPermissionsGroup>
        </HStack>
      </PageContent>
    </Form>
  );
}

export default RolePage;
