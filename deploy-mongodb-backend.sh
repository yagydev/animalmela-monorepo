#!/bin/bash

# 🚀 MongoDB & Backend Deployment Script for kisaanmela.com
# This script fixes the MongoDB connection issues in production

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the right directory
check_environment() {
    if [ ! -f "docker-compose.prod.yml" ]; then
        print_error "Please run this script from the project root directory"
        exit 1
    fi
    
    if [ ! -f "env.production" ]; then
        print_warning "env.production file not found. Creating from template..."
        if [ -f "env.example" ]; then
            cp env.example env.production
            print_warning "Please update env.production with your production values"
        else
            print_error "env.example file not found. Please create env.production manually."
            exit 1
        fi
    fi
}

# Check Docker installation
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        print_error "Docker daemon is not running. Please start Docker first."
        exit 1
    fi
    
    print_success "Docker and Docker Compose are available"
}

# Pull latest changes
pull_changes() {
    print_info "Pulling latest changes from repository..."
    
    if git pull origin main; then
        print_success "Latest changes pulled successfully"
    else
        print_warning "Could not pull changes. Continuing with current code..."
    fi
}

# Stop existing containers
stop_containers() {
    print_info "Stopping existing containers..."
    
    if docker-compose -f docker-compose.prod.yml down; then
        print_success "Containers stopped successfully"
    else
        print_warning "Some containers may not have been running"
    fi
}

# Clean up old containers and images
cleanup() {
    print_info "Cleaning up old containers and images..."
    
    # Remove unused containers
    docker container prune -f
    
    # Remove unused images
    docker image prune -f
    
    print_success "Cleanup completed"
}

# Build and start containers
start_containers() {
    print_info "Building and starting containers..."
    
    if docker-compose -f docker-compose.prod.yml up -d --build; then
        print_success "Containers started successfully"
    else
        print_error "Failed to start containers"
        exit 1
    fi
}

# Wait for services to be ready
wait_for_services() {
    print_info "Waiting for services to be ready..."
    
    # Wait for MongoDB
    print_info "Waiting for MongoDB..."
    for i in {1..30}; do
        if docker exec kisaanmela-mongodb mongosh --eval "db.adminCommand('ping')" &> /dev/null; then
            print_success "MongoDB is ready"
            break
        fi
        if [ $i -eq 30 ]; then
            print_error "MongoDB failed to start within 30 seconds"
            exit 1
        fi
        sleep 1
    done
    
    # Wait for Backend
    print_info "Waiting for Backend..."
    for i in {1..30}; do
        if curl -s http://localhost:5000/api/health &> /dev/null; then
            print_success "Backend is ready"
            break
        fi
        if [ $i -eq 30 ]; then
            print_warning "Backend may not be ready yet"
        fi
        sleep 1
    done
    
    # Wait for Frontend
    print_info "Waiting for Frontend..."
    for i in {1..30}; do
        if curl -s http://localhost:3000 &> /dev/null; then
            print_success "Frontend is ready"
            break
        fi
        if [ $i -eq 30 ]; then
            print_warning "Frontend may not be ready yet"
        fi
        sleep 1
    done
}

# Check container status
check_status() {
    print_info "Checking container status..."
    
    echo ""
    echo "Container Status:"
    docker-compose -f docker-compose.prod.yml ps
    
    echo ""
    echo "Container Health:"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
}

# Test API endpoints
test_apis() {
    print_info "Testing API endpoints..."
    
    echo ""
    echo "Testing Health Endpoint:"
    if curl -s http://localhost:5000/api/health; then
        print_success "Health endpoint is working"
    else
        print_warning "Health endpoint may not be ready"
    fi
    
    echo ""
    echo "Testing Login API (Demo Mode):"
    if curl -s -X POST http://localhost:5000/api/login \
        -H 'Content-Type: application/json' \
        -d '{"email":"demo@kisaanmela.com","password":"demo123"}'; then
        print_success "Login API is working"
    else
        print_warning "Login API may not be ready"
    fi
    
    echo ""
    echo "Testing Listings API:"
    if curl -s http://localhost:5000/api/farmers-market/listings; then
        print_success "Listings API is working"
    else
        print_warning "Listings API may not be ready"
    fi
}

# Show logs
show_logs() {
    print_info "Showing recent logs..."
    
    echo ""
    echo "MongoDB Logs:"
    docker logs --tail 10 kisaanmela-mongodb
    
    echo ""
    echo "Backend Logs:"
    docker logs --tail 10 kisaanmela-backend
    
    echo ""
    echo "Frontend Logs:"
    docker logs --tail 10 kisaanmela-frontend
}

# Main deployment function
deploy() {
    print_header "🚀 MONGODB & BACKEND DEPLOYMENT"
    
    check_environment
    check_docker
    pull_changes
    stop_containers
    cleanup
    start_containers
    wait_for_services
    check_status
    test_apis
    
    print_header "🎉 DEPLOYMENT COMPLETE"
    
    echo ""
    print_success "MongoDB and Backend deployment completed successfully!"
    echo ""
    echo "🌐 Your services are now running:"
    echo "   • Frontend: http://localhost:3000"
    echo "   • Backend: http://localhost:5000"
    echo "   • MongoDB: mongodb://localhost:27017"
    echo ""
    echo "🎯 Demo Users Available:"
    echo "   • demo@kisaanmela.com / demo123 (farmer)"
    echo "   • admin@kisaanmela.com / admin123 (admin)"
    echo "   • buyer@kisaanmela.com / buyer123 (buyer)"
    echo "   • seller@kisaanmela.com / seller123 (seller)"
    echo ""
    echo "🔍 To view logs:"
    echo "   docker-compose -f docker-compose.prod.yml logs -f"
    echo ""
    echo "🛑 To stop services:"
    echo "   docker-compose -f docker-compose.prod.yml down"
    echo ""
    echo "✅ Ready for production! Your kisaanmela.com should now work properly."
}

# Handle script arguments
case "${1:-deploy}" in
    "deploy")
        deploy
        ;;
    "status")
        check_status
        ;;
    "logs")
        show_logs
        ;;
    "test")
        test_apis
        ;;
    "stop")
        stop_containers
        ;;
    "start")
        start_containers
        ;;
    "restart")
        stop_containers
        start_containers
        ;;
    *)
        echo "Usage: $0 [deploy|status|logs|test|stop|start|restart]"
        echo ""
        echo "Commands:"
        echo "  deploy  - Full deployment (default)"
        echo "  status  - Check container status"
        echo "  logs    - Show recent logs"
        echo "  test    - Test API endpoints"
        echo "  stop    - Stop all containers"
        echo "  start   - Start all containers"
        echo "  restart - Restart all containers"
        exit 1
        ;;
esac
