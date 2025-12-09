'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/lib/cart-context';
import { useOrders } from '@/lib/order-context';
import { useCoupon } from '@/lib/coupon-context';
import { CouponInput } from '@/components/coupon-input';
import { calculateProductPrice } from '@/lib/pricing';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { appliedCoupon, calculateDiscount } = useCoupon();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    phoneNumber: '',
    deliveryAddress: '',
    email: ''
  });
  // Calculate cart totals using product-specific dynamic pricing
  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
  
  // Group items by product ID to apply bulk pricing correctly
  const productGroups = items.reduce((groups, item) => {
    const productId = item.product.id;
    if (!groups[productId]) {
      groups[productId] = { items: [], totalQuantity: 0 };
    }
    groups[productId].items.push(item);
    groups[productId].totalQuantity += item.quantity;
    return groups;
  }, {} as Record<string, { items: typeof items, totalQuantity: number }>);

  // Calculate subtotal by applying bulk pricing per product
  const subtotal = Object.entries(productGroups).reduce((total, [productId, group]) => {
    return total + calculateProductPrice(productId, group.totalQuantity);
  }, 0);
  
  const discount = calculateDiscount(subtotal);
  const shipping = 0; // Fixed at 0DH
  const total = subtotal - discount + shipping;
  
  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };
    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!customerInfo.fullName || !customerInfo.phoneNumber || !customerInfo.deliveryAddress) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);      // Create the order with coupon info
      const orderId = await addOrder(customerInfo, items, { 
        subtotal, 
        shipping, 
        total,
        discount,
        couponCode: appliedCoupon?.code
      });

      // Note: Coupon usage will be tracked when order status changes to "Delivered"
      // This prevents counting undelivered orders against coupon usage limits

      // Clear cart and redirect
      clearCart();
      router.push(`/order-confirmation?orderId=${orderId}`);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">You need to add items to your cart before checkout.</p>        <Link href="/collection">
          <Button size="lg">Shop Now</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-xl font-bold mb-4">Customer Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName" className="text-sm">Full Name</Label>
                    <Input 
                      id="fullName" 
                      name="fullName" 
                      value={customerInfo.fullName} 
                      onChange={handleInfoChange} 
                      required 
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phoneNumber" className="text-sm">Phone Number</Label>
                    <Input 
                      id="phoneNumber" 
                      name="phoneNumber" 
                      type="tel" 
                      value={customerInfo.phoneNumber} 
                      onChange={handleInfoChange} 
                      required 
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="deliveryAddress" className="text-sm">Delivery Address</Label>
                    <Input 
                      id="deliveryAddress" 
                      name="deliveryAddress" 
                      value={customerInfo.deliveryAddress} 
                      onChange={handleInfoChange} 
                      required 
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-sm">Email (Optional)</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={customerInfo.email} 
                      onChange={handleInfoChange} 
                      className="mt-2"
                    />
                  </div>
                </div>
                
                <div className="flex justify-between pt-6">
                  <Link href="/cart">
                    <Button variant="outline" size="lg">Back to Cart</Button>
                  </Link>
                  <Button type="submit" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? 'Processing Order...' : 'Place Order'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        
        {/* Order Summary */}
        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-center py-1">
                    <span className="font-medium text-sm">{item.product.name} (x{item.quantity})</span>
                    <span className="text-gray-600 text-xs">Size: {item.product.selectedSize}</span>
                  </div>
                ))}
              </div>              {/* Coupon Code Section */}
              <div className="border-t mt-4 pt-4">
                <CouponInput />
              </div>

              {/* Pricing breakdown with bulk discount info */}
              <div className="border-t mt-4 pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Total Items</span>
                  <span className="font-medium text-sm">{totalQuantity}</span>
                </div>

                {totalQuantity > 1 && (
                  <div className="bg-green-50 p-2 rounded text-xs text-green-700">
                    💰 Bulk pricing applied! You're saving money with this quantity.
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">
                    Subtotal ({totalQuantity} item{totalQuantity > 1 ? 's' : ''})
                  </span>
                  <span className="font-medium text-sm">{subtotal} DH</span>
                </div>

                {totalQuantity > 1 && (
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Price per item</span>
                    <span>{(subtotal / totalQuantity).toFixed(0)} DH each</span>
                  </div>
                )}

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="text-sm">Discount</span>
                    <span className="font-medium text-sm">-{discount.toFixed(2)} DH</span>
                  </div>
                )}

                <div className="flex justify-between border-t pt-4 text-base font-bold">
                  <span>Total</span>
                  <span>{total.toFixed(2)} DH</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}