'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ANIMAL_TYPES, BREEDS_BY_TYPE } from '@/lib/livestock/livestockSpecifications';

export default function LivestockSellPage() {
  const [animalType, setAnimalType] = useState('buffalo');
  const [breed, setBreed] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [sellerId, setSellerId] = useState('seller_005');
  const [sellerName, setSellerName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [images, setImages] = useState('https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800');
  const [ageYears, setAgeYears] = useState('');
  const [milkYield, setMilkYield] = useState('');
  const [healthSummary, setHealthSummary] = useState('');
  const [vaccinationSummary, setVaccinationSummary] = useState('');
  const [negotiable, setNegotiable] = useState(true);
  const [verifiedListing, setVerifiedListing] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const breeds = BREEDS_BY_TYPE[animalType] || [];

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
      const res = await fetch('/api/marketplace/livestock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name || `${breed || animalType} listing`,
          description,
          price: Number(price),
          location,
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
            milkYieldPerDay: milkYield ? Number(milkYield) : undefined,
            healthSummary: healthSummary || undefined,
            vaccinationSummary: vaccinationSummary || undefined,
            sellerType: 'farmer',
            negotiable,
            verifiedListing
          }
        })
      });
      const j = await res.json();
      if (j.success) {
        setMsg(j.message || 'Submitted.');
        setName('');
        setDescription('');
        setPrice('');
      } else {
        setErr(j.error || 'Failed');
      }
    } catch {
      setErr('Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/marketplace/livestock" className="text-sm font-medium text-green-800 underline">
        ← Livestock marketplace
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">List an animal</h1>
      <p className="mt-2 text-sm text-gray-600">
        Submissions go to <strong>pending</strong> until approved. Use seed seller IDs (e.g. seller_005) for demos.
      </p>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-gray-700">Animal type</label>
            <select
              value={animalType}
              onChange={(e) => {
                setAnimalType(e.target.value);
                setBreed('');
              }}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
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
            <select value={breed} onChange={(e) => setBreed(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm">
              <option value="">Select…</option>
              {breeds.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Title</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-gray-700">Price (₹)</label>
            <input
              required
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Location</label>
            <input
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-gray-700">Age (years)</label>
            <input type="number" value={ageYears} onChange={(e) => setAgeYears(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Milk L/day</label>
            <input type="number" value={milkYield} onChange={(e) => setMilkYield(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Health</label>
          <input value={healthSummary} onChange={(e) => setHealthSummary(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Vaccination</label>
          <input value={vaccinationSummary} onChange={(e) => setVaccinationSummary(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
        </div>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={negotiable} onChange={(e) => setNegotiable(e.target.checked)} />
            Negotiable
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={verifiedListing} onChange={(e) => setVerifiedListing(e.target.checked)} />
            Verified listing badge
          </label>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Image URLs (comma or newline)</label>
          <textarea value={images} onChange={(e) => setImages(e.target.value)} rows={2} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-gray-700">Seller ID</label>
            <input value={sellerId} onChange={(e) => setSellerId(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Seller phone</label>
            <input value={sellerPhone} onChange={(e) => setSellerPhone(e.target.value)} placeholder="10-digit" className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Seller name</label>
          <input value={sellerName} onChange={(e) => setSellerName(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
        </div>
        {err && <p className="text-sm text-red-600">{err}</p>}
        {msg && <p className="text-sm text-green-700">{msg}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-green-600 py-3 font-semibold text-white disabled:opacity-50"
        >
          {loading ? 'Submitting…' : 'Submit for review'}
        </button>
      </form>
    </div>
  );
}
