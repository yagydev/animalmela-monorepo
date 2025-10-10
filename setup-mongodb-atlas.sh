#!/bin/bash

# 🗄️ MongoDB Atlas Setup Script for kisaanmela.com
# This script helps set up MongoDB Atlas for production deployment

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

echo "🗄️ MongoDB Atlas Setup for kisaanmela.com"
echo "=========================================="
echo ""

print_status "This script will guide you through setting up MongoDB Atlas for production deployment."
echo ""

# Check if MongoDB CLI is available (optional)
if command -v mongosh &> /dev/null; then
    print_success "MongoDB Shell (mongosh) is available for testing connections."
else
    print_warning "MongoDB Shell (mongosh) not found. You can install it for testing:"
    echo "brew install mongosh  # macOS"
    echo "sudo apt install mongosh  # Ubuntu/Debian"
fi

echo ""
print_status "Step 1: Create MongoDB Atlas Account"
echo "1. Go to https://www.mongodb.com/atlas"
echo "2. Sign up for a free account"
echo "3. Create a new project called 'Kisaan Mela'"
echo ""

print_status "Step 2: Create Database Cluster"
echo "1. Choose 'Build a Database'"
echo "2. Select 'M0 Sandbox' (Free tier)"
echo "3. Choose your preferred region (recommend Mumbai for India)"
echo "4. Create cluster (takes 1-3 minutes)"
echo ""

print_status "Step 3: Configure Database Access"
echo "1. Go to 'Database Access' in left sidebar"
echo "2. Click 'Add New Database User'"
echo "3. Username: kisaanmela_user"
echo "4. Password: Generate secure password (save it!)"
echo "5. Database User Privileges: 'Read and write to any database'"
echo ""

print_status "Step 4: Configure Network Access"
echo "1. Go to 'Network Access' in left sidebar"
echo "2. Click 'Add IP Address'"
echo "3. Click 'Allow Access from Anywhere' (0.0.0.0/0)"
echo "4. This allows Vercel to connect to your database"
echo ""

print_status "Step 5: Get Connection String"
echo "1. Go to 'Clusters' in left sidebar"
echo "2. Click 'Connect' on your cluster"
echo "3. Choose 'Connect your application'"
echo "4. Copy the connection string"
echo ""

# Prompt for connection string
echo ""
read -p "Enter your MongoDB Atlas connection string: " MONGODB_URI

if [ -z "$MONGODB_URI" ]; then
    print_error "Connection string is required. Please run the script again."
    exit 1
fi

# Validate connection string format
if [[ $MONGODB_URI == mongodb+srv://* ]]; then
    print_success "Connection string format looks correct."
else
    print_warning "Connection string format might be incorrect. Expected: mongodb+srv://..."
fi

# Extract database name and create full connection string
DATABASE_NAME="kisaanmela_prod"
FULL_MONGODB_URI="${MONGODB_URI}/kisaanmela_prod?retryWrites=true&w=majority"

echo ""
print_status "Step 6: Environment Variables for Vercel"
echo "Add these environment variables to your Vercel project:"
echo ""
echo "MONGODB_URI=${FULL_MONGODB_URI}"
echo "DATABASE_URL=${FULL_MONGODB_URI}"
echo "JWT_SECRET=your-super-secure-jwt-secret-key-for-production"
echo "JWT_EXPIRES_IN=7d"
echo "NODE_ENV=production"
echo ""

# Test connection if mongosh is available
if command -v mongosh &> /dev/null; then
    echo ""
    read -p "Do you want to test the MongoDB connection? (y/n): " TEST_CONNECTION
    
    if [ "$TEST_CONNECTION" = "y" ] || [ "$TEST_CONNECTION" = "Y" ]; then
        print_status "Testing MongoDB connection..."
        
        # Test connection (this will prompt for password if not in URI)
        if mongosh "$FULL_MONGODB_URI" --eval "db.adminCommand('ping')" --quiet; then
            print_success "MongoDB connection test successful!"
        else
            print_error "MongoDB connection test failed. Please check your connection string and credentials."
        fi
    fi
fi

echo ""
print_status "Step 7: Vercel Deployment"
echo "1. Go to Vercel Dashboard: https://vercel.com/dashboard"
echo "2. Find your kisaanmela project"
echo "3. Go to Settings → Environment Variables"
echo "4. Add the environment variables shown above"
echo "5. Redeploy your application"
echo ""

print_status "Step 8: Test the Deployment"
echo "After redeploying, test with these commands:"
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

print_success "MongoDB Atlas setup guide completed!"
echo ""
print_status "For detailed instructions, see: VERCEL_COMPLETE_DEPLOYMENT_GUIDE.md"
echo ""
print_warning "Remember to:"
echo "1. Save your MongoDB Atlas password securely"
echo "2. Add environment variables to Vercel"
echo "3. Redeploy your application"
echo "4. Test with demo users"
echo ""
print_success "Setup script completed! 🎉"
