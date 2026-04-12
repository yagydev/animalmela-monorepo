import { marketplaceServerFetch } from '@/lib/kisaanmela-marketplace/server-api';
import Link from 'next/link';

type MarketplaceEvent = {
  id: string;
  title: string;
  slug: string;
  description: string;
  state: string;
  district: string;
  startsAt: string;
  endsAt: string;
  venue: string | null;
};

export default async function KisaanMarketplaceEventsPage() {
  let events: MarketplaceEvent[] = [];
  let loadFailed = false;
  try {
    events = await marketplaceServerFetch<MarketplaceEvent[]>('/events');
  } catch {
    loadFailed = true;
    events = [];
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Melas (marketplace API)</h1>
      <p className="text-sm text-gray-600">
        Listings stored with the multi-vendor backend. For community events on the main site, see{' '}
        <Link href="/events" className="font-medium text-green-800 underline">
          Events
        </Link>
        .
      </p>
      {loadFailed ? (
        <p className="text-sm text-gray-500">
          Melas could not be loaded right now. For local Nest, run{' '}
          <code className="rounded bg-gray-100 px-1 text-gray-800">npm run dev:marketplace-api</code> from the monorepo root.
        </p>
      ) : null}
      {!loadFailed && events.length === 0 ? (
        <p className="text-gray-500">No published events yet.</p>
      ) : !loadFailed && events.length > 0 ? (
        <ul className="space-y-3">
          {events.map((e) => (
            <li key={e.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <h2 className="font-semibold text-gray-900">{e.title}</h2>
              <p className="mt-1 text-sm text-gray-600">
                {e.district}, {e.state}
                {e.venue ? ` · ${e.venue}` : ''}
              </p>
              <p className="mt-2 text-xs text-gray-500">
                {new Date(e.startsAt).toLocaleString()} – {new Date(e.endsAt).toLocaleString()}
              </p>
              <p className="mt-2 line-clamp-3 text-sm text-gray-700">{e.description}</p>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
