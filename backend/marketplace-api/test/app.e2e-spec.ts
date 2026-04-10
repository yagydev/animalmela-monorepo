import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createE2eApp } from './helpers/e2e-app';

describe('Health (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createE2eApp();
  }, 60_000);

  afterAll(async () => {
    await app?.close();
  });

  it('GET /api/health', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/health')
      .expect(200);
    expect(res.body.status).toBe('ok');
  });
});
