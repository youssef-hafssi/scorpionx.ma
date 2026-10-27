/**
 * Dynamic pricing utility for the product
 * Handles bulk pricing discounts based on quantity
 */

// Awrah Cover Pricing
export const calculatePrice = (quantity: number): number => {
  if (quantity === 1) return 220;
  if (quantity === 2) return 400;
  if (quantity === 3) return 580;
  if (quantity >= 4) return quantity * 190;
  return 220;
};

export const getPricePerItem = (quantity: number): number => {
  const totalPrice = calculatePrice(quantity);
  return totalPrice / quantity;
};

export const getPricingInfo = (quantity: number) => {
  const totalPrice = calculatePrice(quantity);
  const pricePerItem = getPricePerItem(quantity);
  const hasBulkDiscount = quantity > 1 && quantity <= 3;

  return {
    totalPrice,
    pricePerItem,
    hasBulkDiscount,
    quantity
  };
};

export const getPricingTable = () => {
  return [
    { quantity: 1, totalPrice: 220, pricePerItem: 220 },
    { quantity: 2, totalPrice: 400, pricePerItem: 200 },
    { quantity: 3, totalPrice: 580, pricePerItem: 193.33 },
    { quantity: '4+', totalPrice: 'varies', pricePerItem: 190 }
  ];
};

// Toji Sweatpants Pricing
export const calculateTojiPrice = (quantity: number): number => {
  if (quantity === 1) return 250;
  if (quantity === 2) return 460;
  if (quantity === 3) return 670;
  if (quantity >= 4) return (quantity * 210) + 40;
  return 250;
};

export const getTojiPricePerItem = (quantity: number): number => {
  const totalPrice = calculateTojiPrice(quantity);
  return totalPrice / quantity;
};

export const getTojiPricingInfo = (quantity: number) => {
  const totalPrice = calculateTojiPrice(quantity);
  const pricePerItem = getTojiPricePerItem(quantity);
  const hasBulkDiscount = quantity > 1 && quantity <= 3;

  return {
    totalPrice,
    pricePerItem,
    hasBulkDiscount,
    quantity
  };
};

export const getTojiPricingTable = () => {
  return [
    { quantity: 1, totalPrice: 250, pricePerItem: 250 },
    { quantity: 2, totalPrice: 460, pricePerItem: 230 },
    { quantity: 3, totalPrice: 670, pricePerItem: 223.33 },
    { quantity: '4+', totalPrice: 'varies', pricePerItem: 210 }
  ];
};

// Sweat/Track Pants Pricing
export const calculateSweatPrice = (quantity: number): number => {
  if (quantity === 1) return 270;
  // For 2+ items: 235 DH each + 35 DH shipping
  return (quantity * 235) + 35;
};

export const getSweatPricePerItem = (quantity: number): number => {
  const totalPrice = calculateSweatPrice(quantity);
  return totalPrice / quantity;
};

export const getSweatPricingInfo = (quantity: number) => {
  const totalPrice = calculateSweatPrice(quantity);
  const pricePerItem = getSweatPricePerItem(quantity);
  const hasBulkDiscount = quantity > 1;

  return {
    totalPrice,
    pricePerItem,
    hasBulkDiscount,
    quantity
  };
};

export const getSweatPricingTable = () => {
  return [
    { quantity: 1, totalPrice: 270, pricePerItem: 270 },
    { quantity: 2, totalPrice: 505, pricePerItem: 252.5 },
    { quantity: 3, totalPrice: 740, pricePerItem: 246.67 },
    { quantity: '4+', totalPrice: 'varies', pricePerItem: 235 }
  ];
};

// Track Sweater Pricing
export const calculateTrackSweaterPrice = (quantity: number): number => {
  if (quantity === 1) return 250;
  // For 2+ items: 215 DH each + 35 DH shipping
  return (quantity * 215) + 35;
};

export const getTrackSweaterPricePerItem = (quantity: number): number => {
  const totalPrice = calculateTrackSweaterPrice(quantity);
  return totalPrice / quantity;
};

export const getTrackSweaterPricingInfo = (quantity: number) => {
  const totalPrice = calculateTrackSweaterPrice(quantity);
  const pricePerItem = getTrackSweaterPricePerItem(quantity);
  const hasBulkDiscount = quantity > 1;

  return {
    totalPrice,
    pricePerItem,
    hasBulkDiscount,
    quantity
  };
};

export const getTrackSweaterPricingTable = () => {
  return [
    { quantity: 1, totalPrice: 250, pricePerItem: 250 },
    { quantity: 2, totalPrice: 465, pricePerItem: 232.5 },
    { quantity: 3, totalPrice: 680, pricePerItem: 226.67 },
    { quantity: '4+', totalPrice: 'varies', pricePerItem: 215 }
  ];
};

// Awrah Cover Leggings Pricing (1 = 140, 2 = 200, 3 = 280, each additional item after that = +80)
export const calculateLeggingsPrice = (quantity: number): number => {
  if (quantity === 1) return 140;
  if (quantity === 2) return 200;
  return 280 + (quantity - 3) * 80;
};

export const getLeggingsPricePerItem = (quantity: number): number => {
  const totalPrice = calculateLeggingsPrice(quantity);
  return totalPrice / quantity;
};

export const getLeggingsPricingInfo = (quantity: number) => {
  const totalPrice = calculateLeggingsPrice(quantity);
  const pricePerItem = getLeggingsPricePerItem(quantity);
  const hasBulkDiscount = quantity > 1;

  return {
    totalPrice,
    pricePerItem,
    hasBulkDiscount,
    quantity
  };
};

export const getLeggingsPricingTable = () => {
  return [
    { quantity: 1, totalPrice: 140, pricePerItem: 140 },
    { quantity: 2, totalPrice: 200, pricePerItem: 100 },
    { quantity: 3, totalPrice: 280, pricePerItem: 93.33 },
    { quantity: '4+', totalPrice: 'varies', pricePerItem: 'varies' }
  ];
};

// Track pants / zip-up hoodie colorways share the same pricing and bundle together
export const TRACK_PANTS_IDS = ['sweat', 'track-pants-black'];
export const ZIPUP_HOODIE_IDS = ['track-sweater', 'zipup-hoodie-black'];

// Bundle Configuration
export const TRACK_BUNDLE = {
  products: [...TRACK_PANTS_IDS, ...ZIPUP_HOODIE_IDS],
  bundlePrice: 475, // Price for 1 bundle
  bundlePriceMultiple: 440, // Price per bundle for 2+ bundles
  bundleShipping: 35, // Flat shipping for 2+ bundles
  individualTotal: 520, // 270 + 250
  savings: 45, // Savings for 1 bundle
};

// Calculate bundle price based on quantity
export const calculateBundlePrice = (bundleCount: number): number => {
  if (bundleCount === 0) return 0;
  if (bundleCount === 1) return TRACK_BUNDLE.bundlePrice; // 475 DH
  // For 2+ bundles: (number of bundles × 440) + 35
  return (bundleCount * TRACK_BUNDLE.bundlePriceMultiple) + TRACK_BUNDLE.bundleShipping;
};

// Calculate bundle savings
export const calculateBundleSavings = (bundleCount: number): number => {
  if (bundleCount === 0) return 0;
  const individualTotal = bundleCount * TRACK_BUNDLE.individualTotal; // 520 DH per bundle
  const bundleTotal = calculateBundlePrice(bundleCount);
  return individualTotal - bundleTotal;
};

// Smart pricing calculator - applies correct pricing based on product ID
export const calculateProductPrice = (productId: string, quantity: number): number => {
  if (productId === 'toji-sweatpants') {
    return calculateTojiPrice(quantity);
  }
  if (TRACK_PANTS_IDS.includes(productId)) {
    return calculateSweatPrice(quantity);
  }
  if (ZIPUP_HOODIE_IDS.includes(productId)) {
    return calculateTrackSweaterPrice(quantity);
  }
  if (productId === 'awrah-cover-leggings') {
    return calculateLeggingsPrice(quantity);
  }
  // Default to Awrah Cover pricing for awrah-cover or any other product
  return calculatePrice(quantity);
};

const sumQuantities = (productQuantities: Record<string, number>, ids: string[]): number =>
  ids.reduce((sum, id) => sum + (productQuantities[id] || 0), 0);

// Number of complete pants + hoodie bundles in the cart (any colorway combination)
export const getTrackBundleCount = (productQuantities: Record<string, number>): number =>
  Math.min(
    sumQuantities(productQuantities, TRACK_PANTS_IDS),
    sumQuantities(productQuantities, ZIPUP_HOODIE_IDS)
  );

// Calculate cart total with bundle pricing
export const calculateCartTotalWithBundles = (
  productQuantities: Record<string, number>
): number => {
  const sweatQty = sumQuantities(productQuantities, TRACK_PANTS_IDS);
  const sweaterQty = sumQuantities(productQuantities, ZIPUP_HOODIE_IDS);

  // Calculate how many complete bundles we can make
  const completeBundles = Math.min(sweatQty, sweaterQty);
  
  // Calculate remaining items after bundles
  const remainingSweat = sweatQty - completeBundles;
  const remainingSweater = sweaterQty - completeBundles;
  
  // Calculate bundle total using the bundle pricing function
  let total = calculateBundlePrice(completeBundles);
  
  // Add remaining individual items at their full price (using bulk pricing)
  if (remainingSweat > 0) {
    total += calculateSweatPrice(remainingSweat);
  }
  if (remainingSweater > 0) {
    total += calculateTrackSweaterPrice(remainingSweater);
  }
  
  // Add other products
  Object.entries(productQuantities).forEach(([productId, qty]) => {
    if (!TRACK_BUNDLE.products.includes(productId) && qty > 0) {
      total += calculateProductPrice(productId, qty);
    }
  });
  
  return total;
};

export const getProductPricePerItem = (productId: string, quantity: number): number => {
  const totalPrice = calculateProductPrice(productId, quantity);
  return totalPrice / quantity;
};
