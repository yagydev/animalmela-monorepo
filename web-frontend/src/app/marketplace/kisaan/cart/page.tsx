'use client';

import { marketplaceApiFetch } from '@/lib/kisaanmela-marketplace/api-client';
import { marketplaceKisaanRoutes } from '@/lib/kisaanmela-marketplace/routes';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

type CartItem = {
  id: string;
  quantity: number;
  priceSnapshot: string | number;
  product: {
    id: string;
    title: string;
    images: { url: string }[];
    store: { name: string };
  };
};

type Cart = { items: CartItem[] } | null;

function money(n: string | number) {
  const v = typeof n === 'string' ? parseFloat(n) : n;
  if (Number.isNaN(v)) return '—';
  return `₹${v.toLocaleString('en-IN')}`;
}

export default function KisaanMarketplaceCartPage() {
  const [cart, setCart] = useState<Cart | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await marketplaceApiFetch<Cart>('/cart');
      setCart(data);
    } catch (e) {
      const m = e instanceof Error ? e.message : 'Failed to load cart';
      if (m.includes('401') || m.toLowerCase().includes('unauthorized')) {
        setError('Sign in with your mobile (OTP) to view your cart.');
      } else {
        setError(m);
      }
      setCart(null);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (cart === undefined) {
    return <p className="text-gray-600">Loading cart…</p>;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-amber-900">{error}</p>
        <Link href="/marketplace/kisaan/login" className="font-semibold text-green-800 underline">
          Go to sign in
        </Link>
      </div>
    );
  }

  const items = cart?.items ?? [];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Your cart</h1>
      {items.length === 0 ? (
        <p className="text-gray-600">
          Your cart is empty.{' '}
          <Link href={marketplaceKisaanRoutes.products} className="font-semibold text-green-800 underline">
            Browse listings
          </Link>
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((line) => (
            <li key={line.id} className="flex gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                {line.product.images[0]?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={line.product.images[0].url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center">🌱</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-900">{line.product.title}</p>
                <p className="text-sm text-gray-500">{line.product.store.name}</p>
                <p className="text-sm text-gray-600">
                  Qty {line.quantity} × {money(line.priceSnapshot)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
