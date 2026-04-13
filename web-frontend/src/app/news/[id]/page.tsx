'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface NewsArticle {
  _id?: string;
  slug?: string;
  title: string;
  excerpt: string;
  content: string;
  author: string | { name: string };
  publishedAt: string;
  category: string;
  image: string | { url: string };
  readTime: string;
  featured: boolean;
  tags: string[];
  source?: string;
  views?: number;
}

const CAT_META: Record<string, { name: string; emoji: string; color: string }> = {
  policy:           { name: 'Govt Schemes',   emoji: '🏛️', color: 'bg-blue-100 text-blue-800' },
  market:           { name: 'Market Updates', emoji: '📈', color: 'bg-amber-100 text-amber-800' },
  technology:       { name: 'Technology',     emoji: '🤖', color: 'bg-cyan-100 text-cyan-800' },
  agriculture:      { name: 'Agriculture',    emoji: '🌾', color: 'bg-lime-100 text-lime-800' },
  'farmer-stories': { name: 'Farmer Stories', emoji: '👨‍🌾', color: 'bg-green-100 text-green-800' },
  livestock:        { name: 'Livestock',      emoji: '🐄', color: 'bg-orange-100 text-orange-800' },
  export:           { name: 'Agri Exports',   emoji: '🌍', color: 'bg-rose-100 text-rose-800' },
  events:           { name: 'Events',         emoji: '📅', color: 'bg-violet-100 text-violet-800' },
};

function getImage(a: NewsArticle): string {
  if (!a.image) return 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&h=600&fit=crop';
  if (typeof a.image === 'string') return a.image;
  return (a.image as { url: string }).url || '';
}
function getAuthor(a: NewsArticle): string {
  if (typeof a.author === 'string') return a.author;
  return (a.author as { name: string }).name || '';
}
function getKey(a: NewsArticle) { return a.slug || a._id || ''; }

export default function NewsDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [related, setRelated] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/news/${encodeURIComponent(id)}`)
      .then((r) => r.json())
      .then((j) => {
        if (j.success && j.data?.article) {
          setArticle(j.data.article);
          setRelated(j.data.related || []);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 rounded bg-gray-200" />
          <div className="aspect-[16/7] rounded-2xl bg-gray-200" />
          <div className="h-8 w-3/4 rounded bg-gray-200" />
          <div className="h-4 rounded bg-gray-200" />
          <div className="h-4 w-5/6 rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Article not found</h1>
        <Link href="/news" className="mt-4 inline-block text-green-700 hover:underline">← Back to News</Link>
      </div>
    );
  }

  const cat = CAT_META[article.category];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-green-700">Home</Link>
          <span>/</span>
          <Link href="/news" className="hover:text-green-700">News</Link>
          <span>/</span>
          <span className="line-clamp-1 text-gray-800">{article.title}</span>
        </nav>

        <article className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
          <div className="relative aspect-[16/7] overflow-hidden bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getImage(article)}
              alt={article.title}
              className="h-full w-full object-cover"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&h=600&fit=crop'; }}
            />
            {cat && (
              <div className="absolute top-4 left-4">
                <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${cat.color}`}>
                  {cat.emoji} {cat.name}
                </span>
              </div>
            )}
            {article.views && article.views > 1000 && (
              <div className="absolute top-4 right-4">
                <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
                  🔥 {article.views.toLocaleString('en-IN')} reads
                </span>
              </div>
            )}
          </div>

          <div className="p-6 sm:p-10">
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
              <span>{new Date(article.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <span>·</span>
              <span>{article.readTime}</span>
              <span>·</span>
              <span>By <strong className="text-gray-700">{getAuthor(article)}</strong></span>
              {article.source && <><span>·</span><span className="font-medium text-green-700">{article.source}</span></>}
            </div>

            <h1 className="mt-4 text-2xl font-extrabold leading-snug text-gray-900 sm:text-3xl">
              {article.title}
            </h1>

            <p className="mt-4 border-l-4 border-green-500 pl-4 text-lg font-medium leading-relaxed text-gray-600">
              {article.excerpt}
            </p>

            <div className="mt-8 space-y-5 text-gray-700 leading-relaxed">
              {article.content.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {(article.tags || []).map((tag) => (
                <Link
                  key={tag}
                  href={`/news?q=${encodeURIComponent(tag)}`}
                  className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-green-100 hover:text-green-800 transition"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        </article>

        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-5 text-xl font-bold text-gray-900">Related Articles</h2>
            <div className="grid gap-5 sm:grid-cols-3">
              {related.map((r) => (
                <Link key={getKey(r)} href={`/news/${getKey(r)}`} className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 hover:shadow-md transition">
                  <div className="relative h-36 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getImage(r)}
                      alt=""
                      className="h-full w-full object-cover transition group-hover:scale-105"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop'; }}
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-green-700">{r.title}</p>
                    <p className="mt-1 text-xs text-gray-400">{r.readTime}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mt-8 flex items-center gap-4">
          <Link href="/news" className="text-sm font-semibold text-green-700 hover:underline">← Back to all news</Link>
          <Link href="/marketplace/livestock" className="text-sm font-semibold text-gray-600 hover:text-green-700">Browse Livestock →</Link>
        </div>
      </div>
    </div>
  );
}
