import { publicRouter } from "./routers/public";
import { userRouter } from "./routers/user";
import { applicationRouter } from "./routers/application";
import { router } from "./trpc";

export const appRouter = router({
  public: publicRouter,
  user: userRouter,
  application: applicationRouter,
});

export type AppRouter = typeof appRouter;
export type AppRouterCaller = ReturnType<AppRouter["createCaller"]>;
