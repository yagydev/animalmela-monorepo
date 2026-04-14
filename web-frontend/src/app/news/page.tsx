'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  category: 'farmer-stories' | 'innovation' | 'market-updates' | 'government' | 'technology' | 'livestock' | 'export';
  image: string;
  readTime: string;
  featured: boolean;
  tags: string[];
  source?: string;
}

const CATEGORIES = [
  { id: 'all', name: 'All News', emoji: '📰' },
  { id: 'government', name: 'Govt Schemes', emoji: '🏛️' },
  { id: 'market-updates', name: 'Market Updates', emoji: '📈' },
  { id: 'innovation', name: 'Innovation', emoji: '💡' },
  { id: 'technology', name: 'Technology', emoji: '🤖' },
  { id: 'farmer-stories', name: 'Farmer Stories', emoji: '👨‍🌾' },
  { id: 'livestock', name: 'Livestock', emoji: '🐄' },
  { id: 'export', name: 'Agri Exports', emoji: '🌍' },
];

const newsArticles: NewsArticle[] = [
  // ── FEATURED ──────────────────────────────────────────
  {
    id: 'national-agri-fair-2026',
    title: 'National Agriculture Fair Brings All Govt Schemes Under One Roof for Farmers',
    excerpt:
      'The three-day "Krishi Mahakumbh" in Madhya Pradesh lets farmers access crop insurance, Kisan Credit Cards, seed subsidies, and organic certification — all in one place.',
    content: `The National Agriculture Fair took place in Raisen, Madhya Pradesh from April 11–13, 2026. Union Minister Shivraj Singh Chouhan described it as a "Krishi Mahakumbh" where farmers access comprehensive information on crop insurance, credit, seeds, fertilizers, and organic certification. The fair featured insurance companies offering Pradhan Mantri Fasal Bima Yojana (PMFBY) policies on-site, with workshops addressing premium sharing, claim procedures, reporting of crop losses, and settlement processes. Banks provided guidance on Kisan Credit Cards, term loans, and the Agricultural Infrastructure Fund for warehouses, cold storage, and processing facilities. Government and private seed companies showcased improved varieties, while fertilizer providers emphasized lower cost, higher production and healthier soil through bio-fertilizers and balanced nutrient management. The fair also promoted natural farming and FPO-based direct marketing connections without intermediaries.`,
    author: 'KJ Staff',
    publishedAt: '2026-04-10T09:15:00Z',
    category: 'government',
    image: 'https://kjcdn.gumlet.io/media/105972/hfwa-gra8aecyhb5rtr.jpg',
    readTime: '4 min read',
    featured: true,
    tags: ['PMFBY', 'Kisan Credit Card', 'Madhya Pradesh', 'Shivraj Singh'],
    source: 'Krishi Jagran',
  },
  {
    id: 'dairy-climate-resilience-2026',
    title: 'Climate Resilience is No Longer Optional for India\'s Dairy Sector, Say Experts',
    excerpt:
      'Industry leaders, NABARD chairman, and government officials converged in New Delhi to align on policy, finance, and market integration for a climate-ready dairy value chain.',
    content: `India's dairy leaders convened in New Delhi for a national consultation on creating a climate-resilient dairy ecosystem. The event, organized by CII-FACE and Environmental Defense Fund, brought together government officials, industry representatives, and financial institutions to address mounting challenges in the sector. Varsha Joshi (Additional Secretary, Department of Animal Husbandry) said: "The real opportunity lies in integrating the dairy value chain end-to-end—where even by-products like dung are monetised." NABARD Chairman Shaji K V stated: "Climate resilience is no longer optional, but essential." The consultation examined policy frameworks, innovative financing mechanisms, and institutional coordination to accelerate adoption of climate-resilient practices.`,
    author: 'KJ Staff',
    publishedAt: '2026-04-01T06:00:00Z',
    category: 'livestock',
    image: 'https://img-cdn.krishijagran.com/105954/national-consultation-organised-by-cii-face-and-environmental-denefse-fund.jpeg',
    readTime: '5 min read',
    featured: true,
    tags: ['Dairy', 'NABARD', 'Climate', 'CII-FACE'],
    source: 'Krishi Jagran',
  },
  {
    id: 'croplife-zaid-advisory-2026',
    title: 'After Rabi Hailstorm Losses, CropLife India Issues Critical Zaid Crop Advisory',
    excerpt:
      'Hailstorms across Rajasthan, Haryana, UP & MP have damaged standing Rabi crops. With a weak monsoon outlook and El Niño risk, farmers are urged to act fast on summer sowing.',
    content: `CropLife India has released guidance for farmers preparing for the Zaid (summer) cropping season. This advisory arrives as farmers across multiple states face financial losses from unseasonal hailstorms that damaged Rabi crops. The Union Agriculture Minister has instructed officials to accelerate crop loss assessments. According to Durgesh Chandra, Secretary General of CropLife India: "Every week of delay in sowing compresses the growing period and directly reduces yields." He emphasizes farmers should select heat-tolerant varieties, irrigate every five to seven days, apply mulch for moisture conservation, and monitor regularly for pests. The advisory covers short-duration summer crops including watermelon, muskmelon, cucumber, bitter gourd, moong dal, and fodder maize cultivated between March and June. A projected below-normal monsoon at approximately 94% of the long-period average and a 62% probability of El Niño conditions developing by June–August add to the urgency.`,
    author: 'KJ Staff',
    publishedAt: '2026-04-10T06:41:00Z',
    category: 'market-updates',
    image: 'https://kjcdn.gumlet.io/media/105933/croplife-india.jpg',
    readTime: '5 min read',
    featured: true,
    tags: ['Zaid Crops', 'Hailstorm', 'Monsoon', 'El Niño', 'Crop Advisory'],
    source: 'Krishi Jagran',
  },

  // ── MAIN GRID ─────────────────────────────────────────
  {
    id: 'agrivartan-fpo-dubai-banana-export',
    title: 'Maharashtra FPO Exports 20 Tonnes of Bananas to Dubai — A First for Indapur Farmers',
    excerpt:
      'Agrivartan Agro Farmers Producer Company partnered with Pure Planet India to ship export-quality bananas from 100 acres, with plans for 100 more containers this season.',
    content: `Agrivartan Agro Farmers Producer Company Ltd., based in Indapur, Pune district, successfully exported 20 tonnes of bananas to Dubai. Operating under the SMART Project, the FPC partnered with Pure Planet India Pvt. Ltd., while Palladium Consulting India Pvt. Ltd. provided transaction facilitation and technical oversight. Director Khanderao Yashwant Sonawale said: "Palladium Group has played a key role in enabling banana exports by supporting FPCs with market linkages and guidance." The FPC cultivated 100 acres of export-quality bananas this season, targeting at least 100 containers for export.`,
    author: 'KJ Staff',
    publishedAt: '2026-04-01T05:04:00Z',
    category: 'export',
    image: 'https://kjcdn.gumlet.io/media/105955/agrivartan-fpo-from-indapur-exports-bananas-to-dubai-1.jpeg',
    readTime: '3 min read',
    featured: false,
    tags: ['FPO', 'Banana Export', 'Maharashtra', 'Dubai', 'SMART Project'],
    source: 'Krishi Jagran',
  },
  {
    id: 'vst-tillers-expo-2026',
    title: 'VST Tillers Showcases Compact 4WD Tractors for Small Farmers at Krishi Uday Expo',
    excerpt:
      'Nearly six decades in farm mechanization, VST displayed affordable power tillers designed specifically for small and marginal farmers, attracting Union Minister Shivraj Singh Chauhan.',
    content: `VST Tillers Tractors displayed its range of affordable 4WD compact tractors and power tillers at the Rashtriya Krishi Uday Expo 2026. The company, marking nearly six decades in farm mechanization, welcomed Union Minister Shivraj Singh Chauhan to its exhibition stall, emphasizing its commitment to supporting small and marginal farmers through innovative, cost-effective agricultural solutions. The compact tractors displayed are designed for 1–5 acre holdings where full-size tractors are not economically viable, offering a practical alternative to manual labour.`,
    author: 'KJ Staff',
    publishedAt: '2026-03-28T10:00:00Z',
    category: 'technology',
    image: 'https://kjcdn.gumlet.io/media/105947/vst-power-tiller-shivraj-chauhan-rashtriya-uday-wxpo-2026.jpeg',
    readTime: '3 min read',
    featured: false,
    tags: ['Tractor', 'Farm Mechanization', 'VST', 'Small Farmers'],
    source: 'Krishi Jagran',
  },
  {
    id: 'tribal-women-rice-enterprise-ghoti',
    title: 'How Tribal Women in Ghoti Turned Rice Processing into a ₹400/Day Enterprise',
    excerpt:
      'The SMART-World Bank project introduced mechanized rice processing to tribal women in Nashik, converting seasonal drudgery into stable year-round income and FPC ownership.',
    content: `The SMART Project, backed by the World Bank and implemented by Palladium, has transformed traditional rice processing into a sustainable year-round business for tribal women in Ghoti, Nashik district. By introducing mechanized equipment and establishing the Women's Power FPC, participants shifted from seasonal manual labor to stable employment earning ₹400 daily. This initiative demonstrates how targeted infrastructure investment and capacity building can empower women entrepreneurs while strengthening rural livelihoods across Maharashtra.`,
    author: 'KJ Staff',
    publishedAt: '2026-03-28T08:00:00Z',
    category: 'farmer-stories',
    image: 'https://kjcdn.gumlet.io/media/105946/ghoti-turned-traditional-rice-processing-into-a-year-round-enterprise.jpg',
    readTime: '4 min read',
    featured: false,
    tags: ['Women Farmers', 'Tribal', 'Rice Processing', 'Maharashtra', 'FPC'],
    source: 'Krishi Jagran',
  },
  {
    id: 'climate-resilient-agri-icar-rcer',
    title: 'Farmers in Bihar Adopt Raised-Bed Maize and Mushroom Farming to Beat Climate Stress',
    excerpt:
      'At ICAR-RCER Patna, scientists and farmers from Gaya & Buxar co-designed village-level climate response groups — showcasing diversification as the frontline defence.',
    content: `A stakeholder meeting focused on climate-resilient agriculture took place at ICAR Research Complex for Eastern Region in Patna, bringing together scientists, project workers, and farmers from Bihar's Gaya and Buxar districts. Director Dr. Anup Das emphasized that "partial implementation of technologies may not give desired result." He highlighted the importance of developing comprehensive work plans addressing specific issues and creating climate response groups at village levels. Farmer Shri Ranjit Mahto from Village Amethi demonstrated practical solutions through crop diversification, fruit cultivation, raised-bed maize production, mushroom farming, and crop residue mulching—approaches praised as grassroots examples of climate resilience.`,
    author: 'KJ Staff',
    publishedAt: '2026-03-30T12:00:00Z',
    category: 'innovation',
    image: 'https://img-cdn.krishijagran.com/105951/whatsapp-image-2026-03-30-at-181903.jpeg',
    readTime: '4 min read',
    featured: false,
    tags: ['Bihar', 'Climate Resilience', 'ICAR', 'Mushroom Farming', 'Maize'],
    source: 'Krishi Jagran',
  },
  {
    id: 'dsr-water-saving-fsii',
    title: 'Direct Seeded Rice Can Cut Water Use by 35% and Save ₹14,000/ha — FSII Study',
    excerpt:
      'As groundwater depletes and labour costs rise, the Federation of Seed Industry of India is pushing for mass adoption of DSR techniques backed by improved heat-tolerant seed varieties.',
    content: `The Federation of Seed Industry of India advocates for Direct Seeded Rice (DSR) adoption to address water scarcity and rising labor expenses. At a conference in New Delhi, experts highlighted that DSR could lower water consumption by 35 percent and reduce cultivation expenses by ₹14,000 per hectare through innovative seed technologies and improved agricultural practices. DSR eliminates the transplanting step entirely, reducing both labour requirements and methane emissions from flooded paddies.`,
    author: 'KJ Staff',
    publishedAt: '2026-03-12T09:00:00Z',
    category: 'innovation',
    image: 'https://kjcdn.gumlet.io/media/105930/fsii-dsr-conference.jpeg',
    readTime: '4 min read',
    featured: false,
    tags: ['DSR', 'Rice', 'Water Saving', 'FSII', 'Seed Technology'],
    source: 'Krishi Jagran',
  },
  {
    id: 'iari-122nd-foundation-day',
    title: 'IARI Retains Top Rank in Agriculture for Third Year, Eyes Viksit Bharat 2047 Goals',
    excerpt:
      'On its 122nd Foundation Day, India\'s premier agricultural institute unveiled its strategic roadmap around climate-smart crops, digital farming, and farmer-centric innovation.',
    content: `IARI celebrated its 122nd Foundation Day on April 1, 2026, at the Dr. B.P. Pal Auditorium in New Delhi, marking over a century of contributions to agricultural research and India's food security. The institute retained 1st rank in Agriculture & Allied Sectors (NIRF 2025) for the third consecutive year and entered QS World Rankings 2026 (151–200 band). Dr. Ch. Srinivasa Rao emphasized alignment with "Viksit Bharat 2047," focusing on climate-resilient agriculture, digital technologies, and farmer-centric innovations.`,
    author: 'KJ Staff',
    publishedAt: '2026-04-01T16:00:00Z',
    category: 'government',
    image: 'https://img-cdn.krishijagran.com/105957/whatsapp-image-2026-04-01-at-182801.jpeg',
    readTime: '3 min read',
    featured: false,
    tags: ['IARI', 'ICAR', 'NIRF Ranking', 'Research', 'Viksit Bharat'],
    source: 'Krishi Jagran',
  },
  {
    id: 'mission-2047-organic-india',
    title: 'MIONP 2026: Make India Organic, Natural & Profitable by 2047',
    excerpt:
      'India\'s Mission 2047 initiative aims to make agricultural growth resource-efficient and climate-resilient, requiring alignment of science, policy, and market forces to deliver economic benefits to farmers.',
    content: `India's agricultural sector is transitioning toward sustainability as the country advances toward its 2047 vision. The initiative emphasizes that growth should be resource-efficient, climate-resilient, and economically viable for farmers rather than focusing solely on production increases. Success requires alignment of scientific validation, supportive policies, and market-driven industry engagement to ensure farmers benefit economically from sustainable practices. The initiative targets converting 25% of India's gross cropped area to organic and natural farming by 2030.`,
    author: 'KJ Staff',
    publishedAt: '2026-03-23T14:00:00Z',
    category: 'government',
    image: 'https://kjcdn.gumlet.io/media/105938/whatsapp-image-2026-03-23-at-173510.jpeg',
    readTime: '4 min read',
    featured: false,
    tags: ['Organic Farming', 'Mission 2047', 'Natural Farming', 'Sustainability'],
    source: 'Krishi Jagran',
  },
  {
    id: 'samarth-2026-agri-incubators',
    title: 'SAMARTH 2026: 31 Agri-Incubators Gather at ICAR-IARI to Supercharge Farm Startups',
    excerpt:
      'The RKVY-RAFTAAR initiative brought together incubators from across India for two days of knowledge exchange, peer learning, and strategic planning to strengthen India\'s agri-startup ecosystem.',
    content: `Pusa Krishi at ICAR-IARI hosted the SAMARTH 2026 workshop on March 19–20, bringing together 31 agricultural incubators from across India under the RKVY-RAFTAAR initiative. The event featured leadership discussions, knowledge exchange sessions, and peer learning opportunities focused on strengthening the agri-startup ecosystem and fostering farmer-centric innovation solutions. More than 150 startups currently operate under these incubators, spanning precision farming, supply chain technology, and rural fintech.`,
    author: 'KJ Staff',
    publishedAt: '2026-03-23T10:00:00Z',
    category: 'innovation',
    image: 'https://kjcdn.gumlet.io/media/105934/pusa-krishi-samarth-2026.jpeg',
    readTime: '3 min read',
    featured: false,
    tags: ['Agri Startups', 'RKVY-RAFTAAR', 'ICAR', 'Incubators'],
    source: 'Krishi Jagran',
  },
  {
    id: 'supply-chain-counterfeit-alarm',
    title: 'War in West Asia May Push Pesticide Prices Up 25% and Flood Market With Fakes',
    excerpt:
      'CropLife India warns that geopolitical disruption to chemical supply chains creates dangerous conditions for counterfeit crop protection products — urging farmers to buy only from licensed dealers.',
    content: `CropLife India has warned that the West Asia conflict may increase pesticide costs by 20–25% and disrupt supply chains during critical agricultural seasons. The organization also notes risks of counterfeit products emerging due to supply gaps, potentially affecting farmer yields and MSME employment. CropLife advises farmers to purchase exclusively from licensed dealers and verify product authenticity through QR codes on packaging. The organisation estimates that counterfeit pesticides already cost Indian farmers over ₹6,000 crore annually in crop losses.`,
    author: 'KJ Staff',
    publishedAt: '2026-03-20T11:00:00Z',
    category: 'market-updates',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=500&fit=crop',
    readTime: '4 min read',
    featured: false,
    tags: ['Pesticide', 'Supply Chain', 'Counterfeit', 'CropLife India'],
    source: 'Krishi Jagran',
  },
  {
    id: 'women-agrifood-conference-delhi',
    title: 'President Murmu Opens Global Conference on Women in Agri-Food Systems in New Delhi',
    excerpt:
      '700+ scientists, policymakers, and farmers from around the world gathered for three days to advance gender inclusion and women\'s leadership across the entire food chain.',
    content: `New Delhi hosted a three-day Global Conference on Women in Agri-Food Systems from March 12–14, 2026, inaugurated by President Droupadi Murmu. The event aimed to "bring global leaders together to advance women's empowerment and gender inclusion in agriculture," with over 700 participants including scientists, policymakers, and farmers. Sessions covered land rights, access to credit, digital literacy, and value chain integration for women-led farming enterprises.`,
    author: 'KJ Staff',
    publishedAt: '2026-03-11T08:00:00Z',
    category: 'farmer-stories',
    image: 'https://kjcdn.gumlet.io/media/105928/global-conference-on-women-in-agri-food-systems-gcwas-2026.jpg',
    readTime: '4 min read',
    featured: false,
    tags: ['Women Farmers', 'Gender', 'Agri-Food', 'Delhi', 'Policy'],
    source: 'Krishi Jagran',
  },
  {
    id: 'kirloskar-100-years-pump-tn',
    title: 'Kirloskar Inaugurates Renewable-Powered Factory in Tamil Nadu, Marking 100 Years of Pump Innovation',
    excerpt:
      'The new facility generates 80% of its electricity from renewables and will produce 14,000+ petroleum and agriculture pumps, reinforcing India\'s self-reliance in irrigation infrastructure.',
    content: `Kirloskar Brothers Limited has inaugurated a new sustainable manufacturing facility in Tamil Nadu's Kaniyur location, coinciding with the company's centennial milestone since producing India's first centrifugal pump in 1926. The facility generates 80% of its electricity requirements through renewable energy, achieving significant emissions reductions. The expansion supports KBL's recent large order for 14,000 petroleum application pumps and demonstrates the company's commitment to manufacturing excellence and Green India goals.`,
    author: 'KJ Staff',
    publishedAt: '2026-02-12T10:00:00Z',
    category: 'technology',
    image: 'https://kjcdn.gumlet.io/media/105900/kirloskar.jpg',
    readTime: '3 min read',
    featured: false,
    tags: ['Pump', 'Irrigation', 'Manufacturing', 'Tamil Nadu', 'Renewable Energy'],
    source: 'Krishi Jagran',
  },
  // ── Additional curated articles ────────────────────────
  {
    id: 'pm-kisan-18th-installment-2026',
    title: 'PM-KISAN 18th Installment Released — ₹2,000 Credited to 9.4 Crore Farmers',
    excerpt:
      'The government has transferred over ₹18,800 crore directly to verified beneficiary accounts. Farmers who missed e-KYC must complete it before the next cycle to avoid exclusion.',
    content: `The 18th installment of the PM-KISAN scheme has been transferred to 9.4 crore farmers, with ₹2,000 per farmer deposited directly into bank accounts via Direct Benefit Transfer. The Ministry of Agriculture has urged all beneficiaries to complete e-KYC verification through the PM-KISAN portal or Common Service Centres to remain eligible for future installments. State-wise, Uttar Pradesh received the highest disbursement at ₹3,800 crore, followed by Maharashtra and Rajasthan. Farmers enrolled under PM-KISAN also receive ancillary benefits including access to Kisan Credit Cards at 4% interest.`,
    author: 'KisaanMela Desk',
    publishedAt: '2026-04-05T10:30:00Z',
    category: 'government',
    image: 'https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?w=800&h=500&fit=crop',
    readTime: '3 min read',
    featured: false,
    tags: ['PM-KISAN', 'DBT', 'Government Scheme', 'e-KYC'],
    source: 'KisaanMela Desk',
  },
  {
    id: 'wheat-msp-procurement-2026',
    title: 'Wheat MSP Procurement Hits Record 33 Million Tonnes — Punjab Tops Chart',
    excerpt:
      'Government agencies have procured a record amount of wheat at ₹2,275/quintal MSP this Rabi season, providing guaranteed income to over 8 lakh registered farmers.',
    content: `Central and state government procurement agencies have purchased a record 33 million tonnes of wheat at the Minimum Support Price of ₹2,275 per quintal in the 2025–26 Rabi marketing season. Punjab contributed the largest share at 12.5 MMT, followed by Haryana at 8.2 MMT and Madhya Pradesh at 7.6 MMT. Over 8 lakh farmers received direct payment into their bank accounts within 72 hours of delivery at designated mandis. The bumper procurement comes despite unseasonal hailstorms in some districts, thanks to early variety adoption and crop diversification.`,
    author: 'KisaanMela Market Team',
    publishedAt: '2026-04-08T09:00:00Z',
    category: 'market-updates',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=500&fit=crop',
    readTime: '4 min read',
    featured: false,
    tags: ['Wheat', 'MSP', 'Procurement', 'Punjab', 'Rabi Season'],
    source: 'KisaanMela Market Team',
  },
  {
    id: 'ai-crop-disease-detection-startup',
    title: 'Bengaluru Startup\'s AI App Detects Crop Disease in 5 Seconds — Used by 2 Lakh Farmers',
    excerpt:
      'CropScan uses deep learning on smartphone photos to identify 50+ crop diseases with 94% accuracy, integrating with KCC for instant agri-extension advice in 12 languages.',
    content: `A Bengaluru-based agricultural technology startup has developed an AI-powered mobile application that can detect over 50 crop diseases from a smartphone photograph in under five seconds. CropScan uses deep learning models trained on 2 million labelled field images to achieve 94% detection accuracy. The app provides instant remediation advice in 12 Indian languages and integrates with Kisan Call Centre for follow-up consultation. Currently deployed with over 2 lakh farmers across Karnataka, Telangana, and Andhra Pradesh, the startup raised ₹45 crore Series A funding led by an agri-focused venture fund.`,
    author: 'KisaanMela Tech Team',
    publishedAt: '2026-04-03T11:00:00Z',
    category: 'technology',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=500&fit=crop',
    readTime: '5 min read',
    featured: false,
    tags: ['AI', 'Crop Disease', 'Startup', 'App', 'Precision Farming'],
    source: 'KisaanMela Tech Team',
  },
  {
    id: 'rajesh-organic-farm-success-punjab',
    title: '5 Acres to ₹18 Lakh/Year: How Rajesh Kumar Built Punjab\'s Most-Visited Organic Farm',
    excerpt:
      'After struggling with debt on conventional cotton, a Ludhiana farmer switched to certified organic vegetables, built a direct-to-consumer model, and now earns 3× what his neighbours make.',
    content: `Rajesh Kumar, a farmer from Ludhiana, Punjab, shares his journey from traditional cotton farming to becoming a successful organic vegetable farmer. After three consecutive years of crop failure and mounting debt from pesticide inputs, he enrolled in a state government organic farming training programme in 2021. By 2023, his 5-acre farm was certified organic under the Participatory Guarantee System. Today he supplies 12 hotels and 200 households directly, earning ₹18 lakh annually — three times his previous income. He has trained 47 neighbouring farmers in the process and runs weekly farm visits for urban consumers.`,
    author: 'KisaanMela Desk',
    publishedAt: '2026-03-25T10:00:00Z',
    category: 'farmer-stories',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&h=500&fit=crop',
    readTime: '6 min read',
    featured: false,
    tags: ['Organic Farming', 'Punjab', 'Success Story', 'Vegetables', 'Direct Marketing'],
    source: 'KisaanMela Desk',
  },
  {
    id: 'murrah-buffalo-price-spike-2026',
    title: 'Murrah Buffalo Prices Surge 22% — Haryana Breeders Struggle to Meet Demand',
    excerpt:
      'Strong demand from Maharashtra, Tamil Nadu, and export markets has pushed top-grade Murrah prices to ₹1.2 lakh. Buyers on KisaanMela livestock platform have doubled in 60 days.',
    content: `Prices for premium Murrah buffaloes have risen 22% over the past three months, driven by surging demand from dairy farms in Maharashtra and Tamil Nadu seeking high-yield animals. Top-grade Murrah cows producing 14+ litres per day now fetch ₹1 lakh to ₹1.2 lakh in Haryana mandis. Breeders at Hisar and Rohtak cattle fairs report buyer queues extending to three days. Digital livestock marketplaces have seen enquiry volumes double, with buyers from outside their traditional catchment area accessing listings for the first time via mobile apps.`,
    author: 'KisaanMela Livestock Team',
    publishedAt: '2026-04-06T08:00:00Z',
    category: 'livestock',
    image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800&h=500&fit=crop',
    readTime: '4 min read',
    featured: false,
    tags: ['Murrah', 'Buffalo', 'Livestock Market', 'Haryana', 'Dairy'],
    source: 'KisaanMela Livestock Team',
  },
  {
    id: 'drip-irrigation-subsidy-expansion',
    title: '18 New States Added to Drip Irrigation Subsidy Scheme — Up to 90% Coverage for SC/ST',
    excerpt:
      'The expanded PMKSY Micro Irrigation Fund now offers 55% subsidy for general farmers and 90% for SC/ST farmers, with an ₹8,000 crore corpus to irrigate 30 lakh hectares.',
    content: `The central government has expanded the Pradhan Mantri Krishi Sinchayee Yojana Micro Irrigation Fund to include 18 additional states, bringing the total to all 28 states. The scheme offers 55% capital cost subsidy for general category farmers and up to 90% for SC/ST beneficiaries adopting drip or sprinkler irrigation. With a corpus of ₹8,000 crore managed through NABARD, the fund aims to bring 30 lakh additional hectares under efficient irrigation by 2027. Eligible crops include horticulture, vegetables, oilseeds, sugarcane, and cotton. Applications are available through state agriculture departments and online on the PMKSY portal.`,
    author: 'KisaanMela Desk',
    publishedAt: '2026-03-18T09:00:00Z',
    category: 'government',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=500&fit=crop',
    readTime: '4 min read',
    featured: false,
    tags: ['Drip Irrigation', 'PMKSY', 'Subsidy', 'Water Saving', 'NABARD'],
    source: 'KisaanMela Desk',
  },
  {
    id: 'basmati-export-record-2026',
    title: 'Basmati Rice Exports Cross ₹50,000 Crore — Saudi Arabia, Iran Lead Import Surge',
    excerpt:
      'India\'s aromatic rice exports hit a new record in 2025–26, with premium 1121 variety dominating volumes and GI-tagged origin verification becoming a key differentiator in global markets.',
    content: `India's basmati rice exports have crossed ₹50,000 crore for the first time in 2025–26, driven by strong demand from Saudi Arabia, Iran, UAE, and EU markets. The 1121 Basmati variety accounted for 62% of export volumes. The Agricultural and Processed Food Products Export Development Authority (APEDA) reports that GI tag verification and residue testing are becoming critical for market access, with importers increasingly demanding certified supply chains. Punjab, Haryana, Uttarakhand, and UP together account for 95% of export-quality basmati production.`,
    author: 'KisaanMela Market Team',
    publishedAt: '2026-03-15T10:00:00Z',
    category: 'export',
    image: 'https://images.unsplash.com/photo-1536304993881-ff86e0c9cc95?w=800&h=500&fit=crop',
    readTime: '4 min read',
    featured: false,
    tags: ['Basmati', 'Export', 'Saudi Arabia', 'APEDA', 'GI Tag'],
    source: 'KisaanMela Market Team',
  },
  {
    id: 'smart-irrigation-iot-farmers',
    title: 'IoT Soil Sensors Help Vidarbha Cotton Farmers Save 40% Water and Boost Yields',
    excerpt:
      'A Maharashtra pilot connecting 500 cotton farms to soil moisture sensors and automated pump controllers has reduced irrigation costs by ₹8,000/acre while lifting yields 18%.',
    content: `A pilot programme in Vidarbha, Maharashtra has equipped 500 cotton farms with IoT-based soil moisture sensors connected to automated pump controllers. Farmers receive soil moisture readings on a basic SMS-based dashboard and the system automatically triggers irrigation only when required. Results after one full season show 40% reduction in water usage, 18% improvement in cotton yield per acre, and ₹8,000 savings in electricity and water costs per acre. The programme is backed by the National Bank for Agriculture and Rural Development (NABARD) and delivered by a consortium of agritech firms and a state agricultural university.`,
    author: 'KisaanMela Tech Team',
    publishedAt: '2026-03-10T11:00:00Z',
    category: 'technology',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=500&fit=crop',
    readTime: '5 min read',
    featured: false,
    tags: ['IoT', 'Smart Irrigation', 'Cotton', 'Vidarbha', 'Water Management'],
    source: 'KisaanMela Tech Team',
  },
];

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' });
}

function CategoryBadge({ category }: { category: string }) {
  const cat = CATEGORIES.find((c) => c.id === category);
  const colors: Record<string, string> = {
    government: 'bg-blue-100 text-blue-800',
    'market-updates': 'bg-amber-100 text-amber-800',
    innovation: 'bg-purple-100 text-purple-800',
    technology: 'bg-cyan-100 text-cyan-800',
    'farmer-stories': 'bg-green-100 text-green-800',
    livestock: 'bg-orange-100 text-orange-800',
    export: 'bg-rose-100 text-rose-800',
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors[category] || 'bg-gray-100 text-gray-700'}`}>
      {cat?.emoji} {cat?.name || category}
    </span>
  );
}

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const featuredArticles = useMemo(() => newsArticles.filter((a) => a.featured), []);

  const filteredArticles = useMemo(() => {
    let items = newsArticles;
    if (selectedCategory !== 'all') items = items.filter((a) => a.category === selectedCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return items;
  }, [selectedCategory, searchQuery]);

  const latestArticles = useMemo(
    () => [...newsArticles].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()).slice(0, 6),
    []
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-green-700 via-green-800 to-emerald-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-green-300">KisaanMela News</p>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">Agricultural News & Insights</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-green-100">
              Market prices, government schemes, farmer success stories, and the latest in agri-tech — curated daily.
            </p>
            {/* Search */}
            <div className="mx-auto mt-8 flex max-w-lg overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur focus-within:ring-2 focus-within:ring-green-300">
              <span className="flex items-center pl-4 text-green-200">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search news, topics, schemes…"
                className="flex-1 bg-transparent px-4 py-3 text-white placeholder-green-300 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* ── Category Pills ── */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.id); setSearchQuery(''); }}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                selectedCategory === cat.id
                  ? 'bg-green-700 text-white shadow'
                  : 'bg-white text-gray-700 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>

        <div className="mt-10 lg:grid lg:grid-cols-3 lg:gap-10">
          {/* ── Main content ── */}
          <div className="lg:col-span-2">

            {/* Featured — only show on "all" with no search */}
            {selectedCategory === 'all' && !searchQuery && (
              <section className="mb-10">
                <h2 className="mb-5 flex items-center gap-2 text-xl font-bold text-gray-900">
                  <span className="h-5 w-1 rounded-full bg-green-600" />
                  Featured Stories
                </h2>
                <div className="space-y-6">
                  {featuredArticles.map((article, idx) => (
                    <article
                      key={article.id}
                      className={`overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 hover:shadow-md transition ${idx === 0 ? '' : 'flex gap-0'}`}
                    >
                      {idx === 0 ? (
                        /* Big hero card */
                        <>
                          <div className="relative aspect-[16/7] overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={article.image} alt={article.title} className="h-full w-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4">
                              <CategoryBadge category={article.category} />
                              <h3 className="mt-2 text-xl font-bold text-white leading-snug">{article.title}</h3>
                            </div>
                          </div>
                          <div className="p-5">
                            <p className="text-gray-600 text-sm leading-relaxed">{article.excerpt}</p>
                            <div className="mt-4 flex items-center justify-between">
                              <div className="flex items-center gap-2 text-xs text-gray-400">
                                <span>{article.author}</span>
                                <span>·</span>
                                <span>{timeAgo(article.publishedAt)}</span>
                                <span>·</span>
                                <span>{article.readTime}</span>
                              </div>
                              <Link href={`/news/${article.id}`} className="text-sm font-semibold text-green-700 hover:underline">
                                Read more →
                              </Link>
                            </div>
                          </div>
                        </>
                      ) : (
                        /* Horizontal card */
                        <div className="flex gap-4 p-4 sm:p-5">
                          <div className="relative h-28 w-32 shrink-0 overflow-hidden rounded-xl sm:h-32 sm:w-40">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={article.image} alt={article.title} className="h-full w-full object-cover" />
                          </div>
                          <div className="flex flex-col justify-between flex-1">
                            <div>
                              <CategoryBadge category={article.category} />
                              <h3 className="mt-1.5 font-bold text-gray-900 leading-snug line-clamp-2 text-sm sm:text-base">{article.title}</h3>
                              <p className="mt-1 text-xs text-gray-500 line-clamp-2">{article.excerpt}</p>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-2 text-xs text-gray-400">
                                <span>{timeAgo(article.publishedAt)}</span>
                                <span>·</span>
                                <span>{article.readTime}</span>
                              </div>
                              <Link href={`/news/${article.id}`} className="text-xs font-semibold text-green-700 hover:underline">
                                Read →
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* Article grid */}
            <section>
              <h2 className="mb-5 flex items-center gap-2 text-xl font-bold text-gray-900">
                <span className="h-5 w-1 rounded-full bg-green-600" />
                {searchQuery
                  ? `Search results for "${searchQuery}" (${filteredArticles.length})`
                  : selectedCategory === 'all'
                    ? 'All Articles'
                    : CATEGORIES.find((c) => c.id === selectedCategory)?.name}
              </h2>

              {filteredArticles.length === 0 ? (
                <div className="rounded-2xl bg-white p-12 text-center text-gray-500 ring-1 ring-gray-200">
                  <p className="text-lg font-medium">No articles found</p>
                  <button onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }} className="mt-3 text-sm text-green-700 hover:underline">
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2">
                  {filteredArticles.map((article) => (
                    <article
                      key={article.id}
                      className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 hover:shadow-md transition"
                    >
                      <div className="relative overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={article.image}
                          alt={article.title}
                          className="h-44 w-full object-cover transition duration-300 group-hover:scale-105"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=500&fit=crop';
                          }}
                        />
                        <div className="absolute top-3 left-3">
                          <CategoryBadge category={article.category} />
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 leading-snug line-clamp-2">{article.title}</h3>
                        <p className="mt-1.5 text-sm text-gray-600 line-clamp-2">{article.excerpt}</p>
                        <div className="mt-3 flex flex-wrap gap-1">
                          {article.tags.slice(0, 3).map((tag) => (
                            <button
                              key={tag}
                              onClick={() => setSearchQuery(tag)}
                              className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 hover:bg-green-100 hover:text-green-800 transition"
                            >
                              #{tag}
                            </button>
                          ))}
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <span>{timeAgo(article.publishedAt)}</span>
                            <span>·</span>
                            <span>{article.readTime}</span>
                          </div>
                          <Link href={`/news/${article.id}`} className="text-sm font-semibold text-green-700 hover:underline">
                            Read more →
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* ── Sidebar ── */}
          <aside className="mt-12 space-y-8 lg:mt-0">
            {/* Latest */}
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
              <h3 className="mb-4 flex items-center gap-2 font-bold text-gray-900">
                <span className="h-4 w-1 rounded-full bg-green-600" />
                Latest News
              </h3>
              <div className="space-y-4">
                {latestArticles.map((article) => (
                  <Link key={article.id} href={`/news/${article.id}`} className="group flex gap-3">
                    <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-lg">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={article.image}
                        alt=""
                        className="h-full w-full object-cover transition group-hover:scale-105"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=300&fit=crop';
                        }}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800 leading-snug line-clamp-2 group-hover:text-green-700">
                        {article.title}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-400">{timeAgo(article.publishedAt)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Topics */}
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
              <h3 className="mb-4 flex items-center gap-2 font-bold text-gray-900">
                <span className="h-4 w-1 rounded-full bg-green-600" />
                Trending Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(newsArticles.flatMap((a) => a.tags)))
                  .slice(0, 20)
                  .map((tag) => (
                    <button
                      key={tag}
                      onClick={() => { setSelectedCategory('all'); setSearchQuery(tag); }}
                      className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-green-100 hover:text-green-800 transition"
                    >
                      #{tag}
                    </button>
                  ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="rounded-2xl bg-gradient-to-br from-green-700 to-emerald-800 p-5 text-white">
              <h3 className="font-bold text-lg">📬 Daily Farm Digest</h3>
              <p className="mt-1.5 text-sm text-green-100">Get market prices, scheme alerts and weather forecasts every morning.</p>
              <div className="mt-4 space-y-2">
                <input
                  type="email"
                  placeholder="your@phone-or-email"
                  className="w-full rounded-xl bg-white/10 px-3 py-2 text-sm text-white placeholder-green-300 ring-1 ring-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <button className="w-full rounded-xl bg-white py-2 text-sm font-bold text-green-800 hover:bg-green-50 transition">
                  Subscribe Free
                </button>
              </div>
            </div>

            {/* Quick links */}
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
              <h3 className="mb-4 flex items-center gap-2 font-bold text-gray-900">
                <span className="h-4 w-1 rounded-full bg-green-600" />
                Quick Links
              </h3>
              <div className="space-y-2 text-sm">
                {[
                  { href: '/marketplace/livestock', label: '🐄 Livestock Marketplace' },
                  { href: '/marketplace/livestock/tools/ration', label: '🌾 Feed Calculator' },
                  { href: '/marketplace/livestock/demand', label: '📋 Post Buying Requirement' },
                  { href: '/marketplace/livestock/sell', label: '+ List Your Animal' },
                ].map((link) => (
                  <Link key={link.href} href={link.href} className="flex items-center justify-between rounded-lg px-3 py-2 text-gray-700 hover:bg-green-50 hover:text-green-800 transition">
                    <span>{link.label}</span>
                    <span className="text-gray-400">→</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
