import { Outlet } from "solid-start";
import { NavSidebar } from "~/components/navigation/nav-sidebar";
import { SignInOverlay } from "~/components/overlays/sign-in-overlay";

export function AppLayout() {
  return (
    <>
      <NavSidebar />
      <Outlet />
      <SignInOverlay />
    </>
  );
}

export default AppLayout;
