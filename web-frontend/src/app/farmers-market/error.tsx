'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function FarmersMarketError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Farmers market route error:', error);
  }, [error]);

  return (
    <div className="min-h-[50vh] bg-gray-50 px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-gray-900">Could not load farmers market</h1>
      <p className="mx-auto mt-3 max-w-md text-gray-600">
        Something went wrong. Please try again or contact support.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-800"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-100"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
