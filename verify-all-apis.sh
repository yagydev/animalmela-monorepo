#!/bin/bash

# 🔍 KISAAN MELA - COMPREHENSIVE API VERIFICATION
# This script thoroughly tests all API endpoints with detailed reporting

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

BASE_URL="https://www.kisaanmela.com"
FAILED_TESTS=0
TOTAL_TESTS=0
DETAILED_RESULTS=()

echo -e "${CYAN}🔍 KISAAN MELA - COMPREHENSIVE API VERIFICATION${NC}"
echo "=================================================="
echo "Base URL: $BASE_URL"
echo "Timestamp: $(date)"
echo ""

# Function to test API endpoint with detailed logging
test_api_detailed() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_status=$4
    local description=$5
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    echo -e "${BLUE}[$TOTAL_TESTS] Testing: $description${NC}"
    echo "   Method: $method"
    echo "   Endpoint: $endpoint"
    if [ "$data" != "" ]; then
        echo "   Data: $data"
    fi
    echo "   Expected Status: $expected_status"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}\n%{time_total}" "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}\n%{time_total}" -X "$method" \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$BASE_URL$endpoint")
    fi
    
    # Extract components
    body=$(echo "$response" | head -n -2)
    status_code=$(echo "$response" | tail -n 2 | head -n 1)
    time_taken=$(echo "$response" | tail -n 1)
    
    echo "   Response Time: ${time_taken}s"
    echo "   Actual Status: $status_code"
    
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "   Result: ${GREEN}✅ PASS${NC}"
        DETAILED_RESULTS+=("✅ $description - PASS")
    else
        echo -e "   Result: ${RED}❌ FAIL${NC}"
        echo "   Response Body: $body"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        DETAILED_RESULTS+=("❌ $description - FAIL (Expected: $expected_status, Got: $status_code)")
    fi
    echo ""
}

# Test all endpoints
echo -e "${YELLOW}📄 TESTING PAGES${NC}"
echo "=================="
test_api_detailed "GET" "/" "" "200" "Home page"
test_api_detailed "GET" "/login" "" "200" "Login page"
test_api_detailed "GET" "/register" "" "200" "Register page"
test_api_detailed "GET" "/marketplace" "" "200" "Marketplace page"
test_api_detailed "GET" "/terms" "" "200" "Terms page"
test_api_detailed "GET" "/privacy" "" "200" "Privacy page"
test_api_detailed "GET" "/about" "" "200" "About page"
test_api_detailed "GET" "/contact" "" "200" "Contact page"
test_api_detailed "GET" "/how-it-works" "" "200" "How it works page"
test_api_detailed "GET" "/safety" "" "200" "Safety page"

echo -e "${YELLOW}🔌 TESTING CORE API ENDPOINTS${NC}"
echo "================================"
test_api_detailed "GET" "/api/health" "" "200" "Health check endpoint"

echo -e "${YELLOW}🔐 TESTING AUTHENTICATION APIs${NC}"
echo "================================="
test_api_detailed "POST" "/api/login" '{"email":"demo@kisaanmela.com","password":"demo123"}' "200" "Valid login"
test_api_detailed "POST" "/api/login" '{"email":"wrong@email.com","password":"wrong"}' "401" "Invalid login"
test_api_detailed "POST" "/api/login" '{"email":"","password":""}' "400" "Empty login credentials"
test_api_detailed "GET" "/api/login" "" "405" "Login GET method (should fail)"

test_api_detailed "POST" "/api/register" '{"name":"Test User","email":"test@example.com","password":"test123"}' "200" "Valid registration"
test_api_detailed "POST" "/api/register" '{"name":"","email":"","password":""}' "400" "Empty registration data"
test_api_detailed "GET" "/api/register" "" "405" "Register GET method (should fail)"

test_api_detailed "GET" "/api/me" "" "401" "Me endpoint without token"
test_api_detailed "POST" "/api/logout" '{}' "200" "Logout endpoint"
test_api_detailed "GET" "/api/logout" "" "405" "Logout GET method (should fail)"

echo -e "${YELLOW}🔑 TESTING PASSWORD APIs${NC}"
echo "=========================="
test_api_detailed "POST" "/api/forgot-password" '{"email":"demo@kisaanmela.com"}' "200" "Valid forgot password"
test_api_detailed "POST" "/api/forgot-password" '{"email":"nonexistent@email.com"}' "404" "Non-existent email"
test_api_detailed "POST" "/api/forgot-password" '{"email":""}' "400" "Empty email"
test_api_detailed "GET" "/api/forgot-password" "" "405" "Forgot password GET method"

test_api_detailed "POST" "/api/reset-password" '{"token":"invalid","password":"newpass","confirmPassword":"newpass"}' "400" "Invalid reset token"
test_api_detailed "POST" "/api/reset-password" '{"password":"newpass","confirmPassword":"different"}' "400" "Mismatched passwords"
test_api_detailed "GET" "/api/reset-password" "" "405" "Reset password GET method"

test_api_detailed "POST" "/api/change-password" '{"currentPassword":"old","newPassword":"new","confirmPassword":"new"}' "401" "Change password without token"
test_api_detailed "GET" "/api/change-password" "" "405" "Change password GET method"

# Summary
echo "=================================================="
echo -e "${CYAN}📊 DETAILED TEST RESULTS${NC}"
echo "=================================================="
echo "Total Tests: $TOTAL_TESTS"
echo -e "Passed: ${GREEN}$((TOTAL_TESTS - FAILED_TESTS))${NC}"
echo -e "Failed: ${RED}$FAILED_TESTS${NC}"
echo ""

echo -e "${CYAN}📋 DETAILED BREAKDOWN:${NC}"
for result in "${DETAILED_RESULTS[@]}"; do
    echo "   $result"
done

echo ""
if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED!${NC}"
    echo -e "${GREEN}✅ Kisaan Mela platform is fully functional!${NC}"
    echo ""
    echo -e "${CYAN}🚀 Platform Status: PRODUCTION READY${NC}"
    echo "   • All pages loading correctly"
    echo "   • All APIs responding properly"
    echo "   • Authentication system working"
    echo "   • Password management functional"
    echo ""
    echo -e "${CYAN}🎯 Demo Login Credentials:${NC}"
    echo "   • admin@kisaanmela.com / admin123"
    echo "   • farmer@kisaanmela.com / farmer123"
    echo "   • buyer@kisaanmela.com / buyer123"
    echo "   • demo@kisaanmela.com / demo123"
    exit 0
else
    echo -e "${RED}❌ Some tests failed. Platform needs attention.${NC}"
    echo ""
    echo -e "${YELLOW}🔧 Possible Issues:${NC}"
    echo "   • Deployment still in progress"
    echo "   • CDN caching old responses"
    echo "   • API route conflicts"
    echo "   • Server configuration issues"
    echo ""
    echo -e "${YELLOW}💡 Recommended Actions:${NC}"
    echo "   1. Wait 5-10 minutes for full deployment"
    echo "   2. Clear browser cache and try again"
    echo "   3. Check Vercel deployment logs"
    echo "   4. Verify API route configurations"
    exit 1
fi
