import { PageContent } from "~/components/page/page-content";
import { PageHeader } from "~/components/page/page-header";

export function TenantsPage() {
  return (
    <>
      <PageHeader>
        <h2 class="text-sm text-slate-800 dark:text-slate-200">
          Application Tenants
        </h2>
      </PageHeader>
      <PageContent>Hello</PageContent>
    </>
  );
}

export default TenantsPage;
