#!/bin/bash

# Quick Production Deployment Script for MongoDB Fixes
# This script helps deploy the MongoDB connection fixes to kisaanmela.com

echo "🚀 DEPLOYING MONGODB FIXES TO PRODUCTION"
echo "========================================"
echo ""

# Check if we're in the right directory
if [ ! -f "docker-compose.prod.yml" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📋 Current Status:"
echo "✅ MongoDB connection fixes committed and pushed"
echo "✅ Production environment variables updated"
echo "✅ Demo mode enhanced with multiple test users"
echo ""

echo "🔧 Deployment Options:"
echo ""
echo "1. 🐳 DOCKER COMPOSE DEPLOYMENT (Recommended)"
echo "   This will deploy using Docker Compose on your server"
echo ""
echo "2. 📦 MANUAL SERVER DEPLOYMENT"
echo "   This will provide commands to run on your server"
echo ""
echo "3. ☁️ CLOUD PLATFORM DEPLOYMENT"
echo "   This will provide cloud deployment options"
echo ""

read -p "Choose deployment method (1/2/3): " choice

case $choice in
    1)
        echo ""
        echo "🐳 DOCKER COMPOSE DEPLOYMENT"
        echo "============================"
        echo ""
        echo "Run these commands on your production server:"
        echo ""
        echo "# 1. Connect to your server"
        echo "ssh your-user@your-server-ip"
        echo ""
        echo "# 2. Navigate to your project directory"
        echo "cd /path/to/your/kisaanmela/project"
        echo ""
        echo "# 3. Pull the latest changes"
        echo "git pull origin main"
        echo ""
        echo "# 4. Stop current containers"
        echo "docker-compose -f docker-compose.prod.yml down"
        echo ""
        echo "# 5. Rebuild and start containers"
        echo "docker-compose -f docker-compose.prod.yml up -d --build"
        echo ""
        echo "# 6. Check container status"
        echo "docker-compose -f docker-compose.prod.yml ps"
        echo ""
        echo "# 7. Check logs for any issues"
        echo "docker-compose -f docker-compose.prod.yml logs -f"
        echo ""
        echo "✅ After deployment, test the login API:"
        echo "curl -X POST https://www.kisaanmela.com/api/login \\"
        echo "     -H 'Content-Type: application/json' \\"
        echo "     -d '{\"email\":\"demo@kisaanmela.com\",\"password\":\"demo123\"}'"
        ;;
        
    2)
        echo ""
        echo "📦 MANUAL SERVER DEPLOYMENT"
        echo "==========================="
        echo ""
        echo "If you have SSH access to your production server:"
        echo ""
        echo "# Option A: Direct Git Pull"
        echo "ssh your-user@your-server-ip 'cd /path/to/kisaanmela && git pull origin main && docker-compose -f docker-compose.prod.yml down && docker-compose -f docker-compose.prod.yml up -d --build'"
        echo ""
        echo "# Option B: Using deployment script"
        echo "ssh your-user@your-server-ip 'cd /path/to/kisaanmela && ./deploy-kisaanmela.sh'"
        echo ""
        echo "# Option C: Manual steps"
        echo "ssh your-user@your-server-ip"
        echo "cd /path/to/kisaanmela"
        echo "git pull origin main"
        echo "docker-compose -f docker-compose.prod.yml down"
        echo "docker-compose -f docker-compose.prod.yml up -d --build"
        echo "docker-compose -f docker-compose.prod.yml logs -f"
        ;;
        
    3)
        echo ""
        echo "☁️ CLOUD PLATFORM DEPLOYMENT"
        echo "============================"
        echo ""
        echo "If you're using a cloud platform:"
        echo ""
        echo "🌐 VERCEL (Frontend + API Routes):"
        echo "   npx vercel --prod"
        echo ""
        echo "🚂 RAILWAY:"
        echo "   railway deploy"
        echo ""
        echo "☁️ HEROKU:"
        echo "   git push heroku main"
        echo ""
        echo "🐳 DOCKER HUB:"
        echo "   docker build -t your-username/kisaanmela ."
        echo "   docker push your-username/kisaanmela"
        echo ""
        echo "📋 Note: Make sure to set environment variables in your cloud platform"
        echo "   - MONGODB_URI=mongodb://mongodb:27017/kisaanmela_prod"
        echo "   - DATABASE_URL=mongodb://mongodb:27017/kisaanmela_prod"
        ;;
        
    *)
        echo "❌ Invalid choice. Please run the script again and choose 1, 2, or 3."
        exit 1
        ;;
esac

echo ""
echo "🎯 DEMO USERS AVAILABLE AFTER DEPLOYMENT:"
echo "   • demo@kisaanmela.com / demo123 (farmer)"
echo "   • admin@kisaanmela.com / admin123 (admin)"
echo "   • buyer@kisaanmela.com / buyer123 (buyer)"
echo "   • seller@kisaanmela.com / seller123 (seller)"
echo ""
echo "🔍 TROUBLESHOOTING:"
echo "   If MongoDB connection still fails:"
echo "   1. Check if MongoDB container is running: docker ps"
echo "   2. Check MongoDB logs: docker logs kisaanmela-mongodb"
echo "   3. Verify environment variables: docker-compose -f docker-compose.prod.yml config"
echo "   4. Check network connectivity: docker network ls"
echo ""
echo "✅ Ready to deploy! Follow the commands above to update kisaanmela.com"
