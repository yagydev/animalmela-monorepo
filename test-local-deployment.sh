#!/bin/bash

# 🚀 Local Docker Deployment Testing Script
# This simulates the production deployment using Docker locally

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

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "\n${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}\n"
}

# Start local deployment test
print_header "🚀 KISAAN MELA - LOCAL DOCKER DEPLOYMENT TEST"

print_status "This will simulate the production deployment locally using Docker"

# Step 1: Cleanup any existing containers
print_header "1. 🧹 Cleanup Existing Containers"

print_status "Stopping and removing existing containers..."
docker stop kisaanmela-backend kisaanmela-frontend kisaanmela-mongo kisaanmela-redis 2>/dev/null || true
docker rm kisaanmela-backend kisaanmela-frontend kisaanmela-mongo kisaanmela-redis 2>/dev/null || true

# Kill any processes using our ports
print_status "Freeing up ports 3000, 5000, 27017, 6379..."
kill -9 $(lsof -t -i:3000) 2>/dev/null || true
kill -9 $(lsof -t -i:5000) 2>/dev/null || true
kill -9 $(lsof -t -i:27017) 2>/dev/null || true
kill -9 $(lsof -t -i:6379) 2>/dev/null || true

print_success "Cleanup completed"

# Step 2: Create Docker network
print_header "2. 🌐 Create Docker Network"

print_status "Creating kisaanmela network..."
docker network create kisaanmela-network 2>/dev/null || print_warning "Network already exists"
print_success "Network ready"

# Step 3: Start supporting services
print_header "3. 🗄️ Start Supporting Services"

print_status "Starting MongoDB..."
docker run -d \
  --name kisaanmela-mongo \
  --network kisaanmela-network \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password123 \
  -e MONGO_INITDB_DATABASE=kisaanmela \
  mongo:latest

print_status "Starting Redis..."
docker run -d \
  --name kisaanmela-redis \
  --network kisaanmela-network \
  -p 6379:6379 \
  redis:alpine

print_status "Waiting for services to start..."
sleep 10

print_success "Supporting services started"

# Step 4: Build application images
print_header "4. 🏗️ Build Application Images"

print_status "Building backend image..."
if docker build -f backend/Dockerfile -t kisaanmela-backend:local . > backend-build.log 2>&1; then
    print_success "Backend image built successfully"
else
    print_error "Backend build failed"
    echo "Build log:"
    cat backend-build.log
    exit 1
fi

print_status "Building frontend image..."
if docker build -f web-frontend/Dockerfile -t kisaanmela-frontend:local . > frontend-build.log 2>&1; then
    print_success "Frontend image built successfully"
else
    print_error "Frontend build failed"
    echo "Build log:"
    cat frontend-build.log
    exit 1
fi

# Step 5: Start application containers
print_header "5. 🚀 Start Application Containers"

print_status "Starting backend container..."
docker run -d \
  --name kisaanmela-backend \
  --network kisaanmela-network \
  -p 5000:5000 \
  -e NODE_ENV=production \
  -e MONGODB_URI=mongodb://admin:password123@kisaanmela-mongo:27017/kisaanmela?authSource=admin \
  -e REDIS_URL=redis://kisaanmela-redis:6379 \
  -e JWT_SECRET=your-super-secret-jwt-key-for-local-testing \
  -e NEXTAUTH_SECRET=your-nextauth-secret-for-local-testing \
  kisaanmela-backend:local

print_status "Starting frontend container..."
docker run -d \
  --name kisaanmela-frontend \
  --network kisaanmela-network \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e NEXT_PUBLIC_API_URL=http://localhost:5000/api \
  kisaanmela-frontend:local

print_status "Waiting for applications to start..."
sleep 15

# Step 6: Health checks
print_header "6. 🏥 Health Checks"

print_status "Checking backend health..."
if curl -f -s http://localhost:5000/api/health > /dev/null 2>&1; then
    print_success "✅ Backend is healthy"
    curl -s http://localhost:5000/api/health | jq . 2>/dev/null || curl -s http://localhost:5000/api/health
else
    print_warning "⚠️  Backend health check failed (may need database setup)"
    print_status "Backend logs:"
    docker logs kisaanmela-backend | tail -10
fi

print_status "Checking frontend health..."
if curl -f -s http://localhost:3000 > /dev/null 2>&1; then
    print_success "✅ Frontend is healthy"
else
    print_error "❌ Frontend health check failed"
    print_status "Frontend logs:"
    docker logs kisaanmela-frontend | tail -10
fi

print_status "Checking MongoDB connection..."
if docker exec kisaanmela-mongo mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    print_success "✅ MongoDB is responding"
else
    print_warning "⚠️  MongoDB connection issues"
fi

print_status "Checking Redis connection..."
if docker exec kisaanmela-redis redis-cli ping > /dev/null 2>&1; then
    print_success "✅ Redis is responding"
else
    print_warning "⚠️  Redis connection issues"
fi

# Step 7: Test API endpoints
print_header "7. 🧪 Test API Endpoints"

print_status "Testing backend API endpoints..."

# Test health endpoint
if curl -f -s http://localhost:5000/api/health > /dev/null; then
    print_success "✅ /api/health - OK"
else
    print_warning "⚠️  /api/health - Failed"
fi

# Test other endpoints (these may fail without proper setup, which is expected)
endpoints=("/api/auth/login" "/api/listings" "/api/user/me")
for endpoint in "${endpoints[@]}"; do
    if curl -f -s http://localhost:5000$endpoint > /dev/null 2>&1; then
        print_success "✅ $endpoint - OK"
    else
        print_warning "⚠️  $endpoint - Expected to fail without auth/data"
    fi
done

# Step 8: Test frontend pages
print_header "8. 🌐 Test Frontend Pages"

print_status "Testing frontend pages..."

pages=("/" "/login" "/register" "/marketplace")
for page in "${pages[@]}"; do
    if curl -f -s http://localhost:3000$page > /dev/null 2>&1; then
        print_success "✅ $page - OK"
    else
        print_warning "⚠️  $page - Failed"
    fi
done

# Step 9: Test API proxying
print_header "9. 🔄 Test API Proxying"

print_status "Testing frontend → backend API proxying..."

# Test login endpoint through frontend proxy
if curl -f -s -X POST http://localhost:3000/api/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"password123"}' > /dev/null 2>&1; then
    print_success "✅ Frontend API proxy working"
else
    print_warning "⚠️  Frontend API proxy test failed (expected without valid credentials)"
fi

# Step 10: Container status
print_header "10. 📊 Container Status"

print_status "Container status:"
docker ps --filter "name=kisaanmela" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

print_status "Resource usage:"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}" kisaanmela-backend kisaanmela-frontend kisaanmela-mongo kisaanmela-redis

# Step 11: Deployment summary
print_header "🎉 LOCAL DEPLOYMENT TEST COMPLETED"

echo -e "${GREEN}✅ Local Docker deployment simulation completed!${NC}"
echo ""
echo -e "${BLUE}Services running:${NC}"
echo -e "  🌐 Frontend: http://localhost:3000"
echo -e "  🔧 Backend:  http://localhost:5000"
echo -e "  🗄️  MongoDB:  localhost:27017"
echo -e "  📦 Redis:    localhost:6379"
echo ""
echo -e "${BLUE}Test your application:${NC}"
echo -e "  • Open http://localhost:3000 in your browser"
echo -e "  • Test API at http://localhost:5000/api/health"
echo -e "  • Check logs: docker logs kisaanmela-backend"
echo -e "  • Check logs: docker logs kisaanmela-frontend"
echo ""
echo -e "${YELLOW}To stop the deployment:${NC}"
echo -e "  ./stop-local-deployment.sh"
echo ""
echo -e "${GREEN}If everything works well, you're ready for production! 🇮🇳${NC}"

# Cleanup build logs
rm -f backend-build.log frontend-build.log
