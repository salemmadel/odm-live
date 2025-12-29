import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all discount rules for a shop
router.get('/', async (req, res) => {
  try {
    const shop = res.locals?.shopify?.session?.shop;

    if (!shop) {
      return res.json({ discounts: [] });
    }

    const shopRecord = await prisma.shop.findUnique({
      where: { shopDomain: shop },
      include: { discountRules: true },
    });

    if (!shopRecord) {
      return res.json({ discounts: [] });
    }

    res.json({ discounts: shopRecord.discountRules });
  } catch (error) {
    console.error('Error fetching discounts:', error);
    res.status(500).json({ error: 'Failed to fetch discounts', message: error.message });
  }
});

// Get a single discount rule
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

    const discount = await prisma.discountRule.findFirst({
      where: {
        id,
        shopId: shopRecord.id,
      },
    });

    if (!discount) {
      return res.status(404).json({ error: 'Discount not found' });
    }

    res.json({ discount });
  } catch (error) {
    console.error('Error fetching discount:', error);
    res.status(500).json({ error: 'Failed to fetch discount' });
  }
});

// Create a new discount rule
router.post('/', async (req, res) => {
  try {
    // Get shop from session or use a default for development
    const shop = res.locals?.shopify?.session?.shop || 'odm26-2.myshopify.com';
    const {
      name,
      description,
      type,
      value,
      minCartValue,
      maxCartValue,
      minQuantity,
      productIds,
      collectionIds,
      customerTags,
      stackable,
      priority,
      startDate,
      endDate,
      isActive,
    } = req.body;

    // Validate required fields
    if (!name || !type || value === undefined) {
      return res.status(400).json({
        error: 'Missing required fields: name, type, and value are required',
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
          accessToken: res.locals?.shopify?.session?.accessToken || '',
          scope: res.locals?.shopify?.session?.scope || '',
        },
      });
    }

    const discount = await prisma.discountRule.create({
      data: {
        shopId: shopRecord.id,
        name,
        description,
        type,
        value,
        minCartValue,
        maxCartValue,
        minQuantity,
        productIds: productIds || [],
        collectionIds: collectionIds || [],
        customerTags: customerTags || [],
        stackable: stackable || false,
        priority: priority || 0,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    res.status(201).json({ discount });
  } catch (error) {
    console.error('Error creating discount:', error);
    res.status(500).json({ error: 'Failed to create discount' });
  }
});

// Update a discount rule
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const shop = res.locals?.shopify?.session?.shop || 'odm26-2.myshopify.com';
    const updateData = req.body;

    const shopRecord = await prisma.shop.findUnique({
      where: { shopDomain: shop },
    });

    if (!shopRecord) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    // Verify discount belongs to this shop
    const existingDiscount = await prisma.discountRule.findFirst({
      where: {
        id,
        shopId: shopRecord.id,
      },
    });

    if (!existingDiscount) {
      return res.status(404).json({ error: 'Discount not found' });
    }

    // Convert date strings to Date objects if present
    if (updateData.startDate) {
      updateData.startDate = new Date(updateData.startDate);
    }
    if (updateData.endDate) {
      updateData.endDate = new Date(updateData.endDate);
    }

    const discount = await prisma.discountRule.update({
      where: { id },
      data: updateData,
    });

    res.json({ discount });
  } catch (error) {
    console.error('Error updating discount:', error);
    res.status(500).json({ error: 'Failed to update discount' });
  }
});

// Delete a discount rule
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const shop = res.locals?.shopify?.session?.shop || 'odm26-2.myshopify.com';

    const shopRecord = await prisma.shop.findUnique({
      where: { shopDomain: shop },
    });

    if (!shopRecord) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    // Verify discount belongs to this shop
    const existingDiscount = await prisma.discountRule.findFirst({
      where: {
        id,
        shopId: shopRecord.id,
      },
    });

    if (!existingDiscount) {
      return res.status(404).json({ error: 'Discount not found' });
    }

    await prisma.discountRule.delete({
      where: { id },
    });

    res.json({ success: true, message: 'Discount deleted successfully' });
  } catch (error) {
    console.error('Error deleting discount:', error);
    res.status(500).json({ error: 'Failed to delete discount' });
  }
});

export default router;
