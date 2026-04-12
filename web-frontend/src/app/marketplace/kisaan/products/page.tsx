import { marketplaceServerFetch } from '@/lib/kisaanmela-marketplace/server-api';
import { marketplaceKisaanRoutes } from '@/lib/kisaanmela-marketplace/routes';
import Link from 'next/link';

/** Avoid stale RSC / data cache showing old error copy after code changes. */
export const dynamic = 'force-dynamic';
export const revalidate = 0;

type ProductRow = {
  id: string;
  title: string;
  price: string | { toString(): string };
  district: string | null;
  state: string | null;
  store: { name: string };
  images: { url: string }[];
};

type ListResponse = { items: ProductRow[]; total: number; page: number };

function normalizeProductList(raw: unknown): ListResponse {
  if (!raw || typeof raw !== 'object') return { items: [], total: 0, page: 1 };
  const o = raw as Record<string, unknown>;

  let items: ProductRow[] = [];
  let total: number | undefined;
  let page: number | undefined;

  if (Array.isArray(o.items)) {
    items = o.items as ProductRow[];
    total = typeof o.total === 'number' ? o.total : undefined;
    page = typeof o.page === 'number' ? o.page : undefined;
  } else if (o.data !== undefined) {
    if (Array.isArray(o.data)) {
      items = o.data as ProductRow[];
    } else if (o.data && typeof o.data === 'object') {
      const d = o.data as Record<string, unknown>;
      if (Array.isArray(d.items)) {
        items = d.items as ProductRow[];
        total = typeof d.total === 'number' ? d.total : undefined;
        page = typeof d.page === 'number' ? d.page : undefined;
      } else if (Array.isArray(d.products)) {
        items = d.products as ProductRow[];
        total = typeof d.total === 'number' ? d.total : undefined;
        page = typeof d.page === 'number' ? d.page : undefined;
      }
    }
  } else if (Array.isArray(o.products)) {
    items = o.products as ProductRow[];
    total = typeof o.total === 'number' ? o.total : undefined;
    page = typeof o.page === 'number' ? o.page : undefined;
  } else if (Array.isArray(o.results)) {
    items = o.results as ProductRow[];
    total = typeof o.total === 'number' ? o.total : undefined;
    page = typeof o.page === 'number' ? o.page : undefined;
  }

  if (!total && total !== 0) total = items.length;
  if (!page) page = 1;

  return { items, total, page };
}

function money(p: ProductRow['price']) {
  const n = typeof p === 'string' ? parseFloat(p) : parseFloat(String(p));
  if (Number.isNaN(n)) return '—';
  return `₹${n.toLocaleString('en-IN')}`;
}

export default async function KisaanMarketplaceProductsPage({
  searchParams,
}: {
  searchParams: { q?: string; state?: string; district?: string };
}) {
  const sp = searchParams;
  const q = new URLSearchParams();
  if (sp.q) q.set('q', sp.q);
  if (sp.state) q.set('state', sp.state);
  if (sp.district) q.set('district', sp.district);
  const qs = q.toString();
  const path = `/products${qs ? `?${qs}` : ''}`;

  let data: ListResponse;
  let catalogueUnavailable = false;
  try {
    const raw = await marketplaceServerFetch<unknown>(path);
    data = normalizeProductList(raw);
  } catch {
    catalogueUnavailable = true;
    data = { items: [], total: 0, page: 1 };
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold text-gray-900">Verified seller listings</h1>
        <Link href={marketplaceKisaanRoutes.login} className="text-sm font-medium text-green-800 underline">
          Sign in
        </Link>
      </div>
      {!catalogueUnavailable ? <p className="text-gray-600">{data.total} listings</p> : null}

      <ul className="space-y-3">
        {catalogueUnavailable ? (
          <li className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-600">
            <p className="font-medium text-gray-800">Shop catalogue unavailable</p>
            <p className="mt-3 text-sm leading-relaxed">
              The Nest marketplace API did not respond. Start it with{' '}
              <code className="rounded bg-gray-100 px-1 text-gray-900">npm run dev:marketplace-api</code> from the monorepo
              root, or point{' '}
              <code className="rounded bg-gray-100 px-1 text-gray-900">NEXT_PUBLIC_KISAANMELA_MARKETPLACE_API_URL</code> at a
              reachable <code className="rounded bg-gray-100 px-1 text-gray-900">…/api</code> base. Then restart{' '}
              <code className="rounded bg-gray-100 px-1 text-gray-900">next dev</code> and hard-refresh the page.
            </p>
            <p className="mt-4 text-sm">
              <Link href="/marketplace" className="font-semibold text-green-800 underline">
                Browse the main marketplace
              </Link>{' '}
              (equipment, livestock, produce) instead.
            </p>
          </li>
        ) : data.items.length === 0 ? (
          <li className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-500">
            No products yet. Seed the database or approve seller listings in admin.
          </li>
        ) : (
          data.items.map((p) => (
            <li key={p.id}>
              <Link
                href={marketplaceKisaanRoutes.product(p.id)}
                className="flex gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm active:bg-gray-50"
              >
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {p.images[0]?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.images[0].url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-2xl">🌱</div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 font-semibold text-gray-900">{p.title}</p>
                  <p className="text-lg font-bold text-green-800">{money(p.price)}</p>
                  <p className="truncate text-sm text-gray-500">
                    {p.store.name}
                    {p.district || p.state ? ` · ${[p.district, p.state].filter(Boolean).join(', ')}` : ''}
                  </p>
                </div>
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
