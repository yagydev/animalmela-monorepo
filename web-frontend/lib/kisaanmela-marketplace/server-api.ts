import { getMarketplaceApiBase, getMarketplaceApiPublicFallbackBase } from './api-config';

function trimSlash(s: string) {
  return s.replace(/\/$/, '');
}

/** True when the configured API host is typical local / LAN dev (Nest not running → retry public API). */
function isEligibleForPublicMarketplaceFallback(base: string): boolean {
  try {
    const h = new URL(base).hostname.toLowerCase();
    if (h === 'localhost' || h === '127.0.0.1' || h === '::1') return true;
    if (h === 'host.docker.internal') return true;

    const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(h);
    if (!m) return false;
    const a = Number(m[1]);
    const b = Number(m[2]);
    if (a === 10) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 127) return true;
    return false;
  } catch {
    return false;
  }
}

function shouldTryPublicFallbackAfterPrimary(primary: string, fallback: string, method: string): boolean {
  if (method !== 'GET') return false;
  if (process.env.DISABLE_KISAAN_MARKETPLACE_PUBLIC_FALLBACK === '1') return false;
  if (trimSlash(primary) === trimSlash(fallback)) return false;
  if (process.env.NODE_ENV === 'development') return true;
  return isEligibleForPublicMarketplaceFallback(primary);
}

/** Some systems resolve localhost to IPv6 only; Nest may listen on IPv4 — try 127.0.0.1 as well. */
function marketplaceRequestUrlVariants(base: string, path: string): string[] {
  const p = path.startsWith('/') ? path : `/${path}`;
  const primary = `${trimSlash(base)}${p}`;
  const out = [primary];
  try {
    const u = new URL(primary);
    if (u.hostname === 'localhost') {
      u.hostname = '127.0.0.1';
      out.push(u.toString());
    }
  } catch {
    /* ignore */
  }
  return out;
}

async function fetchMarketplaceJsonAtUrl<T>(url: string, init?: RequestInit): Promise<T> {
  const isDev = process.env.NODE_ENV === 'development';
  const headers = new Headers(init?.headers);
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  const res = await fetch(url, {
    ...init,
    headers,
    ...(isDev
      ? { cache: 'no-store' as const }
      : { next: { revalidate: 30 } }),
    signal: init?.signal ?? AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const text = await res.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error('Invalid JSON from marketplace API');
  }
}

async function fetchMarketplaceJsonOnce<T>(base: string, path: string, init?: RequestInit): Promise<T> {
  const urls = marketplaceRequestUrlVariants(base, path);
  let last: unknown;
  for (const url of urls) {
    try {
      return await fetchMarketplaceJsonAtUrl<T>(url, init);
    } catch (e) {
      last = e;
    }
  }
  throw last instanceof Error ? last : new Error(String(last));
}

/**
 * Server-side fetch to the Nest marketplace API.
 * - In development, GET retries the public API if the primary host fails (unless disabled).
 * - On localhost / LAN IPs, GET retries the public API in any NODE_ENV (unless disabled).
 * - For http://localhost:* also tries 127.0.0.1 before giving up on that base.
 */
export async function marketplaceServerFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const method = (init?.method ?? 'GET').toUpperCase();
  const primary = getMarketplaceApiBase();
  const fallback = getMarketplaceApiPublicFallbackBase();

  const bases = shouldTryPublicFallbackAfterPrimary(primary, fallback, method)
    ? [primary, fallback]
    : [primary];

  let last: unknown;
  for (const base of bases) {
    try {
      return await fetchMarketplaceJsonOnce<T>(base, path, init);
    } catch (e) {
      last = e;
    }
  }
  throw last instanceof Error ? last : new Error(String(last));
}
