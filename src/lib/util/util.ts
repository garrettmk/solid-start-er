import { Session, User } from "@supabase/supabase-js";
import { mapValues, shake } from "radash";
import { createStore } from "solid-js/store";
import { supabaseServiceRole } from "../supabase/supabase";

export function noop(...args: any[]) {}

export function identity(value: any) {
  return value;
}

export function isTruthy(value: unknown): boolean {
  return !!value;
}

export function isFalsy(value: unknown): boolean {
  return !value;
}

export type ClampOptions = {
  min?: number;
  max?: number;
};
export function clamp(value: number, options: ClampOptions) {
  const { min, max } = options;

  if (min !== undefined) value = Math.max(min, value);

  if (max !== undefined) value = Math.min(max, value);

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

  const { data, error } = await supabaseServiceRole.auth.getUser(accessToken);
  if (error) return;

  return data.user;
}

export function omitFalsyValues(value: unknown): unknown | undefined {
  return value || undefined;
}

export function omitFalsyProperties<T extends object>(value: T): Partial<T> {
  return shake(mapValues(value, omitFalsyValues));
}

export function encodeFile(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(",")[1]);
    reader.readAsDataURL(file);
  });
}

export function stringifySupabaseSession(session: Session): string {
  return JSON.stringify([
    session.access_token,
    session.refresh_token,
    session.provider_token,
    session.provider_refresh_token,
    session.user.factors,
  ]);
}
