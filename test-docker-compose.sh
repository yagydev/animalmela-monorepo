#!/bin/bash

# 🐳 Docker Compose Local Testing Script

set -e

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

print_header() {
    echo -e "\n${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}\n"
}

print_header "🐳 KISAAN MELA - DOCKER COMPOSE TEST"

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    print_error "Docker Compose is not available"
    exit 1
fi

# Use docker compose or docker-compose based on what's available
if docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

print_status "Using: $DOCKER_COMPOSE"

# Step 1: Clean up any existing deployment
print_header "1. 🧹 Cleanup"

print_status "Stopping any existing deployment..."
$DOCKER_COMPOSE -f docker-compose.local.yml down --volumes --remove-orphans 2>/dev/null || true

# Kill any processes using our ports
kill -9 $(lsof -t -i:3000) 2>/dev/null || true
kill -9 $(lsof -t -i:5000) 2>/dev/null || true
kill -9 $(lsof -t -i:27017) 2>/dev/null || true
kill -9 $(lsof -t -i:6379) 2>/dev/null || true

print_success "Cleanup completed"

# Step 2: Build and start services
print_header "2. 🏗️ Build and Start Services"

print_status "Building and starting all services..."
if $DOCKER_COMPOSE -f docker-compose.local.yml up -d --build; then
    print_success "All services started successfully"
else
    print_error "Failed to start services"
    exit 1
fi

# Step 3: Wait for services to be ready
print_header "3. ⏳ Waiting for Services"

print_status "Waiting for services to be ready..."
sleep 30

# Check service status
print_status "Service status:"
$DOCKER_COMPOSE -f docker-compose.local.yml ps

# Step 4: Health checks
print_header "4. 🏥 Health Checks"

print_status "Checking backend health..."
for i in {1..10}; do
    if curl -f -s http://localhost:5000/api/health > /dev/null 2>&1; then
        print_success "✅ Backend is healthy"
        break
    else
        if [ $i -eq 10 ]; then
            print_error "❌ Backend health check failed after 10 attempts"
            print_status "Backend logs:"
            $DOCKER_COMPOSE -f docker-compose.local.yml logs backend | tail -20
        else
            print_status "Attempt $i/10: Backend not ready yet, waiting..."
            sleep 5
        fi
    fi
done

print_status "Checking frontend health..."
for i in {1..10}; do
    if curl -f -s http://localhost:3000 > /dev/null 2>&1; then
        print_success "✅ Frontend is healthy"
        break
    else
        if [ $i -eq 10 ]; then
            print_error "❌ Frontend health check failed after 10 attempts"
            print_status "Frontend logs:"
            $DOCKER_COMPOSE -f docker-compose.local.yml logs frontend | tail -20
        else
            print_status "Attempt $i/10: Frontend not ready yet, waiting..."
            sleep 5
        fi
    fi
done

# Step 5: Test endpoints
print_header "5. 🧪 Test Endpoints"

print_status "Testing API endpoints..."
if curl -f -s http://localhost:5000/api/health | grep -q "ok\|healthy\|success" 2>/dev/null; then
    print_success "✅ Backend API responding correctly"
else
    print_error "❌ Backend API not responding as expected"
fi

print_status "Testing frontend pages..."
if curl -f -s http://localhost:3000 | grep -q "html\|Kisaan\|Mela" 2>/dev/null; then
    print_success "✅ Frontend serving pages correctly"
else
    print_error "❌ Frontend not serving pages as expected"
fi

# Step 6: Show logs
print_header "6. 📋 Service Logs"

print_status "Recent backend logs:"
$DOCKER_COMPOSE -f docker-compose.local.yml logs --tail=10 backend

print_status "Recent frontend logs:"
$DOCKER_COMPOSE -f docker-compose.local.yml logs --tail=10 frontend

# Step 7: Final status
print_header "🎉 DOCKER COMPOSE TEST COMPLETED"

echo -e "${GREEN}✅ Docker Compose deployment test completed!${NC}"
echo ""
echo -e "${BLUE}Services running:${NC}"
echo -e "  🌐 Frontend: http://localhost:3000"
echo -e "  🔧 Backend:  http://localhost:5000/api/health"
echo -e "  🗄️  MongoDB:  localhost:27017"
echo -e "  📦 Redis:    localhost:6379"
echo ""
echo -e "${BLUE}Useful commands:${NC}"
echo -e "  • View logs:    $DOCKER_COMPOSE -f docker-compose.local.yml logs -f"
echo -e "  • View status:  $DOCKER_COMPOSE -f docker-compose.local.yml ps"
echo -e "  • Stop all:     $DOCKER_COMPOSE -f docker-compose.local.yml down"
echo -e "  • Restart:      $DOCKER_COMPOSE -f docker-compose.local.yml restart"
echo ""
echo -e "${GREEN}Test your application at http://localhost:3000 🇮🇳${NC}"
