const KEY = 'kisaanmela_marketplace_jwt';

export function getStoredMarketplaceToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(KEY);
}

export function setStoredMarketplaceToken(token: string) {
  localStorage.setItem(KEY, token);
}

export function clearStoredMarketplaceToken() {
  localStorage.removeItem(KEY);
}
