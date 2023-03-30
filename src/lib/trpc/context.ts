import { AuthUser, SupabaseClient } from "@supabase/supabase-js";
import { APIEvent } from "solid-start";

/**
 * The context for TRPC calls
 */
export type APIContext = {
  supabase: SupabaseClient;
  user?: AuthUser;
};

/**
 * The context for authenticated TRPC calls
 */
export type AuthenticatedAPIContext = Required<APIContext>;

export function isAuthenticatedAPIContext(
  context: APIContext
): context is AuthenticatedAPIContext {
  return context.user !== undefined;
}

/**
 *
 * @param event an APIEvent
 * @returns an APICon
 */
export function makeAPIContext(event: APIEvent) {
  return {
    supabase: event.locals.supabase as SupabaseClient,
    user: event.locals.user as AuthUser | undefined,
  };
}
