import {
  parseCookies,
  serializeCookie,
  CookieSerializeOptions,
} from "./cookies.util";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { snakeifyObject } from "./objects.util";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

/**
 * Check storage for authentication tokens
 *
 * @returns true if the storage has auth tokens, false otherwise
 */
export function storageHasAuthTokens(): boolean {
  return Boolean(getAuthTokensFromStorage());
}

/**
 * Get authentication tokens from storage
 *
 * @returns the authentication tokens from storage, or undefined if none are found
 */
export function getAuthTokensFromStorage(): AuthTokens | undefined {
  const cookieString = document.cookie;
  const cookies = parseCookies(cookieString);

  const accessToken = cookies.get(ACCESS_TOKEN_KEY);
  const refreshToken = cookies.get(REFRESH_TOKEN_KEY);

  if (accessToken && refreshToken) return { accessToken, refreshToken };
}

/**
 * Get authentication tokens from a request
 *
 * @param req a Request object
 * @returns the authentication tokens from the request, or undefined if none are found
 */
export function getAuthTokensFromRequest(req: Request): AuthTokens | undefined {
  const cookieString = req.headers.get("Cookie") ?? "";
  const cookies = parseCookies(cookieString);

  const accessToken = cookies.get(ACCESS_TOKEN_KEY);
  const refreshToken = cookies.get(REFRESH_TOKEN_KEY);

  if (accessToken && refreshToken) return { accessToken, refreshToken };
}

/**
 * Save auth tokens in storage
 *
 * @param tokens the authentication tokens to save in storage
 */
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

/**
 * Remove auth tokens from storage
 */
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

export async function useAuthTokens(
  supabase: SupabaseClient,
  tokens: AuthTokens
): Promise<User | undefined> {
  const { data, error } = await supabase.auth.setSession(
    snakeifyObject(tokens)
  );

  if (error) console.log(error);

  return data.user ?? undefined;
}
