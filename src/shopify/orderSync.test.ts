import request from 'supertest';
import express from 'express';
import router, { getUnfulfilledOrders, clearOrders } from './orderSync';
import { addSkuMapping, clearSkuMappings } from './skuMapper';
import pool, { initDb } from '../db';

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
    addSkuMapping('shop1.myshopify.com', 'SKU1', {
      artworkFile: 'designs/sku1.png',
      blankSku: 'BLANK1',
    });
  });

  test('captures unfulfilled orders', async () => {
    const order = { id: 1, fulfillment_status: null };
    await request(app)
      .post('/shopify/webhook/orders/create')
      .set('X-Shopify-Shop-Domain', 'shop1.myshopify.com')
      .send(order)
      .expect(200);
    expect(getUnfulfilledOrders('shop1.myshopify.com')).toHaveLength(1);
  });

  test('ignores fulfilled orders', async () => {
    const order = { id: 2, fulfillment_status: 'fulfilled' };
    await request(app)
      .post('/shopify/webhook/orders/create')
      .set('X-Shopify-Shop-Domain', 'shop1.myshopify.com')
      .send(order)
      .expect(200);
    expect(getUnfulfilledOrders('shop1.myshopify.com')).toHaveLength(0);
  });

  test('maps line items with sku data', async () => {
    const order = {
      id: 3,
      fulfillment_status: null,
      line_items: [{ sku: 'SKU1', quantity: 1 }],
    };
    await request(app)
      .post('/shopify/webhook/orders/create')
      .set('X-Shopify-Shop-Domain', 'shop1.myshopify.com')
      .send(order)
      .expect(200);
    const saved = getUnfulfilledOrders('shop1.myshopify.com')[0];
    expect(saved.mappedLineItems[0]).toEqual({
      sku: 'SKU1',
      quantity: 1,
      artworkFile: 'designs/sku1.png',
      blankSku: 'BLANK1',
    });
  });

  test('persists order data to the database', async () => {
    const order = { id: 4, fulfillment_status: null };
    await request(app)
      .post('/shopify/webhook/orders/create')
      .set('X-Shopify-Shop-Domain', 'shop1.myshopify.com')
      .send(order)
      .expect(200);
    const result = await pool.query('SELECT * FROM orders WHERE id = $1', [
      order.id,
    ]);
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].id).toBe(order.id);
  });

  test('tracks unfulfilled orders separately for each shop', async () => {
    const order1 = { id: 5, fulfillment_status: null };
    const order2 = { id: 6, fulfillment_status: null };
    await request(app)
      .post('/shopify/webhook/orders/create')
      .set('X-Shopify-Shop-Domain', 'shop1.myshopify.com')
      .send(order1)
      .expect(200);
    await request(app)
      .post('/shopify/webhook/orders/create')
      .set('X-Shopify-Shop-Domain', 'shop2.myshopify.com')
      .send(order2)
      .expect(200);
    expect(getUnfulfilledOrders('shop1.myshopify.com')).toHaveLength(1);
    expect(getUnfulfilledOrders('shop2.myshopify.com')).toHaveLength(1);
    expect(getUnfulfilledOrders()).toHaveLength(2);
  });
});
