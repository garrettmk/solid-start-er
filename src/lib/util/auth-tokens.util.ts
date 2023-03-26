import { parseCookieString } from "./util";
import { CookieSerializeOptions } from "solid-start";
import { serializeCookie } from "@supabase/auth-helpers-shared";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export function storageHasAuthTokens(): boolean {
  return Boolean(getAuthTokensFromStorage());
}

export function getAuthTokensFromStorage(): AuthTokens | undefined {
  const cookieString = document.cookie;
  const cookies = parseCookieString(cookieString);

  const accessToken = cookies.get(ACCESS_TOKEN_KEY);
  const refreshToken = cookies.get(REFRESH_TOKEN_KEY);

  if (accessToken && refreshToken) return { accessToken, refreshToken };
}

export function saveAuthTokensInStorage(tokens: AuthTokens) {
  const { accessToken, refreshToken } = tokens;
  const options: CookieSerializeOptions = {
    maxAge: 100 * 365 * 24 * 60 * 60, // 100 years, never expires
    sameSite: "lax",
    secure: true,
    path: "/",
  };

  document.cookie = serializeCookie(ACCESS_TOKEN_KEY, accessToken, options);
  document.cookie = serializeCookie(REFRESH_TOKEN_KEY, refreshToken, options);
}

export function removeAuthTokensFromStorage() {
  const options: CookieSerializeOptions = {
    maxAge: 0,
    sameSite: "lax",
    secure: true,
    path: "/",
  };

  document.cookie = serializeCookie(ACCESS_TOKEN_KEY, "", options);
  document.cookie = serializeCookie(REFRESH_TOKEN_KEY, "", options);
}
