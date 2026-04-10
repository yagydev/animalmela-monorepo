import Link from 'next/link';
import type { CmsEventListItem } from '@/lib/cmsEvents';

function formatVisitors(n?: number) {
  if (n == null || Number.isNaN(n)) return null;
  return `~${n.toLocaleString('en-IN')} visitors`;
}

export function EventCard({ event }: { event: CmsEventListItem }) {
  const href = event.slug ? `/events/${event.slug}` : '/events/upcoming';
  const dateStr = event.date ? new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Date TBA';
  const endStr =
    event.endDate && event.date && new Date(event.endDate).getTime() !== new Date(event.date).getTime()
      ? new Date(event.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
      : null;
  const city = event.location?.city;
  const state = event.location?.state;
  const mandi = event.location?.name || event.melaMeta?.mandi;
  const meta = event.melaMeta;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link href={href} className="relative block aspect-[16/10] w-full overflow-hidden bg-gray-100">
        {event.image?.url ? (
          // eslint-disable-next-line @next/next/no-img-element -- list pages: many remote URLs; avoids RSC/Image pipeline load in dev
          <img
            src={event.image.url}
            alt={event.image.alt || event.title || 'Event'}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full min-h-[140px] items-center justify-center bg-gradient-to-br from-green-700 to-green-900 text-5xl">
            🌾
          </div>
        )}
        {event.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-amber-400 px-2.5 py-0.5 text-xs font-bold text-amber-950 shadow">
            Featured
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {meta?.focusType && (
            <span className="rounded-md bg-green-50 px-2 py-0.5 text-xs font-medium text-green-800">{meta.focusType}</span>
          )}
          {meta?.month && (
            <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-700">{meta.month}</span>
          )}
          {meta?.isRecurring && (
            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs text-blue-800">Recurring</span>
          )}
        </div>

        <h3 className="text-lg font-bold leading-snug text-gray-900 line-clamp-2">
          <Link href={href} className="hover:text-green-800">
            {event.title || 'Untitled event'}
          </Link>
        </h3>

        <p className="mt-2 flex-1 text-sm text-gray-600 line-clamp-3">{event.description || 'Join us at this agricultural fair.'}</p>

        <ul className="mt-4 space-y-1.5 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="shrink-0" aria-hidden>
              📍
            </span>
            <span>
              {mandi && <span className="font-medium">{mandi}</span>}
              {city && (
                <>
                  {mandi ? ' · ' : ''}
                  {city}
                  {state ? `, ${state}` : ''}
                </>
              )}
              {!mandi && !city && (state || 'Location TBA')}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0" aria-hidden>
              🗓
            </span>
            <span>
              {dateStr}
              {endStr ? ` → ${endStr}` : ''}
            </span>
          </li>
          {formatVisitors(meta?.visitors) && (
            <li className="flex items-start gap-2 text-gray-600">
              <span className="shrink-0" aria-hidden>
                👥
              </span>
              <span>{formatVisitors(meta?.visitors)}</span>
            </li>
          )}
        </ul>

        <Link
          href={href}
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-green-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-green-800"
        >
          View details
        </Link>
      </div>
    </article>
  );
}
