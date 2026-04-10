/** Next.js routes for the Nest-backed KisaanMela marketplace section (mobile-first hub). */
export const MARKETPLACE_KISAAN_BASE = '/marketplace/kisaan' as const;

export const marketplaceKisaanRoutes = {
  home: MARKETPLACE_KISAAN_BASE,
  login: `${MARKETPLACE_KISAAN_BASE}/login`,
  products: `${MARKETPLACE_KISAAN_BASE}/products`,
  product: (id: string) => `${MARKETPLACE_KISAAN_BASE}/products/${id}`,
  cart: `${MARKETPLACE_KISAAN_BASE}/cart`,
  events: `${MARKETPLACE_KISAAN_BASE}/events`,
} as const;
