'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface Coupon {
  id: string;
  code: string;
  name: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  influencer_name?: string;
}

interface CouponContextType {
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string; coupon?: Coupon }>;
  removeCoupon: () => void;
  calculateDiscount: (subtotal: number) => number;
}

const CouponContext = createContext<CouponContextType | undefined>(undefined);

export function CouponProvider({ children }: { children: ReactNode }) {
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string; coupon?: Coupon }> => {
    try {
      const response = await fetch(`/api/coupons?code=${encodeURIComponent(code)}&validate=true`);
      const data = await response.json();

      if (!response.ok || !data.valid) {
        return {
          success: false,
          message: data.message || 'Invalid coupon code'
        };
      }

      setAppliedCoupon(data.coupon);
      return {
        success: true,
        message: 'Coupon applied successfully!',
        coupon: data.coupon
      };
    } catch (error) {
      console.error('Error applying coupon:', error);
      return {
        success: false,
        message: 'Failed to apply coupon'
      };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const calculateDiscount = (subtotal: number): number => {
    if (!appliedCoupon) return 0;

    if (appliedCoupon.discount_type === 'percentage') {
      return (subtotal * appliedCoupon.discount_value) / 100;
    } else {
      // Fixed discount
      return Math.min(appliedCoupon.discount_value, subtotal);
    }
  };

  return (
    <CouponContext.Provider
      value={{
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        calculateDiscount
      }}
    >
      {children}
    </CouponContext.Provider>
  );
}

export function useCoupon() {
  const context = useContext(CouponContext);
  if (context === undefined) {
    throw new Error('useCoupon must be used within a CouponProvider');
  }
  return context;
}
