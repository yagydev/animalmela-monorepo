# 🚀 MongoDB & Backend Deployment Guide for kisaanmela.com

## 🎯 **Problem**: MongoDB Connection Failing in Production

**Current Issue**: 
- `https://www.kisaanmela.com/api/login` returns 503 Service Unavailable
- Error: "MongoDB not available. Use demo@kisaanmela.com/demo123..."

**Root Cause**: 
- Production server is running old code without MongoDB connection fixes
- MongoDB container not properly configured in production environment

---

## 🛠️ **SOLUTION: Complete Deployment Process**

### **Step 1: Verify Current Status**

```bash
# Check if you have server access
ssh your-user@your-server-ip

# Check current deployment
cd /path/to/your/kisaanmela/project
git status
docker ps
```

### **Step 2: Deploy MongoDB Fixes**

#### **Option A: Docker Compose Deployment (Recommended)**

```bash
# 1. Connect to your production server
ssh your-user@your-server-ip

# 2. Navigate to project directory
cd /var/www/kisaanmela  # or your project path

# 3. Pull latest changes with MongoDB fixes
git pull origin main

# 4. Stop all containers
docker-compose -f docker-compose.prod.yml down

# 5. Remove old containers and images (optional, for clean deployment)
docker system prune -f

# 6. Build and start all services
docker-compose -f docker-compose.prod.yml up -d --build

# 7. Check container status
docker-compose -f docker-compose.prod.yml ps

# 8. Check MongoDB container specifically
docker logs kisaanmela-mongodb

# 9. Check backend logs
docker logs kisaanmela-backend

# 10. Check frontend logs
docker logs kisaanmela-frontend
```

#### **Option B: Using Deployment Script**

```bash
# On your production server
cd /path/to/your/kisaanmela/project
chmod +x deploy-kisaanmela.sh
./deploy-kisaanmela.sh
```

### **Step 3: Verify MongoDB Connection**

```bash
# Test MongoDB connection
docker exec -it kisaanmela-mongodb mongosh --eval "db.adminCommand('ping')"

# Check if MongoDB is accessible from backend
docker exec -it kisaanmela-backend curl http://mongodb:27017

# Test database connection
docker exec -it kisaanmela-backend node -e "
const mongoose = require('mongoose');
mongoose.connect('mongodb://mongodb:27017/kisaanmela_prod')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));
"
```

### **Step 4: Test API Endpoints**

```bash
# Test login API
curl -X POST https://www.kisaanmela.com/api/login \
     -H 'Content-Type: application/json' \
     -d '{"email":"demo@kisaanmela.com","password":"demo123"}'

# Test other APIs
curl https://www.kisaanmela.com/api/farmers-market/listings
curl https://www.kisaanmela.com/api/farmers-market/profile?userId=1
curl https://www.kisaanmela.com/api/health
```

---

## 🔧 **TROUBLESHOOTING**

### **If MongoDB Container Won't Start**

```bash
# Check MongoDB logs
docker logs kisaanmela-mongodb

# Check if port 27017 is available
netstat -tlnp | grep 27017

# Restart MongoDB container
docker-compose -f docker-compose.prod.yml restart mongodb

# Check MongoDB configuration
docker exec -it kisaanmela-mongodb cat /etc/mongod.conf
```

### **If Backend Can't Connect to MongoDB**

```bash
# Check network connectivity
docker network ls
docker network inspect kisaanmela_kisaanmela-network

# Test connection from backend container
docker exec -it kisaanmela-backend ping mongodb

# Check environment variables
docker exec -it kisaanmela-backend env | grep MONGO
docker exec -it kisaanmela-backend env | grep DATABASE
```

### **If Frontend API Routes Fail**

```bash
# Check frontend logs
docker logs kisaanmela-frontend

# Check if frontend can reach backend
docker exec -it kisaanmela-frontend curl http://backend:5000/api/health

# Verify environment variables
docker exec -it kisaanmela-frontend env | grep API
```

---

## 📋 **ENVIRONMENT VARIABLES CHECKLIST**

Make sure these are set in your `env.production` file:

```bash
# Database Configuration
DATABASE_URL=mongodb://mongodb:27017/kisaanmela_prod
MONGODB_URI=mongodb://mongodb:27017/kisaanmela_prod
DB_NAME=kisaanmela_prod

# JWT Configuration
JWT_SECRET=your-secure-jwt-secret
JWT_EXPIRE=7d

# API Configuration
NEXT_PUBLIC_API_URL=https://api.kisaanmela.com/api
NEXT_PUBLIC_WEB_URL=https://kisaanmela.com
NODE_ENV=production
```

---

## 🎯 **DEMO USERS AVAILABLE**

After successful deployment, these demo users will work:

- **Farmer**: `demo@kisaanmela.com` / `demo123`
- **Admin**: `admin@kisaanmela.com` / `admin123`
- **Buyer**: `buyer@kisaanmela.com` / `buyer123`
- **Seller**: `seller@kisaanmela.com` / `seller123`

---

## 🚀 **QUICK DEPLOYMENT COMMANDS**

### **One-Command Deployment**

```bash
# Run this on your production server
cd /path/to/kisaanmela && git pull origin main && docker-compose -f docker-compose.prod.yml down && docker-compose -f docker-compose.prod.yml up -d --build && docker-compose -f docker-compose.prod.yml logs -f
```

### **Health Check After Deployment**

```bash
# Check all services
curl https://www.kisaanmela.com/api/health
curl https://www.kisaanmela.com/api/farmers-market/listings
curl -X POST https://www.kisaanmela.com/api/login -H 'Content-Type: application/json' -d '{"email":"demo@kisaanmela.com","password":"demo123"}'
```

---

## 📞 **SUPPORT**

If you encounter issues:

1. **Check container logs**: `docker-compose -f docker-compose.prod.yml logs -f`
2. **Verify network**: `docker network ls`
3. **Test connectivity**: `docker exec -it kisaanmela-backend ping mongodb`
4. **Check environment**: `docker exec -it kisaanmela-backend env`

**Common Issues**:
- Port conflicts (27017 already in use)
- Network connectivity issues
- Environment variables not set
- Docker daemon not running
- Insufficient disk space

---

## ✅ **SUCCESS INDICATORS**

After successful deployment, you should see:

1. ✅ All containers running: `docker-compose -f docker-compose.prod.yml ps`
2. ✅ MongoDB connected: No connection errors in logs
3. ✅ API responding: `curl https://www.kisaanmela.com/api/health` returns 200
4. ✅ Login working: Demo users can authenticate successfully
5. ✅ No 503 errors: All API endpoints return proper responses

**Your kisaanmela.com will be fully functional! 🎉**
