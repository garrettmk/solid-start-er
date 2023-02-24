// @refresh reload
import { Suspense } from "solid-js";
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
} from "solid-start";
import { NavSidebar } from "./components/navigation/nav-sidebar";
import { SignInOverlay } from "./components/overlays/sign-in-overlay";
import { AuthProvider } from "./lib/contexts/auth-context";
import {
  createDarkMode,
  DarkModeContext,
} from "./lib/contexts/dark-mode-context";
import { createLayout, LayoutContext } from "./lib/contexts/layout-context";
import "./root.css";

export default function Root() {
  const darkModeContext = createDarkMode();
  const [darkMode] = darkModeContext;

  const layout = createLayout({ sidebarOpen: true });

  return (
    <AuthProvider>
      <DarkModeContext.Provider value={darkModeContext}>
        <LayoutContext.Provider value={layout}>
          <Html lang="en" class={darkMode.isDark ? "dark" : ""}>
            <Head>
              <Title>SolidStart - Bare</Title>
              <Meta charset="utf-8" />
              <Meta
                name="viewport"
                content="width=device-width, initial-scale=1"
              />
            </Head>
            <Body class="bg-slate-50 dark:bg-slate-900">
              <Suspense>
                <ErrorBoundary>
                  <Routes>
                    <FileRoutes />
                  </Routes>
                </ErrorBoundary>
              </Suspense>
              <Scripts />
            </Body>
          </Html>
        </LayoutContext.Provider>
      </DarkModeContext.Provider>
    </AuthProvider>
  );
}
