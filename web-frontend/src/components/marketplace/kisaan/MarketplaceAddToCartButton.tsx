'use client';

import { marketplaceApiFetch } from '@/lib/kisaanmela-marketplace/api-client';
import { marketplaceKisaanRoutes } from '@/lib/kisaanmela-marketplace/routes';
import Link from 'next/link';
import { useState } from 'react';

export function MarketplaceAddToCartButton({
  productId,
  disabled,
}: {
  productId: string;
  disabled: boolean;
}) {
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function add() {
    setMsg(null);
    setLoading(true);
    try {
      await marketplaceApiFetch('/cart/items', { method: 'POST', json: { productId, quantity: 1 } });
      setMsg('Added to cart');
    } catch (e) {
      const m = e instanceof Error ? e.message : 'Failed';
      if (m.includes('401') || m.toLowerCase().includes('unauthorized')) {
        setMsg('Please sign in first (mobile OTP).');
      } else {
        setMsg(m);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={disabled || loading}
        onClick={add}
        className="w-full rounded-xl bg-green-700 py-4 text-lg font-semibold text-white disabled:opacity-50"
      >
        {disabled ? 'Out of stock' : loading ? 'Adding…' : 'Add to cart'}
      </button>
      {msg && (
        <p className="text-center text-sm text-gray-700">
          {msg}{' '}
          <Link href={marketplaceKisaanRoutes.cart} className="font-semibold text-green-800 underline">
            View cart
          </Link>
        </p>
      )}
    </div>
  );
}
