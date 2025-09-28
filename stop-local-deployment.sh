#!/bin/bash

# 🛑 Stop Local Docker Deployment Script

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

print_header() {
    echo -e "\n${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}\n"
}

print_header "🛑 STOPPING LOCAL DOCKER DEPLOYMENT"

print_status "Stopping all Kisaan Mela containers..."

# Stop containers
containers=("kisaanmela-backend" "kisaanmela-frontend" "kisaanmela-mongo" "kisaanmela-redis")
for container in "${containers[@]}"; do
    if docker stop "$container" 2>/dev/null; then
        print_success "Stopped $container"
    else
        print_status "$container was not running"
    fi
done

print_status "Removing containers..."
for container in "${containers[@]}"; do
    if docker rm "$container" 2>/dev/null; then
        print_success "Removed $container"
    else
        print_status "$container was already removed"
    fi
done

print_status "Removing images..."
docker rmi kisaanmela-backend:local kisaanmela-frontend:local 2>/dev/null || print_status "Images already removed"

print_status "Removing network..."
docker network rm kisaanmela-network 2>/dev/null || print_status "Network already removed"

print_status "Cleaning up any remaining processes on ports..."
kill -9 $(lsof -t -i:3000) 2>/dev/null || true
kill -9 $(lsof -t -i:5000) 2>/dev/null || true
kill -9 $(lsof -t -i:27017) 2>/dev/null || true
kill -9 $(lsof -t -i:6379) 2>/dev/null || true

print_success "✅ Local deployment stopped and cleaned up!"
echo ""
echo -e "${GREEN}All containers, images, and networks have been removed.${NC}"
echo -e "${BLUE}Ports 3000, 5000, 27017, and 6379 are now free.${NC}"
