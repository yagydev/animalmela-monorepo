#!/bin/bash

# Vercel Deployment Script for Kisaanmela
echo "🚀 Starting Vercel deployment preparation..."

# Clean up any existing lockfiles
echo "🧹 Cleaning up lockfiles..."
rm -f package-lock.json
rm -f web-frontend/package-lock.json

# Generate fresh lockfiles
echo "📦 Generating fresh lockfiles..."
npm install --package-lock-only

# Verify build works locally
echo "🔨 Testing build locally..."
cd web-frontend
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful! Ready for deployment."
    echo "📋 Next steps:"
    echo "1. Commit and push changes to GitHub"
    echo "2. Deploy to Vercel"
    echo "3. Set environment variables in Vercel dashboard"
else
    echo "❌ Build failed. Please fix issues before deploying."
    exit 1
fi
