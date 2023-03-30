import { createTRPCProxyClient, httpBatchLink, loggerLink } from "@trpc/client";
import type { APIRouter } from "./router";

export const api = createTRPCProxyClient<APIRouter>({
  links: [
    loggerLink(),
    httpBatchLink({
      url: "/api",
    }),
  ],
});
