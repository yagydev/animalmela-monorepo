#!/bin/bash

# Quick Deployment Script for kisaanmela.com
# This script sets up the production environment for your domain

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 Deploying AnimalMela Platform to kisaanmela.com${NC}"
echo "=================================================="

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo -e "${RED}❌ Please don't run this script as root${NC}"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}⚠️  Docker not found. Installing Docker...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    echo -e "${GREEN}✅ Docker installed. Please log out and log back in, then run this script again.${NC}"
    exit 0
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${YELLOW}⚠️  Docker Compose not found. Installing...${NC}"
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Check if .env.production exists and has been configured
if [ ! -f ".env.production" ]; then
    echo -e "${RED}❌ .env.production file not found!${NC}"
    echo "Please create and configure .env.production with your production settings."
    echo "See DEPLOYMENT_GUIDE.md for details."
    exit 1
fi

# Check if critical environment variables are set
if grep -q "CHANGE_THIS" .env.production; then
    echo -e "${RED}❌ Please update .env.production with your actual values!${NC}"
    echo "Found placeholder values that need to be changed."
    echo "Edit .env.production and replace all 'CHANGE_THIS' values."
    exit 1
fi

echo -e "${GREEN}✅ Environment configuration looks good${NC}"

# Create necessary directories
echo -e "${BLUE}📁 Creating necessary directories...${NC}"
mkdir -p nginx/ssl
mkdir -p backend/uploads
mkdir -p backend/logs

# Stop any existing containers
echo -e "${BLUE}🛑 Stopping existing containers...${NC}"
if docker-compose -f docker-compose.prod.yml ps -q | grep -q .; then
    docker-compose -f docker-compose.prod.yml down
fi

# Build and start the production environment
echo -e "${BLUE}🏗️  Building and starting production environment...${NC}"
echo "This may take several minutes on first run..."

if docker compose version &> /dev/null; then
    docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build
else
    docker-compose -f docker-compose.prod.yml --env-file .env.production up -d --build
fi

# Wait for services to start
echo -e "${BLUE}⏳ Waiting for services to start...${NC}"
sleep 30

# Check if services are running
echo -e "${BLUE}🔍 Checking service status...${NC}"
if docker ps | grep -q "animall-"; then
    echo -e "${GREEN}✅ Containers are running${NC}"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
else
    echo -e "${RED}❌ Some containers failed to start${NC}"
    echo "Check logs with: docker-compose -f docker-compose.prod.yml logs"
    exit 1
fi

# Test health endpoints
echo -e "${BLUE}🏥 Testing health endpoints...${NC}"
sleep 10

# Test backend health
if curl -f -s http://localhost/api/health > /dev/null; then
    echo -e "${GREEN}✅ Backend API is healthy${NC}"
else
    echo -e "${YELLOW}⚠️  Backend API health check failed (this is normal if SSL isn't set up yet)${NC}"
fi

# Test frontend
if curl -f -s http://localhost > /dev/null; then
    echo -e "${GREEN}✅ Frontend is responding${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend health check failed (this is normal if SSL isn't set up yet)${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo "=================================================="
echo ""
echo "Your AnimalMela platform is now running!"
echo ""
echo "Next steps:"
echo "1. 🌐 Point your domain kisaanmela.com to this server's IP address"
echo "2. 🔒 SSL certificates will be automatically generated when domain is configured"
echo "3. 🧪 Test your platform at http://your-server-ip (or https://kisaanmela.com once DNS is set)"
echo ""
echo "Useful commands:"
echo "• View logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "• Check status: docker ps"
echo "• Restart services: docker-compose -f docker-compose.prod.yml restart"
echo "• Stop all: docker-compose -f docker-compose.prod.yml down"
echo ""
echo "For detailed instructions, see DEPLOYMENT_GUIDE.md"
echo ""
echo -e "${BLUE}🐾 Your pet services platform is ready to serve customers!${NC}"
