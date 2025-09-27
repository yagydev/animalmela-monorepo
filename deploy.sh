#!/bin/bash

# Animall Platform Deployment Script
# Supports Docker, Vercel, Manual, and Hybrid deployments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if deployment method is provided
if [ $# -eq 0 ]; then
    print_header "🚀 ANIMALL PLATFORM DEPLOYMENT"
    echo "Usage: $0 [deployment-method]"
    echo ""
    echo "Available deployment methods:"
    echo "  docker    - Full Docker deployment with all services"
    echo "  vercel    - Serverless deployment on Vercel"
    echo "  manual    - Manual deployment with PM2"
    echo "  hybrid    - Hybrid deployment (Vercel + Docker backend)"
    echo ""
    echo "Example: $0 docker"
    exit 1
fi

DEPLOYMENT_METHOD=$1

case $DEPLOYMENT_METHOD in
    "docker")
        print_header "🐳 DOCKER DEPLOYMENT"
        
        # Check if Docker is installed
        if ! command -v docker &> /dev/null; then
            print_error "Docker is not installed. Please install Docker first."
            echo "Visit: https://docs.docker.com/get-docker/"
            exit 1
        fi

        if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
            print_error "Docker Compose is not installed. Please install Docker Compose first."
            exit 1
        fi

        # Check if .env.production exists
        if [ ! -f ".env.production" ]; then
            print_warning ".env.production not found. Creating from template..."
            cp env.example .env.production
            print_info "Please update .env.production with your production values"
            read -p "Press Enter to continue after updating .env.production..."
        fi

        print_info "Building and starting Docker containers..."
        
        # Use docker compose if available, otherwise docker-compose
        if docker compose version &> /dev/null; then
            docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build
        else
            docker-compose -f docker-compose.prod.yml --env-file .env.production up -d --build
        fi

        print_success "Docker deployment completed!"
        echo ""
        echo "Your platform is now running at:"
        echo "• Frontend: http://localhost (or your domain)"
        echo "• API: http://localhost/api"
        echo ""
        echo "To check status: docker ps"
        echo "To view logs: docker-compose -f docker-compose.prod.yml logs -f"
        ;;

    "vercel")
        print_header "☁️ VERCEL DEPLOYMENT"
        
        # Check if Vercel CLI is installed
        if ! command -v vercel &> /dev/null; then
            print_info "Installing Vercel CLI..."
            npm install -g vercel
        fi

        # Check if user is logged in
        if ! vercel whoami &> /dev/null; then
            print_info "Please login to Vercel..."
            vercel login
        fi

        print_info "Deploying backend to Vercel..."
        cd backend
        vercel --prod
        cd ..

        print_info "Deploying web frontend to Vercel..."
        cd web-frontend
        vercel --prod
        cd ..

        print_success "Vercel deployment completed!"
        echo ""
        echo "Your platform has been deployed to Vercel!"
        echo "Check your Vercel dashboard for URLs and settings."
        ;;

    "manual")
        print_header "⚙️ MANUAL DEPLOYMENT"
        
        # Check if PM2 is installed
        if ! command -v pm2 &> /dev/null; then
            print_info "Installing PM2..."
            npm install -g pm2
        fi

        # Check if .env.production exists
        if [ ! -f ".env.production" ]; then
            print_warning ".env.production not found. Creating from template..."
            cp env.example .env.production
            print_info "Please update .env.production with your production values"
            read -p "Press Enter to continue after updating .env.production..."
        fi

        print_info "Installing dependencies..."
        npm run install:all

        print_info "Building applications..."
        npm run build

        print_info "Starting applications with PM2..."
        
        # Start backend
        cd backend
        pm2 start ecosystem.config.js --env production
        cd ..

        # Start web frontend
        cd web-frontend
        pm2 start ecosystem.config.js --env production
        cd ..

        # Save PM2 configuration
        pm2 save
        pm2 startup

        print_success "Manual deployment completed!"
        echo ""
        echo "Your platform is now running with PM2:"
        echo "• Backend: http://localhost:5001"
        echo "• Frontend: http://localhost:3000"
        echo ""
        echo "PM2 commands:"
        echo "• Status: pm2 status"
        echo "• Logs: pm2 logs"
        echo "• Restart: pm2 restart all"
        echo "• Stop: pm2 stop all"
        ;;

    "hybrid")
        print_header "🏗️ HYBRID DEPLOYMENT"
        
        print_info "This will deploy:"
        echo "• Frontend to Vercel (global CDN)"
        echo "• Backend to Docker (your server)"
        echo ""

        # Check if Vercel CLI is installed
        if ! command -v vercel &> /dev/null; then
            print_info "Installing Vercel CLI..."
            npm install -g vercel
        fi

        # Check if Docker is installed
        if ! command -v docker &> /dev/null; then
            print_error "Docker is not installed. Please install Docker first."
            exit 1
        fi

        # Deploy backend with Docker
        print_info "Deploying backend with Docker..."
        if [ ! -f ".env.production" ]; then
            cp env.example .env.production
            print_warning "Please update .env.production with your production values"
            read -p "Press Enter to continue..."
        fi

        # Start only backend services
        docker-compose -f docker-compose.prod.yml --env-file .env.production up -d --build backend mongodb redis

        # Deploy frontend to Vercel
        print_info "Deploying frontend to Vercel..."
        cd web-frontend
        vercel --prod
        cd ..

        print_success "Hybrid deployment completed!"
        echo ""
        echo "Your platform is now running in hybrid mode:"
        echo "• Frontend: Deployed on Vercel (check dashboard for URL)"
        echo "• Backend: Running on Docker (your server)"
        ;;

    *)
        print_error "Unknown deployment method: $DEPLOYMENT_METHOD"
        echo "Available methods: docker, vercel, manual, hybrid"
        exit 1
        ;;
esac

print_header "🎉 DEPLOYMENT COMPLETE"
echo ""
echo "Next steps:"
echo "1. Test all functionality"
echo "2. Set up monitoring and backups"
echo "3. Configure domain and SSL (if not done)"
echo "4. Update DNS records to point to your server"
echo "5. Test mobile app connectivity"
echo ""
echo "For help and documentation, check:"
echo "• DEPLOYMENT_GUIDE.md"
echo "• docs/ folder for detailed guides"
echo ""
print_success "Your Animall platform is now live! 🐾"
