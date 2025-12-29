import { shopifyApp } from '@shopify/shopify-app-express';
import { PrismaSessionStorage } from '../storage/prisma-session-storage.js';
import '@shopify/shopify-api/adapters/node';

// Configure Shopify API
const shopify = shopifyApp({
  api: {
    apiKey: process.env.SHOPIFY_API_KEY,
    apiSecretKey: process.env.SHOPIFY_API_SECRET,
    scopes: process.env.SHOPIFY_API_SCOPES?.split(',') || [],
    hostScheme: 'https',
    hostName: process.env.HOST?.replace(/https?:\/\//, '') || '',
    apiVersion: '2024-10',
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
