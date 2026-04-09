export interface LeadItem {
  id: string;
  product: string;
  quantity: string;
  location: string;
  details?: string;
}

export function LeadCard({ lead }: { lead: LeadItem }) {
  const message = encodeURIComponent(
    `Hi, I saw your requirement for ${lead.product} (${lead.quantity}) in ${lead.location}.`
  );
  const whatsappLink = `https://wa.me/919999778321?text=${message}`;

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">{lead.product}</h3>
      <p className="text-sm text-gray-700">Quantity: {lead.quantity}</p>
      <p className="text-sm text-gray-700">Location: {lead.location}</p>
      {lead.details ? <p className="mt-1 text-sm text-gray-600">{lead.details}</p> : null}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex items-center rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
      >
        Contact on WhatsApp
      </a>
    </article>
  );
}
