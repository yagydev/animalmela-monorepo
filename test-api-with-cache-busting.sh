#!/bin/bash

# 🧪 KISAAN MELA - API TEST WITH CACHE BUSTING
# This script tests APIs with cache-busting headers to avoid cached responses

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

BASE_URL="https://www.kisaanmela.com"
TIMESTAMP=$(date +%s)

echo -e "${BLUE}🧪 TESTING APIs WITH CACHE BUSTING${NC}"
echo "=================================="
echo "Base URL: $BASE_URL"
echo "Timestamp: $TIMESTAMP"
echo ""

# Function to test API with cache busting
test_api_no_cache() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    echo -e "${YELLOW}Testing: $description${NC}"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" \
            -H "Cache-Control: no-cache, no-store, must-revalidate" \
            -H "Pragma: no-cache" \
            -H "Expires: 0" \
            "$BASE_URL$endpoint?_t=$TIMESTAMP")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" \
            -H "Content-Type: application/json" \
            -H "Cache-Control: no-cache, no-store, must-revalidate" \
            -H "Pragma: no-cache" \
            -H "Expires: 0" \
            -d "$data" \
            "$BASE_URL$endpoint?_t=$TIMESTAMP")
    fi
    
    # Extract status code and body
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n -1)
    
    echo "   Status: $status_code"
    echo "   Response: $body"
    
    if [ "$status_code" = "200" ]; then
        echo -e "   Result: ${GREEN}✅ SUCCESS${NC}"
    elif [ "$status_code" = "401" ]; then
        echo -e "   Result: ${YELLOW}⚠️ UNAUTHORIZED (check credentials)${NC}"
    elif [ "$status_code" = "404" ]; then
        echo -e "   Result: ${RED}❌ NOT FOUND${NC}"
    elif [ "$status_code" = "500" ]; then
        echo -e "   Result: ${RED}❌ SERVER ERROR${NC}"
    else
        echo -e "   Result: ${YELLOW}⚠️ UNEXPECTED STATUS${NC}"
    fi
    echo ""
}

# Test critical APIs
test_api_no_cache "GET" "/api/health" "" "Health Check"
test_api_no_cache "POST" "/api/login" '{"email":"demo@kisaanmela.com","password":"demo123"}' "Valid Login"
test_api_no_cache "POST" "/api/login" '{"email":"wrong@email.com","password":"wrong"}' "Invalid Login (should be 401)"
test_api_no_cache "POST" "/api/register" '{"name":"Cache Test","email":"cache@test.com","password":"test123"}' "Registration"
test_api_no_cache "POST" "/api/forgot-password" '{"email":"demo@kisaanmela.com"}' "Forgot Password"
test_api_no_cache "POST" "/api/logout" '{}' "Logout"

echo "=================================="
echo -e "${BLUE}📋 TROUBLESHOOTING GUIDE${NC}"
echo "=================================="
echo ""
echo -e "${YELLOW}If you're still seeing 401/404 errors:${NC}"
echo ""
echo "1. 🔄 Clear Browser Cache:"
echo "   • Chrome/Edge: Ctrl+Shift+Delete"
echo "   • Firefox: Ctrl+Shift+Delete"
echo "   • Safari: Cmd+Option+E"
echo ""
echo "2. 🌐 Hard Refresh:"
echo "   • Chrome/Firefox: Ctrl+F5 or Ctrl+Shift+R"
echo "   • Safari: Cmd+Shift+R"
echo ""
echo "3. 🕵️ Check Request Data:"
echo "   • Ensure email/password are correct"
echo "   • Check Content-Type header is 'application/json'"
echo "   • Verify request body is valid JSON"
echo ""
echo "4. 🔧 Test with curl:"
echo "   curl -X POST https://www.kisaanmela.com/api/login \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"email\":\"demo@kisaanmela.com\",\"password\":\"demo123\"}'"
echo ""
echo -e "${GREEN}✅ Demo Credentials:${NC}"
echo "   • admin@kisaanmela.com / admin123"
echo "   • farmer@kisaanmela.com / farmer123"
echo "   • buyer@kisaanmela.com / buyer123"
echo "   • demo@kisaanmela.com / demo123"
