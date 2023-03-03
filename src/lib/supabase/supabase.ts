import {
  createServerSupabaseClient,
  serializeCookie,
} from "@supabase/auth-helpers-shared";
import { createClient } from "@supabase/supabase-js";
import { parseCookieString } from "../util/util";

const {
  VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY,
  VITE_SUPABASE_SERVICE_ROLE_KEY,
} = import.meta.env;

export const createSupabase = (key: "anon" | "service_role" = "anon") =>
  createClient(
    VITE_SUPABASE_URL,
    key === "service_role"
      ? VITE_SUPABASE_SERVICE_ROLE_KEY
      : VITE_SUPABASE_ANON_KEY
  );

export const createSupabaseFrom = async (req: Request, headers: Headers) => {
  const cookieString = req.headers.get("cookie") ?? "";
  const cookies = parseCookieString(cookieString);

  return createServerSupabaseClient({
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
    supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    cookieOptions: { name: "session" },
    getCookie: (name) => cookies.get(name),
    setCookie: (name, value, options) => {
      const session = serializeCookie(name, value, {
        ...options,
        httpOnly: false,
      });

      headers.append(name, session);
    },
    getRequestHeader: (key) => req.headers.get(key) ?? undefined,
  });
};

export const supabaseServiceRole = createSupabase("service_role");
