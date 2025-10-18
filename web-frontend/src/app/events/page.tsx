import EventsPageClient from './EventsPageClient';
import { Metadata } from 'next';

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

// Server-side data fetching for App Router
async function getEvents() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/cms/events?populate=*&filters[status]=published&sort=date:asc`, {
      cache: 'no-store' // Ensure fresh data on each request
    });
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

export default async function EventsPage() {
  const initialEvents = await getEvents();
  
  return <EventsPageClient initialEvents={initialEvents} />;
}