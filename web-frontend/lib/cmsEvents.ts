import { getStaticMelaEventsForListing } from '@/lib/melaStaticFallback';
import type { CmsEventListItem } from '@/lib/cmsEventTypes';

export type { CmsEventListItem } from '@/lib/cmsEventTypes';

/** Sort: featured first, then by start date ascending */
export function sortEventsForListing(events: CmsEventListItem[]): CmsEventListItem[] {
  return [...events].sort((a, b) => {
    const fa = a.featured ? 1 : 0;
    const fb = b.featured ? 1 : 0;
    if (fb !== fa) return fb - fa;
    const ta = a.date ? new Date(a.date).getTime() : 0;
    const tb = b.date ? new Date(b.date).getTime() : 0;
    return ta - tb;
  });
}

/** Fields only — omit `content` / gallery / seo so RSC payloads stay small (avoids ERR_INCOMPLETE_CHUNKED_ENCODING). */
const EVENT_LIST_PROJECTION =
  'title slug description date endDate location image featured tags melaMeta status';

async function fetchPublishedEventsFromDatabase(): Promise<CmsEventListItem[]> {
  const dbConnect = (await import('@/lib/dbConnect')).default;
  const { Event } = await import('@/lib/models/CMSModels');
  await dbConnect();
  const docs = await Event.find({ status: 'published' })
    .select(EVENT_LIST_PROJECTION)
    .sort({ date: 1 })
    .limit(500)
    .lean();
  return JSON.parse(JSON.stringify(docs)) as CmsEventListItem[];
}

function eventsApiBase(): string {
  const configured =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '');

  if (configured) {
    return configured.replace(/\/$/, '');
  }

  if (process.env.NODE_ENV !== 'production') {
    return 'http://localhost:3000';
  }

  return '';
}

function shouldUseStaticMelaFallback(): boolean {
  if (process.env.DISABLE_MELE_STATIC_FALLBACK === '1') return false;
  return process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
}

export async function fetchPublishedEvents(): Promise<CmsEventListItem[]> {
  try {
    const fromDb = await fetchPublishedEventsFromDatabase();
    if (fromDb.length > 0) return fromDb;
  } catch (error) {
    console.error('Events DB load failed:', error);
  }

  const baseUrl = eventsApiBase();
  if (baseUrl) {
    try {
      const response = await fetch(
        `${baseUrl}/api/cms/events?filters[status]=published&sort=date:asc&pagination[pageSize]=500&pagination[page]=1&summary=1`,
        {
          cache: 'no-store',
          signal: AbortSignal.timeout(12000),
        },
      );
      if (response.ok) {
        const data = await response.json();
        const httpRows = (data.data || []) as CmsEventListItem[];
        if (httpRows.length > 0) return httpRows;
      }
    } catch (error) {
      console.error('Error fetching events via HTTP:', error);
    }
  }

  if (shouldUseStaticMelaFallback()) {
    try {
      return getStaticMelaEventsForListing();
    } catch (e) {
      console.error('Static mela fallback failed:', e);
    }
  }

  return [];
}
