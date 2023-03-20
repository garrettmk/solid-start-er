import { NavProgress } from "@/components/navigation/nav-progress";
import { NavSidebar } from "@/components/navigation/nav-sidebar";
import { SignInOverlay } from "@/components/overlays/sign-in-overlay";
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
