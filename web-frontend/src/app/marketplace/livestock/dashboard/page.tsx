'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

type ListingStatus = 'pending' | 'approved' | 'rejected' | 'archived';
type LeadStatus = 'new' | 'contacted' | 'closed' | 'spam';

type SellerListing = {
  _id: string;
  name: string;
  price: number;
  status: ListingStatus;
  featured: boolean;
  viewsCount?: number;
  leadCount?: number;
  boostedUntil?: string;
  images?: string[];
  location: string;
  createdAt: string;
};

type SellerLead = {
  _id: string;
  listingId: string;
  listingTitle: string;
  buyerName: string;
  buyerPhone: string;
  buyerMessage?: string;
  status: LeadStatus;
  createdAt: string;
};

type BuyerLead = {
  _id: string;
  listingId: string;
  status: LeadStatus;
  buyerMessage?: string;
  createdAt: string;
  listing: {
    _id: string;
    name: string;
    price: number;
    images?: string[];
    location: string;
    status: string;
  } | null;
};

type SellerData = { listings: SellerListing[]; leads: SellerLead[] };
type BuyerData = { leads: BuyerLead[] };

const STATUS_BADGE: Record<ListingStatus, string> = {
  approved: 'bg-green-100 text-green-800',
  pending: 'bg-amber-100 text-amber-800',
  rejected: 'bg-red-100 text-red-800',
  archived: 'bg-gray-100 text-gray-500'
};

const LEAD_STATUS_LABEL: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  closed: 'Closed',
  spam: 'Spam'
};

function money(n: number) {
  return `₹${Number(n).toLocaleString('en-IN')}`;
}

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' });
}

export default function LivestockDashboardPage() {
  const [tab, setTab] = useState<'seller' | 'buyer'>('seller');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sellerData, setSellerData] = useState<SellerData | null>(null);
  const [buyerData, setBuyerData] = useState<BuyerData | null>(null);
  const [leadStatuses, setLeadStatuses] = useState<Record<string, LeadStatus>>({});
  const [patchingLead, setPatchingLead] = useState<string | null>(null);
  const [boostingId, setBoostingId] = useState<string | null>(null);
  const [boostMsg, setBoostMsg] = useState<Record<string, string>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const digits = phone.replace(/\D/g, '').slice(-10);
    if (digits.length < 10) {
      setError('Enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    setError(null);
    setSellerData(null);
    setBuyerData(null);
    setLeadStatuses({});
    try {
      const res = await fetch(
        `/api/marketplace/livestock/dashboard?phone=${encodeURIComponent(digits)}&role=${tab}`
      );
      const j = await res.json();
      if (!j.success) {
        setError(j.error || 'Failed to load dashboard');
        return;
      }
      if (tab === 'seller') {
        setSellerData(j.data as SellerData);
        // Seed local status map from fetched leads
        const map: Record<string, LeadStatus> = {};
        (j.data.leads as SellerLead[]).forEach((l) => { map[l._id] = l.status; });
        setLeadStatuses(map);
      } else {
        setBuyerData(j.data as BuyerData);
      }
    } catch {
      setError('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, [phone, tab]);

  const updateLeadStatus = async (leadId: string, newStatus: LeadStatus) => {
    const digits = phone.replace(/\D/g, '').slice(-10);
    setPatchingLead(leadId);
    try {
      const res = await fetch(`/api/marketplace/livestock/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, sellerPhone: digits })
      });
      const j = await res.json();
      if (j.success) {
        setLeadStatuses((prev) => ({ ...prev, [leadId]: newStatus }));
      }
    } catch {
      /* silent */
    } finally {
      setPatchingLead(null);
    }
  };

  const deleteListing = async (listingId: string) => {
    const digits = phone.replace(/\D/g, '').slice(-10);
    setDeletingId(listingId);
    try {
      const res = await fetch(`/api/marketplace/livestock/${listingId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sellerPhone: digits })
      });
      const j = await res.json();
      if (j.success) {
        setDeleteConfirmId(null);
        await load();
      }
    } catch {
      /* silent */
    } finally {
      setDeletingId(null);
    }
  };

  const boostListing = async (listingId: string, days: 3 | 5 | 10) => {
    const digits = phone.replace(/\D/g, '').slice(-10);
    setBoostingId(listingId);
    try {
      const res = await fetch('/api/marketplace/livestock/boost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId, sellerPhone: digits, days })
      });
      const j = await res.json();
      if (j.success) {
        setBoostMsg((prev) => ({ ...prev, [listingId]: `🚀 Boosted ${days} days! ₹${j.data.price} (demo)` }));
        // Refresh dashboard
        await load();
      } else {
        setBoostMsg((prev) => ({ ...prev, [listingId]: j.error || 'Boost failed' }));
      }
    } catch {
      setBoostMsg((prev) => ({ ...prev, [listingId]: 'Boost failed' }));
    } finally {
      setBoostingId(null);
    }
  };

  const handleTabSwitch = (t: 'seller' | 'buyer') => {
    setTab(t);
    setSellerData(null);
    setBuyerData(null);
    setError(null);
    setLeadStatuses({});
  };

  const hasData = sellerData !== null || buyerData !== null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/60 to-gray-50 pb-16">
      {/* Header */}
      <div className="border-b border-green-100 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
          <Link
            href="/marketplace/livestock"
            className="text-sm font-medium text-green-800 hover:underline"
          >
            ← Livestock marketplace
          </Link>
          <h1 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">My Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your listings and leads. Enter your registered mobile number to continue.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Tab switcher */}
        <div className="flex gap-1 rounded-xl bg-gray-100 p-1 w-fit">
          {(['seller', 'buyer'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => handleTabSwitch(t)}
              className={`rounded-lg px-5 py-2 text-sm font-semibold transition ${
                tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t === 'seller' ? '🐄 Seller' : '🛒 Buyer'}
            </button>
          ))}
        </div>

        {/* Phone input */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700">
              {tab === 'seller' ? 'Your seller mobile number' : 'Your buyer mobile number'}
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && load()}
              placeholder="10-digit mobile"
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/30 sm:max-w-xs"
            />
          </div>
          <button
            type="button"
            disabled={loading}
            onClick={load}
            className="rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Loading…' : 'Load dashboard'}
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {/* ─── SELLER VIEW ─── */}
        {tab === 'seller' && sellerData && (
          <div className="mt-8 space-y-10">
            {/* My Listings */}
            <section>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  My Listings ({sellerData.listings.length})
                </h2>
                <Link
                  href="/marketplace/livestock/sell"
                  className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                >
                  + Add listing
                </Link>
              </div>

              {sellerData.listings.length === 0 ? (
                <div className="mt-4 rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
                  No listings found for this number.{' '}
                  <Link href="/marketplace/livestock/sell" className="text-green-700 underline">
                    Add your first animal
                  </Link>
                </div>
              ) : (
                <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white">
                  <table className="w-full text-sm">
                    <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                      <tr>
                        <th className="px-4 py-3 text-left">Animal</th>
                        <th className="px-4 py-3 text-left">Price</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Analytics</th>
                        <th className="px-4 py-3 text-left">Listed</th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {sellerData.listings.map((item) => {
                        const views = item.viewsCount ?? 0;
                        const leads = item.leadCount ?? 0;
                        const convRate = views > 0 ? ((leads / views) * 100).toFixed(1) : '0.0';
                        const isBoosted = item.boostedUntil && new Date(item.boostedUntil) > new Date();
                        return (
                        <tr key={item._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              {item.images?.[0] && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={item.images[0]}
                                  alt=""
                                  className="h-10 w-10 rounded-lg object-cover"
                                />
                              )}
                              <div>
                                <p className="font-medium text-gray-900 line-clamp-1">{item.name}</p>
                                <p className="text-xs text-gray-500">📍 {item.location}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-semibold text-green-800">{money(item.price)}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${STATUS_BADGE[item.status]}`}
                            >
                              {item.status}
                            </span>
                            {isBoosted && (
                              <span className="ml-1 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                                🚀 Boosted
                              </span>
                            )}
                            {item.featured && !isBoosted && (
                              <span className="ml-1 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                                ★ Featured
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-xs text-gray-600">
                              👁 {views} views · 📩 {leads} leads
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              📊 {convRate}% conversion
                            </p>
                          </td>
                          <td className="px-4 py-3 text-gray-500">{shortDate(item.createdAt)}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-col gap-1.5">
                              {item.status === 'approved' && (
                                <Link
                                  href={`/marketplace/livestock/${item._id}`}
                                  className="text-green-700 hover:underline text-xs font-medium"
                                >
                                  View →
                                </Link>
                              )}
                              {!isBoosted && item.status === 'approved' && (
                                <div className="flex gap-1">
                                  {([3, 5, 10] as const).map((d) => (
                                    <button
                                      key={d}
                                      type="button"
                                      disabled={boostingId === item._id}
                                      onClick={() => boostListing(item._id, d)}
                                      className="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-semibold text-amber-800 hover:bg-amber-200 disabled:opacity-50"
                                      title={`Boost ${d} days`}
                                    >
                                      🚀{d}d
                                    </button>
                                  ))}
                                </div>
                              )}
                              {boostMsg[item._id] && (
                                <p className="text-xs text-amber-700">{boostMsg[item._id]}</p>
                              )}
                              {/* Delete */}
                              {deleteConfirmId === item._id ? (
                                <div className="flex gap-1 items-center">
                                  <span className="text-xs text-red-600">Remove?</span>
                                  <button
                                    type="button"
                                    disabled={deletingId === item._id}
                                    onClick={() => deleteListing(item._id)}
                                    className="rounded bg-red-100 px-1.5 py-0.5 text-xs font-semibold text-red-700 hover:bg-red-200 disabled:opacity-50"
                                  >
                                    {deletingId === item._id ? '…' : 'Yes'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600 hover:bg-gray-200"
                                  >
                                    No
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setDeleteConfirmId(item._id)}
                                  className="text-xs text-red-500 hover:text-red-700 hover:underline text-left"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* My Leads */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900">
                Leads Received ({sellerData.leads.length})
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Buyer enquiries. Update status to track follow-ups.
              </p>

              {sellerData.leads.length === 0 ? (
                <div className="mt-4 rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
                  No leads yet. Share your listings to attract buyers.
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {sellerData.leads.map((lead) => {
                    const currentStatus = leadStatuses[lead._id] ?? lead.status;
                    return (
                      <div
                        key={lead._id}
                        className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-gray-900">{lead.buyerName}</p>
                            <a
                              href={`tel:${lead.buyerPhone}`}
                              className="text-sm text-green-700 hover:underline"
                            >
                              {lead.buyerPhone}
                            </a>
                            <p className="mt-1 text-xs text-gray-500">
                              For:{' '}
                              <span className="font-medium text-gray-700">{lead.listingTitle}</span>{' '}
                              · {shortDate(lead.createdAt)}
                            </p>
                            {lead.buyerMessage && (
                              <p className="mt-2 text-sm text-gray-600 italic">"{lead.buyerMessage}"</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <a
                              href={`https://wa.me/91${lead.buyerPhone.replace(/\D/g, '').slice(-10)}?text=${encodeURIComponent(`Hi ${lead.buyerName}, this is the seller from KisaanMela regarding your enquiry for ${lead.listingTitle}.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-lg bg-green-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-green-600"
                            >
                              WhatsApp
                            </a>
                            <a
                              href={`tel:${lead.buyerPhone}`}
                              className="rounded-lg border border-green-700 px-3 py-1.5 text-xs font-semibold text-green-800 hover:bg-green-50"
                            >
                              Call
                            </a>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-xs text-gray-500">Status:</span>
                          <select
                            disabled={patchingLead === lead._id}
                            value={currentStatus}
                            onChange={(e) =>
                              updateLeadStatus(lead._id, e.target.value as LeadStatus)
                            }
                            className="rounded-lg border border-gray-200 px-2 py-1 text-xs font-medium focus:border-green-500 focus:outline-none disabled:opacity-50"
                          >
                            {(Object.keys(LEAD_STATUS_LABEL) as LeadStatus[]).map((s) => (
                              <option key={s} value={s}>
                                {LEAD_STATUS_LABEL[s]}
                              </option>
                            ))}
                          </select>
                          {patchingLead === lead._id && (
                            <span className="text-xs text-gray-400">Saving…</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}

        {/* ─── BUYER VIEW ─── */}
        {tab === 'buyer' && buyerData && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900">
              My Enquiries ({buyerData.leads.length})
            </h2>
            <p className="mt-1 text-sm text-gray-500">Animals you've expressed interest in.</p>

            {buyerData.leads.length === 0 ? (
              <div className="mt-4 rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
                No enquiries found.{' '}
                <Link href="/marketplace/livestock" className="text-green-700 underline">
                  Browse animals
                </Link>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {buyerData.leads.map((lead) => (
                  <div
                    key={lead._id}
                    className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:p-5"
                  >
                    {lead.listing?.images?.[0] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={lead.listing.images[0]}
                        alt=""
                        className="h-16 w-16 shrink-0 rounded-xl object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {lead.listing?.name ?? 'Listing removed'}
                      </p>
                      {lead.listing && (
                        <p className="text-sm text-green-800 font-medium">
                          {money(lead.listing.price)}
                          <span className="mx-2 text-gray-300">·</span>
                          <span className="text-gray-500">📍 {lead.listing.location}</span>
                        </p>
                      )}
                      {lead.buyerMessage && (
                        <p className="mt-1 text-sm text-gray-500 italic">"{lead.buyerMessage}"</p>
                      )}
                      <p className="mt-1 text-xs text-gray-400">{shortDate(lead.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${
                          lead.status === 'contacted'
                            ? 'bg-green-100 text-green-800'
                            : lead.status === 'closed'
                              ? 'bg-gray-100 text-gray-600'
                              : lead.status === 'spam'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {LEAD_STATUS_LABEL[lead.status]}
                      </span>
                      {lead.listing && lead.listing.status === 'approved' && (
                        <Link
                          href={`/marketplace/livestock/${lead.listing._id}`}
                          className="text-xs font-medium text-green-700 hover:underline"
                        >
                          View listing →
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Empty prompt before any load */}
        {!hasData && !loading && !error && (
          <div className="mt-10 rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center text-gray-500">
            <p className="text-base font-medium text-gray-700">Enter your mobile number above</p>
            <p className="mt-1 text-sm">
              {tab === 'seller'
                ? 'See your listings and manage buyer leads.'
                : 'See animals you have enquired about.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
