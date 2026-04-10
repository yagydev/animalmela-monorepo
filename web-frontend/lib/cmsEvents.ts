export type CmsEventListItem = {
  _id?: string;
  id?: string;
  title?: string;
  slug?: string;
  description?: string;
  content?: string;
  date?: string;
  endDate?: string;
  featured?: boolean;
  location?: {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  image?: {
    url?: string;
    alt?: string;
  };
  status?: string;
  tags?: string[];
  melaMeta?: {
    mandi?: string;
    month?: string;
    focusType?: string;
    visitors?: number;
    isRecurring?: boolean;
    listingStatus?: string;
    source?: string;
  };
};

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
  const configured = (
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '')
  );

  if (configured) {
    return configured;
  }

  if (process.env.NODE_ENV !== 'production') {
    return 'http://localhost:3000';
  }

  return '';
}

export async function fetchPublishedEvents(): Promise<CmsEventListItem[]> {
  try {
    return await fetchPublishedEventsFromDatabase();
  } catch (error) {
    console.error('Events DB load failed, trying HTTP:', error);
  }

  const baseUrl = eventsApiBase();
  if (!baseUrl) {
    return [];
  }

  try {
    const response = await fetch(
      `${baseUrl}/api/cms/events?filters[status]=published&sort=date:asc&pagination[pageSize]=500&pagination[page]=1&summary=1`,
      {
        cache: 'no-store',
        signal: AbortSignal.timeout(12000),
      },
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
