/**
 * Seed script for NewsUpdate collection — 22 real agricultural news articles
 * Run with: node scripts/seed-news.js
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kisaanmela_db_dev';

const NewsUpdateSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    slug:        { type: String, required: true, unique: true, lowercase: true },
    excerpt:     { type: String, required: true },
    content:     { type: String, required: true },
    author:      { name: String, email: String, avatar: String },
    category:    { type: String, enum: ['agriculture', 'technology', 'policy', 'market', 'weather', 'events', 'livestock', 'export', 'farmer-stories'], required: true },
    tags:        [String],
    image:       { url: String, alt: String, caption: String },
    status:      { type: String, enum: ['draft', 'published', 'archived'], default: 'published' },
    featured:    { type: Boolean, default: false },
    publishedAt: Date,
    views:       { type: Number, default: 0 },
    readTime:    String,
    source:      String,
  },
  { timestamps: true }
);

const newsArticles = [
  {
    slug: 'national-agri-fair-2026',
    title: 'National Agriculture Fair Brings All Govt Schemes Under One Roof for Farmers',
    excerpt: 'The three-day "Krishi Mahakumbh" in Madhya Pradesh lets farmers access crop insurance, Kisan Credit Cards, seed subsidies, and organic certification — all in one place.',
    content: `The National Agriculture Fair took place in Raisen, Madhya Pradesh from April 11–13, 2026. Union Minister Shivraj Singh Chouhan described it as a "Krishi Mahakumbh" where farmers access comprehensive information on crop insurance, credit, seeds, fertilizers, and organic certification.

The fair featured insurance companies offering Pradhan Mantri Fasal Bima Yojana (PMFBY) policies on-site, with workshops addressing premium sharing, claim procedures, reporting of crop losses, and settlement processes.

Banks provided guidance on Kisan Credit Cards, term loans, and the Agricultural Infrastructure Fund for warehouses, cold storage, and processing facilities. Government and private seed companies showcased improved varieties, while fertilizer providers emphasized lower cost, higher production and healthier soil through bio-fertilizers and balanced nutrient management.

The fair also promoted natural farming and FPO-based direct marketing connections without intermediaries, with several FPOs signing direct procurement agreements with retail chains on the spot.`,
    author: { name: 'KJ Staff' },
    category: 'policy',
    tags: ['PMFBY', 'Kisan Credit Card', 'Madhya Pradesh', 'Shivraj Singh', 'Agriculture Fair'],
    image: { url: 'https://kjcdn.gumlet.io/media/105972/hfwa-gra8aecyhb5rtr.jpg', alt: 'National Agriculture Fair 2026' },
    featured: true,
    publishedAt: new Date('2026-04-10T09:15:00Z'),
    readTime: '4 min read',
    source: 'Krishi Jagran',
    views: 1240,
    status: 'published',
  },
  {
    slug: 'dairy-climate-resilience-2026',
    title: "Climate Resilience is No Longer Optional for India's Dairy Sector, Say Experts",
    excerpt: 'Industry leaders, NABARD chairman, and government officials converged in New Delhi to align on policy, finance, and market integration for a climate-ready dairy value chain.',
    content: `India's dairy leaders convened in New Delhi for a national consultation on creating a climate-resilient dairy ecosystem. The event, organized by CII-FACE and Environmental Defense Fund, brought together government officials, industry representatives, and financial institutions.

Varsha Joshi (Additional Secretary, Department of Animal Husbandry) said: "The real opportunity lies in integrating the dairy value chain end-to-end—where even by-products like dung are monetised."

NABARD Chairman Shaji K V stated: "Climate resilience is no longer optional, but essential." Hisham Mundol (EDF Chief Advisor) added: "The farmer is not the last mile, the farmer is the centre."

The consultation examined policy frameworks, innovative financing mechanisms, and institutional coordination to accelerate adoption of climate-resilient practices. Sessions focused on creating enabling environments and scaling farmer-centric solutions through cooperatives, private sector engagement, and digital technologies.`,
    author: { name: 'KJ Staff' },
    category: 'livestock',
    tags: ['Dairy', 'NABARD', 'Climate', 'CII-FACE', 'Animal Husbandry'],
    image: { url: 'https://img-cdn.krishijagran.com/105954/national-consultation-organised-by-cii-face-and-environmental-denefse-fund.jpeg', alt: 'Dairy Climate Resilience Forum' },
    featured: true,
    publishedAt: new Date('2026-04-01T06:00:00Z'),
    readTime: '5 min read',
    source: 'Krishi Jagran',
    views: 876,
    status: 'published',
  },
  {
    slug: 'croplife-zaid-advisory-2026',
    title: 'After Rabi Hailstorm Losses, CropLife India Issues Critical Zaid Crop Advisory',
    excerpt: 'Hailstorms across Rajasthan, Haryana, UP & MP have damaged standing Rabi crops. With a weak monsoon outlook and El Niño risk, farmers are urged to act fast on summer sowing.',
    content: `CropLife India has released guidance for farmers preparing for the Zaid (summer) cropping season. This advisory arrives as farmers across multiple states face financial losses from unseasonal hailstorms that damaged Rabi crops.

The Union Agriculture Minister has instructed officials to accelerate crop loss assessments. According to Durgesh Chandra, Secretary General of CropLife India: "Every week of delay in sowing compresses the growing period and directly reduces yields."

He emphasizes farmers should select heat-tolerant varieties, irrigate every five to seven days, apply mulch for moisture conservation, and monitor regularly for pests like red spider mites, aphids, and fruit flies.

The advisory covers short-duration summer crops including watermelon, muskmelon, cucumber, bitter gourd, moong dal, and fodder maize cultivated between March and June.

A projected below-normal monsoon at approximately 94% of the long-period average and a 62% probability of El Niño conditions developing by June–August add to the urgency. Chandra also warns against counterfeit crop protection products, urging farmers to purchase exclusively from licensed dealers.`,
    author: { name: 'KJ Staff' },
    category: 'agriculture',
    tags: ['Zaid Crops', 'Hailstorm', 'Monsoon', 'El Niño', 'Crop Advisory', 'CropLife'],
    image: { url: 'https://kjcdn.gumlet.io/media/105933/croplife-india.jpg', alt: 'CropLife India Advisory' },
    featured: true,
    publishedAt: new Date('2026-04-10T06:41:00Z'),
    readTime: '5 min read',
    source: 'Krishi Jagran',
    views: 2105,
    status: 'published',
  },
  {
    slug: 'agrivartan-fpo-dubai-banana-export',
    title: 'Maharashtra FPO Exports 20 Tonnes of Bananas to Dubai — A First for Indapur Farmers',
    excerpt: 'Agrivartan Agro Farmers Producer Company partnered with Pure Planet India to ship export-quality bananas from 100 acres, with plans for 100 more containers this season.',
    content: `Agrivartan Agro Farmers Producer Company Ltd., based in Indapur, Pune district, successfully exported 20 tonnes of bananas to Dubai under the SMART Project.

The FPC partnered with Pure Planet India Pvt. Ltd., while Palladium Consulting India Pvt. Ltd. provided transaction facilitation and technical oversight.

Director Khanderao Yashwant Sonawale said: "Palladium Group has played a key role in enabling banana exports by supporting FPCs with market linkages and guidance."

The FPC cultivated 100 acres of export-quality bananas this season, targeting at least 100 containers for export. The successful export and full payment realization underscore the strengthening of farmer-led agribusiness models in Maharashtra.`,
    author: { name: 'KJ Staff' },
    category: 'export',
    tags: ['FPO', 'Banana Export', 'Maharashtra', 'Dubai', 'SMART Project', 'Palladium'],
    image: { url: 'https://kjcdn.gumlet.io/media/105955/agrivartan-fpo-from-indapur-exports-bananas-to-dubai-1.jpeg', alt: 'Banana Export Dubai' },
    featured: false,
    publishedAt: new Date('2026-04-01T05:04:00Z'),
    readTime: '3 min read',
    source: 'Krishi Jagran',
    views: 543,
    status: 'published',
  },
  {
    slug: 'vst-tillers-expo-2026',
    title: 'VST Tillers Showcases Compact 4WD Tractors for Small Farmers at Krishi Uday Expo',
    excerpt: 'Nearly six decades in farm mechanization, VST displayed affordable power tillers designed specifically for small and marginal farmers, attracting Union Minister Shivraj Singh Chauhan.',
    content: `VST Tillers Tractors displayed its range of affordable 4WD compact tractors and power tillers at the Rashtriya Krishi Uday Expo 2026.

The company, marking nearly six decades in farm mechanization, welcomed Union Minister Shivraj Singh Chauhan to its exhibition stall, emphasizing its commitment to supporting small and marginal farmers through innovative, cost-effective agricultural solutions.

The compact tractors displayed are designed for 1–5 acre holdings where full-size tractors are not economically viable, offering a practical alternative to manual labour. Models range from 11HP to 35HP and are priced between ₹1.5 lakh and ₹4.5 lakh — accessible under PMKSY and state mechanization subsidies.`,
    author: { name: 'KJ Staff' },
    category: 'technology',
    tags: ['Tractor', 'Farm Mechanization', 'VST', 'Small Farmers', 'Power Tiller'],
    image: { url: 'https://kjcdn.gumlet.io/media/105947/vst-power-tiller-shivraj-chauhan-rashtriya-uday-wxpo-2026.jpeg', alt: 'VST Tillers Expo' },
    featured: false,
    publishedAt: new Date('2026-03-28T10:00:00Z'),
    readTime: '3 min read',
    source: 'Krishi Jagran',
    views: 398,
    status: 'published',
  },
  {
    slug: 'tribal-women-rice-enterprise-ghoti',
    title: 'How Tribal Women in Ghoti Turned Rice Processing into a ₹400/Day Enterprise',
    excerpt: 'The SMART-World Bank project introduced mechanized rice processing to tribal women in Nashik, converting seasonal drudgery into stable year-round income and FPC ownership.',
    content: `The SMART Project, backed by the World Bank and implemented by Palladium, has transformed traditional rice processing into a sustainable year-round business for tribal women in Ghoti, Nashik district.

By introducing mechanized equipment and establishing the Women's Power FPC, participants shifted from seasonal manual labor to stable employment earning ₹400 daily.

Previously, women would process rice by hand for 4–5 months per year, earning a fraction of what mechanization now provides. The shift to mechanized processing has improved consistency, reduced physical strain, and enabled the group to take bulk contracts from urban markets.

This initiative demonstrates how targeted infrastructure investment and capacity building can empower women entrepreneurs while strengthening rural livelihoods across Maharashtra.`,
    author: { name: 'KJ Staff' },
    category: 'farmer-stories',
    tags: ['Women Farmers', 'Tribal', 'Rice Processing', 'Maharashtra', 'FPC', 'SMART Project'],
    image: { url: 'https://kjcdn.gumlet.io/media/105946/ghoti-turned-traditional-rice-processing-into-a-year-round-enterprise.jpg', alt: 'Tribal Women Rice Processing' },
    featured: false,
    publishedAt: new Date('2026-03-28T08:00:00Z'),
    readTime: '4 min read',
    source: 'Krishi Jagran',
    views: 712,
    status: 'published',
  },
  {
    slug: 'climate-resilient-agri-icar-rcer',
    title: 'Farmers in Bihar Adopt Raised-Bed Maize and Mushroom Farming to Beat Climate Stress',
    excerpt: 'At ICAR-RCER Patna, scientists and farmers from Gaya & Buxar co-designed village-level climate response groups — showcasing diversification as the frontline defence.',
    content: `A stakeholder meeting focused on climate-resilient agriculture took place at ICAR Research Complex for Eastern Region in Patna, bringing together scientists, project workers, and farmers from Bihar's Gaya and Buxar districts.

Director Dr. Anup Das emphasized that "partial implementation of technologies may not give desired result." He highlighted the importance of developing comprehensive work plans addressing specific issues and creating climate response groups at village levels.

Farmer Shri Ranjit Mahto from Village Amethi demonstrated practical solutions through crop diversification, fruit cultivation, raised-bed maize production, mushroom farming, and crop residue mulching — approaches praised as grassroots examples of climate resilience.

Despite obstacles including irrigation limitations and wildlife threats, participating farmers acknowledged positive impacts from climate-resilient agriculture interventions.`,
    author: { name: 'KJ Staff' },
    category: 'agriculture',
    tags: ['Bihar', 'Climate Resilience', 'ICAR', 'Mushroom Farming', 'Maize', 'RCER'],
    image: { url: 'https://img-cdn.krishijagran.com/105951/whatsapp-image-2026-03-30-at-181903.jpeg', alt: 'Climate Resilient Agriculture Bihar' },
    featured: false,
    publishedAt: new Date('2026-03-30T12:00:00Z'),
    readTime: '4 min read',
    source: 'Krishi Jagran',
    views: 489,
    status: 'published',
  },
  {
    slug: 'dsr-water-saving-fsii',
    title: 'Direct Seeded Rice Can Cut Water Use by 35% and Save ₹14,000/ha — FSII Study',
    excerpt: 'As groundwater depletes and labour costs rise, FSII is pushing for mass adoption of DSR techniques backed by improved heat-tolerant seed varieties.',
    content: `The Federation of Seed Industry of India advocates for Direct Seeded Rice (DSR) adoption to address water scarcity and rising labor expenses.

At a conference in New Delhi, experts highlighted that DSR could lower water consumption by 35 percent and reduce cultivation expenses by ₹14,000 per hectare through innovative seed technologies and improved agricultural practices.

DSR eliminates the transplanting step entirely, reducing both labour requirements and methane emissions from flooded paddies. The technology is particularly relevant in Punjab and Haryana, where groundwater depletion is most severe.

FSII is working with state governments and seed companies to develop DSR-adapted varieties that are also tolerant of dry direct seeding conditions and terminal heat stress.`,
    author: { name: 'KJ Staff' },
    category: 'technology',
    tags: ['DSR', 'Rice', 'Water Saving', 'FSII', 'Seed Technology', 'Groundwater'],
    image: { url: 'https://kjcdn.gumlet.io/media/105930/fsii-dsr-conference.jpeg', alt: 'DSR Conference FSII' },
    featured: false,
    publishedAt: new Date('2026-03-12T09:00:00Z'),
    readTime: '4 min read',
    source: 'Krishi Jagran',
    views: 921,
    status: 'published',
  },
  {
    slug: 'iari-122nd-foundation-day',
    title: "IARI Retains Top Rank in Agriculture for Third Year, Eyes Viksit Bharat 2047 Goals",
    excerpt: "On its 122nd Foundation Day, India's premier agricultural institute unveiled its strategic roadmap around climate-smart crops, digital farming, and farmer-centric innovation.",
    content: `IARI celebrated its 122nd Foundation Day on April 1, 2026, at the Dr. B.P. Pal Auditorium in New Delhi, marking over a century of contributions to agricultural research and India's food security.

The institute retained 1st rank in Agriculture & Allied Sectors (NIRF 2025) for the third consecutive year and entered QS World Rankings 2026 (151–200 band). It also received A+ accreditation (3.64/4.00) from NAEAB (2025–2030).

Dr. Ch. Srinivasa Rao emphasized alignment with "Viksit Bharat 2047," focusing on climate-resilient agriculture, digital technologies, and farmer-centric innovations. Awards were conferred upon scientists, technical staff, and media representatives for outstanding contributions during 2025–26.`,
    author: { name: 'KJ Staff' },
    category: 'agriculture',
    tags: ['IARI', 'ICAR', 'NIRF Ranking', 'Research', 'Viksit Bharat'],
    image: { url: 'https://img-cdn.krishijagran.com/105957/whatsapp-image-2026-04-01-at-182801.jpeg', alt: 'IARI Foundation Day' },
    featured: false,
    publishedAt: new Date('2026-04-01T16:00:00Z'),
    readTime: '3 min read',
    source: 'Krishi Jagran',
    views: 632,
    status: 'published',
  },
  {
    slug: 'mission-2047-organic-india',
    title: 'MIONP 2026: Make India Organic, Natural & Profitable by 2047',
    excerpt: "India's Mission 2047 initiative aims to make agricultural growth resource-efficient and climate-resilient, aligning science, policy, and market forces.",
    content: `India's agricultural sector is transitioning toward sustainability as the country advances toward its 2047 vision. The initiative emphasizes that growth should be resource-efficient, climate-resilient, and economically viable for farmers rather than focusing solely on production increases.

Success requires alignment of scientific validation, supportive policies, and market-driven industry engagement to ensure farmers benefit economically from sustainable practices.

The initiative targets converting 25% of India's gross cropped area to organic and natural farming by 2030, supported by a national network of soil testing laboratories and organic input supply chains. Premium market linkages are being established through ONDC and export promotion agencies.`,
    author: { name: 'KJ Staff' },
    category: 'policy',
    tags: ['Organic Farming', 'Mission 2047', 'Natural Farming', 'Sustainability', 'ONDC'],
    image: { url: 'https://kjcdn.gumlet.io/media/105938/whatsapp-image-2026-03-23-at-173510.jpeg', alt: 'Make India Organic 2047' },
    featured: false,
    publishedAt: new Date('2026-03-23T14:00:00Z'),
    readTime: '4 min read',
    source: 'Krishi Jagran',
    views: 745,
    status: 'published',
  },
  {
    slug: 'samarth-2026-agri-incubators',
    title: 'SAMARTH 2026: 31 Agri-Incubators Gather at ICAR-IARI to Supercharge Farm Startups',
    excerpt: "The RKVY-RAFTAAR initiative brought together incubators from across India for two days of knowledge exchange focused on strengthening India's agri-startup ecosystem.",
    content: `Pusa Krishi at ICAR-IARI hosted the SAMARTH 2026 workshop on March 19–20, bringing together 31 agricultural incubators from across India under the RKVY-RAFTAAR initiative.

The event featured leadership discussions, knowledge exchange sessions, and peer learning opportunities focused on strengthening the agri-startup ecosystem and fostering farmer-centric innovation solutions.

More than 150 startups currently operate under these incubators, spanning precision farming, supply chain technology, and rural fintech. The workshop highlighted success stories from five startups that have scaled to 1 lakh+ farmer users, and identified common bottlenecks around rural internet connectivity, last-mile distribution, and farmer credit access.`,
    author: { name: 'KJ Staff' },
    category: 'technology',
    tags: ['Agri Startups', 'RKVY-RAFTAAR', 'ICAR', 'Incubators', 'Agritech'],
    image: { url: 'https://kjcdn.gumlet.io/media/105934/pusa-krishi-samarth-2026.jpeg', alt: 'SAMARTH 2026 Agri Incubators' },
    featured: false,
    publishedAt: new Date('2026-03-23T10:00:00Z'),
    readTime: '3 min read',
    source: 'Krishi Jagran',
    views: 418,
    status: 'published',
  },
  {
    slug: 'supply-chain-counterfeit-alarm',
    title: 'War in West Asia May Push Pesticide Prices Up 25% and Flood Market With Fakes',
    excerpt: 'CropLife India warns geopolitical disruption to chemical supply chains creates dangerous conditions for counterfeit crop protection products.',
    content: `CropLife India has warned that the West Asia conflict may increase pesticide costs by 20–25% and disrupt supply chains during critical agricultural seasons.

The organization also notes risks of counterfeit products emerging due to supply gaps, potentially affecting farmer yields and MSME employment. CropLife advises farmers to purchase exclusively from licensed dealers and verify product authenticity through QR codes on packaging.

The organisation estimates that counterfeit pesticides already cost Indian farmers over ₹6,000 crore annually in crop losses from ineffective treatment. During supply disruptions, the risk rises further as unscrupulous traders fill gaps with substandard imports.`,
    author: { name: 'KJ Staff' },
    category: 'market',
    tags: ['Pesticide', 'Supply Chain', 'Counterfeit', 'CropLife India', 'Input Costs'],
    image: { url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=500&fit=crop', alt: 'Pesticide Supply Chain Alert' },
    featured: false,
    publishedAt: new Date('2026-03-20T11:00:00Z'),
    readTime: '4 min read',
    source: 'Krishi Jagran',
    views: 834,
    status: 'published',
  },
  {
    slug: 'women-agrifood-conference-delhi',
    title: 'President Murmu Opens Global Conference on Women in Agri-Food Systems in New Delhi',
    excerpt: "700+ scientists, policymakers, and farmers from around the world gathered for three days to advance gender inclusion across the entire food chain.",
    content: `New Delhi hosted a three-day Global Conference on Women in Agri-Food Systems from March 12–14, 2026, inaugurated by President Droupadi Murmu.

The event aimed to "bring global leaders together to advance women's empowerment and gender inclusion in agriculture," with over 700 participants including scientists, policymakers, and farmers from more than 60 countries.

Sessions covered land rights, access to credit, digital literacy, and value chain integration for women-led farming enterprises. Key outcomes included a New Delhi Declaration committing signatory governments to gender-disaggregated agricultural data and equal access to extension services.`,
    author: { name: 'KJ Staff' },
    category: 'farmer-stories',
    tags: ['Women Farmers', 'Gender', 'Agri-Food', 'Delhi', 'Policy', 'President Murmu'],
    image: { url: 'https://kjcdn.gumlet.io/media/105928/global-conference-on-women-in-agri-food-systems-gcwas-2026.jpg', alt: 'GCWAS 2026' },
    featured: false,
    publishedAt: new Date('2026-03-11T08:00:00Z'),
    readTime: '4 min read',
    source: 'Krishi Jagran',
    views: 967,
    status: 'published',
  },
  {
    slug: 'kirloskar-100-years-pump-tn',
    title: 'Kirloskar Inaugurates Renewable-Powered Factory in Tamil Nadu, Marking 100 Years of Pump Innovation',
    excerpt: "The new facility generates 80% of its electricity from renewables and will produce 14,000+ agriculture and petroleum pumps.",
    content: `Kirloskar Brothers Limited has inaugurated a new sustainable manufacturing facility in Tamil Nadu's Kaniyur location, coinciding with the company's centennial milestone since producing India's first centrifugal pump in 1926.

The facility generates 80% of its electricity requirements through renewable energy, achieving significant emissions reductions. The expansion supports KBL's recent large order for 14,000 petroleum application pumps.

For agriculture, KBL's solar pump range is eligible under the PM-KUSUM scheme, helping farmers replace diesel pumps with solar-powered irrigation at subsidised cost. The Kaniyur facility will produce 2,000 solar agricultural pumps per month once at full capacity.`,
    author: { name: 'KJ Staff' },
    category: 'technology',
    tags: ['Pump', 'Irrigation', 'Manufacturing', 'Tamil Nadu', 'Renewable Energy', 'PM-KUSUM'],
    image: { url: 'https://kjcdn.gumlet.io/media/105900/kirloskar.jpg', alt: 'Kirloskar Factory Tamil Nadu' },
    featured: false,
    publishedAt: new Date('2026-02-12T10:00:00Z'),
    readTime: '3 min read',
    source: 'Krishi Jagran',
    views: 289,
    status: 'published',
  },
  {
    slug: 'pm-kisan-18th-installment-2026',
    title: 'PM-KISAN 18th Installment Released — ₹2,000 Credited to 9.4 Crore Farmers',
    excerpt: 'Over ₹18,800 crore transferred directly to verified beneficiary accounts. Farmers who missed e-KYC must act before the next cycle.',
    content: `The 18th installment of the PM-KISAN scheme has been transferred to 9.4 crore farmers, with ₹2,000 per farmer deposited directly into bank accounts via Direct Benefit Transfer.

The Ministry of Agriculture has urged all beneficiaries to complete e-KYC verification through the PM-KISAN portal or Common Service Centres to remain eligible for future installments.

State-wise, Uttar Pradesh received the highest disbursement at ₹3,800 crore, followed by Maharashtra and Rajasthan. Farmers enrolled under PM-KISAN also receive ancillary benefits including access to Kisan Credit Cards at 4% interest for crop and animal husbandry loans.`,
    author: { name: 'KisaanMela Desk' },
    category: 'policy',
    tags: ['PM-KISAN', 'DBT', 'Government Scheme', 'e-KYC', 'Farmer Income'],
    image: { url: 'https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?w=800&h=500&fit=crop', alt: 'PM-KISAN Installment' },
    featured: false,
    publishedAt: new Date('2026-04-05T10:30:00Z'),
    readTime: '3 min read',
    source: 'KisaanMela Desk',
    views: 3421,
    status: 'published',
  },
  {
    slug: 'wheat-msp-procurement-2026',
    title: 'Wheat MSP Procurement Hits Record 33 Million Tonnes — Punjab Tops Chart',
    excerpt: 'Government agencies procured record wheat at ₹2,275/quintal MSP this Rabi season, providing guaranteed income to over 8 lakh registered farmers.',
    content: `Central and state government procurement agencies have purchased a record 33 million tonnes of wheat at the Minimum Support Price of ₹2,275 per quintal in the 2025–26 Rabi marketing season.

Punjab contributed the largest share at 12.5 MMT, followed by Haryana at 8.2 MMT and Madhya Pradesh at 7.6 MMT.

Over 8 lakh farmers received direct payment into their bank accounts within 72 hours of delivery at designated mandis. The bumper procurement comes despite unseasonal hailstorms in some districts, thanks to early variety adoption and crop diversification. FCI has indicated that buffer stocks are now above the minimum norms for June–September.`,
    author: { name: 'KisaanMela Market Team' },
    category: 'market',
    tags: ['Wheat', 'MSP', 'Procurement', 'Punjab', 'Rabi Season', 'FCI'],
    image: { url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=500&fit=crop', alt: 'Wheat MSP Procurement' },
    featured: false,
    publishedAt: new Date('2026-04-08T09:00:00Z'),
    readTime: '4 min read',
    source: 'KisaanMela Market Team',
    views: 2187,
    status: 'published',
  },
  {
    slug: 'ai-crop-disease-detection-startup',
    title: "Bengaluru Startup's AI App Detects Crop Disease in 5 Seconds — Used by 2 Lakh Farmers",
    excerpt: 'CropScan uses deep learning on smartphone photos to identify 50+ crop diseases with 94% accuracy, integrating with KCC for instant agri-extension advice in 12 languages.',
    content: `A Bengaluru-based agricultural technology startup has developed an AI-powered mobile application that can detect over 50 crop diseases from a smartphone photograph in under five seconds.

CropScan uses deep learning models trained on 2 million labelled field images to achieve 94% detection accuracy. The app provides instant remediation advice in 12 Indian languages and integrates with Kisan Call Centre for follow-up consultation.

Currently deployed with over 2 lakh farmers across Karnataka, Telangana, and Andhra Pradesh, the startup raised ₹45 crore Series A funding led by an agri-focused venture fund. Farmers can use the app entirely offline in low-connectivity areas, with sync occurring automatically when internet access is available.`,
    author: { name: 'KisaanMela Tech Team' },
    category: 'technology',
    tags: ['AI', 'Crop Disease', 'Startup', 'App', 'Precision Farming', 'Bengaluru'],
    image: { url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=500&fit=crop', alt: 'AI Crop Disease App' },
    featured: false,
    publishedAt: new Date('2026-04-03T11:00:00Z'),
    readTime: '5 min read',
    source: 'KisaanMela Tech Team',
    views: 1876,
    status: 'published',
  },
  {
    slug: 'rajesh-organic-farm-success-punjab',
    title: "5 Acres to ₹18 Lakh/Year: How Rajesh Kumar Built Punjab's Most-Visited Organic Farm",
    excerpt: "After struggling with debt on conventional cotton, a Ludhiana farmer switched to certified organic vegetables, built a direct-to-consumer model, and now earns 3× what his neighbours make.",
    content: `Rajesh Kumar, a farmer from Ludhiana, Punjab, shares his journey from traditional cotton farming to becoming a successful organic vegetable farmer.

After three consecutive years of crop failure and mounting debt from pesticide inputs, he enrolled in a state government organic farming training programme in 2021. By 2023, his 5-acre farm was certified organic under the Participatory Guarantee System.

Today he supplies 12 hotels and 200 households directly, earning ₹18 lakh annually — three times his previous income. He has trained 47 neighbouring farmers in the process and runs weekly farm visits for urban consumers, creating an agri-tourism revenue stream that adds ₹2 lakh per year.`,
    author: { name: 'KisaanMela Desk' },
    category: 'farmer-stories',
    tags: ['Organic Farming', 'Punjab', 'Success Story', 'Vegetables', 'Direct Marketing', 'Agri-Tourism'],
    image: { url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&h=500&fit=crop', alt: 'Organic Farm Punjab' },
    featured: false,
    publishedAt: new Date('2026-03-25T10:00:00Z'),
    readTime: '6 min read',
    source: 'KisaanMela Desk',
    views: 2934,
    status: 'published',
  },
  {
    slug: 'murrah-buffalo-price-spike-2026',
    title: 'Murrah Buffalo Prices Surge 22% — Haryana Breeders Struggle to Meet Demand',
    excerpt: 'Strong demand from Maharashtra, Tamil Nadu, and export markets has pushed top-grade Murrah prices to ₹1.2 lakh.',
    content: `Prices for premium Murrah buffaloes have risen 22% over the past three months, driven by surging demand from dairy farms in Maharashtra and Tamil Nadu seeking high-yield animals.

Top-grade Murrah cows producing 14+ litres per day now fetch ₹1 lakh to ₹1.2 lakh in Haryana mandis. Breeders at Hisar and Rohtak cattle fairs report buyer queues extending to three days.

Digital livestock marketplaces have seen enquiry volumes double, with buyers from outside their traditional catchment area accessing listings for the first time via mobile apps. Sellers are increasingly requesting WhatsApp video calls before committing to travel, changing the dynamics of livestock trading.`,
    author: { name: 'KisaanMela Livestock Team' },
    category: 'livestock',
    tags: ['Murrah', 'Buffalo', 'Livestock Market', 'Haryana', 'Dairy Prices'],
    image: { url: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800&h=500&fit=crop', alt: 'Murrah Buffalo Market' },
    featured: false,
    publishedAt: new Date('2026-04-06T08:00:00Z'),
    readTime: '4 min read',
    source: 'KisaanMela Livestock Team',
    views: 1543,
    status: 'published',
  },
  {
    slug: 'drip-irrigation-subsidy-expansion',
    title: '18 New States Added to Drip Irrigation Subsidy Scheme — Up to 90% Coverage for SC/ST',
    excerpt: 'The expanded PMKSY Micro Irrigation Fund now offers 55% subsidy for general farmers and 90% for SC/ST farmers, with an ₹8,000 crore corpus.',
    content: `The central government has expanded the Pradhan Mantri Krishi Sinchayee Yojana Micro Irrigation Fund to include 18 additional states, bringing the total to all 28 states.

The scheme offers 55% capital cost subsidy for general category farmers and up to 90% for SC/ST beneficiaries adopting drip or sprinkler irrigation. With a corpus of ₹8,000 crore managed through NABARD, the fund aims to bring 30 lakh additional hectares under efficient irrigation by 2027.

Eligible crops include horticulture, vegetables, oilseeds, sugarcane, and cotton. Applications are available through state agriculture departments and online on the PMKSY portal. NABARD has also launched a low-interest loan product to finance the farmer's share of the capital cost.`,
    author: { name: 'KisaanMela Desk' },
    category: 'policy',
    tags: ['Drip Irrigation', 'PMKSY', 'Subsidy', 'Water Saving', 'NABARD', 'SC/ST'],
    image: { url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=500&fit=crop', alt: 'Drip Irrigation Scheme' },
    featured: false,
    publishedAt: new Date('2026-03-18T09:00:00Z'),
    readTime: '4 min read',
    source: 'KisaanMela Desk',
    views: 1278,
    status: 'published',
  },
  {
    slug: 'basmati-export-record-2026',
    title: 'Basmati Rice Exports Cross ₹50,000 Crore — Saudi Arabia, Iran Lead Import Surge',
    excerpt: "India's aromatic rice exports hit a new record in 2025–26, with premium 1121 variety dominating volumes and GI-tagged origin verification becoming key.",
    content: `India's basmati rice exports have crossed ₹50,000 crore for the first time in 2025–26, driven by strong demand from Saudi Arabia, Iran, UAE, and EU markets.

The 1121 Basmati variety accounted for 62% of export volumes. APEDA reports that GI tag verification and residue testing are becoming critical for market access, with importers increasingly demanding certified supply chains.

Punjab, Haryana, Uttarakhand, and UP together account for 95% of export-quality basmati production. The record export year follows a bumper crop season and favourable exchange rates that made Indian basmati competitive against Pakistani varieties.`,
    author: { name: 'KisaanMela Market Team' },
    category: 'export',
    tags: ['Basmati', 'Export', 'Saudi Arabia', 'APEDA', 'GI Tag', 'Rice'],
    image: { url: 'https://images.unsplash.com/photo-1536304993881-ff86e0c9cc95?w=800&h=500&fit=crop', alt: 'Basmati Rice Export' },
    featured: false,
    publishedAt: new Date('2026-03-15T10:00:00Z'),
    readTime: '4 min read',
    source: 'KisaanMela Market Team',
    views: 889,
    status: 'published',
  },
  {
    slug: 'smart-irrigation-iot-farmers',
    title: 'IoT Soil Sensors Help Vidarbha Cotton Farmers Save 40% Water and Boost Yields',
    excerpt: 'A Maharashtra pilot connecting 500 cotton farms to soil moisture sensors and automated pump controllers has reduced irrigation costs by ₹8,000/acre while lifting yields 18%.',
    content: `A pilot programme in Vidarbha, Maharashtra has equipped 500 cotton farms with IoT-based soil moisture sensors connected to automated pump controllers.

Farmers receive soil moisture readings on a basic SMS-based dashboard and the system automatically triggers irrigation only when required. Results after one full season show 40% reduction in water usage, 18% improvement in cotton yield per acre, and ₹8,000 savings in electricity and water costs per acre.

The programme is backed by NABARD and delivered by a consortium of agritech firms and a state agricultural university. The technology is now being adapted for turmeric and soybean cultivation in the same region.`,
    author: { name: 'KisaanMela Tech Team' },
    category: 'technology',
    tags: ['IoT', 'Smart Irrigation', 'Cotton', 'Vidarbha', 'Water Management', 'NABARD'],
    image: { url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=500&fit=crop', alt: 'IoT Irrigation Vidarbha' },
    featured: false,
    publishedAt: new Date('2026-03-10T11:00:00Z'),
    readTime: '5 min read',
    source: 'KisaanMela Tech Team',
    views: 1102,
    status: 'published',
  },
];

async function seedNews() {
  try {
    console.log('Connecting to MongoDB…');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected:', MONGODB_URI.replace(/\/\/.*@/, '//***@'));

    const NewsUpdate =
      mongoose.models.NewsUpdate ||
      mongoose.model('NewsUpdate', NewsUpdateSchema);

    console.log('Clearing existing news articles…');
    const deleted = await NewsUpdate.deleteMany({});
    console.log(`Deleted ${deleted.deletedCount} old articles`);

    console.log('Inserting news articles…');
    const result = await NewsUpdate.insertMany(newsArticles, { ordered: false });
    console.log(`\n✅ Inserted ${result.length} news articles:`);
    result.forEach((a, i) => {
      console.log(`  ${i + 1}. [${a.category}] ${a.title.substring(0, 70)}…`);
    });

    await mongoose.disconnect();
    console.log('\nDone.');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seedNews();
