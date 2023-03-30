import { signUpRouter } from "../../features/sign-up/api/sign-up.router";
import { rolesRouter } from "../../features/roles/api/roles.router";
import { makeRouter } from "./trpc";
import { usersRouter } from "../../features/users/api/users.router";

export const apiRouter = makeRouter({
  signUp: signUpRouter,
  roles: rolesRouter,
  users: usersRouter,
});

export type APIRouter = typeof apiRouter;
export type APICaller = ReturnType<APIRouter["createCaller"]>;
