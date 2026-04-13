'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import {
  LivestockAnimalCard,
  LivestockFilters,
  CompareBar,
  CompareModal,
  type LivestockFilterState,
  type LivestockListingCard,
  type CompareItem,
} from '@/components/marketplace/livestock';
import { ANIMAL_TYPES } from '@/lib/livestock/livestockSpecifications';

const defaultFilters: LivestockFilterState = {
  q: '',
  animalType: '',
  breed: '',
  minPrice: '',
  maxPrice: '',
  location: '',
  state: '',
  district: '',
  verifiedOnly: false,
  minMilk: '',
  sortBy: 'createdAt'
};

export default function AdvancedLivestockMarketplacePage() {
  const [filters, setFilters] = useState<LivestockFilterState>(defaultFilters);
  const [searchInput, setSearchInput] = useState('');
  const [listings, setListings] = useState<LivestockListingCard[]>([]);
  const [pagination, setPagination] = useState<{
    totalCount: number; totalPages: number; currentPage: number;
    hasNextPage: boolean; hasPrevPage: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [breedSuggestions, setBreedSuggestions] = useState<string[]>([]);
  const [filterSheet, setFilterSheet] = useState(false);
  const [page, setPage] = useState(1);

  // Compare state
  const [compareItems, setCompareItems] = useState<CompareItem[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [compareListings, setCompareListings] = useState<LivestockListingCard[]>([]);

  const loadBreeds = useCallback(async (animalType: string) => {
    const t = animalType || 'cow';
    try {
      const r = await fetch(`/api/marketplace/livestock/breeds?animalType=${encodeURIComponent(t)}`);
      const j = await r.json();
      if (j.success && Array.isArray(j.data)) setBreedSuggestions(j.data);
    } catch { setBreedSuggestions([]); }
  }, []);

  useEffect(() => { loadBreeds(filters.animalType); }, [filters.animalType, loadBreeds]);

  const doFetch = useCallback(async (p: number, f: LivestockFilterState) => {
    setLoading(true); setError(null);
    try {
      const params = new URLSearchParams();
      params.set('page', String(p));
      params.set('limit', '12');
      if (f.q) params.set('q', f.q);
      if (f.animalType) params.set('animalType', f.animalType);
      if (f.breed) params.set('breed', f.breed);
      if (f.minPrice) params.set('minPrice', f.minPrice);
      if (f.maxPrice) params.set('maxPrice', f.maxPrice);
      if (f.location) params.set('location', f.location);
      if (f.state) params.set('state', f.state);
      if (f.district) params.set('district', f.district);
      if (f.verifiedOnly) params.set('verifiedOnly', '1');
      if (f.minMilk) params.set('minMilk', f.minMilk);
      if (f.sortBy) params.set('sortBy', f.sortBy);

      const res = await fetch(`/api/marketplace/livestock?${params}`);
      const result = await res.json();
      if (result.success && Array.isArray(result.data) && result.pagination) {
        setListings(result.data); setPagination(result.pagination); setPage(p);
      } else {
        setError('Could not load listings.'); setListings([]); setPagination(null);
      }
    } catch {
      setError('Could not load listings.'); setListings([]); setPagination(null);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { doFetch(1, defaultFilters); }, [doFetch]);

  const applySearch = () => {
    const next = { ...filters, q: searchInput.trim() };
    setFilters(next); doFetch(1, next);
  };

  const chipSetType = (id: string) => {
    const next = { ...filters, animalType: filters.animalType === id ? '' : id, breed: '' };
    setFilters(next); doFetch(1, next);
  };

  // Compare handlers
  const handleAddToCompare = (item: LivestockListingCard) => {
    if (compareItems.length >= 3) return;
    if (compareItems.find(c => c._id === item._id)) return;
    setCompareItems(prev => [...prev, {
      _id: item._id,
      name: item.name,
      image: item.images?.[0],
      price: item.price
    }]);
  };

  const handleRemoveFromCompare = (id: string) => {
    setCompareItems(prev => prev.filter(c => c._id !== id));
  };

  const handleOpenCompare = async () => {
    // Fetch full details for compare items
    const results = await Promise.allSettled(
      compareItems.map(ci => fetch(`/api/marketplace/livestock/${ci._id}`).then(r => r.json()))
    );
    const full = results
      .filter((r): r is PromiseFulfilledResult<{ success: boolean; data: { listing: LivestockListingCard } }> =>
        r.status === 'fulfilled' && r.value.success)
      .map(r => r.value.data.listing);
    setCompareListings(full);
    setShowCompareModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/80 to-gray-50 pb-32">
      {/* Header */}
      <div className="border-b border-green-100 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-green-800">🐄 Advanced livestock</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">Verified animals near you</h1>
          <p className="mt-3 max-w-2xl text-gray-600">
            Rich listings with breed, milk yield, and trust signals. WhatsApp sellers directly or send a structured lead.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/marketplace/livestock/sell"
              className="inline-flex items-center rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700">
              + List your animal
            </Link>
            <Link href="/marketplace/livestock/dashboard"
              className="inline-flex items-center rounded-xl border-2 border-green-700 px-5 py-3 text-sm font-semibold text-green-900 hover:bg-green-50">
              My Dashboard
            </Link>
            <Link href="/marketplace/livestock/demand"
              className="inline-flex items-center rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:border-green-300 hover:bg-green-50">
              📋 Post a Want
            </Link>
            <Link href="/marketplace/livestock/saved"
              className="inline-flex items-center rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:border-rose-300 hover:bg-rose-50">
              ♥ Saved
            </Link>
            <Link href="/marketplace/livestock/tools/ration"
              className="inline-flex items-center rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:border-green-300">
              🌾 Feed Calc
            </Link>
            <Link href="/marketplace" className="inline-flex items-center self-center text-sm font-medium text-green-800 underline">
              All categories
            </Link>
          </div>

          {/* Search bar */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applySearch()}
                placeholder="Search breed, description, tags…"
                className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/30"
              />
            </div>
            <button type="button" onClick={applySearch}
              className="rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800">
              Search
            </button>
            <button type="button" onClick={() => setFilterSheet(true)}
              className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-800 lg:hidden">
              Filters
            </button>
          </div>

          {/* Category chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            {ANIMAL_TYPES.filter((t) => t.id !== 'other').map((t) => (
              <button key={t.id} type="button" onClick={() => chipSetType(t.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  filters.animalType === t.id
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-green-300'
                }`}>
                {t.emoji} {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <LivestockFilters
          value={filters}
          onChange={setFilters}
          onApply={() => { doFetch(1, filters); setFilterSheet(false); }}
          breedSuggestions={breedSuggestions}
          showSheet={filterSheet}
          onCloseSheet={() => setFilterSheet(false)}
        />

        <div className="min-w-0 flex-1">
          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
          )}
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[1,2,3,4,5,6].map((i) => (
                <div key={i} className="h-80 animate-pulse rounded-2xl bg-gray-200" />
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center text-gray-600">
              <p className="text-lg font-medium text-gray-900">No animals match your filters</p>
              <p className="mt-2 text-sm">Try clearing filters or browse all categories.</p>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">{pagination?.totalCount ?? listings.length} listings</p>
                {compareItems.length > 0 && (
                  <span className="text-xs text-green-700 font-medium">{compareItems.length} in compare</span>
                )}
              </div>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {listings.map((item) => (
                  <LivestockAnimalCard
                    key={item._id}
                    item={item}
                    onAddToCompare={compareItems.length < 3 || compareItems.some(c => c._id === item._id)
                      ? handleAddToCompare : undefined}
                    isInCompare={compareItems.some(c => c._id === item._id)}
                  />
                ))}
              </div>
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  <button type="button" disabled={!pagination.hasPrevPage}
                    onClick={() => doFetch(page - 1, filters)}
                    className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40">
                    Previous
                  </button>
                  <span className="px-3 py-2 text-sm text-gray-600">
                    Page {pagination.currentPage} / {pagination.totalPages}
                  </span>
                  <button type="button" disabled={!pagination.hasNextPage}
                    onClick={() => doFetch(page + 1, filters)}
                    className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40">
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Compare bar */}
      {compareItems.length > 0 && (
        <CompareBar
          items={compareItems}
          onRemove={handleRemoveFromCompare}
          onClear={() => setCompareItems([])}
          onCompare={handleOpenCompare}
        />
      )}

      {/* Compare modal */}
      {showCompareModal && compareListings.length >= 2 && (
        <CompareModal
          items={compareListings}
          onClose={() => { setShowCompareModal(false); setCompareListings([]); }}
        />
      )}

      {/* WhatsApp support */}
      <a href="https://wa.me/919999778321" target="_blank" rel="noopener noreferrer"
        className="fixed bottom-24 right-6 z-40 flex h-14 items-center gap-2 rounded-full bg-green-500 px-5 text-sm font-bold text-white shadow-lg hover:bg-green-600">
        💬 Support
      </a>
    </div>
  );
}
