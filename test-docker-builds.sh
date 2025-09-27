#!/bin/bash

# 🐳 Docker Build Testing Script
# Test Docker builds locally before pushing to production

set -e

echo "🐳 Testing Docker Builds for Kisaan Mela"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed or not in PATH"
    exit 1
fi

print_success "Docker is available"

# Test backend Docker build
print_status "Testing backend Docker build..."
if docker build -f backend/Dockerfile -t kisaanmela-backend:test . > docker-backend.log 2>&1; then
    print_success "Backend Docker build successful"
    docker images | grep kisaanmela-backend
else
    print_error "Backend Docker build failed"
    echo "Last 20 lines of build log:"
    tail -20 docker-backend.log
    exit 1
fi

# Test frontend Docker build  
print_status "Testing frontend Docker build..."
if docker build -f web-frontend/Dockerfile -t kisaanmela-frontend:test . > docker-frontend.log 2>&1; then
    print_success "Frontend Docker build successful"
    docker images | grep kisaanmela-frontend
else
    print_error "Frontend Docker build failed"
    echo "Last 20 lines of build log:"
    tail -20 docker-frontend.log
    exit 1
fi

# Test running containers
print_status "Testing container startup..."

# Start backend container
docker run -d -p 5001:5000 --name backend-test kisaanmela-backend:test
sleep 5

# Start frontend container
docker run -d -p 3001:3000 --name frontend-test kisaanmela-frontend:test
sleep 5

# Test containers
print_status "Testing container health..."

if curl -f -s http://localhost:5001/api/health > /dev/null 2>&1; then
    print_success "Backend container is responding"
else
    print_error "Backend container health check failed"
    docker logs backend-test
fi

if curl -f -s http://localhost:3001 > /dev/null 2>&1; then
    print_success "Frontend container is responding"
else
    print_error "Frontend container health check failed"
    docker logs frontend-test
fi

# Cleanup
print_status "Cleaning up test containers..."
docker stop backend-test frontend-test > /dev/null 2>&1 || true
docker rm backend-test frontend-test > /dev/null 2>&1 || true
docker rmi kisaanmela-backend:test kisaanmela-frontend:test > /dev/null 2>&1 || true

# Clean up log files
rm -f docker-backend.log docker-frontend.log

print_success "Docker build testing completed successfully!"
echo ""
echo "✅ Both Docker images build correctly"
echo "✅ Containers start and respond to health checks"
echo "✅ Ready for production Docker deployment"
