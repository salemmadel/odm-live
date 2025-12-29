# Deployment Guide

This guide covers deploying your Shopify Custom Discounts App to production.

## Pre-Deployment Checklist

- [ ] PostgreSQL database created and accessible
- [ ] All environment variables configured
- [ ] Shopify app created in Partners dashboard
- [ ] Domain/hosting configured with HTTPS
- [ ] Shopify Functions built and tested

## Environment Variables

Ensure all these are set in your production environment:

```env
SHOPIFY_API_KEY=your_production_api_key
SHOPIFY_API_SECRET=your_production_api_secret
SHOPIFY_API_SCOPES=write_products,write_discounts,write_cart_transforms,read_orders
SHOPIFY_APP_URL=https://your-production-domain.com
HOST=your-production-domain.com
DATABASE_URL=postgresql://user:password@host:5432/dbname
PORT=3000
NODE_ENV=production
SESSION_SECRET=your_very_secure_random_string
```

## Deployment Options

### Option 1: Railway (Recommended for Quick Start)

1. **Create Railway account** at https://railway.app

2. **Create new project**:
   ```bash
   railway init
   ```

3. **Add PostgreSQL**:
   - In Railway dashboard, click "New"
   - Select "Database" → "PostgreSQL"
   - Railway will automatically set `DATABASE_URL`

4. **Configure environment variables**:
   ```bash
   railway variables set SHOPIFY_API_KEY=your_key
   railway variables set SHOPIFY_API_SECRET=your_secret
   # ... set all other variables
   ```

5. **Deploy**:
   ```bash
   railway up
   ```

6. **Run migrations**:
   ```bash
   railway run npm run prisma:migrate
   ```

7. **Get your domain**:
   - Railway provides a domain automatically
   - Or connect your custom domain in settings

### Option 2: Heroku

1. **Create Heroku app**:
   ```bash
   heroku create your-app-name
   ```

2. **Add PostgreSQL**:
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

3. **Set environment variables**:
   ```bash
   heroku config:set SHOPIFY_API_KEY=your_key
   heroku config:set SHOPIFY_API_SECRET=your_secret
   # ... set all other variables
   ```

4. **Create Procfile**:
   ```
   web: npm start
   release: npm run prisma:migrate
   ```

5. **Deploy**:
   ```bash
   git push heroku main
   ```

### Option 3: DigitalOcean App Platform

1. **Create app** in DigitalOcean dashboard

2. **Connect repository**:
   - Link your GitHub/GitLab repo
   - Set build command: `npm install`
   - Set run command: `npm start`

3. **Add database**:
   - Add managed PostgreSQL database
   - Database URL will be automatically injected

4. **Configure environment**:
   - Add all environment variables in App settings

5. **Deploy**:
   - App Platform will auto-deploy on push

### Option 4: Self-Hosted (VPS)

1. **Set up server** (Ubuntu 22.04 example):
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs

   # Install PostgreSQL
   sudo apt install -y postgresql postgresql-contrib

   # Install Nginx
   sudo apt install -y nginx

   # Install PM2
   sudo npm install -g pm2
   ```

2. **Set up PostgreSQL**:
   ```bash
   sudo -u postgres psql
   CREATE DATABASE shopify_app;
   CREATE USER shopify_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE shopify_app TO shopify_user;
   \q
   ```

3. **Clone and set up app**:
   ```bash
   cd /var/www
   git clone your-repo.git shopify-app
   cd shopify-app
   npm install --production
   ```

4. **Create .env file**:
   ```bash
   nano .env
   # Add all environment variables
   ```

5. **Run migrations**:
   ```bash
   npm run prisma:migrate
   ```

6. **Start with PM2**:
   ```bash
   pm2 start server/index.js --name shopify-app
   pm2 startup
   pm2 save
   ```

7. **Configure Nginx**:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

8. **Enable HTTPS with Let's Encrypt**:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

## Deploying Shopify Functions

Shopify Functions must be deployed separately:

1. **Install Shopify CLI**:
   ```bash
   npm install -g @shopify/cli
   ```

2. **Login to Shopify**:
   ```bash
   shopify auth login
   ```

3. **Deploy discount function**:
   ```bash
   cd extensions/discount-function
   npm install
   shopify app function build
   shopify app deploy
   ```

4. **Deploy cart transform function**:
   ```bash
   cd ../cart-transform-function
   npm install
   shopify app function build
   shopify app deploy
   ```

5. **Activate functions** in Shopify Partners dashboard

## Post-Deployment Steps

### 1. Update Shopify App URLs

In your Shopify Partners dashboard:
- Set App URL to `https://your-domain.com`
- Set Allowed redirection URL(s) to:
  - `https://your-domain.com/api/auth/callback`
  - `https://your-domain.com/auth/callback`

### 2. Configure Webhooks

The app will automatically register webhooks, but verify they're working:
- App uninstalled webhook
- Shop update webhook

### 3. Test Installation

1. Install app on a test store
2. Create a test discount rule
3. Verify it appears at checkout
4. Test cart transformations

### 4. Monitor Application

Set up monitoring:
- Application logs
- Error tracking (e.g., Sentry)
- Database performance
- API response times

## Database Migrations

When you update the schema:

```bash
# Create migration
npx prisma migrate dev --name description_of_change

# Deploy to production
npx prisma migrate deploy
```

## Rollback Procedure

If you need to rollback:

1. **Revert code**:
   ```bash
   git revert HEAD
   git push
   ```

2. **Rollback database** (if needed):
   ```bash
   # Manually run reverse migration
   # Or restore from backup
   ```

3. **Redeploy functions**:
   ```bash
   shopify app deploy
   ```

## Security Considerations

- [ ] Use strong, unique `SESSION_SECRET`
- [ ] Database uses strong password
- [ ] HTTPS enabled (required by Shopify)
- [ ] Environment variables properly secured
- [ ] Regular security updates applied
- [ ] Database backups configured
- [ ] Rate limiting implemented (consider adding)

## Scaling Considerations

### Database
- Monitor connection pool usage
- Set up read replicas if needed
- Implement connection pooling (PgBouncer)

### Application
- Use horizontal scaling (multiple instances)
- Implement Redis for session storage at scale
- Add caching layer (Redis) for frequently accessed data

### Monitoring
- Set up alerts for errors
- Monitor API response times
- Track function execution times
- Monitor database query performance

## Backup Strategy

1. **Database backups**:
   - Daily automated backups
   - Retain backups for 30 days
   - Test restore procedure monthly

2. **Code backups**:
   - Version control (Git)
   - Tagged releases

3. **Configuration backups**:
   - Document environment variables
   - Store securely (1Password, HashiCorp Vault)

## Cost Optimization

- Use connection pooling to reduce database costs
- Optimize Shopify Function execution
- Monitor and optimize database queries
- Use CDN for static assets
- Implement caching where appropriate

## Support and Maintenance

- Monitor error logs daily
- Review Shopify Function performance weekly
- Update dependencies monthly
- Review security advisories regularly
- Test major updates in staging first
