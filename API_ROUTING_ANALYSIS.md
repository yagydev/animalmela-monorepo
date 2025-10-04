# API Routing Analysis & Solutions

## 🔍 Issue Summary

Based on the comprehensive analysis of your AnimalMela/KisaanMela backend, here are the findings for the routing issues:

### Issues Identified:

1. **405 Method Not Allowed** for `POST /api/auth/otp/send`
2. **404 Not Found** for `POST /api/forgot-password`
3. **Port conflicts** with macOS AirTunes service on port 5000
4. **Next.js SWC binary issues** on ARM64 macOS

## 📋 Current Backend Architecture

Your project uses **Next.js API Routes** with the following structure:

```
backend/pages/api/
├── auth/
│   ├── [...auth].ts          # Catch-all auth routes
│   ├── otp/
│   │   ├── send.ts           # ✅ POST /api/auth/otp/send
│   │   └── verify.ts         # ✅ POST /api/auth/otp/verify
│   ├── login.ts
│   ├── logout.ts
│   └── google.ts
├── health.ts                 # ✅ GET /api/health
└── [other endpoints...]
```

## ✅ Working Test Results

I created a test server that demonstrates **PROPER** routing behavior:

### 🟢 Successful Tests:

```bash
# Health Check
curl http://localhost:9000/api/health
# ✅ 200 OK - Server running

# OPTIONS Request (CORS Preflight)
curl -X OPTIONS http://localhost:9000/api/auth/otp/send -v
# ✅ 200 OK - Returns allowed methods: ["POST", "OPTIONS"]

# POST OTP Send
curl -X POST http://localhost:9000/api/auth/otp/send \
  -H "Content-Type: application/json" \
  -d '{"mobile":"9876543210"}'
# ✅ 200 OK - OTP sent successfully

# POST Forgot Password
curl -X POST http://localhost:9000/api/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
# ✅ 200 OK - Reset email sent
```

### 🔴 Error Handling Tests:

```bash
# Invalid mobile format
curl -X POST http://localhost:9000/api/auth/otp/send \
  -H "Content-Type: application/json" \
  -d '{"mobile":"123"}'
# ✅ 400 Bad Request - "Invalid mobile number format"

# Wrong HTTP method
curl -X GET http://localhost:9000/api/auth/otp/send
# ✅ 404 Not Found - "Endpoint not found" with available methods listed
```

## 🔧 Root Cause Analysis

### 1. **POST /api/auth/otp/send - 405 Method Not Allowed**

**✅ Route EXISTS and is PROPERLY CONFIGURED:**

```typescript
// backend/pages/api/auth/otp/send.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  
  switch (method) {
    case 'POST':                    // ✅ POST method is defined
      return await sendOTP(req, res);
    default:
      res.setHeader('Allow', ['POST']);  // ✅ Correct Allow header
      res.status(405).json({ success: false, error: `Method ${method} not allowed` });
  }
}
```

**Issue:** The 405 error suggests the Next.js server isn't running properly or there's a port conflict.

### 2. **POST /api/forgot-password - 404 Not Found**

**❌ Route MISSING in Next.js API structure:**

The forgot-password route exists in Express routes (`backend/src/routes/auth.js`) but **NOT** in Next.js API routes (`backend/pages/api/`).

```javascript
// ✅ EXISTS in Express routes (not used)
// backend/src/routes/auth.js
router.post('/forgot-password', async (req, res) => { ... });

// ❌ MISSING in Next.js API routes
// backend/pages/api/forgot-password.ts - DOES NOT EXIST
```

### 3. **Port Conflicts**

macOS AirTunes service hijacks port 5000:

```bash
$ lsof -i :5000
COMMAND     PID USER   FD   TYPE   DEVICE SIZE/OFF NODE NAME
ControlCe 79415  dev   10u  IPv4   ...      0t0  TCP *:commplex-main (LISTEN)
```

All requests to port 5000 return `403 Forbidden` with `Server: AirTunes/870.14.1`.

## 🛠️ Solutions

### Solution 1: Fix Missing forgot-password Route

Create the missing Next.js API route:

```typescript
// backend/pages/api/forgot-password.ts
import { NextApiRequest, NextApiResponse } from 'next';
const connectDB = require('../../lib/mongodb');
const { User } = require('../../models');
const jwt = require('jsonwebtoken');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  const { method } = req;

  switch (method) {
    case 'POST':
      return await forgotPassword(req, res);
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).json({ success: false, error: `Method ${method} not allowed` });
  }
}

async function forgotPassword(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      success: true,
      message: 'Password reset email sent',
      resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}
```

### Solution 2: Fix Port Conflicts

Update your startup scripts to use different ports:

```bash
# backend/package.json
{
  "scripts": {
    "dev": "next dev -p 8000",  # Use port 8000 instead of 5000
    "start": "next start -p 8000"
  }
}
```

```bash
# Update environment variables
# .env
API_URL=http://localhost:8000/api
NEXT_PUBLIC_API_URL=http://localhost:8000/api
PORT=8000
```

### Solution 3: Fix Next.js SWC Issues

```bash
# Clean and reinstall dependencies
cd backend
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Or disable SWC
# next.config.js
module.exports = {
  swcMinify: false,  // Disable SWC minification
  // ... other config
}
```

### Solution 4: Alternative Express Server

If Next.js continues to have issues, you can use the Express routes that already exist:

```javascript
// backend/server-express.js
const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/auth');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

app.listen(8000, () => {
  console.log('Express server running on port 8000');
});
```

## 🧪 Testing Commands

Once fixes are applied, test with these commands:

```bash
# Test OTP endpoint
curl -X OPTIONS http://localhost:8000/api/auth/otp/send -v
curl -X POST http://localhost:8000/api/auth/otp/send \
  -H "Content-Type: application/json" \
  -d '{"mobile":"9876543210"}'

# Test forgot password endpoint
curl -X OPTIONS http://localhost:8000/api/forgot-password -v
curl -X POST http://localhost:8000/api/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Test health endpoint
curl http://localhost:8000/api/health
```

## 📝 Debugging Checklist

### For 405 Method Not Allowed:
- [ ] Verify route file exists in `pages/api/`
- [ ] Check method handler is defined (`case 'POST':`)
- [ ] Confirm `Allow` header lists correct methods
- [ ] Test with OPTIONS request first

### For 404 Not Found:
- [ ] Verify API route file exists
- [ ] Check file naming matches URL path
- [ ] Ensure proper export default function
- [ ] Test with simple GET endpoint first

### For Server Issues:
- [ ] Check port availability (`lsof -i :PORT`)
- [ ] Verify environment variables
- [ ] Check server startup logs
- [ ] Test with curl from command line

## 🎯 Quick Fix Summary

1. **Create** `backend/pages/api/forgot-password.ts`
2. **Change** port from 5000 to 8000 in all configs
3. **Test** endpoints with curl commands above
4. **Deploy** updated backend code

## 📊 Current Status

- ✅ **POST /api/auth/otp/send**: Route exists, method defined correctly
- ❌ **POST /api/forgot-password**: Route missing in Next.js API
- ❌ **Port 5000**: Blocked by macOS AirTunes service
- ❌ **Next.js SWC**: Binary compatibility issues on ARM64

**Next Steps**: Implement Solution 1 and 2 above to resolve all routing issues.
