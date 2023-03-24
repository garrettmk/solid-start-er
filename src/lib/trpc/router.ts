import { signUpRouter } from "../../features/sign-up/api/sign-up.router";
import { rolesRouter } from "../../features/roles/api/roles.router";
import { router } from "./trpc";
import { usersRouter } from "../../features/users/api/users.router";

export const apiRouter = router({
  signUp: signUpRouter,
  roles: rolesRouter,
  users: usersRouter,
});

export type ApiRouter = typeof apiRouter;
export type ApiCaller = ReturnType<ApiRouter["createCaller"]>;
