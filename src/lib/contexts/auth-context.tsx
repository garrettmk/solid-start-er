import { serializeCookie } from "@supabase/auth-helpers-shared";
import { AuthError, AuthSession, User } from "@supabase/supabase-js";
import {
  createContext,
  createEffect,
  createSignal,
  JSX,
  onMount,
  useContext,
} from "solid-js";
import { createStore } from "solid-js/store";
import { isServer } from "solid-js/web";
import { CookieSerializeOptions } from "solid-start";
import { SignInData } from "../schemas/sign-in";
import { createSupabaseClient } from "../supabase/supabase";
import {
  getAuthTokensFromStorage,
  removeAuthTokensFromStorage,
  saveAuthTokensInStorage,
} from "../util/auth-tokens.util";
import { parseCookieString } from "../util/util";

export type Auth = {
  user?: User;
  session?: AuthSession;
  error?: AuthError;

  signInWithPassword: (data: SignInData) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<Auth>({} as Auth);

export function createAuth(): Auth {
  const [supabase] = createSignal(createSupabaseClient());
  const [state, setState] = createStore<Auth>({
    signInWithPassword: async (signIn: SignInData) => {
      const { data, error } = await supabase().auth.signInWithPassword(signIn);
      setState((c) => ({
        ...c,
        user: data.user ?? undefined,
        session: data.session ?? undefined,
        error: error ?? undefined,
      }));
    },

    signOut: async () => {
      const { error } = await supabase().auth.signOut();
      setState((c) => ({
        ...c,
        user: undefined,
        session: undefined,
        error: error ?? undefined,
      }));
    },
  });

  onMount(async () => {
    if (!isServer) {
      const tokens = getAuthTokensFromStorage();

      if (tokens)
        await supabase().auth.setSession({
          access_token: tokens.accessToken,
          refresh_token: tokens.refreshToken,
        });
    }
  });

  if (!isServer)
    supabase().auth.onAuthStateChange(async (event, session) => {
      console.log("supabase auth state changed", { event, session });

      if (event === "SIGNED_OUT" || event === "USER_DELETED") {
        removeAuthTokensFromStorage();

        setState((c) => ({
          ...c,
          session: undefined,
          user: undefined,
          error: undefined,
        }));
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        const { access_token, refresh_token } = session!;
        const { data, error } = await supabase().auth.getUser(access_token);

        saveAuthTokensInStorage({
          accessToken: access_token,
          refreshToken: refresh_token,
        });

        setState((c) => ({
          ...c,
          session: session! ?? undefined,
          user: data.user ?? undefined,
          error: error ?? undefined,
        }));
      }
    });

  createEffect(() => {
    console.log("auth state changed", { ...state });
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
