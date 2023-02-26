import { publicRouter } from "./routers/public";
import { router } from "./trpc";

export const appRouter = router({
  public: publicRouter,
});

export type AppRouter = typeof appRouter;
