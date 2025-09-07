# AnimalMela Platform - Monorepo

A comprehensive livestock marketplace platform built with Next.js, React Native, and MongoDB. This monorepo contains the backend API, web frontend, mobile app, and shared code for buying and selling livestock.

## 🏗️ Project Structure

```
animall-monorepo/
│
├── backend/                  # Next.js backend API (Node + MongoDB)
│   ├── pages/api/            # API routes (auth, listings, orders, etc.)
│   ├── models/               # Mongoose models
│   ├── lib/                  # DB connection utils
│   ├── middleware/           # JWT auth middleware
│   ├── scripts/              # Database seeding scripts
│   ├── package.json
│   └── next.config.js
│
├── web-frontend/             # Next.js web frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── app/              # Pages (Login, Register, Dashboard, etc.)
│   │   ├── services/         # API calls (axios/fetch to backend)
│   │   └── store/            # State management (Zustand)
│   ├── public/               # Static assets
│   └── package.json
│
├── mobile/                   # React Native mobile app
│   ├── src/
│   │   ├── components/       # Shared UI components
│   │   ├── screens/          # Login, Register, Dashboard screens
│   │   ├── navigation/       # React Navigation setup
│   │   ├── services/         # API calls (shared with backend)
│   │   └── store/            # State management
│   ├── App.tsx
│   └── package.json
│
├── shared/                   # Shared code for web + mobile + backend
│   ├── constants/           # API endpoints, enums, etc.
│   ├── helpers/             # Utility functions
│   ├── validations/         # Input validation (Joi)
│   └── api-schema/          # TypeScript types and interfaces
│
├── .env.example             # Environment variables template
├── package.json             # Root monorepo config
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- MongoDB (local or cloud)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yagydev/animalmela-monorepo.git
   cd animall-monorepo
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd backend && npm install
   cd ../web-frontend && npm install
   cd ../mobile && npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Seed the database**
   ```bash
   cd backend
   node scripts/seed.js
   ```

5. **Start development servers**
   ```bash
   # Start backend
   cd backend && npm run dev
   
   # Start web frontend (in another terminal)
   cd web-frontend && npm run dev
   
   # Start mobile app (in another terminal)
   cd mobile && npm start
   ```

## 📱 Applications

### Backend API (Port 5000)
- **URL**: http://localhost:5000
- **API Docs**: http://localhost:5000/api
- **Features**:
  - JWT Authentication with OTP support
  - MongoDB with Mongoose
  - RESTful API endpoints for livestock marketplace
  - File upload support
  - Rate limiting
  - CORS enabled

### Web Frontend (Port 3000)
- **URL**: http://localhost:3000
- **Features**:
  - Next.js with TypeScript
  - Tailwind CSS styling
  - Responsive design
  - State management with Zustand
  - React Query for data fetching

### Mobile App
- **Platform**: React Native with Expo
- **Features**:
  - Cross-platform (iOS/Android)
  - Native navigation
  - Camera integration
  - Push notifications
  - Offline support

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/otp/send` - Send OTP to mobile
- `POST /api/auth/otp/verify` - Verify OTP and login/register
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### User Endpoints
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/:id` - Update user

### Listing Endpoints
- `GET /api/listings` - Get listings with filters & pagination
- `GET /api/listings/:id` - Get single listing
- `POST /api/listings` - Create listing
- `PATCH /api/listings/:id` - Update listing
- `DELETE /api/listings/:id` - Delete listing

### Order & Payment Endpoints
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get single order
- `GET /api/orders` - Get user orders
- `POST /api/payments/:orderId/capture` - Capture payment

### Transport Endpoints
- `POST /api/transport/quote` - Request transport quote
- `POST /api/transport/accept` - Accept transport job
- `PATCH /api/transport/:id/status` - Update transport status
- `GET /api/transport` - Get transport jobs

### Vet/Insurance Endpoints
- `POST /api/vet/requests` - Create vet request
- `GET /api/vet/requests` - Get vet requests
- `PATCH /api/vet/requests` - Update vet request
- `POST /api/insurance/leads` - Create insurance lead
- `GET /api/insurance/leads` - Get insurance leads
- `PATCH /api/insurance/leads` - Update insurance lead

### Admin Endpoints
- `GET /api/admin/mod/queue` - Get moderation queue
- `PATCH /api/admin/listings/:id/moderate` - Moderate listing
- `GET /api/admin/reports` - Get admin reports

## 🗄️ Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  role: "buyer" | "seller" | "service" | "admin",
  name: String,
  mobile: String (unique),
  email: String,
  password: String (hashed, optional if OTP only),
  kyc: { aadhaar: String, pan: String, verified: Boolean },
  rating: Number,
  location: { state: String, district: String, pincode: String, lat: Number, lng: Number },
  languages: [String],
  createdAt, updatedAt
}
```

### Listings Collection
```javascript
{
  _id: ObjectId,
  sellerId: ObjectId (ref: User),
  species: String,
  breed: String,
  sex: String,
  age: Number,
  teeth: Number,
  weight: Number,
  milkYield: Number,
  lactationNo: Number,
  pregnancyMonths: Number,
  price: Number,
  negotiable: Boolean,
  description: String,
  media: [String], // image/video URLs
  docs: [String],
  health: String,
  verified: Boolean,
  status: "active" | "paused" | "sold",
  promoted: { type: "hot" | "featured", start: Date, end: Date },
  createdAt, updatedAt
}
```

### Orders Collection
```javascript
{
  _id: ObjectId,
  listingId: ObjectId (ref: Listing),
  buyerId: ObjectId (ref: User),
  sellerId: ObjectId (ref: User),
  amount: Number,
  paymentStatus: "pending" | "paid" | "failed" | "refunded",
  deliveryStatus: "initiated" | "in-progress" | "delivered" | "cancelled",
  createdAt, updatedAt
}
```

## 🔐 Authentication

The platform uses JWT-based authentication with OTP support:

1. **OTP Login**: User provides mobile number, receives OTP
2. **OTP Verification**: User enters OTP to login/register
3. **Token Generation**: Server generates JWT access token
4. **API Requests**: Client includes token in Authorization header
5. **Token Validation**: Server validates token on protected routes

## 🧪 Testing

### Test Credentials
- **Buyer**: `rajesh@example.com` / `password123`
- **Seller**: `priya@example.com` / `password123`
- **Service Provider**: `amit@example.com` / `password123`
- **Admin**: `admin@example.com` / `admin123`

### Backend Testing
```bash
cd backend
npm run test              # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

## 🚀 Deployment

### Backend Deployment
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or your preferred platform
3. Set environment variables in production

### Web Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or your preferred platform
3. Configure environment variables

### Mobile Deployment
1. Build for production: `expo build:android` or `expo build:ios`
2. Submit to app stores
3. Configure push notifications

## 🔧 Configuration

### Environment Variables
```bash
# Database
MONGODB_URI=mongodb://localhost:27017/animalmela
MONGO_URI=mongodb://localhost:27017/animalmela

# JWT
JWT_SECRET=your-jwt-secret-key-here
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-jwt-refresh-secret-here
JWT_REFRESH_EXPIRE=30d

# AWS Configuration
AWS_BUCKET_NAME=your-bucket-name
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**AnimalMela Platform** - Connecting livestock buyers and sellers 🐄🐐🐑
