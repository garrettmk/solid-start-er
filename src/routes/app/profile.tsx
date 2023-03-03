import { User } from "@supabase/supabase-js";
import { Resource, Show } from "solid-js";
import { createRouteAction, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { Avatar } from "~/components/avatars/avatar";
import { BreadcrumbItem } from "~/components/breadcrumbs/breadcrumb-item";
import { Breadcrumbs } from "~/components/breadcrumbs/breadcrumbs";
import { Button } from "~/components/buttons/button";
import { Drawer } from "~/components/drawers/drawer";
import { UpdateProfileForm } from "~/components/forms/update-profile-form";
import { PencilIcon } from "~/components/icons/pencil-icon";
import { XMarkIcon } from "~/components/icons/x-mark-icon";
import { PageDivider } from "~/components/page/page-divider";
import { PageHeader } from "~/components/page/page-header";
import { HStack } from "~/components/stacks/h-stack";
import { VStack } from "~/components/stacks/v-stack";
import { api } from "~/lib/api/client";
import { AppRouterCaller } from "~/lib/api/router";
import { UpdateProfileData } from "~/lib/schemas/update-profile";
import { createToggle } from "~/lib/util/create-toggle";

export function routeData() {
  return createServerData$(async (_, event) => {
    const user = event.locals.user as User;
    const api = event.locals.api as AppRouterCaller;
    const { data: profile, error } = await api.user.getProfile();

    return { user, profile, error };
  });
}

export function ProfilePage() {
  const isOpen = createToggle(true);
  const data = useRouteData<Resource<{ user: User; profile: any }>>();

  const handleClickEdit = (event: Event) => {
    event.stopImmediatePropagation();
    isOpen.on();
  };

  const [update, updateProfile] = createRouteAction<UpdateProfileData>(
    (data: any) => api.user.updateProfile.mutate(data)
  );

  return (
    <>
      <main class="px-12">
        <PageHeader class="-mx-12 mb-12" title="User Profile">
          <Breadcrumbs>
            <BreadcrumbItem href="/app/profile">
              {data()?.profile.email}
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
          <VStack
            spacing="sm"
            align="center"
            class="bg-white border border-slate-300 p-6 rounded-lg"
          >
            <Avatar size="huge" src={data()?.profile.avatar_url} />
            <Button size="sm" color="ghost">
              Upload new image...
            </Button>
          </VStack>
          <VStack
            as="ul"
            spacing="md"
            class="list-none rounded-lg bg-white border border-slate-300 p-6 flex-grow flex-shrink basis-full"
          >
            <li>
              <span class="block text-sm text-slate-600 dark:text-slate-400 mb-1">
                Full name
              </span>
              <span class="text-xl font-medium text-slate-800">
                {data()?.profile.full_name}
              </span>
            </li>
            <li>
              <span class="block text-sm text-slate-600 dark:text-slate-400 mb-1">
                Email
              </span>
              <span class="text-xl font-medium text-slate-800 dark:text-slate-300">
                {data()?.profile.email}
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
        </HStack>
        <h2 class="text-md text-slate-600 dark:text-slate-400 mb-1">Tenants</h2>
        <PageDivider class="mb-6" />
        <p class="p-6 mb-12 min-h-[12rem] border border-slate-300 bg-white rounded-lg">
          You aren't a member of any tenants yet.
        </p>
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
