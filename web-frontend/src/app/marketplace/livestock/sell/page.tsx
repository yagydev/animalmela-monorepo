'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ANIMAL_TYPES, BREEDS_BY_TYPE } from '@/lib/livestock/livestockSpecifications';
import { INDIA_STATES, DISTRICTS_BY_STATE } from '@/lib/livestock/indiaGeoData';

export default function LivestockSellPage() {
  const [animalType, setAnimalType] = useState('buffalo');
  const [breed, setBreed] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [location, setLocation] = useState('');
  const [sellerId, setSellerId] = useState('seller_005');
  const [sellerName, setSellerName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [sellerType, setSellerType] = useState<'farmer' | 'trader' | 'vet'>('farmer');
  const [images, setImages] = useState('https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800');
  const [videoUrl, setVideoUrl] = useState('');
  const [ageYears, setAgeYears] = useState('');
  const [ageMonths, setAgeMonths] = useState('');
  const [milkYield, setMilkYield] = useState('');
  const [lactationStatus, setLactationStatus] = useState('');
  const [pregnant, setPregnant] = useState(false);
  const [healthSummary, setHealthSummary] = useState('');
  const [vaccinationSummary, setVaccinationSummary] = useState('');
  const [negotiable, setNegotiable] = useState(true);
  const [verifiedListing, setVerifiedListing] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Price suggestion state
  const [priceSuggestion, setPriceSuggestion] = useState<{ label: string; tone: string; avg?: number } | null>(null);
  const priceDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const breeds = BREEDS_BY_TYPE[animalType] || [];
  const districts = state ? (DISTRICTS_BY_STATE[state] || []) : [];

  // Debounce price suggestion fetch
  useEffect(() => {
    if (priceDebounceRef.current) clearTimeout(priceDebounceRef.current);
    if (!price || !animalType) {
      setPriceSuggestion(null);
      return;
    }
    priceDebounceRef.current = setTimeout(async () => {
      try {
        const params = new URLSearchParams({
          price,
          animalType,
          ...(breed ? { breed } : {})
        });
        const res = await fetch(`/api/marketplace/livestock/insights?${params}`);
        const j = await res.json();
        if (j.success && j.data?.insightLabel) {
          setPriceSuggestion({
            label: j.data.insightLabel,
            tone: j.data.insightTone || 'neutral',
            avg: j.data.averagePrice
          });
        } else {
          setPriceSuggestion(null);
        }
      } catch {
        setPriceSuggestion(null);
      }
    }, 800);
    return () => {
      if (priceDebounceRef.current) clearTimeout(priceDebounceRef.current);
    };
  }, [price, breed, animalType]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    setLoading(true);
    try {
      const imgList = images
        .split(/[\n,]/)
        .map((s) => s.trim())
        .filter(Boolean);

      // Compose full location string from state + district + freetext
      const locationStr = [district, state, location].filter(Boolean).join(', ') || location;

      const res = await fetch('/api/marketplace/livestock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name || `${breed || animalType} listing`,
          description,
          price: Number(price),
          location: locationStr,
          sellerId,
          sellerName: sellerName || undefined,
          sellerPhone: sellerPhone || undefined,
          condition: 'used',
          images: imgList,
          tags: [animalType, breed].filter(Boolean),
          specifications: {
            animalType,
            breed: breed || undefined,
            ageYears: ageYears ? Number(ageYears) : undefined,
            ageMonths: ageMonths ? Number(ageMonths) : undefined,
            milkYieldPerDay: milkYield ? Number(milkYield) : undefined,
            lactationStatus: lactationStatus || undefined,
            pregnant,
            healthSummary: healthSummary || undefined,
            vaccinationSummary: vaccinationSummary || undefined,
            videoUrl: videoUrl || undefined,
            sellerType,
            state: state || undefined,
            city: district || undefined,
            negotiable,
            verifiedListing
          }
        })
      });
      const j = await res.json();
      if (j.success) {
        setMsg(j.message || 'Submitted! Your listing will go live after review (usually within 2 hours).');
        setName('');
        setDescription('');
        setPrice('');
        setPriceSuggestion(null);
      } else {
        setErr(j.error || 'Failed');
      }
    } catch {
      setErr('Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  const priceSuggestionColor =
    priceSuggestion?.tone === 'good'
      ? 'border-green-200 bg-green-50 text-green-800'
      : priceSuggestion?.tone === 'high'
        ? 'border-amber-200 bg-amber-50 text-amber-800'
        : 'border-blue-200 bg-blue-50 text-blue-800';

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/60 to-gray-50 pb-16">
      <div className="border-b border-green-100 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
          <Link href="/marketplace/livestock" className="text-sm font-medium text-green-800 hover:underline">
            ← Livestock marketplace
          </Link>
          <h1 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">List an animal</h1>
          <p className="mt-1 text-sm text-gray-600">
            Submissions go to <strong>pending</strong> until reviewed. Usually live within 2 hours.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <form onSubmit={submit} className="space-y-6">

          {/* ── Animal basics ── */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-4">
            <h2 className="font-semibold text-gray-900">Animal details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-700">Animal type *</label>
                <select
                  value={animalType}
                  onChange={(e) => {
                    setAnimalType(e.target.value);
                    setBreed('');
                  }}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                >
                  {ANIMAL_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Breed</label>
                <select
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                >
                  <option value="">Select breed…</option>
                  {breeds.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Age (years)</label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={ageYears}
                  onChange={(e) => setAgeYears(e.target.value)}
                  placeholder="e.g. 3"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Age (months)</label>
                <input
                  type="number"
                  min="0"
                  max="11"
                  value={ageMonths}
                  onChange={(e) => setAgeMonths(e.target.value)}
                  placeholder="e.g. 6"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Milk L/day</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={milkYield}
                  onChange={(e) => setMilkYield(e.target.value)}
                  placeholder="e.g. 12"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-700">Lactation status</label>
                <input
                  value={lactationStatus}
                  onChange={(e) => setLactationStatus(e.target.value)}
                  placeholder="e.g. 2nd lactation, 4 months"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                />
              </div>
              <div className="flex flex-col justify-end gap-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={pregnant}
                    onChange={(e) => setPregnant(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-green-600"
                  />
                  <span className="font-medium text-gray-700">Currently pregnant</span>
                </label>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-700">Health summary</label>
                <input
                  value={healthSummary}
                  onChange={(e) => setHealthSummary(e.target.value)}
                  placeholder="e.g. Good health, no diseases"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Vaccination</label>
                <input
                  value={vaccinationSummary}
                  onChange={(e) => setVaccinationSummary(e.target.value)}
                  placeholder="e.g. FMD, HS done"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* ── Listing details ── */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-4">
            <h2 className="font-semibold text-gray-900">Listing details</h2>

            <div>
              <label className="text-sm font-medium text-gray-700">Title</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Murrah Buffalo — 14L/day"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Description *</label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Describe the animal — health, temperament, reason for selling…"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Asking price (₹) *</label>
              <input
                required
                type="number"
                min="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 85000"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
              />
              {priceSuggestion && (
                <div className={`mt-2 rounded-lg border px-3 py-2 text-xs font-medium ${priceSuggestionColor}`}>
                  💡 {priceSuggestion.label}
                  {priceSuggestion.avg && (
                    <span className="ml-1 opacity-75">
                      (Market avg: ₹{priceSuggestion.avg.toLocaleString('en-IN')})
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={negotiable}
                  onChange={(e) => setNegotiable(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-green-600"
                />
                <span className="font-medium text-gray-700">Price is negotiable</span>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={verifiedListing}
                  onChange={(e) => setVerifiedListing(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-green-600"
                />
                <span className="font-medium text-gray-700">Request verification badge</span>
              </label>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Video URL (optional)</label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/... or https://drive.google.com/..."
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
              />
              <p className="mt-1 text-xs text-gray-500">A video builds buyer trust — listings with videos get 2× more leads!</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Photo URLs (comma or newline)</label>
              <textarea
                value={images}
                onChange={(e) => setImages(e.target.value)}
                rows={2}
                placeholder="https://..."
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
              />
            </div>
          </div>

          {/* ── Location ── */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-4">
            <h2 className="font-semibold text-gray-900">Location</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-700">State *</label>
                <select
                  value={state}
                  onChange={(e) => {
                    setState(e.target.value);
                    setDistrict('');
                  }}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                >
                  <option value="">Select state…</option>
                  {INDIA_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">District</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  disabled={!state}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none disabled:opacity-50"
                >
                  <option value="">Select district…</option>
                  {districts.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Village / Town (optional)</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Sirsa, near mandi"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
              />
            </div>
          </div>

          {/* ── Seller info ── */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-4">
            <h2 className="font-semibold text-gray-900">Seller information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-700">Your name *</label>
                <input
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  placeholder="Full name"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Mobile number *</label>
                <input
                  type="tel"
                  value={sellerPhone}
                  onChange={(e) => setSellerPhone(e.target.value)}
                  placeholder="10-digit mobile"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-700">Seller type</label>
                <select
                  value={sellerType}
                  onChange={(e) => setSellerType(e.target.value as 'farmer' | 'trader' | 'vet')}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                >
                  <option value="farmer">🌾 Farmer</option>
                  <option value="trader">🏪 Trader / Dealer</option>
                  <option value="vet">🩺 Veterinarian</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Seller ID (demo)</label>
                <input
                  value={sellerId}
                  onChange={(e) => setSellerId(e.target.value)}
                  placeholder="seller_005"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                />
                <p className="mt-1 text-xs text-gray-400">Use seller_001–seller_010 for demo mode</p>
              </div>
            </div>
          </div>

          {err && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {err}
            </div>
          )}
          {msg && (
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
              ✅ {msg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50 transition"
          >
            {loading ? 'Submitting…' : '🐄 Submit for review'}
          </button>
        </form>
      </div>
    </div>
  );
}
