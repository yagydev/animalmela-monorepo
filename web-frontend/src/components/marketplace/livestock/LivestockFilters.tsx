'use client';

import { FunnelIcon } from '@heroicons/react/24/outline';
import { ANIMAL_TYPES } from '@/lib/livestock/livestockSpecifications';
import { INDIA_STATES, DISTRICTS_BY_STATE } from '@/lib/livestock/indiaGeoData';

export type LivestockFilterState = {
  q: string;
  animalType: string;
  breed: string;
  minPrice: string;
  maxPrice: string;
  location: string;
  state: string;
  district: string;
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

  const districts = value.state ? (DISTRICTS_BY_STATE[value.state] || []) : [];

  const form = (
    <div className="space-y-4">
      {/* State filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700">State</label>
        <select
          value={value.state}
          onChange={(e) => field({ state: e.target.value, district: '' })}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
        >
          <option value="">All States</option>
          {INDIA_STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* District filter — only shown when state is selected */}
      {districts.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700">District</label>
          <select
            value={value.district}
            onChange={(e) => field({ district: e.target.value })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
          >
            <option value="">All Districts</option>
            {districts.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      )}

      {/* Animal type */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Animal type</label>
        <select
          value={value.animalType}
          onChange={(e) => field({ animalType: e.target.value, breed: '' })}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
        >
          <option value="">All types</option>
          {ANIMAL_TYPES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.emoji} {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Breed */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Breed</label>
        <input
          list="livestock-breed-list"
          value={value.breed}
          onChange={(e) => field({ breed: e.target.value })}
          placeholder="e.g. Murrah"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
        />
        <datalist id="livestock-breed-list">
          {breedSuggestions.map((b) => (
            <option key={b} value={b} />
          ))}
        </datalist>
      </div>

      {/* Price range */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Min ₹</label>
          <input
            type="number"
            value={value.minPrice}
            onChange={(e) => field({ minPrice: e.target.value })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Max ₹</label>
          <input
            type="number"
            value={value.maxPrice}
            onChange={(e) => field({ maxPrice: e.target.value })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Location text fallback */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Location (keyword)</label>
        <input
          value={value.location}
          onChange={(e) => field({ location: e.target.value })}
          placeholder="City or area"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
        />
      </div>

      {/* Min milk */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Min milk (L/day)</label>
        <input
          type="number"
          value={value.minMilk}
          onChange={(e) => field({ minMilk: e.target.value })}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
        />
      </div>

      {/* Verified only */}
      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
        <input
          type="checkbox"
          checked={value.verifiedOnly}
          onChange={(e) => field({ verifiedOnly: e.target.checked })}
          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
        />
        Verified listings only
      </label>

      {/* Sort */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Sort by</label>
        <select
          value={value.sortBy}
          onChange={(e) => field({ sortBy: e.target.value })}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
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
        className="w-full rounded-xl bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-700 transition"
      >
        Apply filters
      </button>

      {/* Clear all */}
      <button
        type="button"
        onClick={() => {
          onChange({
            q: '', animalType: '', breed: '', minPrice: '', maxPrice: '',
            location: '', state: '', district: '', verifiedOnly: false,
            minMilk: '', sortBy: 'createdAt'
          });
        }}
        className="w-full text-center text-sm text-gray-500 hover:text-gray-700 underline"
      >
        Clear all filters
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
          <div className="absolute bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto rounded-t-2xl bg-white p-4 shadow-xl">
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
