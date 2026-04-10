/**
 * Seed Indian Kisan Melas into MongoDB collection `events` (Mongoose model `Event`).
 * Data file: web-frontend/data/mela-seed.json
 *
 * Prisma is NOT used here — site CMS events live in MongoDB. Nest marketplace `AgriEvent` is PostgreSQL/Prisma separately.
 *
 * Run: npm run seed:melas   (loads monorepo root .env — same Atlas DB as DATABASE_URL)
 */
const path = require('path');
const mongoose = require('mongoose');
const { resolveMongoUri } = require('./loadMonorepoEnv');

const MELA_SEED = require(path.join(__dirname, '../data/mela-seed.json'));

const connectDB = async () => {
  const mongoUri = resolveMongoUri();
  await mongoose.connect(mongoUri);
  console.log(`📦 Connected — database: ${mongoose.connection.db.databaseName}`);
};

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, required: true },
    endDate: { type: Date, required: true },
    location: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      coordinates: { lat: Number, lng: Number },
    },
    image: {
      url: { type: String, required: true },
      alt: String,
      caption: String,
    },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
    featured: { type: Boolean, default: false },
    tags: [String],
    meta: {
      title: String,
      description: String,
      keywords: [String],
    },
    melaMeta: {
      mandi: String,
      month: String,
      focusType: String,
      visitors: Number,
      isRecurring: Boolean,
      listingStatus: String,
      source: String,
    },
  },
  { timestamps: true },
);

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

const MONTH_INDEX = {
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

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function upcomingDatesForMonth(monthName) {
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

function toEventDoc(row, index) {
  const r = row;
  const { start, end } = upcomingDatesForMonth(r.month);
  const slugBase = `${slugify(r.name)}-${slugify(r.city)}`;
  const description = `${r.type} — ${r.mandi}, ${r.city}. Typical attendance ~${Number(r.visitors).toLocaleString('en-IN')} visitors. Recurring mela in ${r.month}.`;
  const content = `<p><strong>${r.name}</strong> is held near <strong>${r.mandi}</strong> in <strong>${r.city}, ${r.state}</strong>.</p>
<p>Focus: <strong>${r.type}</strong>. Month: <strong>${r.month}</strong>. Expected visitors: <strong>${Number(r.visitors).toLocaleString('en-IN')}</strong>.</p>
<p>This listing was seeded for discovery on Kisan Mela. Dates are representative (mid-month window) and roll forward each year.</p>`;

  return {
    title: r.name,
    slug: slugBase,
    description,
    content,
    date: start,
    endDate: end,
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
}

async function run() {
  try {
    await connectDB();
    for (let i = 0; i < MELA_SEED.length; i++) {
      const doc = toEventDoc(MELA_SEED[i], i);
      await Event.replaceOne({ slug: doc.slug }, doc, { upsert: true });
    }
    console.log(`✅ Mela seed complete. ${MELA_SEED.length} documents upserted in collection "events" (MongoDB).`);
  } catch (e) {
    console.error('❌ Seed failed:', e);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

run();
