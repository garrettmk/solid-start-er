import type { CookieSerializeOptions } from "solid-start";
import { serializeCookie } from "solid-start";

export function parseCookies(cookeString: string): Map<string, string> {
  return new Map(
    cookeString
      .split(";")
      .map((entryString) => entryString.trim().split("=") as [string, string])
  );
}

export { serializeCookie, CookieSerializeOptions };
