import request from 'supertest';
import express from 'express';
import router, { getUnfulfilledOrders, clearOrders } from './orderSync';
import { addSkuMapping, clearSkuMappings } from './skuMapper';
import { initDb } from '../db';

describe('orderSync webhook', () => {
  const app = express();
  app.use(express.json());
  app.use('/shopify', router);

  beforeAll(async () => {
    await initDb();
  });

  beforeEach(async () => {
    await clearOrders();
    clearSkuMappings();
    addSkuMapping('SKU1', { artworkFile: 'designs/sku1.png', blankSku: 'BLANK1' });
  });

  test('captures unfulfilled orders', async () => {
    const order = { id: 1, fulfillment_status: null };
    await request(app).post('/shopify/webhook/orders/create').send(order).expect(200);
    expect(getUnfulfilledOrders()).toHaveLength(1);
  });

  test('ignores fulfilled orders', async () => {
    const order = { id: 2, fulfillment_status: 'fulfilled' };
    await request(app).post('/shopify/webhook/orders/create').send(order).expect(200);
    expect(getUnfulfilledOrders()).toHaveLength(0);
  });

  test('maps line items with sku data', async () => {
    const order = {
      id: 3,
      fulfillment_status: null,
      line_items: [{ sku: 'SKU1', quantity: 1 }],
    };
    await request(app)
      .post('/shopify/webhook/orders/create')
      .send(order)
      .expect(200);
    const saved = getUnfulfilledOrders()[0];
    expect(saved.mappedLineItems[0]).toEqual({
      sku: 'SKU1',
      quantity: 1,
      artworkFile: 'designs/sku1.png',
      blankSku: 'BLANK1',
    });
  });
});
