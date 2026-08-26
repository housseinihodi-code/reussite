const ACCESS_TOKEN_KEY = 'carmarket_access_token';
const REFRESH_TOKEN_KEY = 'carmarket_refresh_token';
const CART_KEY = 'carmarket_cart';

export const tokenStorage = {
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

export const cartStorage = {
  load: <T>(): T[] => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? (JSON.parse(raw) as T[]) : [];
    } catch {
      return [];
    }
  },
  save: <T>(items: T[]) => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  },
};
