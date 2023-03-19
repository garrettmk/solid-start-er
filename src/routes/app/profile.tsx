import { Avatar } from "@/components/avatars/avatar";
import { BreadcrumbItem } from "@/components/breadcrumbs/breadcrumb-item";
import { Breadcrumbs } from "@/components/breadcrumbs/breadcrumbs";
import { Button } from "@/components/buttons/button";
import { Drawer } from "@/components/drawers/drawer";
import { PencilIcon } from "@/components/icons/pencil-icon";
import { XMarkIcon } from "@/components/icons/x-mark-icon";
import { PageDivider } from "@/components/page/page-divider";
import { PageHeader } from "@/components/page/page-header";
import { Panel } from "@/components/panels/panel";
import { HStack } from "@/components/stacks/h-stack";
import { VStack } from "@/components/stacks/v-stack";
import { UpdateProfileForm } from "@/features/users/components/update-profile-form";
import { UserProfileUpdate } from "@/features/users/schema/user-profile-update-schema";
import { api } from "@/lib/trpc/client";
import { createToggle } from "@/lib/util/create-toggle";
import { getAuthenticatedServerContext } from "@/lib/util/get-page-context";
import { Show } from "solid-js";
import { createRouteAction, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";

export function routeData() {
  return createServerData$(async (_, event) => {
    const { api } = getAuthenticatedServerContext(event);
    return await api.users.getCurrentProfile();
  });
}

export function ProfilePage() {
  const isOpen = createToggle();
  const data = useRouteData<typeof routeData>();
  const profile = () => data()?.data;

  const handleClickEdit = (event: Event) => {
    event.stopImmediatePropagation();
    isOpen.on();
  };

  const [update, updateProfile] = createRouteAction((data: UserProfileUpdate) =>
    api.users.updateCurrentProfile.mutate(data)
  );

  return (
    <>
      <main class="px-12">
        <PageHeader class="-mx-12 mb-12" title="User Profile">
          <Breadcrumbs>
            <BreadcrumbItem href="/app/profile">
              {profile()?.email}
            </BreadcrumbItem>
            <BreadcrumbItem>/</BreadcrumbItem>
            <BreadcrumbItem>Profile</BreadcrumbItem>
          </Breadcrumbs>
          <Button onClick={handleClickEdit}>
            <PencilIcon class="mr-3" />
            Edit
          </Button>
        </PageHeader>
        <HStack as="section" spacing="xl" class="mb-12">
          <Panel class="flex items-center justify-middle p-6 shrink-0">
            <Avatar size="huge" src={profile()?.avatar_url} />
          </Panel>
          <Panel class="p-6 basis-full">
            <VStack as="ul" spacing="md" class="list-none">
              <li>
                <span class="block text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Full name
                </span>
                <span class="text-xl font-medium text-slate-800">
                  {profile()?.full_name}
                </span>
              </li>
              <li>
                <span class="block text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Email
                </span>
                <span class="text-xl font-medium text-slate-800 dark:text-slate-300">
                  {profile()?.email}
                </span>
              </li>
              <li>
                <span class="block text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Initials
                </span>
                <span class="text-xl font-medium text-slate-800 dark:text-slate-300">
                  GM
                </span>
              </li>
            </VStack>
          </Panel>
        </HStack>
        <h2 class="text-md text-slate-600 dark:text-slate-400 mb-1">Tenants</h2>
        <PageDivider class="mb-6" />
        <Panel as="p" class="p-6 mb-12 min-h-[12rem]">
          You aren't a member of any tenants yet.
        </Panel>
      </main>
      <Drawer
        isOpen={isOpen.value}
        onClickOutside={isOpen.off}
        placement="right"
        backdrop
      >
        <HStack class="mb-6" align="center" justify="between">
          <h2 class="text-md font-medium text-slate-600 dark:text-slate-400">
            Edit Profile
          </h2>
          <Button color="ghost" size="xs" onClick={isOpen.off}>
            <XMarkIcon />
          </Button>
        </HStack>

        <Show when={isOpen.value}>
          <UpdateProfileForm onSubmit={updateProfile}>
            <Button class="ml-auto mt-6" type="submit">
              Save
            </Button>
          </UpdateProfileForm>
        </Show>
      </Drawer>
    </>
  );
}

export default ProfilePage;
