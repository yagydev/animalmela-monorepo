import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db/pool.js';
import { requireAuth, requireRole, type AuthRequest } from '../middleware/auth.js';
import { mockStore } from '../data/mockStore.js';

const createLeadSchema = z.object({
  product: z.string().min(2),
  quantity: z.string().min(1),
  location: z.string().min(2),
  details: z.string().optional()
});

export const leadsRouter = Router();

leadsRouter.post('/', requireAuth, requireRole('farmer', 'organizer'), async (req: AuthRequest, res) => {
  const parsed = createLeadSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  try {
    const lead = await db.query(
      `
        INSERT INTO buyer_leads (buyer_id, product, quantity, location, details, status)
        VALUES ($1, $2, $3, $4, $5, 'open')
        RETURNING id, buyer_id, product, quantity, location, details, status, created_at
      `,
      [
        req.user?.id ?? 'unknown-buyer',
        parsed.data.product,
        parsed.data.quantity,
        parsed.data.location,
        parsed.data.details ?? null
      ]
    );

    return res.status(201).json({ data: lead.rows[0], source: 'postgres' });
  } catch {
    const lead = {
      id: `lead-mock-${Date.now()}`,
      buyer_id: req.user?.id ?? 'unknown-buyer',
      product: parsed.data.product,
      quantity: parsed.data.quantity,
      location: parsed.data.location,
      details: parsed.data.details ?? null,
      status: 'open' as const,
      created_at: new Date().toISOString()
    };
    mockStore.leads.unshift(lead);
    return res.status(201).json({ data: lead, source: 'mock' });
  }
});

leadsRouter.get('/', requireAuth, requireRole('vendor', 'organizer'), async (_req, res) => {
  try {
    const result = await db.query(
      `
        SELECT id, buyer_id, product, quantity, location, details, status, created_at
        FROM buyer_leads
        WHERE status = 'open'
        ORDER BY created_at DESC
      `
    );

    return res.json({ data: result.rows, source: 'postgres' });
  } catch {
    const rows = mockStore.leads.filter((lead) => lead.status === 'open');
    return res.json({ data: rows, source: 'mock' });
  }
});
