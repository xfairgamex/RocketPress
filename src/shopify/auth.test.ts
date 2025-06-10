beforeAll(() => {
  process.env.SHOPIFY_API_KEY = 'key';
  process.env.SHOPIFY_API_SECRET = 'secret';
  process.env.SHOPIFY_APP_URL = 'https://example.com';
});

test('exports a router', () => {
  const router = require('./auth').default;
  expect(router).toBeDefined();
});
