import request from 'supertest';
import express from 'express';
process.env.SHOPIFY_API_KEY = 'key';
process.env.SHOPIFY_API_SECRET = 'secret';
process.env.SHOPIFY_APP_URL = 'https://example.com';

import authRouter from './auth';

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
