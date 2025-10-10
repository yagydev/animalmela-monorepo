#!/bin/bash

# 🚀 Quick Fix Script for Vercel Deployment
# This script provides immediate fix for the MongoDB connection issue

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo "🚀 Quick Fix for Vercel Deployment"
echo "=================================="
echo ""

print_status "This script will help you fix the MongoDB connection issue immediately."
echo ""

print_status "Current Issue:"
echo "- https://www.kisaanmela.com/api/login returns 503 Service Unavailable"
echo "- Error: 'MongoDB not available. Use demo@kisaanmela.com/demo123...'"
echo ""

print_status "Quick Fix Options:"
echo ""

echo "Option 1: Enable Demo Mode (Immediate Fix)"
echo "----------------------------------------"
echo "1. Go to Vercel Dashboard: https://vercel.com/dashboard"
echo "2. Find your kisaanmela project"
echo "3. Go to Settings → Environment Variables"
echo "4. Add these variables:"
echo ""
echo "   MONGODB_URI=demo-mode"
echo "   DATABASE_URL=demo-mode"
echo "   JWT_SECRET=your-secret-key-here"
echo "   NODE_ENV=production"
echo ""
echo "5. Redeploy your application"
echo "6. Test with demo users:"
echo "   - demo@kisaanmela.com / demo123"
echo "   - admin@kisaanmela.com / admin123"
echo "   - buyer@kisaanmela.com / buyer123"
echo "   - seller@kisaanmela.com / seller123"
echo ""

echo "Option 2: Set up MongoDB Atlas (Full Fix)"
echo "----------------------------------------"
echo "1. Run: ./setup-mongodb-atlas.sh"
echo "2. Follow the MongoDB Atlas setup guide"
echo "3. Add environment variables to Vercel"
echo "4. Redeploy your application"
echo ""

echo "Option 3: Use Existing MongoDB Atlas (If you have one)"
echo "----------------------------------------------------"
echo "1. Get your MongoDB Atlas connection string"
echo "2. Add to Vercel environment variables:"
echo ""
echo "   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kisaanmela_prod?retryWrites=true&w=majority"
echo "   DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/kisaanmela_prod?retryWrites=true&w=majority"
echo "   JWT_SECRET=your-secret-key-here"
echo "   NODE_ENV=production"
echo ""
echo "3. Redeploy your application"
echo ""

print_status "Testing Commands:"
echo ""
echo "# Test login API"
echo "curl -X POST https://www.kisaanmela.com/api/login \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"email\":\"demo@kisaanmela.com\",\"password\":\"demo123\"}'"
echo ""
echo "# Test other APIs"
echo "curl https://www.kisaanmela.com/api/farmers-market/listings"
echo "curl https://www.kisaanmela.com/api/health"
echo ""

print_status "Vercel Dashboard Links:"
echo "- Main Dashboard: https://vercel.com/dashboard"
echo "- Environment Variables: https://vercel.com/dashboard/[your-project]/settings/environment-variables"
echo "- Deployments: https://vercel.com/dashboard/[your-project]/deployments"
echo ""

print_status "Support Files:"
echo "- VERCEL_COMPLETE_DEPLOYMENT_GUIDE.md - Detailed deployment guide"
echo "- setup-mongodb-atlas.sh - MongoDB Atlas setup script"
echo "- deploy-vercel.sh - Vercel deployment script"
echo ""

print_warning "Important Notes:"
echo "1. Demo mode works immediately but doesn't persist data"
echo "2. MongoDB Atlas provides full database functionality"
echo "3. Always use strong JWT secrets in production"
echo "4. Test thoroughly after deployment"
echo ""

print_success "Quick fix guide completed!"
echo ""
print_status "Choose an option above and follow the steps to fix your deployment."
echo ""
print_success "Quick fix script completed! 🎉"
