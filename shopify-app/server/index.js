import 'dotenv/config';
import express from 'express';
import compression from 'compression';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import shopify from './config/shopify.js';
import discountRoutes from './routes/discounts.js';
import cartRulesRoutes from './routes/cart-rules.js';
import webhookRoutes from './routes/webhooks.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '3000', 10);
const app = express();

// Middleware
app.use(compression());
app.use(express.json());

// CORS configuration for development
if (process.env.NODE_ENV !== 'production') {
  app.use(cors());
}

// Shopify auth and session middleware
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  async (req, res) => {
    // After successful auth, redirect to app
    res.redirect(`/?shop=${req.query.shop}&host=${req.query.host}`);
  }
);

// Webhooks must be registered BEFORE bodyParser
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: {} })
);

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Health check endpoint (no auth required)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root endpoint - serve the frontend (no auth required for initial load)
app.get('/', shopify.ensureInstalledOnShop(), async (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Verify all subsequent API requests are authenticated
app.use('/api/*', shopify.validateAuthenticatedSession());

// API Routes
app.use('/api/discounts', discountRoutes);
app.use('/api/cart-rules', cartRulesRoutes);
app.use('/api/webhooks', webhookRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
