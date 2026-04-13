import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiter (per IP, max 1 req/2s)
const rateLimitMap = new Map<string, number>();

function getMockReply(message: string): string {
  const msg = message.toLowerCase();
  if (msg.match(/price|cost|worth|kitna|rate|value/)) {
    return "Market-wise, prices vary by breed, age, and milk yield. A good Murrah buffalo with 12+ L/day typically fetches ₹80,000–₹1,50,000. Add clear photos and your exact milk yield to your listing for better offers! 🐃";
  }
  if (msg.match(/health|bimar|sick|disease|treatment/)) {
    return "Regular FMD, HS, and BQ vaccinations are must! Deworm every 3 months. Watch for signs like fever, loss of appetite, or nasal discharge. Contact a local vet quickly — early treatment saves lives. 🩺";
  }
  if (msg.match(/milk|doodh|yield|production|liter/)) {
    return "To improve doodh production: ensure 16–18% protein in concentrate, maintain a calm environment, milk at fixed times daily, and provide 50+ litres of fresh water. Proper dry period (60 days) before calving also helps! 🥛";
  }
  if (msg.match(/vaccination|vaccine|टीका|injection/)) {
    return "Core vaccinations for cattle: FMD (every 6 months), HS + BQ (annually before monsoon), PPR for goats/sheep, Brucella for females. Keep a vaccination card — it boosts buyer trust significantly! 💉";
  }
  if (msg.match(/sell|बेचना|listing|fast|jaldi/)) {
    return "To sell your pashu faster: add 5+ clear photos in good light, mention exact milk yield per day, keep price slightly negotiable, and respond to leads within 1 hour. WhatsApp buyers directly from your dashboard! 📱";
  }
  if (msg.match(/breed|नस्ल|which|kaun/)) {
    return "For high milk production: Murrah buffalo (10–16 L/day) and HF/Jersey crossbred (10–20 L/day) are top choices. For hardiness in tough climates: Sahiwal and Gir cows. Murrah fetch the best prices in North India! 🐄";
  }
  if (msg.match(/feed|चारा|ration|khana|fodder/)) {
    return "Standard ration: 10–12 kg green fodder + 4–5 kg dry straw + 3–4 kg concentrate per day for a 400kg cow. Increase concentrate by 1 kg per extra 3 litres of milk. Try our 🌾 Feed Calculator for exact amounts!";
  }
  return "Namaste! 🙏 That's a great question. For best results: maintain regular health checkups, document milk yield daily, and keep your listing updated on KisaanMela. Our verified sellers get 3× more enquiries! Ask me anything about pricing, health, or breeds.";
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const last = rateLimitMap.get(ip) || 0;
    if (now - last < 2000) {
      return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 });
    }
    rateLimitMap.set(ip, now);
    // Clean old entries
    if (rateLimitMap.size > 1000) {
      const cutoff = now - 60000;
      rateLimitMap.forEach((v, k) => { if (v < cutoff) rateLimitMap.delete(k); });
    }

    const { message, context } = await request.json();
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ success: false, error: 'message required' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (apiKey) {
      // Use Claude API via fetch
      const systemPrompt = `You are PashuGyan, a friendly and knowledgeable livestock expert for Indian farmers on KisaanMela marketplace.
Answer in simple English, mixing natural Hindi/regional words like "pashu", "doodh", "kisan", "namaste" where appropriate.
Be warm, practical, and concise (2–4 sentences). Focus on: livestock pricing, breeds, health, care, feeding, and selling tips.
Always end with a helpful next step or tip. Do not use markdown formatting.${context ? `\n\nCurrent listing context: ${context}` : ''}`;

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5',
          max_tokens: 250,
          system: systemPrompt,
          messages: [{ role: 'user', content: String(message).slice(0, 500) }]
        })
      });

      if (res.ok) {
        const data = await res.json();
        const reply = data.content?.[0]?.text || getMockReply(message);
        return NextResponse.json({ success: true, reply });
      }
    }

    // Fallback mock
    const reply = getMockReply(message);
    return NextResponse.json({ success: true, reply });
  } catch (error) {
    console.error('PashuGyan AI error:', error);
    return NextResponse.json({ success: true, reply: getMockReply('') });
  }
}
