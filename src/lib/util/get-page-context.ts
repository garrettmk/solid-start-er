import { SupabaseClient, User } from "@supabase/supabase-js";
import { ServerFunctionEvent } from "solid-start";
import { AppRouterCaller } from "../api/router";

export interface ServerFunctionContext {
  user?: User;
  supabase?: SupabaseClient;
  api?: AppRouterCaller;
}

export function getServerContext(
  event: ServerFunctionEvent
): ServerFunctionContext {
  return {
    user: event.locals.user as User,
    supabase: event.locals.supabase as SupabaseClient,
    api: event.locals.api as AppRouterCaller,
  };
}

export function getAuthenticatedServerContext(
  event: ServerFunctionEvent
): Required<ServerFunctionContext> {
  return getServerContext(event) as Required<ServerFunctionContext>;
}
