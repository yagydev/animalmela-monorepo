import { Metadata } from 'next';
import Link from 'next/link';
import { EventCard } from '@/components/events/EventCard';
import { fetchPublishedEvents, sortEventsForListing, type CmsEventListItem } from '@/lib/cmsEvents';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Agricultural Events & Fairs | KisaanMela',
  description:
    'Discover kisan melas, krishi expos, and agricultural fairs across India. Dates, mandis, and visitor info in one place.',
  keywords: 'agricultural events, farmer fairs, kisan mela, krishi mela, mandi, agricultural exhibitions',
  openGraph: {
    title: 'Agricultural Events & Fairs | KisaanMela',
    description: 'Discover kisan melas and agricultural fairs across India.',
    url: 'https://www.kisanmela.com/events',
    siteName: 'KisaanMela',
    type: 'website',
  },
};

function uniqueStates(events: CmsEventListItem[]) {
  const s = new Set<string>();
  for (const e of events) {
    const st = e.location?.state?.trim();
    if (st) s.add(st);
  }
  return s.size;
}

export default async function EventsPage() {
  const raw = await fetchPublishedEvents();
  const events = sortEventsForListing(raw);
  const featured = events.filter((e) => e.featured);
  const others = events.filter((e) => !e.featured);
  const total = events.length;
  const statesCount = uniqueStates(events);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero — mobile-first, KisaanMela green */}
      <div className="bg-gradient-to-br from-green-800 via-green-700 to-green-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <p className="text-sm font-medium uppercase tracking-wide text-green-100">KisaanMela</p>
          <h1 className="mt-2 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">Kisan melas &amp; krishi events</h1>
          <p className="mt-4 max-w-2xl text-base text-green-100 sm:text-lg">
            Browse published fairs across states—mandi locations, dates, crop focus, and expected crowds. All listings from our
            community database.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/events/register"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-5 text-sm font-semibold text-green-900 shadow hover:bg-green-50"
            >
              Register your mela
            </Link>
            <Link
              href="/events/upcoming"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-white/40 px-5 text-sm font-semibold text-white hover:bg-white/10"
            >
              Upcoming only
            </Link>
            <Link
              href="/marketplace/kisaan"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-white/40 px-5 text-sm font-semibold text-white hover:bg-white/10"
            >
              Marketplace hub
            </Link>
          </div>
          {total > 0 && (
            <dl className="mt-10 grid grid-cols-2 gap-4 border-t border-white/20 pt-8 sm:grid-cols-3">
              <div>
                <dt className="text-sm text-green-200">Published events</dt>
                <dd className="text-2xl font-bold">{total}</dd>
              </div>
              <div>
                <dt className="text-sm text-green-200">States covered</dt>
                <dd className="text-2xl font-bold">{statesCount}</dd>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <dt className="text-sm text-green-200">Featured highlights</dt>
                <dd className="text-2xl font-bold">{featured.length}</dd>
              </div>
            </dl>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2 text-sm font-medium">
            <span className="rounded-lg bg-green-100 px-3 py-2 text-green-900">All listings</span>
            <Link href="/events/upcoming" className="rounded-lg bg-white px-3 py-2 text-gray-700 shadow ring-1 ring-gray-200 hover:bg-gray-50">
              Upcoming
            </Link>
            <Link href="/events/past" className="rounded-lg bg-white px-3 py-2 text-gray-700 shadow ring-1 ring-gray-200 hover:bg-gray-50">
              Past
            </Link>
          </div>
        </div>

        {total === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <p className="text-lg font-medium text-gray-900">No published events yet</p>
            <p className="mt-2 text-sm text-gray-600">
              In production, curated sample melas load automatically when MongoDB has no published events. If you see this
              message in development, run{' '}
              <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">npm run seed:all</code> from{' '}
              <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">web-frontend</code> with{' '}
              <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">MONGODB_URI</code> set. On Vercel, set{' '}
              <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">MONGODB_URI</code> and{' '}
              <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">DATABASE_URL</code> to your Atlas URI. To hide
              bundled fallbacks, set{' '}
              <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">DISABLE_MELE_STATIC_FALLBACK=1</code>.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {featured.length > 0 && (
              <section aria-labelledby="featured-heading">
                <div className="mb-5 flex items-end justify-between gap-3">
                  <h2 id="featured-heading" className="text-xl font-bold text-gray-900 sm:text-2xl">
                    Featured melas
                  </h2>
                  <span className="text-sm text-gray-500">{featured.length} highlighted</span>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {featured.map((event) => (
                    <EventCard key={String(event._id || event.slug)} event={event} />
                  ))}
                </div>
              </section>
            )}

            <section aria-labelledby="all-heading">
              <div className="mb-5 flex items-end justify-between gap-3">
                <h2 id="all-heading" className="text-xl font-bold text-gray-900 sm:text-2xl">
                  {featured.length > 0 ? `More events (${others.length})` : `All events (${total})`}
                </h2>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {(featured.length > 0 ? others : events).map((event) => (
                  <EventCard key={String(event._id || event.slug)} event={event} />
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
