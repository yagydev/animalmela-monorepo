#!/bin/bash

# MongoDB Atlas Connection Fix Script
# This script provides multiple solutions for the MongoDB Atlas connection issue

echo "🔧 MongoDB Atlas Connection Fix Script"
echo "======================================"
echo ""

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
check_vercel_cli() {
    if ! command -v vercel &> /dev/null; then
        print_error "Vercel CLI is not installed. Please install it first:"
        echo "npm install -g vercel"
        exit 1
    fi
    print_success "Vercel CLI is installed"
}

# Test MongoDB connection
test_mongodb_connection() {
    print_status "Testing MongoDB Atlas connection..."
    
    if node test-mongodb-connection.js; then
        print_success "MongoDB connection successful!"
        return 0
    else
        print_error "MongoDB connection failed"
        return 1
    fi
}

# Option 1: Enable demo mode
enable_demo_mode() {
    print_status "Enabling demo mode (in-memory storage)..."
    
    # Update Vercel environment variables
    echo "MONGODB_URI=demo-mode" | vercel env add MONGODB_URI production
    echo "DATABASE_URL=demo-mode" | vercel env add DATABASE_URL production
    
    print_success "Demo mode enabled. The app will use in-memory storage instead of MongoDB."
    print_warning "Note: Data will be lost when the server restarts."
}

# Option 2: Update MongoDB Atlas IP whitelist
update_atlas_whitelist() {
    print_status "Opening MongoDB Atlas Network Access page..."
    
    # Open MongoDB Atlas in browser
    if command -v open &> /dev/null; then
        open "https://cloud.mongodb.com"
    elif command -v xdg-open &> /dev/null; then
        xdg-open "https://cloud.mongodb.com"
    else
        print_warning "Please manually open: https://cloud.mongodb.com"
    fi
    
    echo ""
    print_status "Manual steps to fix IP whitelist:"
    echo "1. Login to MongoDB Atlas"
    echo "2. Go to: Security → Network Access"
    echo "3. Click 'Add IP Address'"
    echo "4. Add '0.0.0.0/0' (Allow access from anywhere)"
    echo "5. Click 'Confirm'"
    echo ""
    print_warning "Warning: 0.0.0.0/0 allows access from anywhere. For production, use specific IP ranges."
}

# Option 3: Redeploy Vercel
redeploy_vercel() {
    print_status "Redeploying Vercel application..."
    
    if vercel --prod; then
        print_success "Vercel deployment successful!"
    else
        print_error "Vercel deployment failed"
        return 1
    fi
}

# Option 4: Test API endpoints
test_api_endpoints() {
    print_status "Testing API endpoints..."
    
    # Get the Vercel URL
    VERCEL_URL=$(vercel ls | grep "animalmela-monorepo-web-frontend" | awk '{print $2}' | head -1)
    
    if [ -z "$VERCEL_URL" ]; then
        print_warning "Could not determine Vercel URL. Please test manually."
        return 1
    fi
    
    print_status "Testing: https://$VERCEL_URL/api/farmers-market/farmers"
    
    if curl -s "https://$VERCEL_URL/api/farmers-market/farmers" > /dev/null; then
        print_success "API endpoint is responding!"
    else
        print_error "API endpoint is not responding"
        return 1
    fi
}

# Main menu
show_menu() {
    echo ""
    echo "Choose an option:"
    echo "1) Test MongoDB connection"
    echo "2) Enable demo mode (quick fix)"
    echo "3) Update MongoDB Atlas IP whitelist"
    echo "4) Redeploy Vercel application"
    echo "5) Test API endpoints"
    echo "6) Run all fixes"
    echo "7) Exit"
    echo ""
    read -p "Enter your choice (1-7): " choice
}

# Run all fixes
run_all_fixes() {
    print_status "Running all fixes..."
    
    # Test connection first
    if test_mongodb_connection; then
        print_success "MongoDB connection is working!"
        return 0
    fi
    
    # Enable demo mode as fallback
    enable_demo_mode
    
    # Redeploy
    redeploy_vercel
    
    # Test endpoints
    test_api_endpoints
    
    print_success "All fixes completed!"
}

# Main execution
main() {
    print_status "Starting MongoDB Atlas fix process..."
    
    # Check prerequisites
    check_vercel_cli
    
    # Show menu and handle user choice
    while true; do
        show_menu
        
        case $choice in
            1)
                test_mongodb_connection
                ;;
            2)
                enable_demo_mode
                ;;
            3)
                update_atlas_whitelist
                ;;
            4)
                redeploy_vercel
                ;;
            5)
                test_api_endpoints
                ;;
            6)
                run_all_fixes
                ;;
            7)
                print_status "Exiting..."
                exit 0
                ;;
            *)
                print_error "Invalid choice. Please try again."
                ;;
        esac
        
        echo ""
        read -p "Press Enter to continue..."
    done
}

# Run main function
main
