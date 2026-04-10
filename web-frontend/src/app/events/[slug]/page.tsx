import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/dbConnect';
import { Event } from '@/lib/models/CMSModels';

type Props = { params: { slug: string } };

type LeanPublishedEvent = {
  title?: string;
  description?: string;
  content?: string;
  date?: Date;
  endDate?: Date;
  location?: unknown;
  image?: unknown;
  melaMeta?: unknown;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await dbConnect();
  const doc = (await Event.findOne({ slug: params.slug, status: 'published' }).lean()) as
    | LeanPublishedEvent
    | null;
  if (!doc) {
    return { title: 'Event | Kisan Mela' };
  }
  return {
    title: `${doc.title ?? 'Event'} | Kisan Mela`,
    description: typeof doc.description === 'string' ? doc.description : undefined
  };
}

export default async function EventDetailPage({ params }: Props) {
  await dbConnect();
  const doc = (await Event.findOne({ slug: params.slug, status: 'published' }).lean()) as
    | LeanPublishedEvent
    | null;
  if (!doc) {
    notFound();
  }

  const title = doc.title as string;
  const description = doc.description as string;
  const content = doc.content as string;
  const date = doc.date ? new Date(doc.date as Date).toLocaleDateString('en-IN') : '';
  const endDate = doc.endDate ? new Date(doc.endDate as Date).toLocaleDateString('en-IN') : '';
  const loc = doc.location as {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  const image = doc.image as { url?: string; alt?: string } | undefined;
  const melaMeta = doc.melaMeta as
    | {
        mandi?: string;
        month?: string;
        focusType?: string;
        visitors?: number;
        isRecurring?: boolean;
        listingStatus?: string;
      }
    | undefined;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-wrap gap-2 text-sm">
          <Link href="/events" className="text-green-700 hover:underline">
            ← Events
          </Link>
          <span className="text-gray-400">/</span>
          <Link href="/events/upcoming" className="text-green-700 hover:underline">
            Upcoming
          </Link>
        </div>

        {image?.url && (
          <img
            src={image.url}
            alt={image.alt || title}
            className="w-full h-64 object-cover rounded-xl border border-gray-200"
          />
        )}

        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="mt-2 text-gray-600">{description}</p>
          <div className="mt-4 text-sm text-gray-700 space-y-1">
            <p>
              📍 {loc?.name}
              {loc?.city ? ` — ${loc.city}` : ''}
              {loc?.state ? `, ${loc.state}` : ''}
            </p>
            {loc?.address && <p className="text-gray-600">{loc.address}</p>}
            {(date || endDate) && (
              <p>
                🗓 {date}
                {endDate && endDate !== date ? ` – ${endDate}` : ''}
              </p>
            )}
            {melaMeta && (melaMeta.focusType || melaMeta.month || melaMeta.visitors != null) && (
              <div className="mt-3 rounded-lg border border-green-100 bg-green-50/80 px-3 py-2 text-sm">
                <p className="font-medium text-green-900">Mela details</p>
                <ul className="mt-1 space-y-0.5 text-green-800">
                  {melaMeta.focusType && <li>Focus: {melaMeta.focusType}</li>}
                  {melaMeta.month && <li>Typical month: {melaMeta.month}</li>}
                  {melaMeta.visitors != null && (
                    <li>Expected visitors: ~{Number(melaMeta.visitors).toLocaleString('en-IN')}</li>
                  )}
                  {melaMeta.isRecurring && <li>Recurring annually</li>}
                  {melaMeta.mandi && <li>Mandi: {melaMeta.mandi}</li>}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div
          className="prose prose-sm max-w-none text-gray-800 bg-white rounded-xl border border-gray-200 p-6"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
}
