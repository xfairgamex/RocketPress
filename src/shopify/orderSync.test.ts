import request from 'supertest';
import express from 'express';
import router, { getUnfulfilledOrders, clearOrders } from './orderSync';

describe('orderSync webhook', () => {
  const app = express();
  app.use(express.json());
  app.use('/shopify', router);

  beforeEach(() => {
    clearOrders();
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
});
