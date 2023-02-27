import { Outlet } from "solid-start";
import { NavSidebar } from "~/components/navigation/nav-sidebar";
import { SignInOverlay } from "~/components/overlays/sign-in-overlay";

export function AppLayout() {
  return (
    <>
      <NavSidebar />
      <main class="ml-14">
        <Outlet />
      </main>
      <SignInOverlay />
    </>
  );
}

export default AppLayout;
