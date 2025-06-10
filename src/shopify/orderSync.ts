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
}

const unfulfilledOrders: MappedOrder[] = [];

const handleOrder: RequestHandler = async (req: Request, res: Response) => {
  const order: ShopifyOrder = req.body as ShopifyOrder;
  if (!order) {
    res.status(400).send('Invalid order');
    return;
  }
  const mappedLineItems: MappedLineItem[] =
    (order.line_items || []).map((item: any) => {
      const mapping = getSkuMapping(item.sku) || {
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
  };

  await pool.query(
    `INSERT INTO orders (id, data, fulfillment_status)
     VALUES ($1, $2::jsonb, $3)
     ON CONFLICT (id)
     DO UPDATE SET data = EXCLUDED.data, fulfillment_status = EXCLUDED.fulfillment_status`,
    [mappedOrder.id, JSON.stringify(mappedOrder), mappedOrder.fulfillment_status]
  );

  if (!order.fulfillment_status || order.fulfillment_status === 'unfulfilled') {
    unfulfilledOrders.push(mappedOrder);
  }
  res.status(200).send('OK');
};

router.post('/webhook/orders/create', handleOrder);

export function getUnfulfilledOrders() {
  return unfulfilledOrders;
}

export async function clearOrders() {
  unfulfilledOrders.length = 0;
  await pool.query('DELETE FROM orders');
}

export default router;
