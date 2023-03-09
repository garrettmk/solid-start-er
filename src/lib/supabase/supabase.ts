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

export const createSupabaseFrom = async (req: Request) => {
  const cookieString = req.headers.get("Cookie") ?? "";
  const cookies = parseCookieString(cookieString);

  const client = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
    {
      auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: false,
      },
    }
  );

  if (cookies.has("access_token") && cookies.has("refresh_token")) {
    const access_token = cookies.get("access_token")!;
    const refresh_token = cookies.get("refresh_token")!;

    const response = await client.auth.setSession({
      access_token,
      refresh_token,
    });

    if (response.error) console.log(response.error);
  } else {
    console.log("No session");
  }

  return client;
};

export const supabaseServiceRole = createSupabase("service_role");
