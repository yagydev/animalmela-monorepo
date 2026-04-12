import { getMarketplaceApiBase } from './api-config';

export async function marketplaceServerFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const base = getMarketplaceApiBase();
  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`;
  const res = await fetch(url, {
    ...init,
    next: { revalidate: 30 },
    signal: init?.signal ?? AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json() as Promise<T>;
}
