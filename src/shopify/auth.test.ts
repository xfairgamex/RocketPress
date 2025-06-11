import request from 'supertest';
import express from 'express';
process.env.SHOPIFY_API_KEY = 'key';
process.env.SHOPIFY_API_SECRET = 'secret';
process.env.SHOPIFY_APP_URL = 'https://example.com';

import authRouter, { shopify } from './auth';
import pool, { initDb } from '../db';

beforeAll(() => {
  // Environment variables are already set above
});

test('exports a router', () => {
  expect(authRouter).toBeDefined();
});

test('GET /auth redirects to Shopify', async () => {
  const app = express();
  app.use('/shopify', authRouter);

  const res = await request(app)
    .get('/shopify/auth')
    .query({ shop: 'test.myshopify.com' });

  expect(res.status).toBe(302);
  expect(res.headers.location).toMatch(/^https:\/\/test.myshopify.com/);
});

test('GET /callback stores access token', async () => {
  const app = express();
  app.use('/shopify', authRouter);

  await initDb();

  const spy = jest
    .spyOn(shopify.auth, 'callback')
    .mockResolvedValue({ session: { shop: 'test.myshopify.com', accessToken: 'token123' } } as any);

  const res = await request(app)
    .get('/shopify/callback')
    .query({ shop: 'test.myshopify.com' });

  expect(res.status).toBe(302);
  const result = await pool.query('SELECT access_token FROM shops WHERE shop = $1', [
    'test.myshopify.com',
  ]);
  expect(result.rows[0].access_token).toBe('token123');
  spy.mockRestore();
});
