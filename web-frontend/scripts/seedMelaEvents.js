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

/** Type-specific images so every card looks contextually relevant */
const TYPE_IMAGES = {
  'Chilli Trade':    'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=800&h=600&fit=crop', // red chillies
  'Machinery':       'https://images.unsplash.com/photo-1592982537447-7440770cbfc1?w=800&h=600&fit=crop', // tractor
  'Groundnut':       'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&h=600&fit=crop', // groundnuts
  'Seeds':           'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop', // seeds/seedlings
  'Wheat':           'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop', // wheat field
  'Agri Tech':       'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop', // agri tech/drone
  'Onion Trade':     'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&h=600&fit=crop', // onions
  'Mixed Farming':   'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=600&fit=crop', // mixed crops
  'Sugarcane':       'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop', // sugarcane
  'Smart Farming':   'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&h=600&fit=crop', // precision farming
  'Soybean':         'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop', // soybeans
  'Livestock':       'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&h=600&fit=crop', // cattle fair
  'Cotton':          'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800&h=600&fit=crop', // cotton fields
  'Rice':            'https://images.unsplash.com/photo-1536304993881-ff86e0c9b16e?w=800&h=600&fit=crop', // rice paddy
  'Tea':             'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&h=600&fit=crop', // tea plantation
  'Spices':          'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=600&fit=crop', // spice market
  'Horticulture':    'https://images.unsplash.com/photo-1506484381205-f7945653044d?w=800&h=600&fit=crop', // fruits/horticulture
  'Litchi':          'https://images.unsplash.com/photo-1559181567-c3190ca9be46?w=800&h=600&fit=crop', // fruit trees
  'Apple':           'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=800&h=600&fit=crop', // apple orchard
  'Pulses':          'https://images.unsplash.com/photo-1505253304499-671c55fb57fe?w=800&h=600&fit=crop', // lentils/pulses
  'Coconut':         'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=800&h=600&fit=crop', // coconut trees
  'Organic Farming': 'https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?w=800&h=600&fit=crop', // organic farm
};

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=600&fit=crop';

/** Rich descriptions per mela type */
const TYPE_DESCRIPTIONS = {
  'Chilli Trade':    'India\'s premier chilli trading fair bringing together farmers, traders and exporters. Get live mandi rates, quality grading demos, and connect with bulk buyers across the region.',
  'Machinery':       'Agricultural machinery expo showcasing tractors, harvesters, irrigation equipment and precision farming tools. Live demos, easy financing options, and after-sale service camps.',
  'Groundnut':       'A gathering of groundnut farmers, oil mill owners and traders. Seed distribution, soil health workshops, and direct MSP procurement counters available on-site.',
  'Seeds':           'Annual seed fair featuring latest HYV and hybrid seed varieties from ICAR institutes and private companies. Free seed kits, crop advisory stalls, and KVK experts on call.',
  'Wheat':           'Post-harvest wheat mela connecting farmers with FCI procurement centres, flour mills and commodity traders. Grading workshops and government scheme registration help on-site.',
  'Agri Tech':       'Cutting-edge agricultural technology exhibition with IoT sensors, drone spraying demos, AI-based crop advisory, and smart irrigation systems. Startup pavilion and investor meets included.',
  'Onion Trade':     'One of the largest onion trade fairs in India. Daily price discovery, cold storage facility tours, export procedure guidance, and direct linkages to retail and export buyers.',
  'Mixed Farming':   'Multi-crop farming exhibition covering kharif, rabi and vegetable crops. Soil testing, crop insurance awareness, government scheme enrolment, and mandi rate information camps.',
  'Sugarcane':       'Annual sugarcane growers meet with sugar mill representatives, latest variety trials, disease management demos, and cane harvester machinery exhibitions.',
  'Smart Farming':   'India\'s premier smart and precision farming expo featuring satellite-based crop monitoring, drone analytics, hydroponics, and agri fintech solutions.',
  'Soybean':         'Soybean traders\' mela with soya processing demos, direct procurement by agro-processing companies, seed trials of latest soybean varieties, and export market linkage sessions.',
  'Livestock':       'Annual livestock fair with cattle, buffalo and goat trading, veterinary health camps, AI and breeding services, livestock insurance registration, and fodder stalls.',
  'Cotton':          'Cotton growers\' conclave featuring ginning technology demos, MSP procurement camps, Bt cotton seed trials, and direct tie-up sessions with textile mills.',
  'Rice':            'Rice cultivation expo with paddy variety trials, parboiling and milling technology, direct procurement counters, and organic rice promotion stalls.',
  'Tea':             'Annual tea growers\' festival showcasing orthodox, CTC and specialty green teas. Auction price briefings, blending demos, packaging technology, and export linkage sessions.',
  'Spices':          'Spice trade mela covering pepper, cardamom, turmeric and ginger. Grading and processing demos, organic certification camps, and connect with national and international spice buyers.',
  'Horticulture':    'Horticulture fair featuring fruit, flower and vegetable growers. Packhouse technology, cold chain solutions, polyhouse demos, and APEDA export assistance counters.',
  'Litchi':          'Regional litchi growers\' fair with variety showcases, post-harvest handling technology, packaging solutions, and direct linkages to metro retailers and online platforms.',
  'Apple':           'Apple growers\' festival covering CA storage technology, grading & sorting machinery, export procedures, and IPM demonstrations for Himalayan orchards.',
  'Pulses':          'Pulses fair featuring dal mills, seed companies, NAFED procurement counters, organic pulse cultivation workshops, and government subsidy scheme registration.',
  'Coconut':         'Coconut development fair with processing technology (copra, oil, fiber, shell), government scheme guidance from Coconut Development Board, and farmer producer organisation formation support.',
  'Organic Farming': 'Organic farming expo with PGS and third-party certification guidance, vermicompost and bio-input stalls, premium buyer linkages, and organic market access workshops.',
};

const FALLBACK_DESC = 'A major agricultural fair bringing together farmers, traders and agri experts. Government scheme registration, soil testing, and direct market linkage sessions on-site.';

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

function toEventDoc(row) {
  const r = row;
  const { start, end } = upcomingDatesForMonth(r.month);
  const slugBase = `${slugify(r.name)}-${slugify(r.city)}`;
  const typeDesc = TYPE_DESCRIPTIONS[r.type] || FALLBACK_DESC;
  const description = typeDesc;
  const content = `<p><strong>${r.name}</strong> is held near <strong>${r.mandi}</strong> in <strong>${r.city}, ${r.state}</strong>.</p>
<p>${typeDesc}</p>
<p>Focus: <strong>${r.type}</strong>. Month: <strong>${r.month}</strong>. Expected visitors: <strong>${Number(r.visitors).toLocaleString('en-IN')}</strong>.</p>
<p>This is a recurring annual mela. Dates shown are representative — actual dates may vary. Check local APMC or KVK notices for confirmed schedule.</p>`;

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
      url: TYPE_IMAGES[r.type] || FALLBACK_IMAGE,
      alt: `${r.name} — ${r.type} fair in ${r.city}`,
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
      const doc = toEventDoc(MELA_SEED[i]);
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
