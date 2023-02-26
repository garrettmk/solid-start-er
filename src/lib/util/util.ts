import { User } from "@supabase/supabase-js";
import { createStore } from "solid-js/store";
import { supabase } from "../supabase/supabase";

export function noop(...args: any[]) {}

export type ClampOptions = {
  min?: number;
  max?: number;
};
export function clamp(value: number, options: ClampOptions) {
  const { min, max } = options;

  if (min !== undefined) value = Math.max(min, value);

  if (max !== undefined) value = Math.min(max);

  return value;
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function createFormStore<T extends object>(initial?: Partial<T>) {
  const [state, setState] = createStore<T>({ ...initial } as T);
  const methods = {
    handleChange: (field: keyof T) => (e: Event) =>
      setState((c) => ({
        ...c,
        // @ts-ignore
        [field]: e.currentTarget?.value,
      })),

    isChecked: (field: keyof T) => !!state[field],
  };

  return [state, methods] as const;
}

export function parseCookieString(cookeString: string): Map<string, string> {
  return new Map(
    cookeString
      .split(";")
      .map((entryString) => entryString.trim().split("=") as [string, string])
  );
}

export async function getRequestUser(req: Request): Promise<User | undefined> {
  const cookies = parseCookieString(
    req.headers.get("cookie") ?? req.headers.get("Cookie") ?? ""
  );
  const accessToken = cookies.get("access-token");
  if (!accessToken) return;

  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error) return;

  return data.user;
}
