#!/bin/bash

# 🧪 KISAAN MELA - MANUAL END-TO-END TESTING
# Simple manual testing approach

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🧪 KISAAN MELA - MANUAL E2E TESTING${NC}"
echo "===================================="

# Test backend health
echo -e "${BLUE}1. Testing Backend Health${NC}"
echo "-------------------------"
if curl -s http://localhost:5000/api/health >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is running on port 5000${NC}"
    curl -s http://localhost:5000/api/health | head -3
else
    echo -e "${RED}❌ Backend is not responding on port 5000${NC}"
fi

echo ""

# Test backend login
echo -e "${BLUE}2. Testing Backend Login API${NC}"
echo "-----------------------------"
LOGIN_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" \
    -d '{"email":"demo@kisaanmela.com","password":"demo123"}' \
    http://localhost:5000/api/login)

if echo "$LOGIN_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✅ Login API working${NC}"
    echo "$LOGIN_RESPONSE" | head -3
else
    echo -e "${RED}❌ Login API failed${NC}"
    echo "$LOGIN_RESPONSE"
fi

echo ""

# Test frontend
echo -e "${BLUE}3. Testing Frontend${NC}"
echo "-------------------"
if curl -s http://localhost:3000 >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend is running on port 3000${NC}"
else
    echo -e "${RED}❌ Frontend is not responding on port 3000${NC}"
    echo "Starting frontend manually..."
    cd web-frontend
    npm run dev &
    FRONTEND_PID=$!
    echo "Frontend PID: $FRONTEND_PID"
    cd ..
    sleep 10
    if curl -s http://localhost:3000 >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Frontend started successfully${NC}"
    else
        echo -e "${RED}❌ Frontend failed to start${NC}"
    fi
fi

echo ""

# Test mobile structure
echo -e "${BLUE}4. Testing Mobile App Structure${NC}"
echo "-------------------------------"
if [ -d "mobile/src" ]; then
    echo -e "${GREEN}✅ Mobile source directory exists${NC}"
else
    echo -e "${RED}❌ Mobile source directory missing${NC}"
fi

if [ -f "mobile/package.json" ]; then
    echo -e "${GREEN}✅ Mobile package.json exists${NC}"
    echo "Mobile app name: $(grep '"name"' mobile/package.json | cut -d'"' -f4)"
else
    echo -e "${RED}❌ Mobile package.json missing${NC}"
fi

echo ""

# Summary
echo -e "${BLUE}5. Summary${NC}"
echo "----------"
echo -e "${BLUE}Application URLs:${NC}"
echo "• Frontend: http://localhost:3000"
echo "• Backend API: http://localhost:5000"
echo "• Health Check: http://localhost:5000/api/health"
echo ""
echo -e "${BLUE}Demo Accounts:${NC}"
echo "• admin@kisaanmela.com / admin123"
echo "• farmer@kisaanmela.com / farmer123"
echo "• buyer@kisaanmela.com / buyer123"
echo "• demo@kisaanmela.com / demo123"
echo ""
echo -e "${GREEN}Manual testing complete! 🚀${NC}"
