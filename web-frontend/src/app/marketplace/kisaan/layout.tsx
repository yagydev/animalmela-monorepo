import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verified sellers & shop | KisaanMela Marketplace',
  description:
    'Browse multi-vendor listings, melas from the marketplace API, cart and mobile OTP sign-in — part of KisaanMela.',
};

export default function KisaanMarketplaceSectionLayout({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">{children}</div>;
}
