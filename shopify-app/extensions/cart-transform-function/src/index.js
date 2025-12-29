/**
 * Custom Cart Transform Function
 * This function modifies cart contents based on configurable rules:
 * - Add free products when conditions are met
 * - Bundle products together
 * - Apply quantity limits
 * - Modify prices based on cart conditions
 */

export function run(input) {
  const configuration = JSON.parse(
    input?.cartTransform?.metafield?.value ?? '{}'
  );

  if (!configuration.cartRules || configuration.cartRules.length === 0) {
    return { operations: [] };
  }

  const cart = input.cart;
  const cartTotal = parseFloat(cart.cost.subtotalAmount.amount);

  const operations = [];

  // Process each cart rule by priority
  const activeRules = configuration.cartRules
    .filter(rule => rule.isActive)
    .sort((a, b) => (b.priority || 0) - (a.priority || 0));

  for (const rule of activeRules) {
    // Check minimum cart value condition
    if (rule.minCartValue && cartTotal < rule.minCartValue) continue;

    // Apply transformation based on rule type
    const ruleOperations = applyCartRule(rule, cart);
    if (ruleOperations && ruleOperations.length > 0) {
      operations.push(...ruleOperations);
    }
  }

  return { operations };
}

function applyCartRule(rule, cart) {
  switch (rule.type) {
    case 'ADD_FREE_ITEM':
      return addFreeItem(rule, cart);

    case 'BUNDLE_PRODUCTS':
      return bundleProducts(rule, cart);

    case 'MODIFY_QUANTITY':
      return modifyQuantity(rule, cart);

    case 'TIERED_PRICING':
      return applyTieredPricing(rule, cart);

    default:
      return [];
  }
}

function addFreeItem(rule, cart) {
  const operations = [];
  const config = JSON.parse(rule.actionValue || '{}');

  // Check if trigger condition is met
  const triggerMet = checkTrigger(rule, cart);

  if (!triggerMet) return operations;

  // Check if free item is already in cart
  const freeItemVariantId = config.freeItemVariantId;
  const existingLine = cart.lines.find(
    line => line.merchandise?.id === freeItemVariantId
  );

  if (existingLine) {
    // Free item already added
    return operations;
  }

  // Add free item to cart
  operations.push({
    add: {
      variantId: freeItemVariantId,
      quantity: parseInt(config.quantity || '1'),
      price: {
        fixedPrice: {
          amount: '0'
        }
      }
    }
  });

  return operations;
}

function bundleProducts(rule, cart) {
  const operations = [];
  const config = JSON.parse(rule.actionValue || '{}');

  // Check if all bundle products are in cart
  const bundleProductIds = config.bundleProducts || [];
  const bundleDiscount = parseFloat(config.discountPercentage || '0');

  const allProductsInCart = bundleProductIds.every(productId =>
    cart.lines.some(line => line.merchandise?.product?.id === productId)
  );

  if (!allProductsInCart) return operations;

  // Apply discount to bundle products
  for (const productId of bundleProductIds) {
    const line = cart.lines.find(
      line => line.merchandise?.product?.id === productId
    );

    if (line) {
      const originalPrice = parseFloat(line.cost.amountPerQuantity.amount);
      const discountedPrice = originalPrice * (1 - bundleDiscount / 100);

      operations.push({
        update: {
          cartLineId: line.id,
          price: {
            fixedPrice: {
              amount: discountedPrice.toFixed(2)
            }
          }
        }
      });
    }
  }

  return operations;
}

function modifyQuantity(rule, cart) {
  const operations = [];
  const config = JSON.parse(rule.actionValue || '{}');

  const targetProductId = rule.triggerValue;
  const maxQuantity = parseInt(config.maxQuantity || '999');
  const minQuantity = parseInt(config.minQuantity || '1');

  const line = cart.lines.find(
    line => line.merchandise?.product?.id === targetProductId
  );

  if (!line) return operations;

  let newQuantity = line.quantity;

  if (line.quantity > maxQuantity) {
    newQuantity = maxQuantity;
  } else if (line.quantity < minQuantity) {
    newQuantity = minQuantity;
  }

  if (newQuantity !== line.quantity) {
    operations.push({
      update: {
        cartLineId: line.id,
        quantity: newQuantity
      }
    });
  }

  return operations;
}

function applyTieredPricing(rule, cart) {
  const operations = [];
  const config = JSON.parse(rule.actionValue || '{}');

  // Tiered pricing: different prices based on quantity
  const tiers = config.tiers || []; // [{ quantity: 5, price: 9.99 }, ...]
  const targetProductId = rule.triggerValue;

  const line = cart.lines.find(
    line => line.merchandise?.product?.id === targetProductId
  );

  if (!line) return operations;

  // Find applicable tier
  const applicableTier = tiers
    .filter(tier => line.quantity >= tier.quantity)
    .sort((a, b) => b.quantity - a.quantity)[0];

  if (applicableTier) {
    operations.push({
      update: {
        cartLineId: line.id,
        price: {
          fixedPrice: {
            amount: applicableTier.price.toString()
          }
        }
      }
    });
  }

  return operations;
}

function checkTrigger(rule, cart) {
  const cartTotal = parseFloat(cart.cost.subtotalAmount.amount);

  switch (rule.triggerType) {
    case 'ON_CART_THRESHOLD':
      const threshold = parseFloat(rule.triggerValue || '0');
      return cartTotal >= threshold;

    case 'ON_PRODUCT_ADD':
      const productId = rule.triggerValue;
      return cart.lines.some(
        line => line.merchandise?.product?.id === productId
      );

    case 'ON_QUANTITY':
      const config = JSON.parse(rule.triggerValue || '{}');
      return cart.lines.some(
        line => line.merchandise?.product?.id === config.productId &&
                line.quantity >= parseInt(config.quantity || '1')
      );

    default:
      return false;
  }
}
