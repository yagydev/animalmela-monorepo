import EventsPageClient from './EventsPageClient';

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