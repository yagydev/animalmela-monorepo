#!/bin/bash

# Farmers Market API Testing Setup Script
echo "🌾 Farmers Market API Testing Setup"
echo "=================================="

# Check if MongoDB is running
echo "📊 Checking MongoDB status..."
if pgrep -x "mongod" > /dev/null; then
    echo "✅ MongoDB is running"
else
    echo "❌ MongoDB is not running. Please start MongoDB first:"
    echo "   brew services start mongodb-community"
    exit 1
fi

# Check if Node.js is installed
echo "📦 Checking Node.js..."
if command -v node &> /dev/null; then
    echo "✅ Node.js $(node --version) is installed"
else
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Install dependencies if needed
echo "📥 Installing dependencies..."
if [ ! -d "node_modules" ]; then
    npm install --legacy-peer-deps
else
    echo "✅ Dependencies already installed"
fi

# Start API server
echo "🚀 Starting API test server..."
echo "   Server will run on http://localhost:3001"
echo "   Health check: http://localhost:3001/health"
echo "   Press Ctrl+C to stop the server"
echo ""

# Start server in background
node api-test-server.js &
SERVER_PID=$!

# Wait for server to start
sleep 3

# Test health endpoint
echo "🔍 Testing API server..."
if curl -s http://localhost:3001/health > /dev/null; then
    echo "✅ API server is running successfully!"
    echo ""
    echo "📋 Available endpoints:"
    echo "   GET  /health                    - Health check"
    echo "   POST /api/seed                  - Create seed data"
    echo "   GET  /api/farmers               - Get all farmers"
    echo "   POST /api/farmers               - Create farmer"
    echo "   GET  /api/products              - Get all products"
    echo "   POST /api/products              - Create product"
    echo "   POST /api/cart                  - Add to cart"
    echo "   GET  /api/cart/:userId          - Get user cart"
    echo "   POST /api/orders                - Create order"
    echo "   GET  /api/orders/:userId        - Get user orders"
    echo ""
    echo "🧪 Run tests:"
    echo "   npx mocha test/api-test.js --timeout 10000"
    echo ""
    echo "📮 Import postman-collection.json into Postman for manual testing"
    echo ""
    echo "🛑 Press Ctrl+C to stop the server"
    
    # Keep server running
    wait $SERVER_PID
else
    echo "❌ Failed to start API server"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi
