import { AuthError, AuthSession, User } from "@supabase/supabase-js";
import { shake } from "radash";
import { createContext, createEffect, JSX, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { isServer } from "solid-js/web";
import { SignInData } from "../schemas/sign-in";
import { supabase } from "../supabase/supabase";

export type Auth = {
  user?: User;
  session?: AuthSession;
  error?: AuthError;

  signInWithPassword: (data: SignInData) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<Auth>({} as Auth);

export function createAuth(): Auth {
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
      console.log("auth state changed");

      if (event === "SIGNED_OUT" || event === "USER_DELETED") {
        const expires = new Date(0).toUTCString();
        document.cookie = `access-token=; path=/; expires=${expires}; SameSite=Lax; secure`;
        document.cookie = `refresh-token=; path=/; expires=${expires}; SameSite=Lax; secure`;

        setState((c) => ({
          ...c,
          session: undefined,
          user: undefined,
          error: undefined,
        }));
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        const maxAge = 100 * 365 * 24 * 60 * 60; // 100 years, never expires
        document.cookie = `access-token=${session?.access_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`;
        document.cookie = `refresh-token=${session?.refresh_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`;

        const { data, error } = await supabase.auth.getUser(
          session?.access_token
        );

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
