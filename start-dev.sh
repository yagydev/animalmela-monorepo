#!/bin/bash

# 🚀 KISAAN MELA - LOCAL DEVELOPMENT STARTUP
# This script starts both backend and frontend for local development

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 STARTING KISAAN MELA LOCAL DEVELOPMENT${NC}"
echo "=========================================="

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -i :$port >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️ Port $port is in use. Attempting to free it...${NC}"
        lsof -ti :$port | xargs kill -9 2>/dev/null || true
        sleep 2
    fi
}

# Function to wait for service
wait_for_service() {
    local port=$1
    local name=$2
    local max_attempts=30
    local attempt=1
    
    echo -e "${BLUE}⏳ Waiting for $name to start on port $port...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s http://localhost:$port >/dev/null 2>&1; then
            echo -e "${GREEN}✅ $name is running on http://localhost:$port${NC}"
            return 0
        fi
        echo -n "."
        sleep 1
        attempt=$((attempt + 1))
    done
    
    echo -e "${RED}❌ $name failed to start after $max_attempts seconds${NC}"
    return 1
}

# Check and free ports
check_port 3000
check_port 5000

echo ""
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install --legacy-peer-deps

echo ""
echo -e "${BLUE}🔧 Starting Backend (port 5000)...${NC}"
cd backend
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

echo -e "${BLUE}🔧 Starting Frontend (port 3000)...${NC}"
cd web-frontend  
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Wait for services to start
echo ""
wait_for_service 5000 "Backend API"
wait_for_service 3000 "Frontend"

echo ""
echo -e "${GREEN}🎉 KISAAN MELA DEVELOPMENT ENVIRONMENT READY!${NC}"
echo "=============================================="
echo ""
echo -e "${GREEN}📱 Frontend:${NC} http://localhost:3000"
echo -e "${GREEN}🔌 Backend API:${NC} http://localhost:5000"
echo -e "${GREEN}🏥 Health Check:${NC} http://localhost:5000/api/health"
echo ""
echo -e "${BLUE}🧪 Test Login:${NC}"
echo "curl -X POST http://localhost:5000/api/login \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"email\":\"demo@kisaanmela.com\",\"password\":\"demo123\"}'"
echo ""
echo -e "${BLUE}👥 Demo Accounts:${NC}"
echo "• admin@kisaanmela.com / admin123"
echo "• farmer@kisaanmela.com / farmer123"
echo "• buyer@kisaanmela.com / buyer123"
echo "• demo@kisaanmela.com / demo123"
echo ""
echo -e "${YELLOW}📋 Logs:${NC}"
echo "• Backend: tail -f backend.log"
echo "• Frontend: tail -f frontend.log"
echo ""
echo -e "${YELLOW}🛑 To stop:${NC} kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"

# Keep script running and show logs
echo -e "${BLUE}📊 Live logs (Ctrl+C to exit):${NC}"
echo "================================"
tail -f backend.log frontend.log
