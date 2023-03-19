import { createTRPCProxyClient, httpBatchLink, loggerLink } from "@trpc/client";
import type { ApiRouter } from "./router";

export const api = createTRPCProxyClient<ApiRouter>({
  links: [
    loggerLink(),
    httpBatchLink({
      url: "/api",
    }),
  ],
});
