import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Handle app uninstall webhook
router.post('/app/uninstalled', async (req, res) => {
  try {
    const shop = req.body.shop_domain || req.body.myshopify_domain;

    if (!shop) {
      return res.status(400).json({ error: 'Shop domain not provided' });
    }

    // Mark shop as uninstalled
    await prisma.shop.updateMany({
      where: { shopDomain: shop },
      data: {
        isActive: false,
        uninstalledAt: new Date(),
      },
    });

    console.log(`App uninstalled for shop: ${shop}`);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error handling app uninstall:', error);
    res.status(500).json({ error: 'Failed to process uninstall webhook' });
  }
});

// Handle shop update webhook
router.post('/shop/update', async (req, res) => {
  try {
    const shop = req.body.domain || req.body.myshopify_domain;

    console.log(`Shop update received for: ${shop}`);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error handling shop update:', error);
    res.status(500).json({ error: 'Failed to process shop update webhook' });
  }
});

export default router;
