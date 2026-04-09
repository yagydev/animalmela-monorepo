type EventItem = {
  id: string;
  title: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  price: number;
  image_url: string;
};

type LeadItem = {
  id: string;
  buyer_id: string;
  product: string;
  quantity: string;
  location: string;
  details: string | null;
  status: 'open' | 'closed';
  created_at: string;
};

type BookingItem = {
  id: string;
  event_id: string;
  vendor_id: string;
  stall_type: 'basic' | 'premium' | 'corner';
  amount: number;
  payment_txn_id: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
};

export const mockStore: {
  events: EventItem[];
  leads: LeadItem[];
  bookings: BookingItem[];
} = {
  events: [
    {
      id: 'evt-mock-1',
      title: 'Kharif Expo 2026',
      description: 'Regional farmer event for seeds and equipment',
      location: 'Pune',
      start_date: new Date(Date.now() + 7 * 86400000).toISOString(),
      end_date: new Date(Date.now() + 8 * 86400000).toISOString(),
      price: 499,
      image_url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854'
    },
    {
      id: 'evt-mock-2',
      title: 'Organic Mela',
      description: 'Organic produce showcase and workshops',
      location: 'Nashik',
      start_date: new Date(Date.now() + 14 * 86400000).toISOString(),
      end_date: new Date(Date.now() + 15 * 86400000).toISOString(),
      price: 299,
      image_url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b'
    }
  ],
  leads: [
    {
      id: 'lead-mock-1',
      buyer_id: 'farmer@kisaanmela.com',
      product: 'Organic Tomatoes',
      quantity: '200 kg',
      location: 'Pune',
      details: 'Need weekly supply for 3 months',
      status: 'open',
      created_at: new Date().toISOString()
    }
  ],
  bookings: []
};
