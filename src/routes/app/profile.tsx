import { User } from "@supabase/supabase-js";
import { Resource } from "solid-js";
import { RouteDataFunc, useRouteData } from "solid-start";
import {
  createServerData$,
  useRequest,
  useServerContext,
} from "solid-start/server";
import { Avatar } from "~/components/avatars/avatar";
import { BreadcrumbItem } from "~/components/breadcrumbs/breadcrumb-item";
import { Breadcrumbs } from "~/components/breadcrumbs/breadcrumbs";
import { Button } from "~/components/buttons/button";
import { PageDivider } from "~/components/page/page-divider";
import { PageHeader } from "~/components/page/page-header";
import { VStack } from "~/components/stacks/v-stack";
import { useAuthContext } from "~/lib/contexts/auth-context";
import { supabase } from "~/lib/supabase/supabase";
import { createToggle } from "~/lib/util/create-toggle";

export function routeData() {
  return createServerData$(async (_, event) => {
    const user = event.locals.user as User;
    const profile = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    return { user, profile };
  });
}

export function ProfilePage() {
  const auth = useAuthContext();
  const isOpen = createToggle(false);
  const data = useRouteData<Resource<{ user: User }>>();
  console.log(data()?.profile);

  return (
    <main class="px-12">
      <PageHeader class="-mx-12 mb-12" title="User Profile">
        <Breadcrumbs>
          <BreadcrumbItem href="/app/profile">
            {data()?.user.email}
          </BreadcrumbItem>
          <BreadcrumbItem>/</BreadcrumbItem>
          <BreadcrumbItem>Profile</BreadcrumbItem>
        </Breadcrumbs>
      </PageHeader>
      <section class="flex mb-12 items-center">
        <VStack spacing="sm" align="center" class="mr-12">
          <Avatar size="huge" />
          <Button size="sm" color="ghost">
            Upload new image...
          </Button>
        </VStack>
        <VStack as="ul" spacing="md" class="mb-12 list-none">
          <li>
            <span class="block text-sm text-slate-600 dark:text-slate-400 mb-1">
              Full name
            </span>
            <span class="text-xl font-medium text-slate-800">
              Garrett Myrick
            </span>
          </li>
          <li>
            <span class="block text-sm text-slate-600 dark:text-slate-400 mb-1">
              Email address
            </span>
            <span class="text-xl font-medium text-slate-800 dark:text-slate-300">
              garrettmyrick@gmail.com
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
      </section>
      <h2 class="text-md text-slate-600 dark:text-slate-400 mb-1">Tenants</h2>
      <PageDivider class="mb-6" />
      <p>You aren't a member of any tenants yet.</p>
    </main>
  );
}

export default ProfilePage;
