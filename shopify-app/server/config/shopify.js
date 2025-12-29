import { Shopify, LATEST_API_VERSION } from '@shopify/shopify-api';
import { shopifyApp } from '@shopify/shopify-app-express';
import { PrismaSessionStorage } from '../storage/prisma-session-storage.js';
import '@shopify/shopify-api/adapters/node';

const PORT = parseInt(process.env.PORT || '3000', 10);
const DEV_MODE = process.env.NODE_ENV !== 'production';

// Configure Shopify API
const shopify = shopifyApp({
  api: {
    apiKey: process.env.SHOPIFY_API_KEY,
    apiSecretKey: process.env.SHOPIFY_API_SECRET,
    scopes: process.env.SHOPIFY_API_SCOPES?.split(',') || [],
    hostScheme: 'https',
    hostName: process.env.HOST?.replace(/https?:\/\//, '') || '',
    apiVersion: LATEST_API_VERSION,
    isEmbeddedApp: true,
    billing: undefined,
  },
  auth: {
    path: '/api/auth',
    callbackPath: '/api/auth/callback',
  },
  webhooks: {
    path: '/api/webhooks',
  },
  sessionStorage: new PrismaSessionStorage(),
});

export default shopify;
