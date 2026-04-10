import Link from 'next/link';
import { Metadata } from 'next';
import { fetchPublishedEvents, type CmsEventListItem } from '@/lib/cmsEvents';

export const metadata: Metadata = {
  title: 'Past Highlights - Kisaanmela',
  description:
    'Explore past agricultural fairs, exhibitions, and farmer success stories from previous events.'
};

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export default async function PastHighlightsPage() {
  const all = await fetchPublishedEvents();
  const cutoff = startOfToday();
  const past = all
    .filter((e: CmsEventListItem) => e.date && new Date(e.date) < cutoff)
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime());

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Past Highlights</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Events from earlier dates on our calendar (published in CMS).
          </p>
        </div>

        <div className="mb-6 flex justify-center gap-2 text-sm">
          <Link href="/events" className="rounded-md bg-gray-900 px-3 py-1.5 text-white hover:bg-gray-800">
            All events
          </Link>
          <Link href="/events/upcoming" className="rounded-md bg-gray-100 px-3 py-1.5 hover:bg-gray-200">
            Upcoming
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Past events</h2>
          {past.length === 0 ? (
            <p className="text-gray-600">No past published events in the feed yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {past.map((event) => (
                <article
                  key={String(event._id || event.id || event.slug)}
                  className="rounded-lg border border-gray-200 p-4 bg-gray-50"
                >
                  <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{event.description}</p>
                  <p className="text-sm text-gray-700 mt-2">
                    📍 {event.location?.city}, {event.location?.state}
                  </p>
                  <p className="text-sm text-gray-700">
                    🗓 {event.date ? new Date(event.date).toLocaleDateString('en-IN') : 'TBA'}
                  </p>
                  {event.slug && (
                    <Link
                      href={`/events/${event.slug}`}
                      className="mt-3 inline-flex rounded-md bg-gray-800 px-3 py-2 text-sm font-medium text-white hover:bg-gray-900"
                    >
                      Details
                    </Link>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
