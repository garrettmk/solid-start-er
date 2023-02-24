import { AuthError, AuthSession } from "@supabase/supabase-js";
import { createContext, createEffect, JSX, useContext } from "solid-js";
import { createStore } from "solid-js/store";
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
      console.log("sign in", { email, password });
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

  supabase.auth.onAuthStateChange((event, session) => {
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
