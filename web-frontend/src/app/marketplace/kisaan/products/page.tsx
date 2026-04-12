import { marketplaceServerFetch } from '@/lib/kisaanmela-marketplace/server-api';
import { marketplaceKisaanRoutes } from '@/lib/kisaanmela-marketplace/routes';
import Link from 'next/link';

const base = marketplaceKisaanRoutes.home;

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
  try {
    data = await marketplaceServerFetch<ListResponse>(path);
  } catch {
    return (
      <div className="rounded-xl bg-amber-50 p-4 text-amber-900">
        <p className="font-semibold">Cannot load products</p>
        <p className="mt-1 text-sm">
          The Nest marketplace API is not reachable. Production uses{' '}
          <code className="rounded bg-amber-100 px-1">https://api.kisaanmela.com/api</code> by default — ensure that host
          serves the marketplace API and allows CORS from this site. Override with{' '}
          <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_KISAANMELA_MARKETPLACE_API_URL</code> or server-only{' '}
          <code className="rounded bg-amber-100 px-1">MARKETPLACE_API_URL</code> in Vercel. Locally run{' '}
          <code className="rounded bg-amber-100 px-1">npm run dev:marketplace-api</code> from the monorepo root.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold text-gray-900">Verified seller listings</h1>
        <Link href={marketplaceKisaanRoutes.login} className="text-sm font-medium text-green-800 underline">
          Sign in
        </Link>
      </div>
      <p className="text-gray-600">{data.total} listings</p>

      <ul className="space-y-3">
        {data.items.length === 0 ? (
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
