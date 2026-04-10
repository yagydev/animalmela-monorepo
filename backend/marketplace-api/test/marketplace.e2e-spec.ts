import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';
import { createE2eApp } from './helpers/e2e-app';
import { ensureCategorySeed, resetMarketplaceTables } from './helpers/reset-db';

/** Nest may return 201 for POST; accept any 2xx success. */
function expect2xx(res: { status: number }) {
  expect(res.status).toBeGreaterThanOrEqual(200);
  expect(res.status).toBeLessThan(300);
}

describe('Marketplace API (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const otpCode = process.env.OTP_DEV_CODE || '123456';

  beforeAll(async () => {
    app = await createE2eApp();
    prisma = app.get(PrismaService);
  }, 60_000);

  afterAll(async () => {
    await app?.close();
  });

  beforeEach(async () => {
    await resetMarketplaceTables(prisma);
    await ensureCategorySeed(prisma);
  });

  it('GET /api/health returns ok', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/health')
      .expect(expect2xx);
    expect(res.body.status).toBe('ok');
  });

  it('rejects invalid OTP send payload', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/otp/send')
      .send({ phone: 'not-a-phone' })
      .expect(400);
  });

  it('returns 401 for protected routes without JWT', async () => {
    await request(app.getHttpServer()).get('/api/cart').expect(401);
    await request(app.getHttpServer()).get('/api/users/me').expect(401);
  });

  it('runs full buyer + seller + admin + payments + reviews + chat + events flow', async () => {
    const adminPhone = '+919999000001';
    const sellerPhone = '+918888888888';
    const buyerPhone = '+917777777777';

    const sendOtp = (phone: string) =>
      request(app.getHttpServer())
        .post('/api/auth/otp/send')
        .send({ phone })
        .expect(expect2xx);

    const verify = (phone: string, asRole?: string) =>
      request(app.getHttpServer())
        .post(`/api/auth/otp/verify${asRole ? `?as=${asRole}` : ''}`)
        .send({ phone, code: otpCode })
        .expect(expect2xx);

    await sendOtp(adminPhone);
    const adminAuth = await verify(adminPhone, 'ADMIN');
    const tokenAdmin = adminAuth.body.accessToken as string;
    expect(adminAuth.body.user.role).toBe('ADMIN');

    await sendOtp(sellerPhone);
    const sellerAuth = await verify(sellerPhone, 'SELLER');
    const tokenSeller = sellerAuth.body.accessToken as string;
    const sellerUserId = sellerAuth.body.user.id as string;
    expect(sellerAuth.body.user.role).toBe('SELLER');

    await sendOtp(buyerPhone);
    const buyerAuth = await verify(buyerPhone);
    const tokenBuyer = buyerAuth.body.accessToken as string;
    expect(buyerAuth.body.user.role).toBe('BUYER');

    await request(app.getHttpServer())
      .patch('/api/users/me')
      .set('Authorization', `Bearer ${tokenBuyer}`)
      .send({ name: 'Test Buyer', email: 'buyer@example.com' })
      .expect(expect2xx);

    const me = await request(app.getHttpServer())
      .get('/api/users/me')
      .set('Authorization', `Bearer ${tokenBuyer}`)
      .expect(expect2xx);
    expect(me.body.name).toBe('Test Buyer');

    const addrRes = await request(app.getHttpServer())
      .post('/api/users/me/addresses')
      .set('Authorization', `Bearer ${tokenBuyer}`)
      .send({
        label: 'Home',
        line1: 'Village Road 1',
        district: 'Ludhiana',
        state: 'Punjab',
        pincode: '141001',
      })
      .expect(expect2xx);
    const addressId = addrRes.body.id as string;

    const addresses = await request(app.getHttpServer())
      .get('/api/users/me/addresses')
      .set('Authorization', `Bearer ${tokenBuyer}`)
      .expect(expect2xx);
    expect(addresses.body.length).toBe(1);

    const catTree = await request(app.getHttpServer())
      .get('/api/products/categories')
      .expect(expect2xx);
    expect(Array.isArray(catTree.body)).toBe(true);
    const cattle = await prisma.category.findUnique({
      where: { slug: 'cattle' },
    });
    expect(cattle).toBeTruthy();

    await request(app.getHttpServer())
      .post('/api/sellers/onboarding')
      .set('Authorization', `Bearer ${tokenSeller}`)
      .send({ gstNumber: 'GST123', panNumber: 'PAN123' })
      .expect(expect2xx);

    await request(app.getHttpServer())
      .patch(`/api/admin/sellers/${sellerUserId}/kyc`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ status: 'APPROVED', notes: 'ok' })
      .expect(expect2xx);

    const storeRes = await request(app.getHttpServer())
      .post('/api/sellers/me/store')
      .set('Authorization', `Bearer ${tokenSeller}`)
      .send({
        name: 'Green Fields',
        slug: 'green-fields',
        description: 'Organic produce',
      })
      .expect(expect2xx);
    const storeId = storeRes.body.id as string;

    const sellerMe = await request(app.getHttpServer())
      .get('/api/sellers/me')
      .set('Authorization', `Bearer ${tokenSeller}`)
      .expect(expect2xx);
    expect(sellerMe.body.store?.slug).toBe('green-fields');

    const productRes = await request(app.getHttpServer())
      .post('/api/products')
      .set('Authorization', `Bearer ${tokenSeller}`)
      .send({
        categoryId: cattle!.id,
        title: 'Organic Wheat 50kg',
        slug: 'organic-wheat-50kg',
        description: 'High quality wheat bag for testing marketplace flow.',
        price: 2500,
        stock: 100,
        state: 'Punjab',
        district: 'Ludhiana',
        imageUrls: ['https://example.com/wheat.jpg'],
      })
      .expect(expect2xx);
    const productId = productRes.body.id as string;

    const listBefore = await request(app.getHttpServer())
      .get('/api/products')
      .expect(expect2xx);
    expect(listBefore.body.items.length).toBe(0);

    await request(app.getHttpServer())
      .patch(`/api/admin/products/${productId}/status`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ status: 'APPROVED' })
      .expect(expect2xx);

    const listAfter = await request(app.getHttpServer())
      .get('/api/products')
      .expect(expect2xx);
    expect(listAfter.body.items.length).toBe(1);
    expect(listAfter.body.items[0].id).toBe(productId);

    const detail = await request(app.getHttpServer())
      .get(`/api/products/${productId}`)
      .expect(expect2xx);
    expect(detail.body.title).toContain('Wheat');

    const filterRes = await request(app.getHttpServer())
      .get('/api/products?state=Punjab&district=Ludhiana&q=wheat')
      .expect(expect2xx);
    expect(filterRes.body.items.length).toBeGreaterThanOrEqual(1);

    const sorted = await request(app.getHttpServer())
      .get('/api/products?sort=price_asc&limit=10')
      .expect(expect2xx);
    expect(sorted.body.items.length).toBeGreaterThanOrEqual(1);

    await request(app.getHttpServer())
      .post('/api/cart/items')
      .set('Authorization', `Bearer ${tokenBuyer}`)
      .send({ productId, quantity: 2 })
      .expect(expect2xx);

    const cart = await request(app.getHttpServer())
      .get('/api/cart')
      .set('Authorization', `Bearer ${tokenBuyer}`)
      .expect(expect2xx);
    expect(cart.body.items?.length ?? 0).toBeGreaterThanOrEqual(1);

    const checkoutRes = await request(app.getHttpServer())
      .post('/api/orders/checkout')
      .set('Authorization', `Bearer ${tokenBuyer}`)
      .send({ addressId })
      .expect(expect2xx);
    const orderId = checkoutRes.body.order.id as string;
    expect(checkoutRes.body.order.status).toBe('PLACED');

    const rz = await request(app.getHttpServer())
      .post(`/api/payments/razorpay/order/${orderId}`)
      .set('Authorization', `Bearer ${tokenBuyer}`)
      .expect(expect2xx);
    expect(rz.body.mock === true || rz.body.mock === false).toBe(true);

    await request(app.getHttpServer())
      .post(`/api/payments/razorpay/mock-complete/${orderId}`)
      .set('Authorization', `Bearer ${tokenBuyer}`)
      .send({ paymentId: 'pay_test_1' })
      .expect(expect2xx);

    const ordersMine = await request(app.getHttpServer())
      .get('/api/orders/me')
      .set('Authorization', `Bearer ${tokenBuyer}`)
      .expect(expect2xx);
    expect(ordersMine.body.some((o: { id: string }) => o.id === orderId)).toBe(
      true,
    );

    const profileWithOrders = await request(app.getHttpServer())
      .get('/api/users/me')
      .set('Authorization', `Bearer ${tokenBuyer}`)
      .expect(expect2xx);
    expect(profileWithOrders.body.orders?.length ?? 0).toBeGreaterThanOrEqual(
      1,
    );

    await request(app.getHttpServer())
      .delete('/api/cart')
      .set('Authorization', `Bearer ${tokenBuyer}`)
      .expect(expect2xx);

    await request(app.getHttpServer())
      .post(`/api/reviews/products/${productId}`)
      .set('Authorization', `Bearer ${tokenBuyer}`)
      .send({ rating: 5, comment: 'Great quality' })
      .expect(expect2xx);

    await request(app.getHttpServer())
      .post(`/api/reviews/stores/${storeId}`)
      .set('Authorization', `Bearer ${tokenBuyer}`)
      .send({ rating: 4, comment: 'Fast response' })
      .expect(201);

    const threadRes = await request(app.getHttpServer())
      .post('/api/chat/threads')
      .set('Authorization', `Bearer ${tokenBuyer}`)
      .send({ storeId })
      .expect(expect2xx);
    const threadId = threadRes.body.id as string;

    await request(app.getHttpServer())
      .post(`/api/chat/threads/${threadId}/messages`)
      .set('Authorization', `Bearer ${tokenBuyer}`)
      .send({ body: 'Is this still available?' })
      .expect(expect2xx);

    const msgs = await request(app.getHttpServer())
      .get(`/api/chat/threads/${threadId}/messages`)
      .set('Authorization', `Bearer ${tokenBuyer}`)
      .expect(expect2xx);
    expect(msgs.body.length).toBeGreaterThanOrEqual(1);

    await request(app.getHttpServer())
      .post(
        '/api/chat/threads/thread-00000000-0000-0000-0000-000000000000/messages',
      )
      .set('Authorization', `Bearer ${tokenBuyer}`)
      .send({ body: 'x' })
      .expect(404);

    await request(app.getHttpServer())
      .post('/api/events')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        title: 'Spring Kisan Mela',
        slug: 'spring-kisan-mela',
        description: 'Seeds and tools exhibition',
        state: 'Punjab',
        district: 'Ludhiana',
        startsAt: '2026-06-01T10:00:00.000Z',
        endsAt: '2026-06-02T18:00:00.000Z',
        venue: 'Main ground',
        isPublished: true,
      })
      .expect(expect2xx);

    const events = await request(app.getHttpServer())
      .get('/api/events')
      .expect(expect2xx);
    expect(
      events.body.some((e: { slug: string }) => e.slug === 'spring-kisan-mela'),
    ).toBe(true);

    const summary = await request(app.getHttpServer())
      .get('/api/admin/summary')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .expect(expect2xx);
    expect(summary.body.users).toBeGreaterThanOrEqual(3);
    expect(summary.body.orders).toBeGreaterThanOrEqual(1);

    const pending = await request(app.getHttpServer())
      .get('/api/admin/products/pending')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .expect(expect2xx);
    expect(Array.isArray(pending.body)).toBe(true);

    await request(app.getHttpServer())
      .get('/api/admin/summary')
      .set('Authorization', `Bearer ${tokenBuyer}`)
      .expect(403);

    await request(app.getHttpServer())
      .post('/api/sellers/me/store')
      .set('Authorization', `Bearer ${tokenBuyer}`)
      .send({ name: 'X', slug: 'x' })
      .expect(403);
  }, 120_000);

  it('seller cannot create store before KYC approval', async () => {
    const phone = '+916666666666';
    await request(app.getHttpServer())
      .post('/api/auth/otp/send')
      .send({ phone })
      .expect(expect2xx);
    const { body } = await request(app.getHttpServer())
      .post('/api/auth/otp/verify?as=SELLER')
      .send({ phone, code: otpCode })
      .expect(expect2xx);
    const token = body.accessToken as string;

    await request(app.getHttpServer())
      .post('/api/sellers/onboarding')
      .set('Authorization', `Bearer ${token}`)
      .send({ panNumber: 'PAN99' })
      .expect(expect2xx);

    await request(app.getHttpServer())
      .post('/api/sellers/me/store')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Too Early', slug: 'too-early' })
      .expect(400);
  });

  it('checkout fails with empty cart', async () => {
    const phone = '+915555555555';
    await request(app.getHttpServer())
      .post('/api/auth/otp/send')
      .send({ phone })
      .expect(expect2xx);
    const { body } = await request(app.getHttpServer())
      .post('/api/auth/otp/verify')
      .send({ phone, code: otpCode })
      .expect(expect2xx);
    const token = body.accessToken as string;

    const addr = await request(app.getHttpServer())
      .post('/api/users/me/addresses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        line1: 'Line 1',
        district: 'D',
        state: 'S',
        pincode: '110011',
      })
      .expect(expect2xx);

    await request(app.getHttpServer())
      .post('/api/orders/checkout')
      .set('Authorization', `Bearer ${token}`)
      .send({ addressId: addr.body.id })
      .expect(400);
  });
});
