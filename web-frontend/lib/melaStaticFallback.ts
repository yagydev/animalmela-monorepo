import type { CmsEventListItem } from '@/lib/cmsEventTypes';
import melaSeed from '../data/mela-seed.json';

type MelaSeedRow = {
  name: string;
  state: string;
  city: string;
  mandi: string;
  month: string;
  type: string;
  visitors: number;
  is_recurring?: boolean;
  status?: string;
  source?: string;
};

const MONTH_INDEX: Record<string, number> = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11,
};

const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1592982537447-7440770cbfc1?w=800&h=600&fit=crop',
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function upcomingDatesForMonth(monthName: string) {
  const month = MONTH_INDEX[monthName];
  if (month === undefined) {
    throw new Error(`Unknown month: ${monthName}`);
  }
  const now = new Date();
  let year = now.getFullYear();
  let start = new Date(year, month, 15, 10, 0, 0);
  if (start < now) {
    year += 1;
    start = new Date(year, month, 15, 10, 0, 0);
  }
  const end = new Date(start);
  end.setDate(end.getDate() + 2);
  end.setHours(18, 0, 0, 0);
  return { start, end };
}

/** Same shape as Mongo CMS events — used when production DB has no published rows yet. */
export function getStaticMelaEventsForListing(): CmsEventListItem[] {
  const rows = melaSeed as MelaSeedRow[];
  return rows.map((r, index) => {
    const { start, end } = upcomingDatesForMonth(r.month);
    const slugBase = `${slugify(r.name)}-${slugify(r.city)}`;
    const description = `${r.type} — ${r.mandi}, ${r.city}. Typical attendance ~${Number(r.visitors).toLocaleString('en-IN')} visitors. Recurring mela in ${r.month}.`;
    return {
      title: r.name,
      slug: slugBase,
      description,
      date: start.toISOString(),
      endDate: end.toISOString(),
      location: {
        name: r.mandi,
        address: `${r.mandi}, ${r.city}`,
        city: r.city,
        state: r.state,
        pincode: '000000',
      },
      image: {
        url: PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length],
        alt: r.name,
      },
      status: 'published',
      featured: r.visitors >= 40000,
      tags: [r.type, r.state, r.city, r.mandi, r.month, 'mela', 'seed-mela', r.source || 'seed'],
      melaMeta: {
        mandi: r.mandi,
        month: r.month,
        focusType: r.type,
        visitors: r.visitors,
        isRecurring: !!r.is_recurring,
        listingStatus: r.status || 'upcoming',
        source: r.source || 'seed',
      },
    };
  });
}
