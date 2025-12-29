import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all cart rules for a shop
router.get('/', async (req, res) => {
  try {
    const shop = res.locals?.shopify?.session?.shop;

    if (!shop) {
      return res.json({ cartRules: [] });
    }

    const shopRecord = await prisma.shop.findUnique({
      where: { shopDomain: shop },
      include: { cartRules: true },
    });

    if (!shopRecord) {
      return res.json({ cartRules: [] });
    }

    res.json({ cartRules: shopRecord.cartRules });
  } catch (error) {
    console.error('Error fetching cart rules:', error);
    res.status(500).json({ error: 'Failed to fetch cart rules', message: error.message });
  }
});

// Get a single cart rule
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const shop = res.locals.shopify.session.shop;

    const shopRecord = await prisma.shop.findUnique({
      where: { shopDomain: shop },
    });

    if (!shopRecord) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    const cartRule = await prisma.cartRule.findFirst({
      where: {
        id,
        shopId: shopRecord.id,
      },
    });

    if (!cartRule) {
      return res.status(404).json({ error: 'Cart rule not found' });
    }

    res.json({ cartRule });
  } catch (error) {
    console.error('Error fetching cart rule:', error);
    res.status(500).json({ error: 'Failed to fetch cart rule' });
  }
});

// Create a new cart rule
router.post('/', async (req, res) => {
  try {
    const shop = res.locals.shopify.session.shop;
    const {
      name,
      description,
      type,
      triggerType,
      triggerValue,
      actionType,
      actionValue,
      minCartValue,
      productIds,
      collectionIds,
      priority,
      isActive,
    } = req.body;

    // Validate required fields
    if (!name || !type || !triggerType || !actionType) {
      return res.status(400).json({
        error: 'Missing required fields: name, type, triggerType, and actionType are required',
      });
    }

    let shopRecord = await prisma.shop.findUnique({
      where: { shopDomain: shop },
    });

    // Create shop record if it doesn't exist
    if (!shopRecord) {
      shopRecord = await prisma.shop.create({
        data: {
          shopDomain: shop,
          accessToken: res.locals.shopify.session.accessToken,
          scope: res.locals.shopify.session.scope || '',
        },
      });
    }

    const cartRule = await prisma.cartRule.create({
      data: {
        shopId: shopRecord.id,
        name,
        description,
        type,
        triggerType,
        triggerValue,
        actionType,
        actionValue,
        minCartValue,
        productIds: productIds || [],
        collectionIds: collectionIds || [],
        priority: priority || 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    res.status(201).json({ cartRule });
  } catch (error) {
    console.error('Error creating cart rule:', error);
    res.status(500).json({ error: 'Failed to create cart rule' });
  }
});

// Update a cart rule
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const shop = res.locals.shopify.session.shop;
    const updateData = req.body;

    const shopRecord = await prisma.shop.findUnique({
      where: { shopDomain: shop },
    });

    if (!shopRecord) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    // Verify cart rule belongs to this shop
    const existingRule = await prisma.cartRule.findFirst({
      where: {
        id,
        shopId: shopRecord.id,
      },
    });

    if (!existingRule) {
      return res.status(404).json({ error: 'Cart rule not found' });
    }

    const cartRule = await prisma.cartRule.update({
      where: { id },
      data: updateData,
    });

    res.json({ cartRule });
  } catch (error) {
    console.error('Error updating cart rule:', error);
    res.status(500).json({ error: 'Failed to update cart rule' });
  }
});

// Delete a cart rule
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const shop = res.locals.shopify.session.shop;

    const shopRecord = await prisma.shop.findUnique({
      where: { shopDomain: shop },
    });

    if (!shopRecord) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    // Verify cart rule belongs to this shop
    const existingRule = await prisma.cartRule.findFirst({
      where: {
        id,
        shopId: shopRecord.id,
      },
    });

    if (!existingRule) {
      return res.status(404).json({ error: 'Cart rule not found' });
    }

    await prisma.cartRule.delete({
      where: { id },
    });

    res.json({ success: true, message: 'Cart rule deleted successfully' });
  } catch (error) {
    console.error('Error deleting cart rule:', error);
    res.status(500).json({ error: 'Failed to delete cart rule' });
  }
});

export default router;
