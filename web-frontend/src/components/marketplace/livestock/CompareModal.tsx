'use client';

import { parseLivestockSpec } from '@/lib/livestock/livestockSpecifications';

type FullListing = {
  _id: string;
  name: string;
  price: number;
  images?: string[];
  location: string;
  specifications?: unknown;
};

type CompareModalProps = {
  items: FullListing[];
  onClose: () => void;
};

function money(n: number) {
  return `₹${Number(n).toLocaleString('en-IN')}`;
}

function Best({ val, best }: { val: string; best: boolean }) {
  return (
    <span className={`${best ? 'font-bold text-green-700' : 'text-gray-700'}`}>
      {best && <span className="mr-1 text-xs">★</span>}
      {val}
    </span>
  );
}

export function CompareModal({ items, onClose }: CompareModalProps) {
  const specs = items.map((i) => parseLivestockSpec(i.specifications));

  const prices = items.map((i) => i.price);
  const milks = specs.map((s) => s.milkYieldPerDay ?? 0);
  const minPrice = Math.min(...prices);
  const maxMilk = Math.max(...milks);

  const rows: { label: string; values: (string | null)[] }[] = [
    { label: 'Price', values: items.map((i) => money(i.price)) },
    { label: 'Breed', values: specs.map((s) => s.breed || '—') },
    { label: 'Age', values: specs.map((s) => s.ageYears != null ? `${s.ageYears} yrs` : (s.ageMonths != null ? `${s.ageMonths} mo` : '—')) },
    { label: 'Milk yield', values: specs.map((s) => s.milkYieldPerDay != null ? `${s.milkYieldPerDay} L/day` : '—') },
    { label: 'Lactation', values: specs.map((s) => s.lactationStatus || '—') },
    { label: 'Pregnant', values: specs.map((s) => s.pregnant === true ? 'Yes' : s.pregnant === false ? 'No' : '—') },
    { label: 'Health', values: specs.map((s) => s.healthSummary || '—') },
    { label: 'Vaccination', values: specs.map((s) => s.vaccinationSummary || '—') },
    { label: 'Seller type', values: specs.map((s) => s.sellerType ? String(s.sellerType) : '—') },
    { label: 'Location', values: items.map((i) => i.location) },
    { label: 'Negotiable', values: specs.map((s) => s.negotiable ? 'Yes' : 'No') },
    { label: 'Verified', values: specs.map((s) => s.verifiedListing ? '✓ Verified' : '—') },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <button type="button" className="absolute inset-0 bg-black/60" onClick={onClose} aria-label="Close" />

      {/* Modal */}
      <div className="relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-lg font-bold text-gray-900">Compare Animals</h2>
          <button type="button" onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
            ×
          </button>
        </div>

        <div className="overflow-auto flex-1">
          <table className="w-full text-sm">
            {/* Animal images + names */}
            <thead className="sticky top-0 bg-white z-10 border-b border-gray-100">
              <tr>
                <th className="w-28 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Feature
                </th>
                {items.map((item) => (
                  <th key={item._id} className="px-4 py-3 text-center">
                    <div className="flex flex-col items-center gap-2">
                      {item.images?.[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.images[0]} alt=""
                          className="h-16 w-20 rounded-xl object-cover shadow-sm" />
                      )}
                      <span className="text-xs font-semibold text-gray-900 line-clamp-2 max-w-[120px]">
                        {item.name}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rows.map((row) => (
                <tr key={row.label} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-xs font-medium text-gray-500 whitespace-nowrap">
                    {row.label}
                  </td>
                  {row.values.map((val, i) => {
                    const isBestPrice = row.label === 'Price' && prices[i] === minPrice;
                    const isBestMilk = row.label === 'Milk yield' && milks[i] === maxMilk && maxMilk > 0;
                    const isBest = isBestPrice || isBestMilk;
                    return (
                      <td key={i} className={`px-4 py-3 text-center text-sm ${isBest ? 'bg-green-50' : ''}`}>
                        <Best val={val || '—'} best={isBest} />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer CTA */}
        <div className="border-t border-gray-100 px-5 py-4 flex gap-3 justify-end">
          <button type="button" onClick={onClose}
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Close
          </button>
          <div className="flex gap-2">
            {items.map((item) => (
              <a key={item._id}
                href={`/marketplace/livestock/${item._id}`}
                className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
                View {item.name.split(' ')[0]}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
