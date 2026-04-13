'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

interface NewsArticle {
  _id?: string;
  id?: string;
  slug?: string;
  title: string;
  excerpt: string;
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

const CATEGORIES = [
  { id: 'all',            name: 'All News',       emoji: '📰', dbCat: null },
  { id: 'policy',         name: 'Govt Schemes',   emoji: '🏛️', dbCat: 'policy' },
  { id: 'market',         name: 'Market Updates', emoji: '📈', dbCat: 'market' },
  { id: 'technology',     name: 'Technology',     emoji: '🤖', dbCat: 'technology' },
  { id: 'agriculture',    name: 'Agriculture',    emoji: '🌾', dbCat: 'agriculture' },
  { id: 'farmer-stories', name: 'Farmer Stories', emoji: '👨‍🌾', dbCat: 'farmer-stories' },
  { id: 'livestock',      name: 'Livestock',      emoji: '🐄', dbCat: 'livestock' },
  { id: 'export',         name: 'Agri Exports',   emoji: '🌍', dbCat: 'export' },
];

// Normalise article shape from DB or static
function getArticleKey(a: NewsArticle) { return a.slug || a._id || a.id || ''; }
function getImage(a: NewsArticle): string {
  if (!a.image) return 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=500&fit=crop';
  if (typeof a.image === 'string') return a.image;
  return (a.image as { url: string }).url || '';
}
function getAuthor(a: NewsArticle): string {
  if (typeof a.author === 'string') return a.author;
  return (a.author as { name: string }).name || '';
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' });
}

const CAT_COLORS: Record<string, string> = {
  policy: 'bg-blue-100 text-blue-800',
  market: 'bg-amber-100 text-amber-800',
  technology: 'bg-cyan-100 text-cyan-800',
  agriculture: 'bg-lime-100 text-lime-800',
  'farmer-stories': 'bg-green-100 text-green-800',
  livestock: 'bg-orange-100 text-orange-800',
  export: 'bg-rose-100 text-rose-800',
  events: 'bg-violet-100 text-violet-800',
};

function CategoryBadge({ category }: { category: string }) {
  const cat = CATEGORIES.find((c) => c.dbCat === category || c.id === category);
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${CAT_COLORS[category] || 'bg-gray-100 text-gray-700'}`}>
      {cat?.emoji || '📄'} {cat?.name || category}
    </span>
  );
}

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch from DB
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch('/api/news?limit=50');
        const j = await res.json();
        if (j.success && j.data?.articles?.length > 0) {
          setArticles(j.data.articles);
        }
      } catch {
        // keep empty — filtered articles will show empty state
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const featuredArticles = useMemo(() => articles.filter((a) => a.featured), [articles]);

  const filteredArticles = useMemo(() => {
    let items = articles;
    if (selectedCategory !== 'all') {
      const dbCat = CATEGORIES.find((c) => c.id === selectedCategory)?.dbCat;
      if (dbCat) items = items.filter((a) => a.category === dbCat);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          (a.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    }
    return items;
  }, [articles, selectedCategory, searchQuery]);

  const latestArticles = useMemo(
    () => [...articles].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()).slice(0, 6),
    [articles]
  );

  const allTags = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => (a.tags || []).forEach((t) => set.add(t)));
    return Array.from(set).slice(0, 24);
  }, [articles]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-green-700 via-green-800 to-emerald-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-green-300">KisaanMela News</p>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">Agricultural News & Insights</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-green-100">
              Market prices, government schemes, farmer success stories, and the latest in agri-tech — curated daily.
            </p>
            <div className="mx-auto mt-8 flex max-w-lg overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur focus-within:ring-2 focus-within:ring-green-300">
              <span className="flex items-center pl-4 text-green-200">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search news, topics, schemes…"
                className="flex-1 bg-transparent px-4 py-3 text-white placeholder-green-300 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* ── Category Pills ── */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.id); setSearchQuery(''); }}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                selectedCategory === cat.id
                  ? 'bg-green-700 text-white shadow'
                  : 'bg-white text-gray-700 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>

        {/* ── Loading skeleton ── */}
        {loading && (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200">
                <div className="h-44 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-3 w-20 rounded bg-gray-200" />
                  <div className="h-4 rounded bg-gray-200" />
                  <div className="h-4 w-3/4 rounded bg-gray-200" />
                  <div className="h-3 w-1/2 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <div className="mt-10 lg:grid lg:grid-cols-3 lg:gap-10">
            {/* ── Main ── */}
            <div className="lg:col-span-2">
              {/* Featured — only on All + no search */}
              {selectedCategory === 'all' && !searchQuery && featuredArticles.length > 0 && (
                <section className="mb-10">
                  <h2 className="mb-5 flex items-center gap-2 text-xl font-bold text-gray-900">
                    <span className="h-5 w-1 rounded-full bg-green-600" />
                    Featured Stories
                  </h2>
                  <div className="space-y-6">
                    {featuredArticles.slice(0, 3).map((article, idx) => (
                      <article key={getArticleKey(article)} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 hover:shadow-md transition">
                        {idx === 0 ? (
                          <>
                            <Link href={`/news/${getArticleKey(article)}`}>
                              <div className="relative aspect-[16/7] overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={getImage(article)}
                                  alt={article.title}
                                  className="h-full w-full object-cover"
                                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&h=600&fit=crop'; }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4">
                                  <CategoryBadge category={article.category} />
                                  <h3 className="mt-2 text-xl font-bold text-white leading-snug">{article.title}</h3>
                                </div>
                              </div>
                            </Link>
                            <div className="p-5">
                              <p className="text-gray-600 text-sm leading-relaxed">{article.excerpt}</p>
                              <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                  <span>{getAuthor(article)}</span>
                                  <span>·</span>
                                  <span>{timeAgo(article.publishedAt)}</span>
                                  <span>·</span>
                                  <span>{article.readTime}</span>
                                </div>
                                <Link href={`/news/${getArticleKey(article)}`} className="text-sm font-semibold text-green-700 hover:underline">
                                  Read more →
                                </Link>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="flex gap-4 p-4 sm:p-5">
                            <Link href={`/news/${getArticleKey(article)}`} className="relative h-28 w-32 shrink-0 overflow-hidden rounded-xl sm:h-32 sm:w-40">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={getImage(article)}
                                alt=""
                                className="h-full w-full object-cover"
                                onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=300&fit=crop'; }}
                              />
                            </Link>
                            <div className="flex flex-col justify-between flex-1">
                              <div>
                                <CategoryBadge category={article.category} />
                                <Link href={`/news/${getArticleKey(article)}`}>
                                  <h3 className="mt-1.5 font-bold text-gray-900 leading-snug line-clamp-2 text-sm sm:text-base hover:text-green-700">{article.title}</h3>
                                </Link>
                                <p className="mt-1 text-xs text-gray-500 line-clamp-2">{article.excerpt}</p>
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                  <span>{timeAgo(article.publishedAt)}</span>
                                  <span>·</span>
                                  <span>{article.readTime}</span>
                                </div>
                                <Link href={`/news/${getArticleKey(article)}`} className="text-xs font-semibold text-green-700 hover:underline">Read →</Link>
                              </div>
                            </div>
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {/* Article grid */}
              <section>
                <h2 className="mb-5 flex items-center gap-2 text-xl font-bold text-gray-900">
                  <span className="h-5 w-1 rounded-full bg-green-600" />
                  {searchQuery
                    ? `Search results for "${searchQuery}" (${filteredArticles.length})`
                    : selectedCategory === 'all'
                      ? `All Articles (${articles.length})`
                      : CATEGORIES.find((c) => c.id === selectedCategory)?.name}
                </h2>

                {filteredArticles.length === 0 ? (
                  <div className="rounded-2xl bg-white p-12 text-center text-gray-500 ring-1 ring-gray-200">
                    <p className="text-lg font-medium">No articles found</p>
                    <button onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }} className="mt-3 text-sm text-green-700 hover:underline">
                      Clear filters
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-5 sm:grid-cols-2">
                    {filteredArticles.map((article) => (
                      <article key={getArticleKey(article)} className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 hover:shadow-md transition">
                        <Link href={`/news/${getArticleKey(article)}`}>
                          <div className="relative overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={getImage(article)}
                              alt={article.title}
                              className="h-44 w-full object-cover transition duration-300 group-hover:scale-105"
                              onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=500&fit=crop'; }}
                            />
                            <div className="absolute top-3 left-3">
                              <CategoryBadge category={article.category} />
                            </div>
                            {article.views && article.views > 1000 && (
                              <div className="absolute top-3 right-3">
                                <span className="rounded-full bg-black/50 px-2 py-0.5 text-xs text-white">
                                  🔥 Trending
                                </span>
                              </div>
                            )}
                          </div>
                        </Link>
                        <div className="p-4">
                          <Link href={`/news/${getArticleKey(article)}`}>
                            <h3 className="font-bold text-gray-900 leading-snug line-clamp-2 hover:text-green-700">{article.title}</h3>
                          </Link>
                          <p className="mt-1.5 text-sm text-gray-600 line-clamp-2">{article.excerpt}</p>
                          <div className="mt-3 flex flex-wrap gap-1">
                            {(article.tags || []).slice(0, 3).map((tag) => (
                              <button
                                key={tag}
                                onClick={() => setSearchQuery(tag)}
                                className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 hover:bg-green-100 hover:text-green-800 transition"
                              >
                                #{tag}
                              </button>
                            ))}
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                              <span>{getAuthor(article)}</span>
                              <span>·</span>
                              <span>{timeAgo(article.publishedAt)}</span>
                              <span>·</span>
                              <span>{article.readTime}</span>
                            </div>
                            <Link href={`/news/${getArticleKey(article)}`} className="text-sm font-semibold text-green-700 hover:underline">
                              Read →
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* ── Sidebar ── */}
            <aside className="mt-12 space-y-8 lg:mt-0">
              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
                <h3 className="mb-4 flex items-center gap-2 font-bold text-gray-900">
                  <span className="h-4 w-1 rounded-full bg-green-600" />
                  Latest News
                </h3>
                <div className="space-y-4">
                  {latestArticles.map((article) => (
                    <Link key={getArticleKey(article)} href={`/news/${getArticleKey(article)}`} className="group flex gap-3">
                      <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-lg">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={getImage(article)}
                          alt=""
                          className="h-full w-full object-cover transition group-hover:scale-105"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=300&fit=crop'; }}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 leading-snug line-clamp-2 group-hover:text-green-700">
                          {article.title}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-400">{timeAgo(article.publishedAt)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {allTags.length > 0 && (
                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
                  <h3 className="mb-4 flex items-center gap-2 font-bold text-gray-900">
                    <span className="h-4 w-1 rounded-full bg-green-600" />
                    Trending Topics
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => { setSelectedCategory('all'); setSearchQuery(tag); }}
                        className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-green-100 hover:text-green-800 transition"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-2xl bg-gradient-to-br from-green-700 to-emerald-800 p-5 text-white">
                <h3 className="font-bold text-lg">📬 Daily Farm Digest</h3>
                <p className="mt-1.5 text-sm text-green-100">Market prices, scheme alerts and weather forecasts every morning.</p>
                <div className="mt-4 space-y-2">
                  <input
                    type="email"
                    placeholder="your@phone-or-email"
                    className="w-full rounded-xl bg-white/10 px-3 py-2 text-sm text-white placeholder-green-300 ring-1 ring-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <button className="w-full rounded-xl bg-white py-2 text-sm font-bold text-green-800 hover:bg-green-50 transition">
                    Subscribe Free
                  </button>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
                <h3 className="mb-4 flex items-center gap-2 font-bold text-gray-900">
                  <span className="h-4 w-1 rounded-full bg-green-600" />
                  Quick Links
                </h3>
                <div className="space-y-2 text-sm">
                  {[
                    { href: '/marketplace/livestock', label: '🐄 Livestock Marketplace' },
                    { href: '/marketplace/livestock/tools/ration', label: '🌾 Feed Calculator' },
                    { href: '/marketplace/livestock/demand', label: '📋 Post Buying Requirement' },
                    { href: '/marketplace/livestock/sell', label: '+ List Your Animal' },
                  ].map((link) => (
                    <Link key={link.href} href={link.href} className="flex items-center justify-between rounded-lg px-3 py-2 text-gray-700 hover:bg-green-50 hover:text-green-800 transition">
                      <span>{link.label}</span>
                      <span className="text-gray-400">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
