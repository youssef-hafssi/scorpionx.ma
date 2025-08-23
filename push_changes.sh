#!/bin/bash

echo "🚀 Pushing all changes to GitHub repository..."

# Configure git user (if not already done)
git config --global user.email "youssef_hafssi@emsi-edu.ma"
git config --global user.name "Youssef Hafssi"

# Check current status
echo "📋 Current git status:"
git status

# Add all changes
echo "➕ Adding all changes..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "feat: UI improvements and WhatsApp integration

🎯 Contact & Communication:
- Add WhatsApp integration for contact number (+212 617 603 374)
- Contact number now redirects directly to WhatsApp
- Remove generic phone icon, keep only WhatsApp icon for clarity

🎨 UI/UX Improvements:
- Update CTA section text to emphasize 'premium quality products'
- Remove all shipping-related text and lines from entire application
- Remove 'Free shipping' text from product page
- Remove 'Shipping: 0 DH' from checkout, cart, and order pages
- Cleaner, more focused pricing display throughout app

🔧 Technical Updates:
- WhatsApp link format: https://wa.me/212617603374
- Consistent pricing display across all pages (subtotal → total)
- Removed shipping calculations from UI (still maintained in backend)
- Better mobile/desktop WhatsApp integration

🔐 Admin System:
- Complete admin authentication system
- Login credentials: adminscorpion@scorpionx.com / admin123
- Protected admin routes with JWT authentication
- Orders and stock management functionality"

# Set up remote if needed (uncomment if first time)
# git remote add origin https://github.com/youssef-hafssi/scorpionx.git
# git branch -M main

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push origin main

echo "✅ All changes pushed successfully to https://github.com/youssef-hafssi/scorpionx"
echo "🎉 Repository updated with:"
echo "   - Dynamic pricing system"
echo "   - Enhanced product page"
echo "   - Size guide functionality"
echo "   - Admin authentication"
echo "   - Improved footer design"
