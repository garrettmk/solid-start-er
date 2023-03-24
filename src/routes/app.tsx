import { NavProgress } from "@/lib/components/navigation/nav-progress";
import { NavSidebar } from "@/lib/components/navigation/nav-sidebar";
import { SignInOverlay } from "@/lib/components/overlays/sign-in-overlay";
import { Outlet } from "solid-start";

export function AppLayout() {
  return (
    <>
      <NavSidebar />
      <div class="ml-14">
        <Outlet />
      </div>
      <NavProgress />
      <SignInOverlay />
    </>
  );
}

export default AppLayout;
