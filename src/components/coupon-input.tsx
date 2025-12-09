'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCoupon } from '@/lib/coupon-context';
import { Tag, X, Check, AlertCircle } from 'lucide-react';

export function CouponInput() {
  const { appliedCoupon, applyCoupon, removeCoupon } = useCoupon();
  const [couponCode, setCouponCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setMessage({ type: 'error', text: 'Please enter a coupon code' });
      return;
    }

    setIsApplying(true);
    setMessage(null);

    const result = await applyCoupon(couponCode.trim());

    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      setCouponCode('');
    } else {
      setMessage({ type: 'error', text: result.message });
    }

    setIsApplying(false);
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponCode('');
    setMessage(null);
  };

  if (appliedCoupon) {
    return (
      <div className="border-2 border-green-200 bg-green-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-green-500 rounded-full p-2">
              <Tag className="h-4 w-4 text-white" />
            </div>            <div>
              <p className="font-semibold text-green-900">{appliedCoupon.code}</p>
              <p className="text-sm text-green-700">
                {appliedCoupon.discount_type === 'percentage'
                  ? `${appliedCoupon.discount_value}% off`
                  : `${appliedCoupon.discount_value} DH off`}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemoveCoupon}
            className="text-green-700 hover:text-green-900 hover:bg-green-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
            className="pl-10 uppercase"
            disabled={isApplying}
          />
        </div>
        <Button
          onClick={handleApplyCoupon}
          disabled={isApplying || !couponCode.trim()}
          className="px-6"
        >
          {isApplying ? 'Applying...' : 'Apply'}
        </Button>
      </div>

      {message && (
        <div
          className={`flex items-center gap-2 p-3 rounded-md text-sm ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <Check className="h-4 w-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}
    </div>
  );
}
