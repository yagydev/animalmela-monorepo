import { Router } from 'express';

export const whatsappRouter = Router();

whatsappRouter.get('/link', (req, res) => {
  const phone = String(req.query.phone ?? '').replace(/[^\d]/g, '');
  const message = encodeURIComponent(String(req.query.message ?? 'Hello from Kisaan Mela'));

  if (!phone) {
    return res.status(400).json({ error: 'phone is required' });
  }

  return res.json({
    link: `https://wa.me/${phone}?text=${message}`
  });
});
