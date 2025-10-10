# 🚀 Complete Vercel Deployment Guide for kisaanmela.com

## 🎯 **Problem**: MongoDB Connection Failing on Vercel

**Current Issue**: 
- `https://www.kisaanmela.com/api/login` returns 503 Service Unavailable
- Error: "MongoDB not available. Use demo@kisaanmela.com/demo123..."

**Root Cause**: 
- Vercel doesn't support Docker containers or local MongoDB
- Need to use MongoDB Atlas (cloud database) for Vercel deployment
- Environment variables not properly configured

---

## 🛠️ **SOLUTION: Complete Vercel Deployment Setup**

### **Step 1: Set up MongoDB Atlas (Free)**

1. **Create MongoDB Atlas Account**:
   - Go to https://www.mongodb.com/atlas
   - Sign up for free account
   - Create a new project called "Kisaan Mela"

2. **Create Database Cluster**:
   - Choose "Build a Database"
   - Select "M0 Sandbox" (Free tier)
   - Choose your preferred region (recommend Mumbai for India)
   - Create cluster (takes 1-3 minutes)

3. **Configure Database Access**:
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Username: `kisaanmela_user`
   - Password: Generate secure password (save it!)
   - Database User Privileges: "Read and write to any database"

4. **Configure Network Access**:
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - This allows Vercel to connect to your database

5. **Get Connection String**:
   - Go to "Clusters" in left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like):
   ```
   mongodb+srv://kisaanmela_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### **Step 2: Configure Vercel Environment Variables**

1. **Go to Vercel Dashboard**:
   - Visit https://vercel.com/dashboard
   - Find your kisaanmela project
   - Click on the project

2. **Add Environment Variables**:
   - Go to "Settings" → "Environment Variables"
   - Add these variables:

   ```
   MONGODB_URI=mongodb+srv://kisaanmela_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/kisaanmela_prod?retryWrites=true&w=majority
   DATABASE_URL=mongodb+srv://kisaanmela_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/kisaanmela_prod?retryWrites=true&w=majority
   JWT_SECRET=your-super-secure-jwt-secret-key-for-production-change-this
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://www.kisaanmela.com/api
   NEXT_PUBLIC_WEB_URL=https://www.kisaanmela.com
   ```

3. **Redeploy Application**:
   - Go to "Deployments" tab
   - Click "Redeploy" on the latest deployment
   - Or push a new commit to trigger automatic deployment

### **Step 3: Update Database Connection Code**

The database connection code needs to be updated for Vercel. The current code already has good fallback handling.

### **Step 4: Create Vercel Configuration**

Create `vercel.json` in the project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "web-frontend/package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "web-frontend/$1"
    }
  ],
  "env": {
    "MONGODB_URI": "@mongodb_uri",
    "DATABASE_URL": "@database_url",
    "JWT_SECRET": "@jwt_secret",
    "NODE_ENV": "production"
  },
  "functions": {
    "web-frontend/src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

### **Step 5: Test the Deployment**

After redeploying with MongoDB Atlas:

```bash
# Test login API
curl -X POST https://www.kisaanmela.com/api/login \
     -H 'Content-Type: application/json' \
     -d '{"email":"demo@kisaanmela.com","password":"demo123"}'

# Test other APIs
curl https://www.kisaanmela.com/api/farmers-market/listings
curl https://www.kisaanmela.com/api/health
```

---

## 🔧 **ALTERNATIVE: Quick Fix with Demo Mode**

If you want to get the site working immediately while setting up MongoDB Atlas:

### **Option 1: Enhanced Demo Mode (Immediate)**

The current code already has enhanced demo mode. You can test it right now:

```bash
# Test with demo users
curl -X POST https://www.kisaanmela.com/api/login \
     -H 'Content-Type: application/json' \
     -d '{"email":"demo@kisaanmela.com","password":"demo123"}'

curl -X POST https://www.kisaanmela.com/api/login \
     -H 'Content-Type: application/json' \
     -d '{"email":"admin@kisaanmela.com","password":"admin123"}'
```

### **Option 2: Update Vercel Environment Variables**

Add this to your Vercel environment variables to force demo mode:

```
MONGODB_URI=demo-mode
DATABASE_URL=demo-mode
NODE_ENV=production
```

---

## 📋 **VERCEL ENVIRONMENT VARIABLES CHECKLIST**

Make sure these are set in your Vercel project:

### **Required Variables**:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kisaanmela_prod?retryWrites=true&w=majority
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/kisaanmela_prod?retryWrites=true&w=majority
JWT_SECRET=your-super-secure-jwt-secret-key
JWT_EXPIRES_IN=7d
NODE_ENV=production
```

### **Optional Variables**:
```
NEXT_PUBLIC_API_URL=https://www.kisaanmela.com/api
NEXT_PUBLIC_WEB_URL=https://www.kisaanmela.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

---

## 🎯 **DEMO USERS AVAILABLE**

After successful deployment, these demo users will work:

- **Farmer**: `demo@kisaanmela.com` / `demo123`
- **Admin**: `admin@kisaanmela.com` / `admin123`
- **Buyer**: `buyer@kisaanmela.com` / `buyer123`
- **Seller**: `seller@kisaanmela.com` / `seller123`

---

## 🚀 **QUICK DEPLOYMENT STEPS**

### **For Immediate Fix (Demo Mode)**:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add: `MONGODB_URI=demo-mode`
3. Add: `DATABASE_URL=demo-mode`
4. Add: `JWT_SECRET=your-secret-key`
5. Add: `NODE_ENV=production`
6. Redeploy your application
7. Test with demo users

### **For Full MongoDB Atlas Setup**:

1. Create MongoDB Atlas account (free)
2. Create database cluster
3. Configure database user and network access
4. Get connection string
5. Add environment variables to Vercel
6. Redeploy application
7. Test with real database

---

## 🔧 **TROUBLESHOOTING**

### **If API Routes Still Return 503**:

1. **Check Vercel Logs**: Go to Vercel Dashboard → Your Project → Functions → View Logs
2. **Verify Environment Variables**: Make sure all required variables are set
3. **Check MongoDB Atlas Connection**: Use MongoDB Compass to test connection
4. **Check Network Access**: Ensure MongoDB Atlas allows connections from anywhere

### **If Demo Mode Doesn't Work**:

1. **Check Environment Variables**: Ensure `MONGODB_URI=demo-mode` is set
2. **Check API Route**: Verify the login route is properly deployed
3. **Check Logs**: Look for any errors in Vercel function logs

### **If MongoDB Atlas Connection Fails**:

1. **Check Connection String**: Ensure it's properly formatted
2. **Check Network Access**: Make sure 0.0.0.0/0 is allowed
3. **Check Database User**: Verify username and password are correct
4. **Check Cluster Status**: Ensure cluster is running

---

## ✅ **SUCCESS INDICATORS**

After successful deployment, you should see:

1. ✅ No 503 errors on API endpoints
2. ✅ Login API returns success with demo users
3. ✅ Other APIs return proper JSON responses
4. ✅ MongoDB connection established (if using Atlas)
5. ✅ Application fully functional on kisaanmela.com

---

## 📞 **SUPPORT**

If you encounter issues:

1. **Check Vercel Logs**: Go to Vercel Dashboard → Your Project → Functions → View Logs
2. **Verify Environment Variables**: Make sure all required variables are set
3. **Test MongoDB Atlas Connection**: Use MongoDB Compass to test connection
4. **Check Network Access**: Ensure MongoDB Atlas allows connections from anywhere

**Your kisaanmela.com will be fully functional! 🎉**
