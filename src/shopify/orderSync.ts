import { Router, RequestHandler, Request, Response } from 'express';
import { getSkuMapping, SkuMapping } from './skuMapper';
import pool from '../db';

export interface ShopifyOrder {
  id: number;
  fulfillment_status: string | null;
  [key: string]: any;
}

const router = Router();
export interface MappedLineItem extends SkuMapping {
  sku: string;
  quantity: number;
}

export interface MappedOrder extends ShopifyOrder {
  mappedLineItems: MappedLineItem[];
  shop: string;
}

const unfulfilledOrders: Record<string, MappedOrder[]> = {};

const handleOrder: RequestHandler = async (req: Request, res: Response) => {
  const order: ShopifyOrder = req.body as ShopifyOrder;
  const shop = req.headers['x-shopify-shop-domain'] as string | undefined;
  if (!order || !shop) {
    res.status(400).send('Invalid order');
    return;
  }
  const mappedLineItems: MappedLineItem[] =
    (order.line_items || []).map((item: any) => {
      const mapping = getSkuMapping(shop, item.sku) || {
        artworkFile: '',
        blankSku: '',
      };
      return {
        sku: item.sku,
        quantity: item.quantity,
        ...mapping,
      };
    });

const mappedOrder: MappedOrder = {
  ...order,
  mappedLineItems,
  shop,
};

  await pool.query(
    `INSERT INTO orders (id, shop, data, fulfillment_status)
     VALUES ($1, $2, $3::jsonb, $4)
     ON CONFLICT (id)
     DO UPDATE SET shop = EXCLUDED.shop, data = EXCLUDED.data, fulfillment_status = EXCLUDED.fulfillment_status`,
    [mappedOrder.id, shop, JSON.stringify(mappedOrder), mappedOrder.fulfillment_status]
  );

  if (!order.fulfillment_status || order.fulfillment_status === 'unfulfilled') {
    if (!unfulfilledOrders[shop]) {
      unfulfilledOrders[shop] = [];
    }
    unfulfilledOrders[shop].push(mappedOrder);
  }
  res.status(200).send('OK');
};

router.post('/webhook/orders/create', handleOrder);

export function getUnfulfilledOrders(shop?: string) {
  if (shop) {
    return unfulfilledOrders[shop] || [];
  }
  return Object.values(unfulfilledOrders).flat();
}

export async function clearOrders() {
  for (const key of Object.keys(unfulfilledOrders)) {
    delete unfulfilledOrders[key];
  }
  await pool.query('DELETE FROM orders');
}

export default router;
