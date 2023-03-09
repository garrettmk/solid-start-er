import { AuthError, AuthSession, User } from "@supabase/supabase-js";
import { serializeCookie } from "@supabase/auth-helpers-shared";
import { createContext, JSX, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { isServer } from "solid-js/web";
import { SignInData } from "../schemas/sign-in";
import { createSupabase } from "../supabase/supabase";
import { identity, stringifySupabaseSession } from "../util/util";
import { CookieSerializeOptions } from "solid-start";

export type Auth = {
  user?: User;
  session?: AuthSession;
  error?: AuthError;

  signInWithPassword: (data: SignInData) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<Auth>({} as Auth);

export function createAuth(): Auth {
  const supabase = createSupabase();
  const [state, setState] = createStore({
    signInWithPassword: async (signIn: SignInData) => {
      const { data, error } = await supabase.auth.signInWithPassword(signIn);
      setState((c) => ({
        ...c,
        user: data.user ?? undefined,
        session: data.session ?? undefined,
        error: error ?? undefined,
      }));
    },

    signOut: async () => {
      const { error } = await supabase.auth.signOut();
      setState((c) => ({
        ...c,
        user: undefined,
        session: undefined,
        error: error ?? undefined,
      }));
    },
  });

  if (!isServer)
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("auth state changed", { event, session });

      if (event === "SIGNED_OUT" || event === "USER_DELETED") {
        const options: CookieSerializeOptions = {
          maxAge: 0,
          sameSite: "lax",
          secure: true,
          path: "/",
        };

        document.cookie = serializeCookie("access_token", "", options);
        document.cookie = serializeCookie("refresh_token", "", options);

        setState((c) => ({
          ...c,
          session: undefined,
          user: undefined,
          error: undefined,
        }));
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        const { access_token, refresh_token } = session!;

        const options: CookieSerializeOptions = {
          maxAge: 100 * 365 * 24 * 60 * 60, // 100 years, never expires
          sameSite: "lax",
          secure: true,
          path: "/",
        };

        document.cookie = serializeCookie(
          "access_token",
          access_token,
          options
        );
        document.cookie = serializeCookie(
          "refresh_token",
          refresh_token,
          options
        );

        const { data, error } = await supabase.auth.getUser(access_token);

        setState((c) => ({
          ...c,
          session: session ?? undefined,
          user: data.user ?? undefined,
          error: error ?? undefined,
        }));
      }
    });

  return state;
}

export function useAuthContext() {
  return useContext(AuthContext);
}

export interface AuthProviderProps {
  children?: JSX.Element;
}

export function AuthProvider(props: AuthProviderProps) {
  const value = createAuth();

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
}
