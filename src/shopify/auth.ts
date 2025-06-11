import '@shopify/shopify-api/adapters/node';
import { Router } from 'express';
import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api';
import dotenv from 'dotenv';
import { saveShopToken } from '../db';

dotenv.config();

const router = Router();

export const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY || '',
  apiSecretKey: process.env.SHOPIFY_API_SECRET || '',
  scopes: ['read_products', 'write_products', 'read_orders', 'write_orders'],
  hostName: process.env.SHOPIFY_APP_URL?.replace(/https?:\/\//, '') || '',
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: false,
});

router.get('/auth', async (req, res) => {
  const redirectUrl = await shopify.auth.begin({
    shop: req.query.shop as string,
    callbackPath: '/shopify/callback',
    isOnline: false,
    rawRequest: req,
    rawResponse: res,
  });
  res.redirect(redirectUrl);
});

router.get('/callback', async (req, res) => {
  try {
    const { session } = await shopify.auth.callback({
      rawRequest: req,
      rawResponse: res,
    });
    if (session.accessToken) {
      await saveShopToken(session.shop, session.accessToken);
    }
    res.redirect('/');
  } catch (error) {
    console.error('Shopify OAuth callback error', error);
    res.status(500).send('Authentication failed');
  }
});

export default router;
