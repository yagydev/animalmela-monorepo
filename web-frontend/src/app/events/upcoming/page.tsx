import Link from 'next/link';
import { Metadata } from 'next';
import { EventCard } from '@/components/events/EventCard';
import { fetchPublishedEvents, sortEventsForListing, type CmsEventListItem } from '@/lib/cmsEvents';

export const metadata: Metadata = {
  title: 'Upcoming Melas - Kisaanmela',
  description:
    'Discover upcoming agricultural fairs and exhibitions near you. Join farmers, vendors, and agricultural enthusiasts.'
};

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export default async function UpcomingMelasPage() {
  const all = await fetchPublishedEvents();
  const cutoff = startOfToday();
  const upcoming = sortEventsForListing(
    all.filter((e: CmsEventListItem) => e.date && new Date(e.date) >= cutoff),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Upcoming Melas</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover upcoming agricultural fairs and exhibitions near you.
          </p>
        </div>

        <div className="mb-6 flex justify-center gap-2 text-sm">
          <Link href="/events" className="rounded-md bg-gray-900 px-3 py-1.5 text-white hover:bg-gray-800">
            All events
          </Link>
          <Link href="/events/past" className="rounded-md bg-gray-100 px-3 py-1.5 hover:bg-gray-200">
            Past highlights
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Upcoming agricultural events</h2>
          {upcoming.length === 0 ? (
            <p className="text-gray-600">No upcoming published events right now.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((event) => (
                <EventCard key={String(event._id || event.id || event.slug)} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
