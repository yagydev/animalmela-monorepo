import { Router } from 'express';
import { db } from '../db/pool.js';
import { mockStore } from '../data/mockStore.js';

export const eventsRouter = Router();

eventsRouter.get('/', async (req, res) => {
  const location = (req.query.location as string | undefined)?.trim();
  const date = (req.query.date as string | undefined)?.trim();

  const values: string[] = [];
  const where: string[] = [];

  if (location) {
    values.push(`%${location}%`);
    where.push(`location ILIKE $${values.length}`);
  }

  if (date) {
    values.push(date);
    where.push(`DATE(start_date) = $${values.length}`);
  }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const query = `
    SELECT id, title, description, location, start_date, end_date, price, image_url
    FROM events
    ${whereClause}
    ORDER BY start_date ASC
  `;

  try {
    const result = await db.query(query, values);
    return res.json({ data: result.rows, source: 'postgres' });
  } catch {
    const filtered = mockStore.events.filter((event) => {
      const matchLocation = location
        ? event.location.toLowerCase().includes(location.toLowerCase())
        : true;
      const matchDate = date ? event.start_date.slice(0, 10) === date : true;
      return matchLocation && matchDate;
    });
    return res.json({ data: filtered, source: 'mock' });
  }
});

eventsRouter.get('/:id', async (req, res) => {
  try {
    const result = await db.query(
      `
        SELECT id, title, description, location, start_date, end_date, price, image_url
        FROM events
        WHERE id = $1
      `,
      [req.params.id]
    );

    if (!result.rowCount) {
      return res.status(404).json({ error: 'Event not found' });
    }

    return res.json({ data: result.rows[0], source: 'postgres' });
  } catch {
    const event = mockStore.events.find((item) => item.id === req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    return res.json({ data: event, source: 'mock' });
  }
});
