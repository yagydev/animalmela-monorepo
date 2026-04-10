import { marketplaceKisaanRoutes } from '@/lib/kisaanmela-marketplace/routes';
import Link from 'next/link';

const base = marketplaceKisaanRoutes.home;

export default function KisaanMarketplaceHubPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-gradient-to-br from-green-700 to-green-900 p-6 text-white shadow-lg">
        <p className="text-sm font-medium uppercase tracking-wide text-green-100">KisaanMela marketplace</p>
        <h1 className="mt-2 text-2xl font-bold leading-tight">Shop from verified sellers near you</h1>
        <p className="mt-3 text-base text-green-100">
          Animals, seeds, tools, and more — same site as events & training. Sign in with your mobile (OTP) to use
          cart and checkout when enabled.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href={marketplaceKisaanRoutes.products}
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-5 font-semibold text-green-900"
          >
            Browse products
          </Link>
          <Link
            href={marketplaceKisaanRoutes.events}
            className="inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-white/40 px-5 font-semibold text-white"
          >
            Marketplace melas
          </Link>
          <Link
            href={marketplaceKisaanRoutes.login}
            className="inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-white/40 px-5 font-semibold text-white"
          >
            Sign in (OTP)
          </Link>
          <Link
            href={marketplaceKisaanRoutes.cart}
            className="inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-white/40 px-5 font-semibold text-white"
          >
            Cart
          </Link>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        {[
          { href: `${base}/products?q=seed`, label: 'Seeds', emoji: '🌾' },
          { href: `${base}/products?q=tool`, label: 'Tools', emoji: '🔧' },
          { href: `${base}/products?q=animal`, label: 'Animals', emoji: '🐄' },
          { href: `${base}/events`, label: 'Melas', emoji: '📍' },
        ].map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="flex min-h-14 items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm active:bg-gray-50"
          >
            <span className="text-2xl" aria-hidden>
              {c.emoji}
            </span>
            <span className="font-semibold text-gray-900">{c.label}</span>
          </Link>
        ))}
      </section>

      <p className="text-center text-sm text-gray-600">
        Powered by the KisaanMela marketplace API (PostgreSQL).{' '}
        <Link href="/marketplace" className="font-medium text-green-800 underline">
          Back to all marketplace pages
        </Link>
      </p>
    </div>
  );
}
