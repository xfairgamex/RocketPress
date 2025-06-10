import { Router, RequestHandler, Request, Response } from 'express';
import { getSkuMapping, SkuMapping } from './skuMapper';

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

const handleOrder: RequestHandler = (req: Request, res: Response) => {
  const order: ShopifyOrder = req.body as ShopifyOrder;
  if (!order) {
    res.status(400).send('Invalid order');
    return;
  }
  if (!order.fulfillment_status || order.fulfillment_status === 'unfulfilled') {
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
    unfulfilledOrders.push({
      ...order,
      mappedLineItems,
    });
  }
  res.status(200).send('OK');
};

router.post('/webhook/orders/create', handleOrder);

export function getUnfulfilledOrders() {
  return unfulfilledOrders;
}

export function clearOrders() {
  unfulfilledOrders.length = 0;
}

export default router;
