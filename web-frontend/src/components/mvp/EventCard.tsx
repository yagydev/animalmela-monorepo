import Link from 'next/link';

export interface EventItem {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  price: number;
  imageUrl: string;
}

export function EventCard({ event }: { event: EventItem }) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <img src={event.imageUrl} alt={event.title} className="h-44 w-full object-cover" />
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
        <div className="text-sm text-gray-700">
          <p>📍 {event.location}</p>
          <p>🗓 {new Date(event.startDate).toLocaleDateString()}</p>
          <p>₹{event.price}</p>
        </div>
        <Link
          href={`/mvp/events/${event.id}`}
          className="inline-flex items-center rounded-md bg-green-700 px-3 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          View details
        </Link>
      </div>
    </article>
  );
}
