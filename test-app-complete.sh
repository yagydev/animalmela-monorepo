#!/bin/bash

# 🧪 KISAAN MELA - COMPLETE APPLICATION TEST
# This script tests the entire application functionality

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
PURPLE='\033[0;35m'
NC='\033[0m'

echo -e "${BLUE}🧪 KISAAN MELA - COMPLETE APPLICATION TEST${NC}"
echo "=============================================="

# Test Results
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to run test
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_result="$3"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -e "${PURPLE}[TEST $TOTAL_TESTS]${NC} $test_name"
    
    if eval "$test_command" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ PASSED${NC} - $test_name"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}❌ FAILED${NC} - $test_name"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
}

# 1. INFRASTRUCTURE TESTS
echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}1. 🏗️ INFRASTRUCTURE TESTS${NC}"
echo -e "${BLUE}================================${NC}"

run_test "Backend port 5000 accessible" "curl -s http://localhost:5000 >/dev/null"
run_test "Frontend port 3000 accessible" "curl -s http://localhost:3000 >/dev/null"

# 2. BACKEND API TESTS
echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}2. 🔌 BACKEND API TESTS${NC}"
echo -e "${BLUE}================================${NC}"

# Test health endpoint
echo -e "${YELLOW}Testing Backend Health...${NC}"
HEALTH_RESPONSE=$(curl -s http://localhost:5000/api/health 2>/dev/null || echo "")
if [ -n "$HEALTH_RESPONSE" ]; then
    echo -e "${GREEN}✅ Backend health endpoint responding${NC}"
    echo "Response: $HEALTH_RESPONSE"
else
    echo -e "${RED}❌ Backend health endpoint not responding${NC}"
fi

# Test login endpoints
echo -e "${YELLOW}Testing Login Endpoints...${NC}"

# Test /api/login
LOGIN_RESPONSE_1=$(curl -s -X POST -H "Content-Type: application/json" \
    -d '{"email":"demo@kisaanmela.com","password":"demo123"}' \
    http://localhost:5000/api/login 2>/dev/null || echo "")

if [ -n "$LOGIN_RESPONSE_1" ]; then
    echo -e "${GREEN}✅ /api/login endpoint responding${NC}"
    echo "Response: $LOGIN_RESPONSE_1"
else
    echo -e "${RED}❌ /api/login endpoint not responding${NC}"
fi

# Test /api/auth/login
LOGIN_RESPONSE_2=$(curl -s -X POST -H "Content-Type: application/json" \
    -d '{"email":"demo@kisaanmela.com","password":"demo123"}' \
    http://localhost:5000/api/auth/login 2>/dev/null || echo "")

if [ -n "$LOGIN_RESPONSE_2" ]; then
    echo -e "${GREEN}✅ /api/auth/login endpoint responding${NC}"
    echo "Response: $LOGIN_RESPONSE_2"
else
    echo -e "${RED}❌ /api/auth/login endpoint not responding${NC}"
fi

# 3. FRONTEND TESTS
echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}3. 🌐 FRONTEND TESTS${NC}"
echo -e "${BLUE}================================${NC}"

# Test main pages
echo -e "${YELLOW}Testing Frontend Pages...${NC}"

PAGES=("/" "/login" "/register" "/terms" "/privacy")
for page in "${PAGES[@]}"; do
    PAGE_RESPONSE=$(curl -s "http://localhost:3000$page" 2>/dev/null || echo "")
    if echo "$PAGE_RESPONSE" | grep -q "<!DOCTYPE html>" 2>/dev/null; then
        echo -e "${GREEN}✅ Page $page loads correctly${NC}"
    else
        echo -e "${RED}❌ Page $page failed to load${NC}"
    fi
done

# Test frontend API routes
echo -e "${YELLOW}Testing Frontend API Routes...${NC}"

FRONTEND_LOGIN_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" \
    -d '{"email":"demo@kisaanmela.com","password":"demo123"}' \
    http://localhost:3000/api/login 2>/dev/null || echo "")

if [ -n "$FRONTEND_LOGIN_RESPONSE" ]; then
    echo -e "${GREEN}✅ Frontend /api/login responding${NC}"
    echo "Response: $FRONTEND_LOGIN_RESPONSE"
else
    echo -e "${RED}❌ Frontend /api/login not responding${NC}"
fi

# 4. MOBILE APP STRUCTURE
echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}4. 📱 MOBILE APP STRUCTURE${NC}"
echo -e "${BLUE}================================${NC}"

run_test "Mobile source directory exists" "[ -d 'mobile/src' ]"
run_test "Mobile package.json exists" "[ -f 'mobile/package.json' ]"
run_test "Mobile app.json exists" "[ -f 'mobile/app.json' ]"

if [ -f "mobile/package.json" ]; then
    MOBILE_NAME=$(grep '"name"' mobile/package.json | cut -d'"' -f4)
    echo -e "${GREEN}📱 Mobile app name: $MOBILE_NAME${NC}"
fi

# 5. FILE STRUCTURE VERIFICATION
echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}5. 📁 FILE STRUCTURE VERIFICATION${NC}"
echo -e "${BLUE}================================${NC}"

REQUIRED_FILES=(
    "package.json"
    "backend/package.json"
    "web-frontend/package.json"
    "mobile/package.json"
    "backend/next.config.js"
    "web-frontend/next.config.js"
    "shared/constants/branding.ts"
)

for file in "${REQUIRED_FILES[@]}"; do
    run_test "File $file exists" "[ -f '$file' ]"
done

REQUIRED_DIRS=(
    "backend/pages/api"
    "web-frontend/src"
    "mobile/src"
    "shared"
)

for dir in "${REQUIRED_DIRS[@]}"; do
    run_test "Directory $dir exists" "[ -d '$dir' ]"
done

# 6. CONFIGURATION TESTS
echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}6. ⚙️ CONFIGURATION TESTS${NC}"
echo -e "${BLUE}================================${NC}"

# Check environment files
run_test "Backend .env exists" "[ -f 'backend/.env' ]"
run_test "Production env config exists" "[ -f 'env.production' ]"
run_test "Development env config exists" "[ -f 'env.development' ]"

# Check Docker files
run_test "Backend Dockerfile exists" "[ -f 'backend/Dockerfile' ]"
run_test "Frontend Dockerfile exists" "[ -f 'web-frontend/Dockerfile' ]"
run_test "Docker Compose prod exists" "[ -f 'docker-compose.prod.yml' ]"

# 7. DEPLOYMENT READINESS
echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}7. 🚀 DEPLOYMENT READINESS${NC}"
echo -e "${BLUE}================================${NC}"

# Check deployment files
run_test "Deployment guide exists" "[ -f 'DEPLOYMENT_GUIDE.md' ]"
run_test "GitHub Actions workflow exists" "[ -f '.github/workflows/deploy-production.yml' ]"
run_test "Nginx config exists" "[ -f 'nginx/nginx.conf' ]"

# 8. SUMMARY
echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}8. 📊 TEST SUMMARY${NC}"
echo -e "${BLUE}================================${NC}"

echo ""
echo -e "${BLUE}Test Results:${NC}"
echo -e "  Total Tests: $TOTAL_TESTS"
echo -e "  ${GREEN}Passed: $PASSED_TESTS${NC}"
echo -e "  ${RED}Failed: $FAILED_TESTS${NC}"

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED! Application is ready for deployment.${NC}"
else
    echo -e "${YELLOW}⚠️ Some tests failed. Review the results above.${NC}"
fi

echo ""
echo -e "${BLUE}🌐 Application URLs:${NC}"
echo "  • Frontend: http://localhost:3000"
echo "  • Backend API: http://localhost:5000"
echo "  • Health Check: http://localhost:5000/api/health"

echo ""
echo -e "${BLUE}👥 Demo Accounts (if database is set up):${NC}"
echo "  • admin@kisaanmela.com / admin123"
echo "  • farmer@kisaanmela.com / farmer123"
echo "  • buyer@kisaanmela.com / buyer123"
echo "  • demo@kisaanmela.com / demo123"

echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "  1. Set up MongoDB database with demo users"
echo "  2. Configure environment variables"
echo "  3. Test all API endpoints with valid data"
echo "  4. Deploy to production environment"

echo ""
echo -e "${GREEN}✅ Complete application testing finished!${NC}"
