import { apiRouter } from "@/lib/trpc/router";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { APIEvent } from "solid-start";
import { makeAPIContext } from "./context";

export const apiRequestHandler = (event: APIEvent) =>
  fetchRequestHandler({
    endpoint: "/api",
    req: event.request,
    router: apiRouter,
    createContext: () => makeAPIContext(event),
  });
