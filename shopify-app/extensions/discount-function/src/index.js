/**
 * Custom Discount Function
 * This function applies custom discount logic based on cart contents,
 * customer tags, product tags, and configurable rules.
 */

export function run(input) {
  const configuration = JSON.parse(
    input?.discountNode?.metafield?.value ?? '{}'
  );

  if (!configuration.discountRules || configuration.discountRules.length === 0) {
    return { discounts: [] };
  }

  const cart = input.cart;
  const cartTotal = parseFloat(cart.cost.subtotalAmount.amount);
  const customer = cart.buyerIdentity?.customer;

  const discounts = [];

  // Process each discount rule
  for (const rule of configuration.discountRules) {
    if (!rule.isActive) continue;

    // Check if rule is within valid date range
    if (rule.startDate && new Date(rule.startDate) > new Date()) continue;
    if (rule.endDate && new Date(rule.endDate) < new Date()) continue;

    // Check cart value conditions
    if (rule.minCartValue && cartTotal < rule.minCartValue) continue;
    if (rule.maxCartValue && cartTotal > rule.maxCartValue) continue;

    // Check customer tags if specified
    if (rule.customerTags && rule.customerTags.length > 0 && customer) {
      const hasRequiredTag = rule.customerTags.some(tag =>
        customer.hasTags?.includes(tag)
      );
      if (!hasRequiredTag) continue;
    }

    // Apply discount based on type
    const discount = applyDiscount(rule, cart);
    if (discount) {
      discounts.push(discount);

      // If not stackable, break after first discount
      if (!rule.stackable) break;
    }
  }

  // Sort by priority (higher priority first)
  discounts.sort((a, b) => (b.priority || 0) - (a.priority || 0));

  return { discounts };
}

function applyDiscount(rule, cart) {
  const targets = getTargets(rule, cart);

  if (targets.length === 0) return null;

  switch (rule.type) {
    case 'PERCENTAGE':
      return {
        targets,
        value: {
          percentage: {
            value: rule.value.toString()
          }
        },
        message: rule.description || `${rule.value}% off`,
        priority: rule.priority || 0
      };

    case 'FIXED_AMOUNT':
      return {
        targets,
        value: {
          fixedAmount: {
            amount: rule.value.toString()
          }
        },
        message: rule.description || `$${rule.value} off`,
        priority: rule.priority || 0
      };

    case 'BUY_X_GET_Y':
      return applyBuyXGetY(rule, cart);

    default:
      return null;
  }
}

function getTargets(rule, cart) {
  const targets = [];

  for (const line of cart.lines) {
    const productId = line.merchandise?.product?.id;

    // If specific products are configured, only target those
    if (rule.productIds && rule.productIds.length > 0) {
      if (rule.productIds.includes(productId)) {
        targets.push({
          cartLine: {
            id: line.id
          }
        });
      }
      continue;
    }

    // Check minimum quantity if specified
    if (rule.minQuantity && line.quantity < rule.minQuantity) {
      continue;
    }

    // If no specific targeting, apply to all lines
    targets.push({
      cartLine: {
        id: line.id
      }
    });
  }

  return targets;
}

function applyBuyXGetY(rule, cart) {
  // Implement Buy X Get Y logic
  // This is a simplified version - can be expanded based on specific needs
  const triggerQuantity = rule.triggerQuantity || 2;
  const rewardQuantity = rule.rewardQuantity || 1;

  const eligibleLines = cart.lines.filter(line => {
    const productId = line.merchandise?.product?.id;
    return rule.productIds?.includes(productId) &&
           line.quantity >= triggerQuantity;
  });

  if (eligibleLines.length === 0) return null;

  return {
    targets: eligibleLines.map(line => ({
      cartLine: { id: line.id }
    })),
    value: {
      percentage: {
        value: "100"
      }
    },
    message: `Buy ${triggerQuantity}, Get ${rewardQuantity} Free`,
    conditions: {
      quantity: {
        greaterThanOrEqualTo: triggerQuantity
      }
    }
  };
}
