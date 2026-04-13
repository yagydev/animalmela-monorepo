'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ANIMAL_TYPES } from '@/lib/livestock/livestockSpecifications';
import { INDIA_STATES } from '@/lib/livestock/indiaGeoData';

type DemandPost = {
  _id: string;
  animalType: string;
  breed?: string;
  minMilkYield?: number;
  budgetMin?: number;
  budgetMax?: number;
  state: string;
  district?: string;
  description: string;
  buyerName: string;
  buyerPhone: string;
  createdAt: string;
};

function money(n: number) { return `₹${Number(n).toLocaleString('en-IN')}`; }
function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

const TYPE_EMOJI: Record<string, string> = {
  cow: '🐄', buffalo: '🐃', goat: '🐐', sheep: '🐑', poultry: '🐓', other: '🐾'
};

export default function DemandPage() {
  const [tab, setTab] = useState<'browse' | 'post'>('browse');

  // Browse state
  const [demands, setDemands] = useState<DemandPost[]>([]);
  const [loadingDemands, setLoadingDemands] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [respondId, setRespondId] = useState<string | null>(null);
  const [respondName, setRespondName] = useState('');
  const [respondPhone, setRespondPhone] = useState('');
  const [respondMsg, setRespondMsg] = useState('');
  const [respondOk, setRespondOk] = useState<string | null>(null);

  // Post form state
  const [animalType, setAnimalType] = useState('cow');
  const [breed, setBreed] = useState('');
  const [minMilk, setMinMilk] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [description, setDescription] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [posting, setPosting] = useState(false);
  const [postOk, setPostOk] = useState<string | null>(null);
  const [postErr, setPostErr] = useState<string | null>(null);

  const loadDemands = useCallback(async () => {
    setLoadingDemands(true);
    try {
      const params = new URLSearchParams({ limit: '30' });
      if (filterType) params.set('animalType', filterType);
      const res = await fetch(`/api/marketplace/livestock/demand?${params}`);
      const j = await res.json();
      if (j.success) setDemands(j.data);
    } catch { setDemands([]); }
    finally { setLoadingDemands(false); }
  }, [filterType]);

  useEffect(() => { loadDemands(); }, [loadDemands]);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setPosting(true); setPostErr(null); setPostOk(null);
    try {
      const res = await fetch('/api/marketplace/livestock/demand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          animalType, breed: breed || undefined,
          minMilkYield: minMilk ? Number(minMilk) : undefined,
          budgetMin: budgetMin ? Number(budgetMin) : undefined,
          budgetMax: budgetMax ? Number(budgetMax) : undefined,
          state, district: district || undefined, description, buyerName, buyerPhone
        })
      });
      const j = await res.json();
      if (j.success) {
        setPostOk(j.message);
        setBreed(''); setMinMilk(''); setBudgetMin(''); setBudgetMax('');
        setDistrict(''); setDescription(''); setBuyerName(''); setBuyerPhone('');
        setTimeout(() => { setTab('browse'); loadDemands(); }, 1500);
      } else {
        setPostErr(j.error);
      }
    } catch { setPostErr('Failed to post. Please try again.'); }
    finally { setPosting(false); }
  };

  const handleRespond = async (demand: DemandPost) => {
    if (!respondName.trim() || !respondPhone.trim()) return;
    // For MVP: just show a thank-you (no backend yet for seller-to-buyer response)
    setRespondOk(`Thank you ${respondName}! The buyer will be notified. You can call ${demand.buyerPhone} directly.`);
    setTimeout(() => { setRespondId(null); setRespondOk(null); setRespondName(''); setRespondPhone(''); setRespondMsg(''); }, 4000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/40 to-gray-50 pb-16">
      {/* Header */}
      <div className="border-b border-blue-100 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
          <Link href="/marketplace/livestock" className="text-sm font-medium text-green-800 hover:underline">
            ← Livestock marketplace
          </Link>
          <h1 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">📋 Buyer Wants</h1>
          <p className="mt-1 text-sm text-gray-600">
            Buyers post what they're looking for. Sellers respond directly.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        {/* Tab switcher */}
        <div className="flex gap-1 rounded-xl bg-gray-100 p-1 w-fit mb-6">
          {(['browse', 'post'] as const).map(t => (
            <button key={t} type="button" onClick={() => setTab(t)}
              className={`rounded-lg px-5 py-2 text-sm font-semibold transition ${
                tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-800'
              }`}>
              {t === 'browse' ? '🔍 Browse Wants' : '✏️ Post a Want'}
            </button>
          ))}
        </div>

        {/* Browse tab */}
        {tab === 'browse' && (
          <>
            {/* Animal type chips */}
            <div className="flex flex-wrap gap-2 mb-5">
              <button type="button" onClick={() => setFilterType('')}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  !filterType ? 'bg-green-600 text-white' : 'bg-white ring-1 ring-gray-200 text-gray-700 hover:ring-green-300'
                }`}>
                All
              </button>
              {ANIMAL_TYPES.filter(t => t.id !== 'other').map(t => (
                <button key={t.id} type="button" onClick={() => setFilterType(t.id)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                    filterType === t.id ? 'bg-green-600 text-white' : 'bg-white ring-1 ring-gray-200 text-gray-700 hover:ring-green-300'
                  }`}>
                  {t.emoji} {t.label}
                </button>
              ))}
            </div>

            {loadingDemands ? (
              <div className="space-y-3">
                {[1,2,3].map(i => <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-200" />)}
              </div>
            ) : demands.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center text-gray-500">
                <p className="text-lg font-semibold text-gray-800">No buyer wants posted yet</p>
                <p className="mt-2 text-sm">Be the first buyer to post a requirement!</p>
                <button type="button" onClick={() => setTab('post')}
                  className="mt-4 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700">
                  Post a Want
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {demands.map(demand => (
                  <div key={demand._id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{TYPE_EMOJI[demand.animalType] || '🐾'}</span>
                        <div>
                          <p className="font-bold text-gray-900 capitalize">
                            {demand.breed ? `${demand.breed} ${demand.animalType}` : demand.animalType}
                          </p>
                          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-sm text-gray-500">
                            {(demand.budgetMin || demand.budgetMax) && (
                              <span>💰 {demand.budgetMin ? money(demand.budgetMin) : '?'} – {demand.budgetMax ? money(demand.budgetMax) : '?'}</span>
                            )}
                            {demand.minMilkYield && <span>🥛 {demand.minMilkYield}+ L/day</span>}
                            <span>📍 {demand.district ? `${demand.district}, ` : ''}{demand.state}</span>
                            <span className="text-gray-400">{shortDate(demand.createdAt)}</span>
                          </div>
                          <p className="mt-2 text-sm text-gray-700">{demand.description}</p>
                          <p className="mt-1 text-xs text-gray-400">Posted by: {demand.buyerName}</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => setRespondId(respondId === demand._id ? null : demand._id)}
                        className="shrink-0 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
                        I Can Supply
                      </button>
                    </div>

                    {/* Respond form */}
                    {respondId === demand._id && (
                      <div className="mt-4 rounded-xl border border-green-100 bg-green-50 p-4">
                        {respondOk ? (
                          <p className="text-sm font-medium text-green-700">{respondOk}</p>
                        ) : (
                          <div className="space-y-3">
                            <p className="text-sm font-medium text-gray-800">Your contact details</p>
                            <div className="grid gap-3 sm:grid-cols-2">
                              <input value={respondName} onChange={e => setRespondName(e.target.value)}
                                placeholder="Your name" className="rounded-lg border px-3 py-2 text-sm" />
                              <input value={respondPhone} onChange={e => setRespondPhone(e.target.value)}
                                placeholder="Mobile number" className="rounded-lg border px-3 py-2 text-sm" />
                            </div>
                            <textarea value={respondMsg} onChange={e => setRespondMsg(e.target.value)}
                              placeholder="Message to buyer (optional)" rows={2}
                              className="w-full rounded-lg border px-3 py-2 text-sm" />
                            <button type="button" onClick={() => handleRespond(demand)}
                              className="rounded-xl bg-gray-900 px-5 py-2 text-sm font-semibold text-white hover:bg-gray-800">
                              Send Response
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Post tab */}
        {tab === 'post' && (
          <form onSubmit={handlePost} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
            <h2 className="font-bold text-gray-900 text-lg">Post your requirement</h2>
            <p className="text-sm text-gray-500">Tell sellers exactly what you're looking for. Your post stays active for 30 days.</p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Animal type <span className="text-red-500">*</span></label>
                <select required value={animalType} onChange={e => setAnimalType(e.target.value)}
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-green-500 focus:outline-none">
                  {ANIMAL_TYPES.map(t => <option key={t.id} value={t.id}>{t.emoji} {t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Breed (optional)</label>
                <input value={breed} onChange={e => setBreed(e.target.value)}
                  placeholder="e.g. Murrah, Sahiwal"
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-green-500 focus:outline-none" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Min milk (L/day)</label>
                <input type="number" value={minMilk} onChange={e => setMinMilk(e.target.value)}
                  placeholder="e.g. 10"
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-green-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Budget min (₹)</label>
                <input type="number" value={budgetMin} onChange={e => setBudgetMin(e.target.value)}
                  placeholder="e.g. 60000"
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-green-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Budget max (₹)</label>
                <input type="number" value={budgetMax} onChange={e => setBudgetMax(e.target.value)}
                  placeholder="e.g. 90000"
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-green-500 focus:outline-none" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">State <span className="text-red-500">*</span></label>
                <select required value={state} onChange={e => setState(e.target.value)}
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-green-500 focus:outline-none">
                  <option value="">Select state</option>
                  {INDIA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">District</label>
                <input value={district} onChange={e => setDistrict(e.target.value)}
                  placeholder="Optional"
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-green-500 focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description <span className="text-red-500">*</span>
                <span className="ml-2 text-xs text-gray-400">({description.length}/500)</span>
              </label>
              <textarea required value={description} onChange={e => setDescription(e.target.value)}
                maxLength={500} rows={3}
                placeholder="E.g. Looking for a healthy Murrah buffalo with 12+ L/day milk, 3-5 years old, fully vaccinated"
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-green-500 focus:outline-none" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Your name <span className="text-red-500">*</span></label>
                <input required value={buyerName} onChange={e => setBuyerName(e.target.value)}
                  placeholder="Full name"
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-green-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mobile <span className="text-red-500">*</span></label>
                <input required value={buyerPhone} onChange={e => setBuyerPhone(e.target.value)}
                  placeholder="10-digit mobile"
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-green-500 focus:outline-none" />
              </div>
            </div>

            {postErr && <p className="text-sm text-red-600">{postErr}</p>}
            {postOk && <p className="text-sm font-medium text-green-700">{postOk}</p>}

            <button type="submit" disabled={posting}
              className="w-full rounded-xl bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50 transition">
              {posting ? 'Posting…' : 'Post My Requirement'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
