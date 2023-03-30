import { createClient } from "@supabase/supabase-js";

export type AuthTokens = {
  access_token: string;
  refresh_token: string;
};

const {
  VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY,
  VITE_SUPABASE_SERVICE_ROLE_KEY,
} = import.meta.env;

export function createSupabaseClient(key: "anon" | "service_role" = "anon") {
  return createClient(
    VITE_SUPABASE_URL,
    key === "service_role"
      ? VITE_SUPABASE_SERVICE_ROLE_KEY
      : VITE_SUPABASE_ANON_KEY,
    {
      auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: false,
      },
    }
  );
}

export const supabaseServiceRole = createSupabaseClient("service_role");
