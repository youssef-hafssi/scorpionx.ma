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

// Smart pricing calculator - applies correct pricing based on product ID
export const calculateProductPrice = (productId: string, quantity: number): number => {
  if (productId === 'toji-sweatpants') {
    return calculateTojiPrice(quantity);
  }
  // Default to Awrah Cover pricing for awrah-cover or any other product
  return calculatePrice(quantity);
};

export const getProductPricePerItem = (productId: string, quantity: number): number => {
  const totalPrice = calculateProductPrice(productId, quantity);
  return totalPrice / quantity;
};
