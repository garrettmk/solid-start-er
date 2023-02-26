import { AuthError, AuthSession } from "@supabase/supabase-js";
import { createContext, createEffect, JSX, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { isServer } from "solid-js/web";
import { supabase } from "../supabase/supabase";

export type AuthState = {
  session?: AuthSession;
  error?: AuthError;
};

export const defaultAuthState: AuthState = {};

export type AuthMethods = {
  signInWithPassword: (email: string, password: string) => void;
  signOut: () => void;
};

export const defaultAuthMethods = {
  signInWithPassword: (email: string, password: string) => {},
  signOut: () => {},
};

export type AuthContextValue = [AuthState, AuthMethods];

export const AuthContext = createContext<AuthContextValue>([
  defaultAuthState,
  defaultAuthMethods,
]);

export function createAuthState(): AuthContextValue {
  const [state, setState] = createStore<AuthState>({});
  const methods: AuthMethods = {
    signInWithPassword: async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) setState({ error });
      else if (data.session) setState({ session: data.session });
      console.log({ data, error });
    },
    signOut: () => supabase.auth.signOut(),
  };

  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session) setState({ session });
  });

  if (!isServer)
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || event === "USER_DELETED") {
        const expires = new Date(0).toUTCString();
        document.cookie = `access-token=; path=/; expires=${expires}; SameSite=Lax; secure`;
        document.cookie = `refresh-token=; path=/; expires=${expires}; SameSite=Lax; secure`;
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        const maxAge = 100 * 365 * 24 * 60 * 60; // 100 years, never expires
        document.cookie = `access-token=${session?.access_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`;
        document.cookie = `refresh-token=${session?.refresh_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`;
      }
      setState({ session: session ?? undefined });
    });

  return [state, methods];
}

export function useAuthContext() {
  return useContext(AuthContext);
}

export interface AuthProviderProps {
  children?: JSX.Element;
}

export function AuthProvider(props: AuthProviderProps) {
  const value = createAuthState();

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
}
