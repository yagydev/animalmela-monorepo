'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { parseLivestockSpec } from '@/lib/livestock/livestockSpecifications';
import { LivestockAnimalCard, type LivestockListingCard } from '@/components/marketplace/livestock';

type Listing = {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  location: string;
  specifications?: unknown;
  viewsCount?: number;
  sellerId: { _id: string; name: string; phone: string; location: string; rating: number; verifiedSeller?: boolean };
};

function money(n: number) {
  return `₹${Number(n).toLocaleString('en-IN')}`;
}

export default function LivestockDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [data, setData] = useState<{ listing: Listing; relatedListings: LivestockListingCard[]; viewsTodayHint: number } | null>(
    null
  );
  const [insight, setInsight] = useState<{ label: string; tone: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadMsg, setLeadMsg] = useState('');
  const [leadOk, setLeadOk] = useState<string | null>(null);
  const [leadErr, setLeadErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/marketplace/livestock/${id}`);
      const j = await res.json();
      if (j.success && j.data?.listing) {
        setData(j.data);
        const L = j.data.listing;
        const spec = parseLivestockSpec(L.specifications);
        const ir = await fetch(
          `/api/marketplace/livestock/insights?price=${encodeURIComponent(String(L.price))}&breed=${encodeURIComponent(spec.breed || '')}&animalType=${encodeURIComponent(String(spec.animalType || ''))}`
        );
        const ij = await ir.json();
        if (ij.success && ij.data?.insightLabel) {
          setInsight({ label: ij.data.insightLabel, tone: ij.data.insightTone || 'neutral' });
        }
      } else {
        setData(null);
      }
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const submitLead = async () => {
    setLeadErr(null);
    setLeadOk(null);
    if (!leadName.trim() || !leadPhone.trim()) {
      setLeadErr('Name and phone are required.');
      return;
    }
    setSaving(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch('/api/marketplace/livestock/leads', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          listingId: id,
          buyerName: leadName.trim(),
          buyerPhone: leadPhone.trim(),
          buyerMessage: leadMsg.trim() || undefined
        })
      });
      const j = await res.json();
      if (j.success) {
        setLeadOk(j.message || 'Interest sent.');
        setLeadMsg('');
      } else {
        setLeadErr(j.error || 'Failed to send');
      }
    } catch {
      setLeadErr('Failed to send');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl animate-pulse px-4 py-10">
        <div className="h-64 rounded-2xl bg-gray-200" />
        <div className="mt-6 h-8 w-2/3 rounded bg-gray-200" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-gray-900">Listing not found</h1>
        <Link href="/marketplace/livestock" className="mt-4 inline-block text-green-800 underline">
          Back to livestock marketplace
        </Link>
      </div>
    );
  }

  const L = data.listing;
  const spec = parseLivestockSpec(L.specifications);
  const images = L.images?.length ? L.images : ['/images/placeholder.jpg'];
  const wa = L.sellerId.phone?.replace(/\D/g, '');
  const waLink =
    wa && wa.length >= 10
      ? `https://wa.me/91${wa.slice(-10)}?text=${encodeURIComponent(`Hi, I'm interested in: ${L.name} (₹${L.price}) on KisaanMela.`)}`
      : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10">
      <Link href="/marketplace/livestock" className="text-sm font-medium text-green-800 hover:underline">
        ← All livestock
      </Link>

      <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="relative aspect-[16/10] bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[imgIdx]} alt="" className="h-full w-full object-cover" />
          {images.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setImgIdx(i)}
                  className={`h-2 w-2 rounded-full ${i === imgIdx ? 'bg-white' : 'bg-white/50'}`}
                  aria-label={`Image ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
        <div className="p-5 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              {spec.animalType && (
                <p className="text-sm font-medium uppercase text-green-800">{String(spec.animalType)}</p>
              )}
              <h1 className="text-2xl font-bold text-gray-900">{L.name}</h1>
              <p className="mt-2 text-3xl font-bold text-green-800">{money(L.price)}</p>
              {spec.negotiable && <p className="text-sm text-gray-600">Price negotiable</p>}
            </div>
            <div className="text-right text-sm text-gray-500">
              <p>📍 {L.location}</p>
              <p className="mt-1">{data.viewsTodayHint}+ views recently</p>
            </div>
          </div>

          {insight && (
            <div
              className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
                insight.tone === 'good'
                  ? 'border-green-200 bg-green-50 text-green-900'
                  : insight.tone === 'high'
                    ? 'border-amber-200 bg-amber-50 text-amber-900'
                    : 'border-gray-200 bg-gray-50 text-gray-800'
              }`}
            >
              <strong>Price check:</strong> {insight.label}
            </div>
          )}

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <section>
              <h2 className="font-semibold text-gray-900">Animal details</h2>
              <ul className="mt-2 space-y-1 text-sm text-gray-700">
                {spec.breed && <li>Breed: {spec.breed}</li>}
                {spec.ageYears != null && <li>Age: {spec.ageYears} years</li>}
                {spec.ageMonths != null && spec.ageYears == null && <li>Age: {spec.ageMonths} months</li>}
                {spec.milkYieldPerDay != null && <li>Milk yield: ~{spec.milkYieldPerDay} L/day</li>}
                {spec.lactationStatus && <li>Lactation: {spec.lactationStatus}</li>}
                {spec.pregnant === true && <li>Currently pregnant</li>}
                {spec.healthSummary && <li>Health: {spec.healthSummary}</li>}
                {spec.vaccinationSummary && <li>Vaccination: {spec.vaccinationSummary}</li>}
                {spec.sellerType && <li>Seller type: {spec.sellerType}</li>}
              </ul>
            </section>
            <section className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <h2 className="font-semibold text-gray-900">Seller</h2>
              <p className="mt-2 font-medium text-gray-800">{L.sellerId.name}</p>
              <p className="text-sm text-gray-600">★ {L.sellerId.rating} · {L.sellerId.location}</p>
              {L.sellerId.verifiedSeller && (
                <span className="mt-2 inline-block rounded-full bg-green-600 px-2 py-0.5 text-xs font-semibold text-white">
                  Verified listing
                </span>
              )}
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                {waLink && (
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex justify-center rounded-xl bg-green-500 px-4 py-3 text-center text-sm font-bold text-white hover:bg-green-600"
                  >
                    WhatsApp seller
                  </a>
                )}
                {L.sellerId.phone && (
                  <a
                    href={`tel:${L.sellerId.phone}`}
                    className="inline-flex justify-center rounded-xl border-2 border-green-700 px-4 py-3 text-center text-sm font-semibold text-green-900 hover:bg-green-50"
                  >
                    Call
                  </a>
                )}
              </div>
            </section>
          </div>

          {spec.videoUrl && (
            <section className="mt-8">
              <h2 className="font-semibold text-gray-900">Video</h2>
              <a
                href={spec.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-green-800 underline"
              >
                Open video link
              </a>
            </section>
          )}

          <section className="mt-8 rounded-xl border border-dashed border-green-200 bg-green-50/50 p-5">
            <h2 className="font-semibold text-gray-900">Interested?</h2>
            <p className="mt-1 text-sm text-gray-600">Send a lead to the seller (stored in KisaanMela).</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                placeholder="Your name"
                className="rounded-lg border px-3 py-2 text-sm"
              />
              <input
                value={leadPhone}
                onChange={(e) => setLeadPhone(e.target.value)}
                placeholder="Mobile"
                className="rounded-lg border px-3 py-2 text-sm"
              />
            </div>
            <textarea
              value={leadMsg}
              onChange={(e) => setLeadMsg(e.target.value)}
              placeholder="Optional message"
              rows={2}
              className="mt-3 w-full rounded-lg border px-3 py-2 text-sm"
            />
            {leadErr && <p className="mt-2 text-sm text-red-600">{leadErr}</p>}
            {leadOk && <p className="mt-2 text-sm text-green-700">{leadOk}</p>}
            <button
              type="button"
              disabled={saving}
              onClick={submitLead}
              className="mt-4 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {saving ? 'Sending…' : "I'm interested"}
            </button>
          </section>

          <section className="mt-10">
            <h2 className="text-lg font-semibold text-gray-900">Similar nearby</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {data.relatedListings?.map((item) => (
                <LivestockAnimalCard key={item._id} item={item} />
              ))}
            </div>
          </section>

          <p className="mt-8 whitespace-pre-wrap text-sm text-gray-700">{L.description}</p>
        </div>
      </div>
    </div>
  );
}
