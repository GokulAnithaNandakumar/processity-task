/**
 * Cookie utility functions for secure JWT token management
 * Note: For production, JWT should be stored in httpOnly cookies set by the server
 * This utility provides client-side cookie management for development/fallback
 */

import type { User } from '../types';

export interface CookieOptions {
  expires?: Date;
  maxAge?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  httpOnly?: boolean;
}

/**
 * Set a cookie with the given name, value, and options
 */
export const setCookie = (name: string, value: string, options: CookieOptions = {}): void => {
  const {
    expires,
    maxAge,
    path = '/',
    domain,
    secure = window.location.protocol === 'https:',
    sameSite = 'lax'
  } = options;

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (expires) {
    cookieString += `; expires=${expires.toUTCString()}`;
  }

  if (maxAge !== undefined) {
    cookieString += `; max-age=${maxAge}`;
  }

  cookieString += `; path=${path}`;

  if (domain) {
    cookieString += `; domain=${domain}`;
  }

  if (secure) {
    cookieString += `; secure`;
  }

  cookieString += `; samesite=${sameSite}`;

  document.cookie = cookieString;
};

/**
 * Get a cookie value by name
 */
export const getCookie = (name: string): string | null => {
  const encodedName = encodeURIComponent(name);
  const cookies = document.cookie.split(';');

  for (const cookie of cookies) {
    const trimmedCookie = cookie.trim();
    if (trimmedCookie.startsWith(`${encodedName}=`)) {
      return decodeURIComponent(trimmedCookie.substring(encodedName.length + 1));
    }
  }

  return null;
};

/**
 * Remove a cookie by setting its expiration to the past
 */
export const removeCookie = (name: string, options: Omit<CookieOptions, 'expires' | 'maxAge'> = {}): void => {
  setCookie(name, '', {
    ...options,
    expires: new Date(0)
  });
};

/**
 * Check if cookies are enabled in the browser
 */
export const areCookiesEnabled = (): boolean => {
  try {
    const testCookie = '__test_cookie__';
    setCookie(testCookie, 'test');
    const isEnabled = getCookie(testCookie) === 'test';
    removeCookie(testCookie);
    return isEnabled;
  } catch {
    return false;
  }
};

/**
 * Token-specific cookie management
 */
export const tokenCookies = {
  TOKEN_NAME: 'auth_token',
  USER_NAME: 'user_data',

  setToken: (token: string): void => {
    setCookie(tokenCookies.TOKEN_NAME, token, {
      maxAge: 24 * 60 * 60, // 24 hours
      secure: true,
      sameSite: 'strict',
      path: '/'
    });
  },

  getToken: (): string | null => {
    return getCookie(tokenCookies.TOKEN_NAME);
  },

  removeToken: (): void => {
    removeCookie(tokenCookies.TOKEN_NAME, { path: '/' });
  },

  setUser: (user: User): void => {
    setCookie(tokenCookies.USER_NAME, JSON.stringify(user), {
      maxAge: 24 * 60 * 60, // 24 hours
      secure: true,
      sameSite: 'strict',
      path: '/'
    });
  },

  getUser: (): User | null => {
    const userData = getCookie(tokenCookies.USER_NAME);
    if (!userData) return null;

    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  },

  removeUser: (): void => {
    removeCookie(tokenCookies.USER_NAME, { path: '/' });
  },

  clearAll: (): void => {
    tokenCookies.removeToken();
    tokenCookies.removeUser();
  }
};
