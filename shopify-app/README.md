# Shopify Custom Discounts App

A powerful Shopify app that enables merchants to create custom discount rules and cart transformation logic beyond Shopify's built-in capabilities.

## Features

### Custom Discount Rules
- **Percentage Discounts**: Apply percentage-based discounts to cart items
- **Fixed Amount Discounts**: Apply fixed dollar amount discounts
- **Buy X Get Y**: Implement buy-one-get-one or similar promotions
- **Conditional Logic**: Set conditions based on:
  - Minimum/maximum cart values
  - Product quantities
  - Specific products or collections
  - Customer tags (VIP, wholesale, etc.)
  - Date ranges
- **Stacking Rules**: Control whether discounts can be combined
- **Priority System**: Set discount priority when multiple rules apply

### Cart Transform Rules
- **Add Free Items**: Automatically add free products when conditions are met
- **Product Bundling**: Create product bundles with special pricing
- **Quantity Limits**: Enforce minimum or maximum quantities
- **Tiered Pricing**: Implement volume-based pricing
- **Dynamic Cart Modifications**: Transform cart contents based on various triggers

## Architecture

### Backend
- **Node.js/Express**: RESTful API server
- **Shopify API**: Official Shopify API integration
- **PostgreSQL**: Database for storing rules and shop data
- **Prisma ORM**: Type-safe database access

### Frontend
- **Admin UI**: Web-based interface for managing rules
- **Vanilla JavaScript**: No framework dependencies for lightweight performance

### Shopify Functions
- **Discount Function**: Runs on Shopify infrastructure to apply discounts
- **Cart Transform Function**: Modifies cart contents in real-time

## Project Structure

```
shopify-app/
├── server/                 # Backend API server
│   ├── config/            # Shopify API configuration
│   ├── routes/            # API endpoints
│   ├── storage/           # Session storage
│   └── index.js           # Server entry point
├── extensions/            # Shopify Functions
│   ├── discount-function/ # Custom discount logic
│   └── cart-transform-function/ # Cart transformation logic
├── frontend/              # Admin UI
│   ├── index.html        # Main UI
│   ├── styles.css        # Styles
│   └── app.js            # Frontend logic
├── prisma/               # Database schema
│   └── schema.prisma     # Prisma schema
├── package.json          # Dependencies
├── shopify.app.toml      # App configuration
└── .env.example          # Environment variables template
```

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Shopify Partner account
- Shopify development store

### Step 1: Clone and Install

```bash
cd shopify-app
npm install
```

### Step 2: Configure Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required environment variables:
- `SHOPIFY_API_KEY`: Your app's API key from Shopify Partners
- `SHOPIFY_API_SECRET`: Your app's API secret
- `SHOPIFY_API_SCOPES`: Required API scopes
- `DATABASE_URL`: PostgreSQL connection string
- `HOST`: Your app's public URL
- `SESSION_SECRET`: Random string for session encryption

### Step 3: Set Up Database

```bash
npm run prisma:migrate
npm run prisma:generate
```

### Step 4: Configure Shopify App

1. Go to [Shopify Partners](https://partners.shopify.com/)
2. Create a new app
3. Set the app URL to your public URL
4. Set OAuth redirect URL to `https://your-app-url.com/api/auth/callback`
5. Configure required scopes:
   - `write_products`
   - `write_discounts`
   - `write_cart_transforms`
   - `read_orders`
   - `write_price_rules`

### Step 5: Update App Configuration

Edit `shopify.app.toml` with your app details:
- Set `client_id` to your Shopify app's client ID
- Update `application_url` to your app's public URL
- Update `dev_store_url` to your development store URL

### Step 6: Deploy Shopify Functions

```bash
# Install Shopify CLI if not already installed
npm install -g @shopify/cli

# Deploy functions
cd extensions/discount-function
npm install
shopify app deploy

cd ../cart-transform-function
npm install
shopify app deploy
```

### Step 7: Start the Development Server

```bash
npm run dev
```

The server will start on port 3000 (or the port specified in your .env file).

## Usage

### Installing the App

1. Navigate to your app URL with `?shop=your-store.myshopify.com`
2. Complete the OAuth flow
3. The app will be installed on your store

### Creating Discount Rules

1. Open the app from your Shopify admin
2. Go to the "Discount Rules" tab
3. Click "Add New Discount"
4. Configure your discount:
   - **Name**: Give your discount a descriptive name
   - **Type**: Choose percentage, fixed amount, or Buy X Get Y
   - **Value**: Set the discount amount
   - **Conditions**: Set minimum cart value, products, customer tags, etc.
   - **Dates**: Optional start and end dates
   - **Priority**: Set priority if multiple discounts apply
   - **Stackable**: Allow combining with other discounts
5. Save the discount

### Creating Cart Rules

1. Go to the "Cart Rules" tab
2. Click "Add New Cart Rule"
3. Configure your rule:
   - **Name**: Descriptive name for the rule
   - **Type**: Choose transformation type (add free item, bundle, etc.)
   - **Trigger**: Set what triggers the rule
   - **Action**: Define what happens when triggered
   - **Priority**: Set rule priority
4. Save the rule

## API Documentation

### Discount Endpoints

#### GET /api/discounts
Get all discount rules for the authenticated shop.

**Response:**
```json
{
  "discounts": [
    {
      "id": "uuid",
      "name": "VIP Discount",
      "type": "PERCENTAGE",
      "value": 15,
      "isActive": true,
      ...
    }
  ]
}
```

#### POST /api/discounts
Create a new discount rule.

**Request Body:**
```json
{
  "name": "Summer Sale",
  "description": "15% off all products",
  "type": "PERCENTAGE",
  "value": 15,
  "minCartValue": 50,
  "isActive": true
}
```

#### PUT /api/discounts/:id
Update an existing discount rule.

#### DELETE /api/discounts/:id
Delete a discount rule.

### Cart Rule Endpoints

#### GET /api/cart-rules
Get all cart rules for the authenticated shop.

#### POST /api/cart-rules
Create a new cart rule.

**Request Body:**
```json
{
  "name": "Free Gift",
  "type": "ADD_FREE_ITEM",
  "triggerType": "ON_CART_THRESHOLD",
  "triggerValue": "100",
  "actionType": "add_free_product",
  "actionValue": "{\"freeItemVariantId\": \"gid://shopify/ProductVariant/123\", \"quantity\": \"1\"}",
  "isActive": true
}
```

#### PUT /api/cart-rules/:id
Update an existing cart rule.

#### DELETE /api/cart-rules/:id
Delete a cart rule.

## Deployment

### Production Deployment

1. **Set up production database**:
   - Create a PostgreSQL database
   - Update `DATABASE_URL` in production environment

2. **Configure production environment**:
   - Set all required environment variables
   - Ensure `NODE_ENV=production`

3. **Build and deploy**:
   ```bash
   npm install --production
   npm run prisma:migrate
   npm start
   ```

4. **Deploy Shopify Functions**:
   ```bash
   shopify app deploy --env production
   ```

### Recommended Hosting Platforms
- **Railway**: Easy deployment with PostgreSQL
- **Heroku**: Classic PaaS with database support
- **DigitalOcean App Platform**: Managed platform with database
- **AWS/Google Cloud**: Full control with managed services

## Testing

### Testing Discounts
1. Create a discount rule in the admin UI
2. Add qualifying products to your development store cart
3. Verify the discount appears at checkout

### Testing Cart Rules
1. Create a cart transformation rule
2. Trigger the rule conditions (e.g., add specific product)
3. Verify the cart is transformed correctly

## Troubleshooting

### App won't install
- Verify your OAuth redirect URLs are correct
- Check that your app is accessible via HTTPS
- Ensure all required scopes are set

### Discounts not applying
- Verify the discount rule is active
- Check that all conditions are met
- Ensure the Shopify Function is deployed

### Cart transforms not working
- Verify the cart rule is active
- Check trigger conditions
- Ensure the action configuration is valid JSON

## Support

For issues, questions, or contributions:
1. Check the troubleshooting section
2. Review Shopify Function logs in your Partner dashboard
3. Check server logs for API errors

## License

ISC

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
