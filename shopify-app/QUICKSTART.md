# Quick Start Guide

Get your Shopify Custom Discounts App up and running in 15 minutes.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or hosted)
- Shopify Partner account
- Shopify development store

## Step-by-Step Setup

### 1. Install Dependencies (2 minutes)

```bash
cd shopify-app
npm install
```

### 2. Create Shopify App (3 minutes)

1. Go to https://partners.shopify.com/
2. Click "Apps" → "Create app"
3. Choose "Create app manually"
4. Fill in app name: "Custom Discounts"
5. Copy your API key and API secret

### 3. Configure Environment (2 minutes)

```bash
# Copy example env file
cp .env.example .env

# Edit .env and add your values
nano .env
```

Minimum required values:
```env
SHOPIFY_API_KEY=your_api_key_from_step_2
SHOPIFY_API_SECRET=your_api_secret_from_step_2
DATABASE_URL=postgresql://user:password@localhost:5432/shopify_app
SHOPIFY_APP_URL=https://your-tunnel-url.com
HOST=your-tunnel-url.com
SESSION_SECRET=random_string_here
```

**Pro Tip**: Use `openssl rand -hex 32` to generate SESSION_SECRET

### 4. Set Up Database (2 minutes)

```bash
# Create database
createdb shopify_app

# Run migrations
npm run prisma:migrate

# Generate Prisma client
npm run prisma:generate
```

### 5. Configure App URLs (2 minutes)

In your Shopify Partners dashboard:

1. Go to your app → Configuration
2. Set **App URL**: `https://your-tunnel-url.com`
3. Set **Allowed redirection URL(s)**:
   - `https://your-tunnel-url.com/api/auth/callback`
4. Click "Save"

### 6. Set Up ngrok or Cloudflare Tunnel (2 minutes)

**Option A - ngrok**:
```bash
# Install ngrok
npm install -g ngrok

# Start tunnel
ngrok http 3000
```

**Option B - Cloudflare Tunnel**:
```bash
# Install cloudflared
brew install cloudflared  # macOS
# or download from https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/

# Start tunnel
cloudflared tunnel --url http://localhost:3000
```

Copy the HTTPS URL and update your .env file with it.

### 7. Start Development Server (1 minute)

```bash
npm run dev
```

You should see: `Server is running on port 3000`

### 8. Install on Test Store (2 minutes)

1. Open your browser
2. Go to: `https://your-tunnel-url.com?shop=your-store.myshopify.com`
3. Click "Install app"
4. Approve permissions

### 9. Create Your First Discount (1 minute)

1. In the app, click "Add New Discount"
2. Fill in:
   - **Name**: "10% Off"
   - **Type**: "Percentage Off"
   - **Value**: 10
   - **Min Cart Value**: 50
3. Click "Save Discount"

### 10. Test the Discount (2 minutes)

1. Go to your store
2. Add products worth $50+ to cart
3. Go to checkout
4. Verify 10% discount is applied

## Common Issues & Solutions

### "Database connection failed"
- Check your DATABASE_URL is correct
- Ensure PostgreSQL is running: `pg_isready`
- Test connection: `psql postgresql://user:password@localhost:5432/shopify_app`

### "OAuth error" or "redirect_uri mismatch"
- Verify your ngrok/tunnel URL matches exactly in .env and Shopify Partners
- Must use HTTPS, not HTTP
- Include the full callback URL in Shopify Partners

### "App won't install"
- Check that your tunnel is running
- Verify the app URL is accessible from your browser
- Ensure all required scopes are set in shopify.app.toml

### "Discount not showing at checkout"
- Verify the discount rule is "Active"
- Check the cart meets all conditions (min value, products, etc.)
- Shopify Functions need to be deployed (see next section)

## Next Steps

### Deploy Shopify Functions

For discounts and cart transforms to work, you need to deploy Shopify Functions:

```bash
# Install Shopify CLI
npm install -g @shopify/cli

# Login
shopify auth login

# Deploy discount function
cd extensions/discount-function
npm install
shopify app deploy

# Deploy cart transform function
cd ../cart-transform-function
npm install
shopify app deploy
```

### Learn More

- **Full documentation**: See README.md
- **API reference**: See API section in README.md
- **Deployment**: See DEPLOYMENT.md
- **Examples**: Check the examples/ folder (if available)

## Development Tips

### Auto-reload on changes

Install nodemon for auto-restart:
```bash
npm install -D nodemon
# Update package.json dev script to use nodemon
```

### View database

Use Prisma Studio to view data:
```bash
npx prisma studio
```

### Check logs

Watch server logs in real-time:
```bash
npm run dev | tee server.log
```

### Test API endpoints

Use curl or Postman:
```bash
# Health check
curl https://your-tunnel-url.com/api/health

# Get discounts (requires auth)
curl https://your-tunnel-url.com/api/discounts \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Example Discount Rules

### VIP Customer Discount (15% off)
```json
{
  "name": "VIP 15% Off",
  "type": "PERCENTAGE",
  "value": 15,
  "customerTags": ["vip"],
  "isActive": true
}
```

### Buy 2 Get 1 Free
```json
{
  "name": "Buy 2 Get 1 Free",
  "type": "BUY_X_GET_Y",
  "value": 100,
  "minQuantity": 2,
  "isActive": true
}
```

### Flash Sale ($20 off orders over $100)
```json
{
  "name": "Flash Sale",
  "type": "FIXED_AMOUNT",
  "value": 20,
  "minCartValue": 100,
  "startDate": "2024-12-01T00:00:00Z",
  "endDate": "2024-12-31T23:59:59Z",
  "isActive": true
}
```

## Example Cart Rules

### Free Shipping Product (add at $75)
```json
{
  "name": "Free Shipping Threshold",
  "type": "ADD_FREE_ITEM",
  "triggerType": "ON_CART_THRESHOLD",
  "triggerValue": "75",
  "actionValue": "{\"freeItemVariantId\": \"gid://shopify/ProductVariant/123\"}",
  "isActive": true
}
```

### Product Bundle (10% off when both products in cart)
```json
{
  "name": "Bundle Discount",
  "type": "BUNDLE_PRODUCTS",
  "triggerType": "ON_PRODUCT_ADD",
  "actionValue": "{\"bundleProducts\": [\"gid://shopify/Product/1\", \"gid://shopify/Product/2\"], \"discountPercentage\": \"10\"}",
  "isActive": true
}
```

## Need Help?

- Check the troubleshooting section in README.md
- Review Shopify's [Function documentation](https://shopify.dev/docs/apps/functions)
- Check [Shopify API docs](https://shopify.dev/docs/api)

## Ready for Production?

Once everything works in development:
1. Read DEPLOYMENT.md
2. Set up production database
3. Deploy to your chosen platform
4. Update Shopify app URLs
5. Deploy Shopify Functions to production
6. Test thoroughly before going live

Good luck! 🚀
