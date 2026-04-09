import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { env } from '../config/env.js';

const loginSchema = z.object({
  email: z.string().email(),
  role: z.enum(['farmer', 'vendor', 'organizer'])
});

export const authRouter = Router();

authRouter.post('/login', (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const { email, role } = parsed.data;
  const token = jwt.sign({ role }, env.jwtSecret, {
    subject: email,
    expiresIn: '7d'
  });

  return res.json({
    token,
    user: {
      id: email,
      email,
      role
    }
  });
});
