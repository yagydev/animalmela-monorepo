#!/bin/bash

# 🚀 KISAAN MELA - START BOTH SERVERS
# This script starts both backend and frontend servers

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 STARTING KISAAN MELA DEVELOPMENT SERVERS${NC}"
echo "============================================="

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
    local max_attempts=20
    local attempt=1
    
    echo -e "${BLUE}⏳ Waiting for $name to start on port $port...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s http://localhost:$port >/dev/null 2>&1; then
            echo -e "${GREEN}✅ $name is running on http://localhost:$port${NC}"
            return 0
        fi
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo -e "${RED}❌ $name failed to start after $max_attempts attempts${NC}"
    return 1
}

# Check and free ports
check_port 5000
check_port 3000

echo ""
echo -e "${BLUE}🔧 Starting Backend (port 5000)...${NC}"
cd backend
npm run dev > ../backend-dev.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"
cd ..

echo ""
echo -e "${BLUE}🔧 Starting Frontend (port 3000)...${NC}"
cd web-frontend
npm run dev > ../frontend-dev.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"
cd ..

# Wait for services to start
echo ""
wait_for_service 5000 "Backend API"
wait_for_service 3000 "Frontend"

echo ""
echo -e "${GREEN}🎉 BOTH SERVERS ARE RUNNING!${NC}"
echo "============================"
echo ""
echo -e "${GREEN}📱 Frontend:${NC} http://localhost:3000"
echo -e "${GREEN}🔌 Backend API:${NC} http://localhost:5000"
echo -e "${GREEN}🏥 Health Check:${NC} http://localhost:5000/api/health"
echo ""
echo -e "${BLUE}📋 Logs:${NC}"
echo "• Backend: tail -f backend-dev.log"
echo "• Frontend: tail -f frontend-dev.log"
echo ""
echo -e "${YELLOW}🛑 To stop:${NC} kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo -e "${GREEN}Ready for testing! 🚀${NC}"

# Save PIDs for later cleanup
echo "$BACKEND_PID $FRONTEND_PID" > .server-pids

echo ""
echo -e "${BLUE}Running quick verification...${NC}"
sleep 5

# Quick test
if curl -s http://localhost:5000 >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend responding${NC}"
else
    echo -e "${RED}❌ Backend not responding${NC}"
fi

if curl -s http://localhost:3000 >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend responding${NC}"
else
    echo -e "${RED}❌ Frontend not responding${NC}"
fi

echo ""
echo -e "${GREEN}Servers started successfully! 🎉${NC}"
