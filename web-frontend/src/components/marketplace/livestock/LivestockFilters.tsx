'use client';

import { FunnelIcon } from '@heroicons/react/24/outline';
import { ANIMAL_TYPES } from '@/lib/livestock/livestockSpecifications';

export type LivestockFilterState = {
  q: string;
  animalType: string;
  breed: string;
  minPrice: string;
  maxPrice: string;
  location: string;
  verifiedOnly: boolean;
  minMilk: string;
  sortBy: string;
};

export function LivestockFilters({
  value,
  onChange,
  onApply,
  breedSuggestions,
  showSheet,
  onCloseSheet
}: {
  value: LivestockFilterState;
  onChange: (v: LivestockFilterState) => void;
  onApply: () => void;
  breedSuggestions: string[];
  showSheet: boolean;
  onCloseSheet: () => void;
}) {
  const field = (patch: Partial<LivestockFilterState>) => onChange({ ...value, ...patch });

  const form = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Animal type</label>
        <select
          value={value.animalType}
          onChange={(e) => field({ animalType: e.target.value, breed: '' })}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">All types</option>
          {ANIMAL_TYPES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.emoji} {t.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Breed</label>
        <input
          list="livestock-breed-list"
          value={value.breed}
          onChange={(e) => field({ breed: e.target.value })}
          placeholder="e.g. Murrah"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        <datalist id="livestock-breed-list">
          {breedSuggestions.map((b) => (
            <option key={b} value={b} />
          ))}
        </datalist>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Min ₹</label>
          <input
            type="number"
            value={value.minPrice}
            onChange={(e) => field({ minPrice: e.target.value })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Max ₹</label>
          <input
            type="number"
            value={value.maxPrice}
            onChange={(e) => field({ maxPrice: e.target.value })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Location</label>
        <input
          value={value.location}
          onChange={(e) => field({ location: e.target.value })}
          placeholder="City or state"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Min milk (L/day)</label>
        <input
          type="number"
          value={value.minMilk}
          onChange={(e) => field({ minMilk: e.target.value })}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={value.verifiedOnly}
          onChange={(e) => field({ verifiedOnly: e.target.checked })}
        />
        Verified listings only
      </label>
      <div>
        <label className="block text-sm font-medium text-gray-700">Sort</label>
        <select
          value={value.sortBy}
          onChange={(e) => field({ sortBy: e.target.value })}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="createdAt">Recently added</option>
          <option value="price-asc">Price: low → high</option>
          <option value="price-desc">Price: high → low</option>
          <option value="milk-desc">Milk yield (high first)</option>
        </select>
      </div>
      <button
        type="button"
        onClick={onApply}
        className="w-full rounded-xl bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-700"
      >
        Apply filters
      </button>
    </div>
  );

  return (
    <>
      <aside className="hidden w-72 shrink-0 lg:block">
        <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
            <FunnelIcon className="h-5 w-5" />
            Filters
          </h2>
          {form}
        </div>
      </aside>

      {showSheet && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close filters"
            onClick={onCloseSheet}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Filters</h2>
              <button type="button" className="text-sm text-green-800 underline" onClick={onCloseSheet}>
                Close
              </button>
            </div>
            {form}
          </div>
        </div>
      )}
    </>
  );
}
