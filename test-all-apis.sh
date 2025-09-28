#!/bin/bash

# 🧪 KISAAN MELA - API TESTING SCRIPT
# Tests all API endpoints on kisaanmela.com

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

BASE_URL="https://www.kisaanmela.com"
FAILED_TESTS=0
TOTAL_TESTS=0

echo -e "${BLUE}🧪 TESTING ALL KISAAN MELA APIs${NC}"
echo "=================================="
echo "Base URL: $BASE_URL"
echo ""

# Function to test API endpoint
test_api() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_status=$4
    local description=$5
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    echo -n "Testing: $description... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$BASE_URL$endpoint")
    fi
    
    # Extract status code (last line)
    status_code=$(echo "$response" | tail -n1)
    # Extract response body (all but last line)
    body=$(echo "$response" | head -n -1)
    
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}✅ PASS${NC} (Status: $status_code)"
    else
        echo -e "${RED}❌ FAIL${NC} (Expected: $expected_status, Got: $status_code)"
        echo "   Response: $body"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
}

# Test Pages
echo -e "${YELLOW}📄 TESTING PAGES${NC}"
test_api "GET" "/" "" "200" "Home page"
test_api "GET" "/login" "" "200" "Login page"
test_api "GET" "/register" "" "200" "Register page"
test_api "GET" "/marketplace" "" "200" "Marketplace page"
test_api "GET" "/terms" "" "200" "Terms page"
test_api "GET" "/privacy" "" "200" "Privacy page"
test_api "GET" "/about" "" "200" "About page"
test_api "GET" "/contact" "" "200" "Contact page"

echo ""
echo -e "${YELLOW}🔌 TESTING API ENDPOINTS${NC}"

# Test Health Check
test_api "GET" "/api/health" "" "200" "Health check"

# Test Login API
test_api "POST" "/api/login" '{"email":"demo@kisaanmela.com","password":"demo123"}' "200" "Valid login"
test_api "POST" "/api/login" '{"email":"wrong@email.com","password":"wrong"}' "401" "Invalid login"
test_api "POST" "/api/login" '{"email":"","password":""}' "400" "Empty credentials"
test_api "GET" "/api/login" "" "405" "Login GET method"

# Test Registration API
test_api "POST" "/api/register" '{"name":"Test User","email":"test@example.com","password":"test123"}' "200" "Valid registration"
test_api "POST" "/api/register" '{"name":"","email":"","password":""}' "400" "Empty registration data"
test_api "GET" "/api/register" "" "405" "Register GET method"

# Test Me API (without token)
test_api "GET" "/api/me" "" "401" "Me endpoint without token"

# Test Logout API
test_api "POST" "/api/logout" '{}' "200" "Logout"
test_api "GET" "/api/logout" "" "405" "Logout GET method"

# Test Forgot Password API
test_api "POST" "/api/forgot-password" '{"email":"demo@kisaanmela.com"}' "200" "Valid forgot password"
test_api "POST" "/api/forgot-password" '{"email":"nonexistent@email.com"}' "404" "Non-existent email forgot password"
test_api "POST" "/api/forgot-password" '{"email":""}' "400" "Empty email forgot password"
test_api "GET" "/api/forgot-password" "" "405" "Forgot password GET method"

# Test Reset Password API (without token)
test_api "POST" "/api/reset-password" '{"token":"invalid","password":"newpass","confirmPassword":"newpass"}' "400" "Invalid reset token"
test_api "POST" "/api/reset-password" '{"password":"newpass","confirmPassword":"different"}' "400" "Mismatched passwords"
test_api "GET" "/api/reset-password" "" "405" "Reset password GET method"

# Test Change Password API (without token)
test_api "POST" "/api/change-password" '{"currentPassword":"old","newPassword":"new","confirmPassword":"new"}' "401" "Change password without token"
test_api "GET" "/api/change-password" "" "405" "Change password GET method"

echo ""
echo "=================================="
echo -e "${BLUE}📊 TEST RESULTS${NC}"
echo "Total Tests: $TOTAL_TESTS"
echo -e "Passed: ${GREEN}$((TOTAL_TESTS - FAILED_TESTS))${NC}"
echo -e "Failed: ${RED}$FAILED_TESTS${NC}"

if [ $FAILED_TESTS -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 ALL TESTS PASSED!${NC}"
    echo -e "${GREEN}✅ Kisaan Mela APIs are working correctly!${NC}"
    exit 0
else
    echo ""
    echo -e "${RED}❌ Some tests failed. Please check the issues above.${NC}"
    exit 1
fi
