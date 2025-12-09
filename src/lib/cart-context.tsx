'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  sizes: string[];
  selectedSize?: string;
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

  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

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