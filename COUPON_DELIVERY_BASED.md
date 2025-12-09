# 🚚 Delivery-Based Coupon Usage System

## Overview

The coupon system has been updated to only count coupons as "used" when orders reach **"Delivered"** status, not when they are created or confirmed. This ensures more accurate coupon usage tracking and prevents abuse.

---

## 📋 **Business Logic**

### **When Coupons Are Counted as Used:**
- ✅ **Only when order status = "Delivered"**
- ✅ Customer has actually received the product
- ✅ Transaction is considered complete

### **When Coupons Are NOT Counted:**
- ❌ Order created (Pending status)
- ❌ Order confirmed (Confirmed status) 
- ❌ Order shipped (Shipped status)
- ❌ Order cancelled (any status)

---

## 🔄 **System Flow**

### **1. Customer Places Order**
```
Customer applies coupon → Order created with Pending status
Coupon: NOT counted as used yet
Usage Count: Unchanged
```

### **2. Admin Confirms Order**
```
Admin changes status: Pending → Confirmed
Coupon: Still NOT counted as used
Usage Count: Still unchanged
```

### **3. Admin Ships Order**
```
Admin changes status: Confirmed → Shipped
Coupon: Still NOT counted as used
Usage Count: Still unchanged
```

### **4. Order Gets Delivered**
```
Admin changes status: Shipped → Delivered
Coupon: NOW counted as used ✅
Usage Count: Incremented by 1
Usage Record: Created in coupon_usage table
```

### **5. Order Cancelled After Delivery (Edge Case)**
```
Admin changes status: Delivered → Canceled
Coupon: Usage REVERSED ↩️
Usage Count: Decremented by 1
Usage Record: Deleted from coupon_usage table
```

---

## 🛠 **Technical Implementation**

### **Files Modified:**

#### **1. Checkout Process (`src/app/checkout/page.tsx`)**
```typescript
// BEFORE: Coupon tracked immediately
if (appliedCoupon) {
  await fetch('/api/coupons/use', { ... }); // ❌ Removed
}

// AFTER: Coupon tracked only on delivery
// Note: Coupon usage will be tracked when order status changes to "Delivered"
```

#### **2. Order Status Updates (`src/lib/order-context.tsx`)**
```typescript
// NEW: Track coupon usage on delivery
if (status === 'Delivered' && oldStatus !== 'Delivered' && currentOrder?.couponCode) {
  await fetch('/api/coupons/use', {
    method: 'POST',
    body: JSON.stringify({
      couponCode: currentOrder.couponCode,
      orderId: currentOrder.id,
      discountAmount: currentOrder.discount
    })
  });
}

// NEW: Reverse coupon usage if delivered order is cancelled
if (status === 'Canceled' && oldStatus === 'Delivered' && currentOrder?.couponCode) {
  await fetch('/api/coupons/reverse', {
    method: 'POST',
    body: JSON.stringify({
      couponCode: currentOrder.couponCode,
      orderId: currentOrder.id
    })
  });
}
```

#### **3. Coupon Usage API (`src/app/api/coupons/use/route.ts`)**
```typescript
// NEW: Validate order is delivered before counting usage
const { data: order } = await supabase
  .from('orders')
  .select('status')
  .eq('id', orderId)
  .single();

if (order.status !== 'Delivered') {
  return NextResponse.json(
    { error: 'Coupon can only be marked as used for delivered orders' },
    { status: 400 }
  );
}

// NEW: Prevent duplicate usage tracking
const { data: existingUsage } = await supabase
  .from('coupon_usage')
  .select('id')
  .eq('coupon_id', coupon.id)
  .eq('order_id', orderId);

if (existingUsage) {
  return { success: true, message: 'Already recorded' };
}
```

#### **4. Coupon Reversal API (`src/app/api/coupons/reverse/route.ts`)**
```typescript
// NEW: API endpoint to reverse coupon usage
export async function POST(request: NextRequest) {
  // Find usage record for this order
  // Delete the usage record
  // Decrement coupon usage_count
  // Ensure count doesn't go below 0
}
```

---

## 📊 **Database Schema**

### **Tables Used:**

#### **`coupons` Table**
```sql
- usage_count: Only incremented when orders are delivered
- max_usage: Compared against delivered orders only
```

#### **`coupon_usage` Table**
```sql
- Records individual coupon uses
- Only created when order status = 'Delivered'
- Deleted if delivered order is cancelled
```

#### **`orders` Table**
```sql
- coupon_code: Stored from checkout
- discount_amount: Stored from checkout
- status: Triggers coupon usage tracking
```

---

## 🔍 **Admin Dashboard Impact**

### **Admin Order Management:**
- ✅ **Pending → Confirmed**: No coupon impact
- ✅ **Confirmed → Shipped**: No coupon impact  
- ✅ **Shipped → Delivered**: Coupon counted as used
- ⚠️ **Delivered → Canceled**: Coupon usage reversed

### **Coupon Analytics:**
- Usage counts reflect actual delivered orders
- More accurate ROI tracking
- Prevents gaming of coupon limits

---

## 🧪 **Testing Scenarios**

### **Test Case 1: Normal Flow**
1. Customer applies `WELCOME10` coupon
2. Order created with Pending status
3. Check: `usage_count` should be unchanged
4. Admin marks as Delivered
5. Check: `usage_count` should increase by 1

### **Test Case 2: Cancelled Before Delivery**
1. Customer applies `TOJI20` coupon
2. Order goes: Pending → Confirmed → Cancelled
3. Check: `usage_count` should be unchanged (never incremented)

### **Test Case 3: Cancelled After Delivery**
1. Customer applies `SUMMER15` coupon
2. Order goes: Pending → Confirmed → Shipped → Delivered
3. Check: `usage_count` increases by 1
4. Admin marks as Cancelled
5. Check: `usage_count` decreases by 1

### **Test Case 4: Duplicate Prevention**
1. Order with coupon is marked as Delivered
2. Try to mark same order as Delivered again
3. Check: `usage_count` should not double-increment

---

## 🚀 **API Endpoints**

### **POST `/api/coupons/use`**
**Purpose:** Track coupon usage (automatic on delivery)
```typescript
Body: {
  couponCode: string,
  orderId: string,
  orderNumber: string,
  discountAmount: number
}

Validation:
- Order must exist
- Order status must be 'Delivered'
- No duplicate usage for same order
```

### **POST `/api/coupons/reverse`**
**Purpose:** Reverse coupon usage (automatic on cancellation)
```typescript
Body: {
  couponCode: string,
  orderId: string,
  orderNumber: string
}

Actions:
- Find usage record
- Delete usage record
- Decrement usage_count (min: 0)
```

---

## ⚠️ **Important Notes**

### **Coupon Validation:**
- Coupons can still be applied at checkout
- Validation checks `usage_count` vs `max_usage`
- Count only reflects delivered orders

### **Usage Limits:**
- `max_usage` is compared against delivered orders only
- Pending/confirmed orders don't count toward limit
- More customer-friendly approach

### **Edge Cases Handled:**
- ✅ Duplicate delivery tracking prevention
- ✅ Negative usage count prevention
- ✅ Missing order validation
- ✅ Non-existent coupon handling

---

## 📈 **Benefits**

### **Business Benefits:**
- More accurate coupon ROI tracking
- Reduced coupon abuse potential
- Better inventory management correlation
- Customer satisfaction focused

### **Technical Benefits:**
- Cleaner separation of concerns
- Better error handling
- Comprehensive logging
- Atomic operations

---

## 🔧 **Deployment Checklist**

- [ ] Run updated database schema
- [ ] Test coupon application at checkout
- [ ] Test order status changes in admin
- [ ] Verify usage count updates correctly
- [ ] Test edge cases (cancellations, duplicates)
- [ ] Monitor API logs for errors

---

**Last Updated:** January 27, 2025  
**Change Type:** Business Logic Update  
**Priority:** High - Changes core coupon behavior  
**Impact:** All orders with coupons
