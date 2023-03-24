import { CalendarIcon } from "@/lib/components/icons/calendar-icon";
import { CheckIcon } from "@/lib/components/icons/check-icon";
import { SearchInput } from "@/lib/components/inputs/search-input";
import { PageContent } from "@/lib/components/page/page-content";
import { PageHeader } from "@/lib/components/page/page-header";
import { HStack } from "@/lib/components/stacks/h-stack";
import { VStack } from "@/lib/components/stacks/v-stack";

export function TenantsPage() {
  const now = new Date();

  return (
    <>
      <PageHeader>
        <h2 class="text-sm text-slate-800 dark:text-slate-200">
          Application Tenants
        </h2>
        <HStack>
          <SearchInput placeholder="Search tenants..." class="w-64" />
        </HStack>
      </PageHeader>
      <PageContent>
        <table class="w-full table-fixed border-collapse">
          <thead class="text-sm text-slate-600 [&_th]:font-medium">
            <tr class="[&>th]:py-3 [&>th:not(:first-child)]:px-6 border-b border-slate-200">
              <th class="w-32 text-left">Logo</th>
              <th class="text-left">Description</th>
              <th class="w-36 text-left">Status</th>
              <th class="w-36 text-left">Created</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="h-6" colSpan="-1" />
            </tr>
            <tr class="[&_td]:p-0">
              <td>
                <div class="h-36 flex items-center justify-center bg-slate-200 font-medium text-2xl text-slate-800 rounded-tl-lg rounded-bl-lg border border-slate-300 border-r-0 overflow-hidden">
                  ACME
                </div>
              </td>
              <td>
                <VStack class="h-36 p-6 bg-white border-slate-300 border border-l-0 border-r-0">
                  <p class="mb-1 text-lg font-medium text-slate-700">
                    ACME Industrial, Inc.
                  </p>
                  <p class="block text-sm text-slate-700 whitespace-pre-lin text-ellipsis overflow-hidden w-64">
                    Since 1947, ACME Industrial has been the world leader in
                    explosives and booby-trap manufacture.
                  </p>
                </VStack>
              </td>
              <td>
                <VStack
                  align="start"
                  justify="center"
                  class="h-36 p-6 bg-white border border-slate-300 border-l-0 border-r-0 text-sm text-slate-800"
                >
                  <div>
                    <CheckIcon
                      size="xs"
                      stroke-width="2"
                      class="text-green-600 inline mr-1"
                    />
                    Active
                  </div>
                </VStack>
              </td>
              <td>
                <VStack
                  align="start"
                  justify="center"
                  class="h-36 p-6 bg-white border border-slate-300 border-l-0 rounded-tr-lg rounded-br-lg text-sm text-slate-800"
                >
                  <div>
                    <CalendarIcon
                      size="xs"
                      stroke-width="2"
                      class="inline text-blue-600 mr-1"
                    />
                    {now.toLocaleDateString()}
                  </div>
                </VStack>
              </td>
            </tr>
          </tbody>
        </table>
      </PageContent>
    </>
  );
}

export default TenantsPage;
