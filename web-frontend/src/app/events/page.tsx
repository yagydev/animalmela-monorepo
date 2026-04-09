import { Metadata } from 'next';
import { fetchEvents as fetchMvpEvents } from '../../lib/mvpApi';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Agricultural Events & Fairs | Kisan Mela',
  description: 'Discover upcoming agricultural events, fairs, and exhibitions across India. Connect with farmers, vendors, and agricultural organizations.',
  keywords: 'agricultural events, farmer fairs, kisan mela, agricultural exhibitions, farming events',
  openGraph: {
    title: 'Agricultural Events & Fairs | Kisan Mela',
    description: 'Discover upcoming agricultural events, fairs, and exhibitions across India.',
    url: 'https://www.kisanmela.com/events',
    siteName: 'Kisan Mela',
    type: 'website',
  },
};

type CmsEvent = {
  _id?: string;
  id?: string;
  title?: string;
  slug?: string;
  description?: string;
  date?: string;
  location?: {
    city?: string;
    name?: string;
  };
  image?: {
    url?: string;
    alt?: string;
  };
};

async function getCmsEvents(): Promise<CmsEvent[]> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '');

  if (!baseUrl) {
    return [];
  }

  try {
    const response = await fetch(
      `${baseUrl}/api/cms/events?populate=*&filters[status]=published&sort=date:asc`,
      {
        cache: 'no-store',
        signal: AbortSignal.timeout(8000)
      }
    );
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

export default async function EventsPage() {
  const initialEvents = await getCmsEvents();
  const mvpEvents = await fetchMvpEvents();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Agricultural Events</h1>
          <p className="mt-2 text-gray-600">
            One unified place for community events and stall-booking ready events.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <section className="rounded-xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-green-900">Marketplace-ready events</h2>
              <p className="text-sm text-green-700">Fast stall booking and lead-centric events from MVP.</p>
            </div>
            <Link
              href="/vendors/book-stall"
              className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
            >
              Book Stall
            </Link>
          </div>
          {mvpEvents.length === 0 ? (
            <p className="mt-4 text-sm text-gray-600">No marketplace-ready events available right now.</p>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mvpEvents.map((event) => (
                <article key={event.id} className="rounded-lg border border-green-100 bg-white p-4 shadow-sm">
                  <h3 className="text-base font-semibold text-gray-900">{event.title}</h3>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">{event.description}</p>
                  <div className="mt-2 text-sm text-gray-700">
                    <p>📍 {event.location}</p>
                    <p>🗓 {new Date(event.startDate).toLocaleDateString('en-IN')}</p>
                  </div>
                  <Link
                    href={`/mvp/events/${event.id}`}
                    className="mt-3 inline-flex rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                  >
                    View & Book
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-gray-900">Community events</h2>
            <div className="flex gap-2 text-sm">
              <Link href="/events/upcoming" className="rounded-md bg-gray-100 px-3 py-1.5 hover:bg-gray-200">
                Upcoming
              </Link>
              <Link href="/events/past" className="rounded-md bg-gray-100 px-3 py-1.5 hover:bg-gray-200">
                Past
              </Link>
            </div>
          </div>
          {initialEvents.length === 0 ? (
            <p className="mt-4 text-sm text-gray-600">No published community events right now.</p>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {initialEvents.slice(0, 9).map((event) => (
                <article key={event._id || event.id || event.slug} className="rounded-lg border border-gray-200 p-4">
                  <h3 className="text-base font-semibold text-gray-900">{event.title || 'Untitled event'}</h3>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">{event.description || 'No description.'}</p>
                  <div className="mt-2 text-sm text-gray-700">
                    <p>📍 {event.location?.name || event.location?.city || 'TBA'}</p>
                    <p>🗓 {event.date ? new Date(event.date).toLocaleDateString('en-IN') : 'Date TBA'}</p>
                  </div>
                  <Link
                    href={event.slug ? `/events/${event.slug}` : '/events/upcoming'}
                    className="mt-3 inline-flex rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
                  >
                    Learn More
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}