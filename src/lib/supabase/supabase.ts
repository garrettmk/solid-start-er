import {
  createClient,
  SupabaseClient,
  User,
  Session,
} from "@supabase/supabase-js";
import { parseCookieString } from "../util/util";

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

export function getAuthTokens(req: Request): AuthTokens | undefined {
  const cookieString = req.headers.get("Cookie") ?? "";
  const cookies = parseCookieString(cookieString);

  const access_token = cookies.get("access_token");
  const refresh_token = cookies.get("refresh_token");

  if (access_token && refresh_token) return { access_token, refresh_token };
}

export async function useAuthTokens(
  client: SupabaseClient,
  tokens: AuthTokens
): Promise<User | undefined> {
  const { data, error } = await client.auth.setSession(tokens);

  if (error) console.log(error);

  return data.user ?? undefined;
}

export const supabaseServiceRole = createSupabaseClient("service_role");
