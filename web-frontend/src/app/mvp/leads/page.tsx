import { LeadCard, type LeadItem } from '@/components/mvp/LeadCard';
import { fetchLeadsForVendor } from '../../../lib/mvpApi';

export default async function LeadsPage() {
  const leads = await fetchLeadsForVendor();

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Lead Marketplace</h1>
        <p className="text-sm text-gray-600">Vendors can view buyer requirements and contact instantly.</p>
      </div>

      {leads.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-600">
          No open requirements yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {leads.map((lead: LeadItem) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      )}
    </div>
  );
}
