#!/bin/bash

# 🚀 KISAAN MELA - IMMEDIATE DEPLOYMENT FIX
# This script will deploy your latest codebase locally for testing
# and provide options for production deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${CYAN}================================${NC}"
    echo -e "${CYAN}🚀 KISAAN MELA - DEPLOY NOW${NC}"
    echo -e "${CYAN}================================${NC}"
    echo ""
}

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

check_requirements() {
    print_status "Checking requirements..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        print_status "Visit: https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    # Check if Docker Compose is available
    if ! docker compose version &> /dev/null && ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not available."
        print_status "Please install Docker Compose or use Docker Desktop"
        exit 1
    fi
    
    print_success "All requirements satisfied"
}

setup_environment() {
    print_status "Setting up environment..."
    
    # Create development environment file if it doesn't exist
    if [ ! -f "env.development" ]; then
        print_status "Creating development environment file..."
        cat > env.development << 'EOF'
# Kisaan Mela - Development Environment
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL=mongodb://mongodb:27017/kisaanmela_dev
DB_NAME=kisaanmela_dev

# JWT
JWT_SECRET=dev_jwt_secret_key_change_in_production
JWT_EXPIRE=7d

# API URLs
API_URL=http://localhost:5000/api
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_WEB_URL=http://localhost:3000

# MongoDB
MONGO_ROOT_USER=admin
MONGO_ROOT_PASSWORD=password123

# Redis
REDIS_PASSWORD=redis123

# AWS S3 (Development - use placeholder values)
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_S3_BUCKET_NAME=kisaanmela-dev-uploads
AWS_REGION=us-east-1

# Payment (Development - use test keys)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
RAZORPAY_KEY_ID=rzp_test_your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# SMS & Email (Development)
SMS_API_KEY=your_sms_api_key
EMAIL_SERVICE_API_KEY=your_email_api_key
EMAIL_FROM=noreply@kisaanmela.com

# File Upload
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,application/pdf
EOF
        print_success "Development environment file created"
    fi
    
    # Create local Docker Compose file if it doesn't exist
    if [ ! -f "docker-compose.local.yml" ]; then
        print_status "Creating local Docker Compose configuration..."
        cat > docker-compose.local.yml << 'EOF'
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    container_name: kisaanmela-mongodb-local
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data_local:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_ROOT_USER:-admin}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ROOT_PASSWORD:-password123}
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s

  backend:
    build:
      context: .
      dockerfile: backend/Dockerfile
    container_name: kisaanmela-backend-local
    ports:
      - "5000:5000"
    env_file:
      - env.development
    depends_on:
      mongodb:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 20s

  web-frontend:
    build:
      context: .
      dockerfile: web-frontend/Dockerfile
    container_name: kisaanmela-frontend-local
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - NEXT_PUBLIC_API_URL=http://localhost:5000/api
    depends_on:
      backend:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 20s

volumes:
  mongodb_data_local:
EOF
        print_success "Local Docker Compose configuration created"
    fi
}

deploy_locally() {
    print_status "Deploying Kisaan Mela locally..."
    
    # Stop any existing containers
    print_status "Stopping existing containers..."
    docker compose -f docker-compose.local.yml down --remove-orphans 2>/dev/null || true
    
    # Build and start containers
    print_status "Building and starting containers..."
    docker compose -f docker-compose.local.yml up --build -d
    
    # Wait for services
    print_status "Waiting for services to start..."
    sleep 30
    
    # Check if services are running
    print_status "Checking service health..."
    
    # Check backend
    for i in {1..12}; do
        if curl -f http://localhost:5000/api/health &>/dev/null; then
            print_success "✅ Backend is running at http://localhost:5000"
            break
        fi
        if [ $i -eq 12 ]; then
            print_error "Backend failed to start"
            print_status "Checking logs..."
            docker compose -f docker-compose.local.yml logs backend
            return 1
        fi
        sleep 5
    done
    
    # Check frontend
    for i in {1..12}; do
        if curl -f http://localhost:3000 &>/dev/null; then
            print_success "✅ Frontend is running at http://localhost:3000"
            break
        fi
        if [ $i -eq 12 ]; then
            print_error "Frontend failed to start"
            print_status "Checking logs..."
            docker compose -f docker-compose.local.yml logs web-frontend
            return 1
        fi
        sleep 5
    done
    
    print_success "🎉 Kisaan Mela is now running locally!"
    echo ""
    print_status "Access your application:"
    print_status "  🌐 Website: http://localhost:3000"
    print_status "  🔌 API: http://localhost:5000/api"
    print_status "  📊 MongoDB: localhost:27017"
    echo ""
    print_status "To view logs: docker compose -f docker-compose.local.yml logs -f"
    print_status "To stop: docker compose -f docker-compose.local.yml down"
}

show_production_options() {
    echo ""
    print_header
    print_status "🚀 PRODUCTION DEPLOYMENT OPTIONS"
    echo ""
    
    echo "Your Kisaan Mela platform is working locally! Here are your production options:"
    echo ""
    
    echo "1. 🌐 VERCEL (Recommended - Easiest)"
    echo "   • Free hosting for frontend"
    echo "   • Automatic deployments"
    echo "   • Global CDN"
    echo "   • Run: npx vercel --prod"
    echo ""
    
    echo "2. 🐳 DOCKER ON VPS"
    echo "   • Get a VPS (DigitalOcean, AWS, etc.)"
    echo "   • Run: ./deploy-kisaanmela.sh"
    echo "   • Full control over deployment"
    echo ""
    
    echo "3. ☁️ CLOUD PLATFORMS"
    echo "   • Heroku, Railway, Render"
    echo "   • Deploy directly from GitHub"
    echo "   • Managed databases available"
    echo ""
    
    echo "4. 🔧 MANUAL SERVER SETUP"
    echo "   • Install Docker on your server"
    echo "   • Copy files and run deployment script"
    echo "   • Configure DNS and SSL"
    echo ""
    
    print_status "Need help with production deployment? Let me know which option you prefer!"
}

# Main script
print_header

case "${1:-local}" in
    local)
        check_requirements
        setup_environment
        deploy_locally
        show_production_options
        ;;
    stop)
        print_status "Stopping local deployment..."
        docker compose -f docker-compose.local.yml down --remove-orphans
        print_success "Local deployment stopped"
        ;;
    logs)
        docker compose -f docker-compose.local.yml logs -f
        ;;
    restart)
        print_status "Restarting local deployment..."
        docker compose -f docker-compose.local.yml restart
        print_success "Local deployment restarted"
        ;;
    *)
        echo "Usage: $0 {local|stop|logs|restart}"
        echo ""
        echo "Commands:"
        echo "  local    - Deploy locally (default)"
        echo "  stop     - Stop local deployment"
        echo "  logs     - Show application logs"
        echo "  restart  - Restart local deployment"
        exit 1
        ;;
esac
