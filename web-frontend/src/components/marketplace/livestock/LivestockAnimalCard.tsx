'use client';

import Link from 'next/link';
import { parseLivestockSpec } from '@/lib/livestock/livestockSpecifications';

export type LivestockListingCard = {
  _id: string;
  name: string;
  price: number;
  images: string[];
  location: string;
  specifications?: unknown;
  featured?: boolean;
};

function money(n: number) {
  return `₹${Number(n).toLocaleString('en-IN')}`;
}

export function LivestockAnimalCard({ item }: { item: LivestockListingCard }) {
  const spec = parseLivestockSpec(item.specifications);
  const img = item.images?.[0] || '/images/placeholder.jpg';
  const typeLabel = spec.animalType ? String(spec.animalType) : 'Livestock';
  const breed = spec.breed || item.name.split('—')[0].trim().slice(0, 48);

  return (
    <Link
      href={`/marketplace/livestock/${item._id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:border-green-300 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt="" className="h-full w-full object-cover" />
        {item.featured && (
          <span className="absolute left-2 top-2 rounded-full bg-amber-500 px-2 py-0.5 text-xs font-semibold text-white">
            Featured
          </span>
        )}
        {spec.verifiedListing && (
          <span className="absolute right-2 top-2 rounded-full bg-green-600 px-2 py-0.5 text-xs font-semibold text-white">
            Verified
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{typeLabel}</p>
        <h3 className="mt-1 line-clamp-2 text-base font-semibold text-gray-900 group-hover:text-green-800">{breed}</h3>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-gray-600">
          {spec.milkYieldPerDay != null && (
            <span>Milk ~{spec.milkYieldPerDay} L/day</span>
          )}
          {spec.ageYears != null && <span>Age {spec.ageYears} yr</span>}
          {spec.pregnant === true && <span className="text-rose-600">Pregnant</span>}
        </div>
        <p className="mt-3 text-xl font-bold text-green-800">{money(item.price)}</p>
        <p className="mt-1 truncate text-sm text-gray-500">📍 {item.location}</p>
        <div className="mt-4 flex gap-2">
          <span className="inline-flex flex-1 items-center justify-center rounded-lg bg-green-600 py-2 text-sm font-semibold text-white group-hover:bg-green-700">
            View
          </span>
          <span className="inline-flex items-center justify-center rounded-lg border border-green-700 px-3 py-2 text-sm font-semibold text-green-800">
            Contact
          </span>
        </div>
      </div>
    </Link>
  );
}
