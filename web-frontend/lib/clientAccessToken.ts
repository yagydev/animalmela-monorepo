/**
 * Browser-only helpers: avoid passing non-JWT strings to libraries that expect
 * `header.payload.signature` (e.g. jwt-decode) or sending garbage as Bearer.
 */
export function looksLikeJwt(accessToken: string | null | undefined): boolean {
  if (!accessToken || typeof accessToken !== 'string') return false;
  const t = accessToken.trim();
  const parts = t.split('.');
  if (parts.length !== 3) return false;
  return parts.every((p) => p.length > 0);
}

/** Remove clearly invalid values from localStorage `token`. */
export function sanitizeStoredAccessToken(): void {
  if (typeof window === 'undefined') return;
  const raw = localStorage.getItem('token');
  if (raw == null || raw === '') return;
  if (looksLikeJwt(raw)) return;
  localStorage.removeItem('token');
}
