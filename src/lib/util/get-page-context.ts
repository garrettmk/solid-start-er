import { SupabaseClient, User } from "@supabase/supabase-js";
import { ServerFunctionEvent } from "solid-start";
import { APICaller } from "@/lib/trpc/router";

export interface ServerFunctionContext {
  user?: User;
  supabase?: SupabaseClient;
  api?: APICaller;
}

export function getServerContext(
  event: ServerFunctionEvent
): ServerFunctionContext {
  return {
    user: event.locals.user as User,
    supabase: event.locals.supabase as SupabaseClient,
    api: event.locals.api as APICaller,
  };
}

export function getAuthenticatedServerContext(
  event: ServerFunctionEvent
): Required<ServerFunctionContext> {
  return getServerContext(event) as Required<ServerFunctionContext>;
}
