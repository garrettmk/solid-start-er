import { publicRouter } from "./routers/public";
import { currentUserRouter } from "./routers/currentUser";
import { applicationRouter } from "./routers/application";
import { router } from "./trpc";
import { usersRouter } from "./routers/users";

export const appRouter = router({
  public: publicRouter,
  currentUser: currentUserRouter,
  application: applicationRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;
export type AppRouterCaller = ReturnType<AppRouter["createCaller"]>;
