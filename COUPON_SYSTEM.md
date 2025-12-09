# Coupon System Documentation

## Overview
The coupon system allows you to create and manage discount codes that customers can use during checkout. Each coupon can be tracked by usage count and optionally assigned to influencers for attribution.

---

## Features

### ✅ Customer Features
- Apply discount codes during checkout
- Real-time validation of coupon codes
- Visual feedback for applied coupons
- Automatic discount calculation
- Support for percentage and fixed-amount discounts

### ✅ Admin Features
- Create, edit, and delete coupons
- Set discount type (percentage or fixed amount)
- Assign coupons to influencers
- Track usage counts
- Set expiration dates
- Set maximum usage limits
- Activate/deactivate coupons
- View coupon statistics

---

## Database Schema

### Tables Created

#### 1. `coupons` table
Stores all coupon information:
- `id`: Unique identifier (UUID)
- `code`: Coupon code (unique, uppercase)
- `name`: Display name
- `discount_type`: 'percentage' or 'fixed'
- `discount_value`: Discount amount
- `influencer_name`: Optional influencer attribution
- `usage_count`: Times coupon has been used
- `max_usage`: Maximum usage limit (NULL = unlimited)
- `is_active`: Whether coupon is currently active
- `expires_at`: Optional expiration date
- `created_at`, `updated_at`: Timestamps

#### 2. `coupon_usage` table
Tracks individual coupon uses:
- `id`: Unique identifier (UUID)
- `coupon_id`: References coupon
- `order_id`: References order (nullable)
- `order_number`: Order number string
- `discount_amount`: Actual discount applied
- `used_at`: Timestamp of usage

#### 3. Updated `orders` table
Added fields:
- `coupon_code`: Applied coupon code
- `discount_amount`: Discount amount applied

---

## Setup Instructions

### 1. Database Setup
Run the `coupon-schema.sql` file in Supabase:
```bash
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to SQL Editor
4. Copy and paste the contents of coupon-schema.sql
5. Click 'Run' to execute
```

### 2. Environment Variables
No additional environment variables needed. Uses existing Supabase configuration.

### 3. Dependencies
Already installed:
- `@radix-ui/react-select` - for dropdown selects
- Lucide React icons

---

## Usage Guide

### For Customers

#### Applying a Coupon
1. Add items to cart
2. Go to checkout page
3. Enter coupon code in the "Enter coupon code" field
4. Click "Apply" button
5. Discount will be automatically calculated and displayed
6. Complete order as normal

#### Visual Feedback
- ✅ Green box shows applied coupon with discount details
- ❌ Red message shows invalid/expired coupons
- Discount line item appears in order summary

---

### For Administrators

#### Accessing Coupon Management
1. Go to Admin Dashboard (`/admin`)
2. Click "Coupons" in the navigation bar
3. Or click "Manage Coupons" in Quick Actions

#### Creating a New Coupon

1. Click "New Coupon" button
2. Fill in the form:
   - **Coupon Code**: Unique code (e.g., SUMMER20)
   - **Display Name**: Friendly name (e.g., Summer Sale)
   - **Discount Type**: Percentage or Fixed Amount
   - **Discount Value**: Amount (10 for 10% or 50 for 50 DH)
   - **Influencer Name**: Optional attribution
   - **Max Usage**: Optional limit (leave empty for unlimited)
   - **Expiry Date**: Optional expiration date
3. Click "Create"

#### Editing a Coupon
1. Find the coupon in the list
2. Click the edit icon (pencil)
3. Modify fields as needed
4. Click "Update"

#### Activating/Deactivating
- Click "Deactivate" to temporarily disable a coupon
- Click "Activate" to re-enable it
- Deactivated coupons cannot be used by customers

#### Deleting a Coupon
1. Click the trash icon next to the coupon
2. Confirm deletion
3. Coupon and all usage history will be removed

---

## API Endpoints

### GET `/api/coupons`
Fetch all coupons (admin) or validate a specific coupon.

**Query Parameters:**
- `code` - Coupon code to validate
- `validate=true` - Validate mode

**Response:**
```json
{
  "valid": true,
  "coupon": {
    "id": "uuid",
    "code": "SUMMER20",
    "name": "Summer Sale",
    "discount_type": "percentage",
    "discount_value": 20,
    "influencer_name": "Toji"
  }
}
```

### POST `/api/coupons`
Create a new coupon.

**Body:**
```json
{
  "code": "SUMMER20",
  "name": "Summer Sale",
  "discount_type": "percentage",
  "discount_value": 20,
  "influencer_name": "Toji",
  "max_usage": 100,
  "expires_at": "2025-12-31"
}
```

### PATCH `/api/coupons`
Update an existing coupon.

**Body:**
```json
{
  "id": "coupon-uuid",
  "discount_value": 25,
  "is_active": false
}
```

### DELETE `/api/coupons?id=uuid`
Delete a coupon.

### POST `/api/coupons/use`
Record coupon usage (called automatically during checkout).

**Body:**
```json
{
  "couponCode": "SUMMER20",
  "orderId": "order-uuid",
  "orderNumber": "ORD-12345678",
  "discountAmount": 40.50
}
```

---

## Code Structure

### Frontend Components
- `src/components/coupon-input.tsx` - Coupon input field for checkout
- `src/app/admin/coupons/page.tsx` - Admin coupon management page
- `src/lib/coupon-context.tsx` - Coupon state management

### Backend APIs
- `src/app/api/coupons/route.ts` - CRUD operations
- `src/app/api/coupons/use/route.ts` - Usage tracking

### UI Components
- `src/components/ui/select.tsx` - Dropdown select component
- `src/components/ui/badge.tsx` - Badge component
- `src/components/ui/dialog.tsx` - Modal dialog component

---

## Example Coupons

The schema includes sample coupons:

| Code | Type | Value | Influencer | Status |
|------|------|-------|------------|--------|
| WELCOME10 | Percentage | 10% | - | Active |
| TOJI20 | Percentage | 20% | Toji | Active |
| SUMMER15 | Percentage | 15% | - | Active |
| FIXED50 | Fixed | 50 DH | - | Active |

---

## Validation Rules

### Coupon Validation
- ✅ Code must exist in database
- ✅ Coupon must be active (`is_active = true`)
- ✅ Must not be expired
- ✅ Must not exceed max usage limit
- ✅ Code is case-insensitive (converted to uppercase)

### Discount Calculation
- **Percentage**: `discount = subtotal × (discount_value / 100)`
- **Fixed**: `discount = min(discount_value, subtotal)`
  - Fixed discounts cannot exceed the subtotal

---

## Integration Points

### Checkout Flow
1. Customer enters coupon code
2. Frontend validates via `/api/coupons?code=X&validate=true`
3. If valid, discount is calculated and displayed
4. On order submission:
   - Order includes `coupon_code` and `discount_amount`
   - Coupon usage is recorded via `/api/coupons/use`
   - Usage counter is incremented

### Order Display
- Admin orders page shows applied coupons
- Order confirmation shows discount line item
- Telegram notifications include coupon information

---

## Influencer Attribution

Coupons can be assigned to influencers for tracking:

1. Set `influencer_name` when creating coupon
2. Badge shows influencer name in admin view
3. Track usage per influencer via `coupon_usage` table
4. Query analytics:
```sql
SELECT 
  c.influencer_name,
  c.code,
  c.usage_count,
  SUM(cu.discount_amount) as total_discount
FROM coupons c
LEFT JOIN coupon_usage cu ON c.id = cu.coupon_id
WHERE c.influencer_name IS NOT NULL
GROUP BY c.influencer_name, c.code, c.usage_count
ORDER BY total_discount DESC;
```

---

## Security Considerations

- ✅ Coupon codes are validated server-side
- ✅ Usage tracking uses service role key
- ✅ Discount calculations verified on backend
- ✅ SQL injection protection via Supabase client
- ✅ Admin routes protected by authentication

---

## Future Enhancements

Potential features to add:
- [ ] Minimum order value requirements
- [ ] Product-specific coupons
- [ ] First-time customer only coupons
- [ ] Coupon stacking rules
- [ ] Automatic coupon suggestions
- [ ] Email coupon distribution
- [ ] Referral code generation
- [ ] A/B testing for coupons
- [ ] Advanced analytics dashboard

---

## Troubleshooting

### Coupon Not Applying
1. Check if coupon is active in admin panel
2. Verify expiration date hasn't passed
3. Check if usage limit has been reached
4. Ensure code is spelled correctly
5. Check browser console for API errors

### Usage Counter Not Incrementing
1. Verify `/api/coupons/use` is being called
2. Check Supabase logs for errors
3. Ensure service role key is set correctly
4. Verify `coupon_usage` table exists

### Database Errors
1. Confirm all tables were created successfully
2. Check foreign key constraints
3. Verify column types match schema
4. Review Supabase error logs

---

## Support

For issues or questions:
1. Check Supabase logs
2. Review browser console errors
3. Verify database schema is correct
4. Check API endpoint responses

---

**Last Updated:** October 31, 2025
**Version:** 1.0.0
