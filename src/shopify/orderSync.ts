import { Router, RequestHandler, Request, Response } from 'express';

export interface ShopifyOrder {
  id: number;
  fulfillment_status: string | null;
  [key: string]: any;
}

const router = Router();
const unfulfilledOrders: ShopifyOrder[] = [];

const handleOrder: RequestHandler = (req: Request, res: Response) => {
  const order: ShopifyOrder = req.body as ShopifyOrder;
  if (!order) {
    res.status(400).send('Invalid order');
    return;
  }
  if (!order.fulfillment_status || order.fulfillment_status === 'unfulfilled') {
    unfulfilledOrders.push(order);
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
