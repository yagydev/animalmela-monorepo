'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { LivestockAnimalCard, type LivestockListingCard } from '@/components/marketplace/livestock';

export default function SavedAnimalsPage() {
  const [listings, setListings] = useState<LivestockListingCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const ids: string[] = JSON.parse(localStorage.getItem('livestock_saved') || '[]');
      setSavedIds(ids);
      if (ids.length === 0) { setListings([]); return; }

      const results = await Promise.allSettled(
        ids.map(id => fetch(`/api/marketplace/livestock/${id}`).then(r => r.json()))
      );

      const found: LivestockListingCard[] = [];
      results.forEach((r, i) => {
        if (r.status === 'fulfilled' && r.value.success && r.value.data?.listing) {
          found.push({ ...r.value.data.listing, _id: ids[i] });
        }
      });
      setListings(found);
    } catch {
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const unsave = (id: string) => {
    const next = savedIds.filter(s => s !== id);
    localStorage.setItem('livestock_saved', JSON.stringify(next));
    setSavedIds(next);
    setListings(prev => prev.filter(l => l._id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/40 to-gray-50 pb-16">
      {/* Header */}
      <div className="border-b border-rose-100 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
          <Link href="/marketplace/livestock" className="text-sm font-medium text-green-800 hover:underline">
            ← Livestock marketplace
          </Link>
          <h1 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">
            ♥ Saved Animals
            {savedIds.length > 0 && (
              <span className="ml-2 text-lg font-normal text-gray-500">({savedIds.length})</span>
            )}
          </h1>
          <p className="mt-1 text-sm text-gray-500">Animals you've bookmarked. Saved in your browser.</p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-80 animate-pulse rounded-2xl bg-gray-200" />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-14 text-center">
            <p className="text-4xl mb-4">🐄</p>
            <p className="text-lg font-semibold text-gray-800">No saved animals yet</p>
            <p className="mt-2 text-sm text-gray-500">
              Tap the ♡ Save button on any listing to bookmark it here.
            </p>
            <Link href="/marketplace/livestock"
              className="mt-6 inline-flex items-center rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700">
              Browse animals
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map(item => (
              <div key={item._id} className="relative">
                <LivestockAnimalCard item={item} />
                <button
                  type="button"
                  onClick={() => unsave(item._id)}
                  className="absolute left-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-rose-500 shadow hover:bg-rose-50 hover:text-rose-700 text-sm"
                  title="Remove from saved"
                >
                  ♥
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
