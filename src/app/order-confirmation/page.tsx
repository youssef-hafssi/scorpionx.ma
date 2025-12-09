'use client';

import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useOrders } from '@/lib/order-context';
import { calculateProductPrice } from '@/lib/pricing';
import type { Order } from '@/lib/order-context';

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const { getOrder } = useOrders();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    if (orderId) {
      const foundOrder = getOrder(orderId);
      setOrder(foundOrder || null);
    }
    setLoading(false);
  }, [searchParams, getOrder]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <Card>
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
            <p className="text-gray-600 mb-6">We couldn't find your order. Please check your order number.</p>
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <Card>
        <CardContent className="p-8">          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-gray-600">Thank you for your purchase.</p>
            
            {order.discount && order.discount > 0 && order.couponCode && (
              <div className="mt-4 inline-block bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                <p className="text-sm text-green-800">
                  🎉 You saved <span className="font-bold">{order.discount.toFixed(2)} DH</span> with code <span className="font-bold">{order.couponCode}</span>
                </p>
              </div>
            )}
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <div className="flex justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500">Order Number</p>
                <p className="font-semibold">{order.orderNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-semibold">{order.orderDate.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>
            </div>

          </div>
            <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Order Details</h2>
              <div className="border rounded-lg overflow-hidden">
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex justify-between">
                    <span className="font-medium">Product</span>
                    <span className="font-medium">Total</span>
                  </div>
                </div>
                <div className="p-4">
                  {(() => {
                    // Group items by product ID to calculate bulk pricing correctly
                    const productGroups = order.items.reduce((groups, item) => {
                      const productId = item.product.id;
                      if (!groups[productId]) {
                        groups[productId] = { 
                          product: item.product,
                          items: [],
                          totalQuantity: 0 
                        };
                      }
                      groups[productId].items.push(item);
                      groups[productId].totalQuantity += item.quantity;
                      return groups;
                    }, {} as Record<string, { product: any, items: any[], totalQuantity: number }>);

                    // Display each product group with correct bulk pricing
                    return Object.entries(productGroups).map(([productId, group], index) => {
                      const totalPrice = calculateProductPrice(productId, group.totalQuantity);
                      return (
                        <div key={index} className="flex justify-between py-2">
                          <div>
                            <p className="font-medium">{group.product.name}</p>
                            <p className="text-sm text-gray-500">
                              {group.items.map(item => item.product.selectedSize).filter(Boolean).join(', ') && 
                                `Size: ${group.items.map(item => item.product.selectedSize).filter(Boolean).join(', ')} • `}
                              Qty: {group.totalQuantity}
                            </p>
                          </div>
                          <p>{totalPrice} DH</p>
                        </div>
                      );
                    });
                  })()}
                </div>                <div className="p-4 border-t bg-gray-50">
                  <div className="flex justify-between py-1">
                    <span>Subtotal</span>
                    <span>{order.subtotal} DH</span>
                  </div>

                  {order.discount && order.discount > 0 && (
                    <div className="flex justify-between py-1 text-green-600">
                      <span className="flex items-center gap-2">
                        Discount
                        {order.couponCode && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-semibold">
                            {order.couponCode}
                          </span>
                        )}
                      </span>
                      <span>-{order.discount.toFixed(2)} DH</span>
                    </div>
                  )}

                  <div className="flex justify-between py-1">
                    <span>Tax</span>
                    <span>0 DH</span>
                  </div>
                  <div className="flex justify-between py-1 font-bold text-lg border-t pt-2 mt-2">
                    <span>Total</span>
                    <span>{order.total.toFixed(2)} DH</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">{order.customerInfo.fullName}</p>
                <p className="mt-1">{order.customerInfo.deliveryAddress}</p>
                <p className="mt-2 text-sm text-gray-600">Phone: {order.customerInfo.phoneNumber}</p>
                {order.customerInfo.email && (
                  <p className="text-sm text-gray-600">Email: {order.customerInfo.email}</p>
                )}
              </div>
            </div>
              <div className="border-t pt-6 flex flex-col sm:flex-row justify-between gap-4">
              <Link href="/collection">
                <Button variant="outline" className="w-full sm:w-auto">
                  Continue Shopping
                </Button>
              </Link>
              
              <Link href="/">
                <Button className="w-full sm:w-auto">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>      </Card>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="text-center">Loading...</div>
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  );
}