CREATE TABLE IF NOT EXISTS app_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('farmer', 'vendor', 'organizer')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stall_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  vendor_id TEXT NOT NULL,
  stall_type TEXT NOT NULL CHECK (stall_type IN ('basic', 'premium', 'corner')),
  amount NUMERIC(10,2) NOT NULL,
  payment_txn_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS buyer_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id TEXT NOT NULL,
  product TEXT NOT NULL,
  quantity TEXT NOT NULL,
  location TEXT NOT NULL,
  details TEXT,
  status TEXT NOT NULL CHECK (status IN ('open', 'closed')) DEFAULT 'open',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO events (title, description, location, start_date, end_date, price, image_url)
VALUES
  ('Kharif Expo 2026', 'Regional farmer event for seeds and equipment', 'Pune', NOW() + INTERVAL '7 days', NOW() + INTERVAL '8 days', 499, 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854'),
  ('Organic Mela', 'Organic produce showcase and workshops', 'Nashik', NOW() + INTERVAL '14 days', NOW() + INTERVAL '15 days', 299, 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b'),
  ('Agri Tech Meet', 'Technology for modern farming', 'Ludhiana', NOW() + INTERVAL '21 days', NOW() + INTERVAL '22 days', 799, 'https://images.unsplash.com/photo-1550583724-b2692b85b150')
ON CONFLICT DO NOTHING;
