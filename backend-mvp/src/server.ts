import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { authRouter } from './routes/auth.js';
import { eventsRouter } from './routes/events.js';
import { stallsRouter } from './routes/stalls.js';
import { leadsRouter } from './routes/leads.js';
import { whatsappRouter } from './routes/whatsapp.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true, service: 'backend-mvp' }));

app.use('/api/auth', authRouter);
app.use('/api/events', eventsRouter);
app.use('/api/stalls', stallsRouter);
app.use('/api/leads', leadsRouter);
app.use('/api/whatsapp', whatsappRouter);

app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`MVP backend running on http://localhost:${env.port}`);
});
