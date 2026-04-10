import { MarketplaceAddToCartButton } from '@/components/marketplace/kisaan';
import { marketplaceServerFetch } from '@/lib/kisaanmela-marketplace/server-api';
import { marketplaceKisaanRoutes } from '@/lib/kisaanmela-marketplace/routes';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const base = marketplaceKisaanRoutes.home;

type ProductDetail = {
  id: string;
  title: string;
  description: string;
  price: string | { toString(): string };
  stock: number;
  store: { name: string; slug: string };
  category: { name: string };
  images: { url: string }[];
  district: string | null;
  state: string | null;
};

function money(p: ProductDetail['price']) {
  const n = typeof p === 'string' ? parseFloat(p) : parseFloat(String(p));
  if (Number.isNaN(n)) return '—';
  return `₹${n.toLocaleString('en-IN')}`;
}

export default async function KisaanMarketplaceProductDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  let product: ProductDetail;
  try {
    product = await marketplaceServerFetch<ProductDetail>(`/products/${id}`);
  } catch {
    notFound();
  }

  return (
    <article className="space-y-4">
      <Link href={`${base}/products`} className="inline-block text-sm font-medium text-green-800">
        ← All listings
      </Link>

      <div className="overflow-hidden rounded-2xl bg-white shadow-md">
        <div className="aspect-[4/3] bg-gray-100">
          {product.images[0]?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.images[0].url} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-6xl">🌾</div>
          )}
        </div>
        <div className="space-y-2 p-4">
          <p className="text-sm text-gray-500">{product.category.name}</p>
          <h1 className="text-xl font-bold text-gray-900">{product.title}</h1>
          <p className="text-2xl font-bold text-green-800">{money(product.price)}</p>
          <p className="text-sm text-gray-600">
            Sold by <strong>{product.store.name}</strong>
            {product.district || product.state
              ? ` · ${[product.district, product.state].filter(Boolean).join(', ')}`
              : ''}
          </p>
          <p className="text-sm text-gray-500">In stock: {product.stock}</p>
        </div>
      </div>

      <section className="rounded-xl bg-white p-4 shadow-sm">
        <h2 className="font-semibold text-gray-900">About this item</h2>
        <p className="mt-2 whitespace-pre-wrap text-gray-700">{product.description}</p>
      </section>

      <MarketplaceAddToCartButton productId={product.id} disabled={product.stock < 1} />
    </article>
  );
}
