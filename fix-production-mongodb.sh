#!/bin/bash

# Fix MongoDB Connection for Production Deployment
# This script helps fix the 503 error on kisaanmela.com

echo "🔧 Fixing MongoDB Connection for Production..."

# Check if we're in the right directory
if [ ! -f "docker-compose.prod.yml" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📋 Current Status:"
echo "✅ Database connection configuration updated"
echo "✅ Production environment variables updated"
echo "✅ Demo mode enhanced with multiple test users"
echo "✅ Login API improved with better error handling"

echo ""
echo "🚀 Next Steps to Deploy:"
echo ""
echo "1. Commit and push changes:"
echo "   git add ."
echo "   git commit -m 'Fix MongoDB connection for production'"
echo "   git push origin main"
echo ""
echo "2. Deploy to production server:"
echo "   # If using Docker Compose:"
echo "   docker-compose -f docker-compose.prod.yml down"
echo "   docker-compose -f docker-compose.prod.yml up -d --build"
echo ""
echo "   # If using deployment script:"
echo "   ./deploy-kisaanmela.sh"
echo ""
echo "3. Test the login API:"
echo "   curl -X POST https://www.kisaanmela.com/api/login \\"
echo "        -H 'Content-Type: application/json' \\"
echo "        -d '{\"email\":\"demo@kisaanmela.com\",\"password\":\"demo123\"}'"
echo ""
echo "🎯 Demo Users Available:"
echo "   • demo@kisaanmela.com / demo123 (farmer)"
echo "   • admin@kisaanmela.com / admin123 (admin)"
echo "   • buyer@kisaanmela.com / buyer123 (buyer)"
echo "   • seller@kisaanmela.com / seller123 (seller)"
echo ""
echo "📊 What was fixed:"
echo "   • MongoDB connection string for Docker production setup"
echo "   • Environment variables for production deployment"
echo "   • Enhanced demo mode with multiple test users"
echo "   • Better error messages and logging"
echo ""
echo "✅ Ready to deploy! Run the commands above to update kisaanmela.com"
