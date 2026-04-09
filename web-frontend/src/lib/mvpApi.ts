import type { EventItem } from '@/components/mvp/EventCard';
import type { LeadItem } from '@/components/mvp/LeadCard';

const API_BASE = process.env.NEXT_PUBLIC_MVP_API_BASE_URL ?? 'http://localhost:5050';

type ApiEnvelope<T> = {
  data: T;
  source?: 'postgres' | 'mock';
};

type ApiEvent = {
  id: string;
  title: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  price: number;
  image_url: string;
};

type ApiLead = {
  id: string;
  product: string;
  quantity: string;
  location: string;
  details?: string | null;
};

function toEventItem(event: ApiEvent): EventItem {
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    location: event.location,
    startDate: event.start_date,
    endDate: event.end_date,
    price: event.price,
    imageUrl: event.image_url
  };
}

function toLeadItem(lead: ApiLead): LeadItem {
  return {
    id: lead.id,
    product: lead.product,
    quantity: lead.quantity,
    location: lead.location,
    details: lead.details ?? undefined
  };
}

async function safeFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response | null> {
  try {
    return await fetch(input, init);
  } catch {
    return null;
  }
}

export async function fetchEvents(filters?: { location?: string; date?: string }): Promise<EventItem[]> {
  const params = new URLSearchParams();
  if (filters?.location) params.set('location', filters.location);
  if (filters?.date) params.set('date', filters.date);
  const query = params.toString();
  const url = `${API_BASE}/api/events${query ? `?${query}` : ''}`;

  const response = await safeFetch(url, { cache: 'no-store' });
  if (!response || !response.ok) return [];
  const payload = (await response.json()) as ApiEnvelope<ApiEvent[]>;
  return (payload.data ?? []).map(toEventItem);
}

export async function fetchEventById(id: string): Promise<EventItem | null> {
  const response = await safeFetch(`${API_BASE}/api/events/${id}`, { cache: 'no-store' });
  if (!response || !response.ok) return null;
  const payload = (await response.json()) as ApiEnvelope<ApiEvent>;
  return payload.data ? toEventItem(payload.data) : null;
}

export async function getDemoToken(role: 'vendor' | 'farmer' | 'organizer'): Promise<string | null> {
  const response = await safeFetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: `${role}@kisaanmela.com`,
      role
    })
  });

  if (!response || !response.ok) return null;
  const payload = (await response.json()) as { token?: string };
  return payload.token ?? null;
}

export async function fetchLeadsForVendor(): Promise<LeadItem[]> {
  const token = await getDemoToken('vendor');
  if (!token) return [];

  const response = await safeFetch(`${API_BASE}/api/leads`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    cache: 'no-store'
  });

  if (!response || !response.ok) return [];
  const payload = (await response.json()) as ApiEnvelope<ApiLead[]>;
  return (payload.data ?? []).map(toLeadItem);
}

export async function createBooking(payload: {
  eventId: string;
  stallType: 'basic' | 'premium' | 'corner';
  amount: number;
}): Promise<boolean> {
  const token = await getDemoToken('vendor');
  if (!token) return false;

  const response = await safeFetch(`${API_BASE}/api/stalls/book`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  return Boolean(response?.ok);
}
