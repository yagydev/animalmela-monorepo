# 🧪 Local Pipeline Testing & Verification Guide

## 🎯 **Complete Local Testing Strategy**

This guide shows you how to test every aspect of the deployment pipeline locally before going to production.

---

## 1. 🔧 **Environment Setup Verification**

### Check All Dependencies
```bash
# Verify Node.js version
node --version  # Should be 18.x or 20.x

# Verify npm version  
npm --version

# Verify Docker installation
docker --version
docker-compose --version

# Verify Git configuration
git --version
git config --list
```

### Install All Dependencies
```bash
# Clean install (recommended)
rm -rf node_modules backend/node_modules web-frontend/node_modules mobile/node_modules
npm install --legacy-peer-deps
```

---

## 2. 🧪 **Test Suite Verification**

### Run All Tests Locally
```bash
# Run complete test suite (same as CI/CD)
npm run test

# Expected output:
# ✅ Backend: 5/5 tests passing
# ✅ Frontend: 6/6 tests passing
# ✅ Total: 11/11 tests passing
```

### Individual Test Verification
```bash
# Test backend only
cd backend && npm run test

# Test frontend only  
cd web-frontend && npm run test

# Test with coverage
cd backend && npm run test:coverage
cd web-frontend && npm run test:coverage
```

---

## 3. 🏗️ **Build Process Verification**

### Test Complete Build Pipeline
```bash
# Run complete build (same as CI/CD)
npm run build

# This runs:
# - npm run build:backend
# - npm run build:web
```

### Individual Build Testing
```bash
# Test backend build
npm run build:backend
# ✅ Should show: "Compiled successfully"

# Test frontend build  
npm run build:web
# ✅ Should show: "Compiled successfully"

# Verify build outputs
ls -la backend/.next/
ls -la web-frontend/.next/
```

### Production Build Testing
```bash
# Test production builds
cd backend && npm run build && npm run start &
cd web-frontend && npm run build && npm run start &

# Test endpoints
curl http://localhost:5000/api/health
curl http://localhost:3000
```

---

## 4. 🐳 **Docker Pipeline Testing**

### Build Docker Images Locally
```bash
# Build backend Docker image
docker build -f backend/Dockerfile -t kisaanmela-backend:test .

# Build frontend Docker image  
docker build -f web-frontend/Dockerfile -t kisaanmela-frontend:test .

# Verify images created
docker images | grep kisaanmela
```

### Test Docker Containers
```bash
# Run backend container
docker run -d -p 5000:5000 --name backend-test kisaanmela-backend:test

# Run frontend container
docker run -d -p 3000:3000 --name frontend-test kisaanmela-frontend:test

# Test containers
curl http://localhost:5000/api/health
curl http://localhost:3000

# Check container logs
docker logs backend-test
docker logs frontend-test

# Cleanup
docker stop backend-test frontend-test
docker rm backend-test frontend-test
```

### Test Docker Compose
```bash
# Test with docker-compose
docker-compose -f docker-compose.prod.yml --env-file env.production up -d

# Verify services
docker-compose -f docker-compose.prod.yml ps

# Test endpoints
curl http://localhost:5000/api/health
curl http://localhost:3000

# Check logs
docker-compose -f docker-compose.prod.yml logs

# Cleanup
docker-compose -f docker-compose.prod.yml down
```

---

## 5. 🔄 **API Proxy Testing**

### Test Frontend → Backend Proxying
```bash
# Start both servers
npm run dev

# Test API proxying (in another terminal)
# Frontend API should proxy to backend
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test other proxy endpoints
curl http://localhost:3000/api/me \
  -H "Authorization: Bearer YOUR_TOKEN"

curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","mobile":"1234567890"}'
```

---

## 6. 🌐 **Network & Port Testing**

### Port Conflict Resolution
```bash
# Check what's using ports
lsof -i :3000
lsof -i :5000

# Kill conflicting processes if needed
kill -9 $(lsof -t -i:5000)
kill -9 $(lsof -t -i:3000)

# Start clean
npm run dev
```

### Test All Endpoints
```bash
# Backend API endpoints
curl http://localhost:5000/api/health
curl http://localhost:5000/api/auth/login
curl http://localhost:5000/api/listings
curl http://localhost:5000/api/user/me

# Frontend pages
curl http://localhost:3000/
curl http://localhost:3000/login
curl http://localhost:3000/marketplace
curl http://localhost:3000/api/login  # Proxy test
```

---

## 7. 📱 **Mobile App Testing**

### Test Mobile Development
```bash
# Start mobile development server
cd mobile && npm run start

# Test mobile build
cd mobile && npm run build

# Test with Expo
npx expo start
```

---

## 8. 🔍 **GitHub Actions Simulation**

### Simulate CI/CD Pipeline Locally
```bash
# Create test script to simulate GitHub Actions
cat > test-pipeline.sh << 'EOF'
#!/bin/bash
set -e

echo "🚀 Starting Local Pipeline Simulation..."

echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

echo "🏗️ Building backend..."
cd backend && npm run build && cd ..

echo "🏗️ Building frontend..."  
cd web-frontend && npm run build && cd ..

echo "🧪 Running tests..."
npm run test

echo "✅ Pipeline simulation completed successfully!"
EOF

chmod +x test-pipeline.sh
./test-pipeline.sh
```

### Test Different Node Versions (like CI/CD matrix)
```bash
# Using nvm to test multiple Node versions
nvm use 18
npm install --legacy-peer-deps
npm run build
npm run test

nvm use 20  
npm install --legacy-peer-deps
npm run build
npm run test
```

---

## 9. 🔐 **Security & Environment Testing**

### Test Environment Variables
```bash
# Test with production-like environment
cp env.example .env.local

# Test environment loading
cd backend && node -e "
require('dotenv').config();
console.log('Environment loaded:', {
  NODE_ENV: process.env.NODE_ENV,
  MONGODB_URI: process.env.MONGODB_URI ? '✅ Set' : '❌ Missing',
  JWT_SECRET: process.env.JWT_SECRET ? '✅ Set' : '❌ Missing'
});
"
```

### Test Security Headers
```bash
# Test security headers
curl -I http://localhost:3000/
curl -I http://localhost:5000/api/health

# Should include headers like:
# X-Frame-Options: SAMEORIGIN
# X-Content-Type-Options: nosniff
# X-XSS-Protection: 1; mode=block
```

---

## 10. 📊 **Performance Testing**

### Load Testing
```bash
# Install load testing tool
npm install -g autocannon

# Test backend performance
autocannon -c 10 -d 30 http://localhost:5000/api/health

# Test frontend performance
autocannon -c 10 -d 30 http://localhost:3000/
```

### Memory & CPU Testing
```bash
# Monitor resource usage
top -pid $(pgrep -f "next dev")

# Or use htop for better visualization
htop
```

---

## 11. 🚀 **Pre-Production Checklist**

### Final Verification Script
```bash
cat > pre-production-check.sh << 'EOF'
#!/bin/bash
set -e

echo "🔍 Pre-Production Verification Checklist"
echo "========================================"

# 1. Clean build test
echo "1. Testing clean build..."
rm -rf node_modules backend/node_modules web-frontend/node_modules
npm install --legacy-peer-deps
npm run build

# 2. Test suite
echo "2. Running test suite..."
npm run test

# 3. Docker build test
echo "3. Testing Docker builds..."
docker build -f backend/Dockerfile -t test-backend .
docker build -f web-frontend/Dockerfile -t test-frontend .

# 4. Port availability
echo "4. Checking port availability..."
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 3000 is in use"
else
    echo "✅ Port 3000 is available"
fi

if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 5000 is in use"  
else
    echo "✅ Port 5000 is available"
fi

# 5. Environment files
echo "5. Checking environment files..."
if [ -f "env.production" ]; then
    echo "✅ env.production exists"
else
    echo "⚠️  env.production missing"
fi

echo ""
echo "🎉 Pre-production check completed!"
echo "Ready for deployment to kisaanmela.com"
EOF

chmod +x pre-production-check.sh
./pre-production-check.sh
```

---

## 12. 🎯 **Quick Test Commands**

### One-Command Full Test
```bash
# Complete pipeline test in one command
npm install --legacy-peer-deps && npm run build && npm run test && echo "✅ All tests passed!"
```

### Development Server Test
```bash
# Start and test development servers
npm run dev &
sleep 10
curl http://localhost:5000/api/health && echo "✅ Backend OK"
curl http://localhost:3000 && echo "✅ Frontend OK"
```

### Production Simulation
```bash
# Simulate production environment
NODE_ENV=production npm run build
NODE_ENV=production npm run start &
sleep 5
curl http://localhost:5000/api/health
curl http://localhost:3000
```

---

## ✅ **Success Criteria**

Your local pipeline is ready when:

- ✅ All 11 tests pass
- ✅ Both builds complete successfully  
- ✅ Docker images build without errors
- ✅ All API endpoints respond correctly
- ✅ Frontend → Backend proxying works
- ✅ No port conflicts
- ✅ Environment variables load properly
- ✅ Security headers are present
- ✅ Performance is acceptable

---

## 🚀 **Ready for Production!**

Once all local tests pass, you can confidently deploy to production:

```bash
# Deploy to production
git checkout main
git merge feature/complete-platform  
git push origin main
# → Triggers automatic deployment to kisaanmela.com
```

Your Kisaan Mela platform will be live and ready to serve farmers across India! 🇮🇳🐄
