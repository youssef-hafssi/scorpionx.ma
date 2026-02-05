'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Bundle configuration
const TRACK_BUNDLE = {
  products: ['sweat', 'track-sweater'],
  bundlePrice: 475,
};

export type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  sizes: string[];
  selectedSize?: string;
  isBundle?: boolean; // Flag to indicate item was added as part of a bundle
};

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string, selectedSize?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedSize?: string) => void;
  clearCart: () => void;
  subtotal: number;
  checkStockAvailability: () => Promise<{ available: boolean; details: any[] }>;
  isCartSidebarOpen: boolean;
  openCartSidebar: () => void;
  closeCartSidebar: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartSidebarOpen, setIsCartSidebarOpen] = useState(false);
  
  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item =>
        item.product.id === product.id &&
        item.product.selectedSize === product.selectedSize
      );

      if (existingItem) {
        return prevItems.map(item =>
          item.product.id === product.id && item.product.selectedSize === product.selectedSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevItems, { product, quantity: 1 }];
    });

    // Open cart sidebar when item is added
    setIsCartSidebarOpen(true);
  };

  const openCartSidebar = () => {
    setIsCartSidebarOpen(true);
  };

  const closeCartSidebar = () => {
    setIsCartSidebarOpen(false);
  };

  const removeItem = (productId: string, selectedSize?: string) => {
    setItems(prevItems =>
      prevItems.filter(item => {
        if (selectedSize) {
          return !(item.product.id === productId && item.product.selectedSize === selectedSize);
        }
        return item.product.id !== productId;
      })
    );
  };

  const updateQuantity = (productId: string, quantity: number, selectedSize?: string) => {
    if (quantity <= 0) {
      removeItem(productId, selectedSize);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item => {
        if (selectedSize) {
          return item.product.id === productId && item.product.selectedSize === selectedSize
            ? { ...item, quantity }
            : item;
        }
        return item.product.id === productId
          ? { ...item, quantity }
          : item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const checkStockAvailability = async () => {
    try {
      const stockCheckItems = items.map(item => ({
        product_id: item.product.id,
        selected_size: item.product.selectedSize,
        quantity: item.quantity
      }));

      const response = await fetch('/api/stock/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: stockCheckItems }),
      });

      if (!response.ok) {
        throw new Error('Failed to check stock availability');
      }

      const result = await response.json();
      return {
        available: result.allItemsAvailable,
        details: result.items
      };
    } catch (error) {
      console.error('Error checking stock availability:', error);
      return { available: true, details: [] };
    }
  };

  // Calculate subtotal with bundle pricing
  const calculateSubtotal = (): number => {
    // Check if both bundle products are in cart
    const bundleProductIds = TRACK_BUNDLE.products;
    const bundleItemsInCart = items.filter(item => 
      bundleProductIds.includes(item.product.id)
    );
    
    // Count how many of each bundle product we have
    const sweatItems = items.filter(item => item.product.id === 'sweat');
    const sweaterItems = items.filter(item => item.product.id === 'track-sweater');
    
    const sweatQty = sweatItems.reduce((sum, item) => sum + item.quantity, 0);
    const sweaterQty = sweaterItems.reduce((sum, item) => sum + item.quantity, 0);
    
    // Calculate how many complete bundles we can make
    const completeBundles = Math.min(sweatQty, sweaterQty);
    
    // Calculate remaining items after bundles
    const remainingSweat = sweatQty - completeBundles;
    const remainingSweater = sweaterQty - completeBundles;
    
    // Get prices for individual items
    const sweatPrice = 270; // Track Pants individual price
    const sweaterPrice = 250; // Track Sweater individual price
    
    // Calculate bundle total
    let total = completeBundles * TRACK_BUNDLE.bundlePrice;
    
    // Add remaining individual items at their full price
    total += remainingSweat * sweatPrice;
    total += remainingSweater * sweaterPrice;
    
    // Add other non-bundle items
    const nonBundleItems = items.filter(item => 
      !bundleProductIds.includes(item.product.id)
    );
    total += nonBundleItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    
    return total;
  };

  const subtotal = calculateSubtotal();

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        checkStockAvailability,
        isCartSidebarOpen,
        openCartSidebar,
        closeCartSidebar,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
}