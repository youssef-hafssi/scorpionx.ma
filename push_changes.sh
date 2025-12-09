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
git commit -m "cart changes"

# Set up remote if needed (uncomment if first time)
# git remote add origin https://github.com/youssef-hafssi/scorpionx.git
# git branch -M main

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push origin main

echo "✅ All changes pushed successfully to https://github.com/youssef-hafssi/scorpionx"
echo "🎉 Repository updated with:"
echo " cart changes