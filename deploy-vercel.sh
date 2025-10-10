#!/bin/bash

# 🚀 Vercel Deployment Script for kisaanmela.com
# This script helps deploy the application to Vercel with proper configuration

set -e

echo "🚀 Starting Vercel deployment for kisaanmela.com..."

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

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_error "Vercel CLI is not installed. Please install it first:"
    echo "npm install -g vercel"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "vercel.json" ]; then
    print_error "vercel.json not found. Please run this script from the project root."
    exit 1
fi

# Check if web-frontend directory exists
if [ ! -d "web-frontend" ]; then
    print_error "web-frontend directory not found."
    exit 1
fi

print_status "Checking Vercel CLI version..."
vercel --version

print_status "Checking if user is logged in to Vercel..."
if ! vercel whoami &> /dev/null; then
    print_warning "Not logged in to Vercel. Please log in:"
    vercel login
fi

print_status "Current Vercel user:"
vercel whoami

# Navigate to web-frontend directory
cd web-frontend

print_status "Installing dependencies..."
npm install

print_status "Building the application..."
npm run build

# Go back to root directory
cd ..

print_status "Deploying to Vercel..."
vercel --prod

print_success "Deployment completed!"

echo ""
echo "🎯 Next Steps:"
echo "1. Go to Vercel Dashboard: https://vercel.com/dashboard"
echo "2. Find your kisaanmela project"
echo "3. Go to Settings → Environment Variables"
echo "4. Add the following variables:"
echo ""
echo "   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kisaanmela_prod?retryWrites=true&w=majority"
echo "   DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/kisaanmela_prod?retryWrites=true&w=majority"
echo "   JWT_SECRET=your-super-secure-jwt-secret-key"
echo "   JWT_EXPIRES_IN=7d"
echo "   NODE_ENV=production"
echo ""
echo "5. Redeploy the application"
echo "6. Test with demo users:"
echo "   - demo@kisaanmela.com / demo123"
echo "   - admin@kisaanmela.com / admin123"
echo ""
echo "📖 For detailed instructions, see: VERCEL_COMPLETE_DEPLOYMENT_GUIDE.md"
echo ""
print_success "Deployment script completed! 🎉"
