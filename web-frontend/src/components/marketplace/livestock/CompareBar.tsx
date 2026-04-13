'use client';

export type CompareItem = {
  _id: string;
  name: string;
  image?: string;
  price: number;
};

type CompareBarProps = {
  items: CompareItem[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onCompare: () => void;
};

function money(n: number) {
  return `₹${Number(n).toLocaleString('en-IN')}`;
}

export function CompareBar({ items, onRemove, onClear, onCompare }: CompareBarProps) {
  const slots = [0, 1, 2];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white shadow-2xl">
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3 sm:px-6">
        <p className="hidden shrink-0 text-sm font-semibold text-gray-700 sm:block">
          Compare
        </p>

        <div className="flex flex-1 gap-3">
          {slots.map((i) => {
            const item = items[i];
            return item ? (
              <div key={item._id}
                className="relative flex flex-1 items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-3 py-2">
                {item.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-gray-900">{item.name}</p>
                  <p className="text-xs text-green-800 font-medium">{money(item.price)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(item._id)}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-xs text-gray-600 hover:bg-red-100 hover:text-red-700"
                  aria-label="Remove"
                >
                  ×
                </button>
              </div>
            ) : (
              <div key={`empty-${i}`}
                className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-gray-300 px-3 py-2 text-xs text-gray-400">
                Add animal
              </div>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onCompare}
            disabled={items.length < 2}
            className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-40 transition"
          >
            Compare {items.length > 0 ? `(${items.length})` : ''}
          </button>
          <button type="button" onClick={onClear}
            className="text-xs text-gray-500 hover:text-gray-700 underline">
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
