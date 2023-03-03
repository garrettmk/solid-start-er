import { publicRouter } from "./routers/public";
import { userRouter } from "./routers/user";
import { router } from "./trpc";

export const appRouter = router({
  public: publicRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
export type AppRouterCaller = ReturnType<AppRouter["createCaller"]>;
