# Animall Platform - Enhanced Marketplace Monorepo 🐾

A comprehensive pet services platform with integrated marketplace functionality, built with Next.js, React Native, and MongoDB. This monorepo contains the backend API, web frontend, mobile app, and shared code for both pet services and marketplace features.

## 🏗️ Enhanced Project Structure

```
animall-monorepo/
│
├── backend/                  # Next.js backend API (Node + MongoDB)
│   ├── pages/api/            # API routes (auth, services, pets, listings, orders)
│   │   ├── auth/[...auth].ts
│   │   ├── services/[...services].ts
│   │   ├── pets/[...pets].ts
│   │   ├── listings/[...listings].ts  # NEW: Marketplace listings
│   │   └── orders/[...orders].ts      # NEW: Order management
│   ├── models/               # Mongoose models (enhanced with marketplace)
│   ├── lib/                  # DB connection utils
│   ├── middleware/           # JWT auth middleware
│   ├── scripts/              # Database seeding
│   └── package.json
│
├── web-frontend/             # Next.js web frontend
│   ├── src/app/
│   │   ├── services/         # Pet services pages
│   │   ├── pets/            # Pet management pages
│   │   ├── marketplace/     # NEW: Marketplace pages
│   │   │   ├── page.tsx     # Marketplace listing
│   │   │   └── [id]/page.tsx # Listing details
│   │   └── admin/           # Admin dashboard
│   ├── components/          # Reusable UI components
│   └── package.json
│
├── mobile/                   # React Native mobile app
│   ├── src/
│   │   ├── screens/
│   │   │   ├── ServicesScreen.tsx
│   │   │   ├── PetsScreen.tsx
│   │   │   ├── MarketplaceScreen.tsx    # NEW: Marketplace
│   │   │   └── ListingDetailScreen.tsx  # NEW: Listing details
│   │   ├── navigation/       # React Navigation setup
│   │   ├── services/         # API calls
│   │   └── store/            # State management
│   └── package.json
│
├── shared/                   # Shared code for web + mobile + backend
│   ├── constants/           # API endpoints, enums, marketplace constants
│   ├── helpers/             # Utility functions
│   ├── validations/         # Input validation (Joi)
│   └── api-schema/          # TypeScript types and interfaces
│
├── env.example              # Environment variables template
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
   git clone <repository-url>
   cd animall-monorepo
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Seed the database**
   ```bash
   cd backend
   npm run seed
   ```

5. **Start development servers**
   ```bash
   # Start both backend and web frontend
   npm run dev
   
   # Or start individually
   npm run dev:backend    # Backend on port 5000
   npm run dev:web        # Web frontend on port 3000
   npm run dev:mobile     # Mobile app (Expo)
   ```

## 📱 Applications

### Backend API (Port 5000)
- **URL**: http://localhost:5000
- **API Docs**: http://localhost:5000/api
- **Features**:
  - JWT Authentication with role-based access
  - MongoDB with Mongoose
  - RESTful API endpoints
  - Pet Services CRUD operations
  - Marketplace listings and orders
  - File upload support
  - Rate limiting and CORS

### Web Frontend (Port 3000)
- **URL**: http://localhost:3000
- **Features**:
  - Next.js with TypeScript
  - Tailwind CSS styling
  - Responsive design
  - Pet services management
  - Marketplace browsing and selling
  - State management with Zustand
  - React Query for data fetching

### Mobile App
- **Platform**: React Native with Expo
- **Features**:
  - Cross-platform (iOS/Android)
  - Pet services booking
  - Marketplace browsing
  - Native navigation
  - Camera integration
  - Push notifications

## 🛒 Marketplace Features

### For Buyers
- **Browse Listings**: Search and filter by category, price, location
- **Product Details**: View specifications, seller info, reviews
- **Order Management**: Place orders, track shipments
- **Reviews**: Rate and review purchases
- **Favorites**: Save listings for later

### For Sellers
- **Create Listings**: Add products with images and descriptions
- **Inventory Management**: Track stock levels
- **Order Processing**: Manage incoming orders
- **Analytics**: View sales performance
- **KYC Verification**: Business verification process

### Categories
- **Pets**: Live animals for sale
- **Pet Food**: Food and treats
- **Pet Toys**: Toys and entertainment
- **Pet Accessories**: Collars, leashes, carriers
- **Pet Health**: Medications and supplements
- **Pet Grooming**: Grooming supplies
- **Pet Training**: Training aids
- **Pet Services**: Service bookings

## 🔧 Development

### Available Scripts

#### Root Level
```bash
npm run dev              # Start backend + web frontend
npm run build            # Build all applications
npm run test             # Run all tests
npm run lint             # Lint all code
npm run clean            # Clean all node_modules
npm run seed             # Seed database with sample data
```

#### Backend
```bash
cd backend
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run seed             # Seed database
npm run test             # Run tests
npm run lint             # Lint code
```

#### Web Frontend
```bash
cd web-frontend
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run test             # Run tests
npm run lint             # Lint code
```

#### Mobile
```bash
cd mobile
npm run start            # Start Expo development server
npm run android          # Run on Android
npm run ios              # Run on iOS
npm run web              # Run on web
npm run test             # Run tests
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Pet Services Endpoints
- `GET /api/services` - List services with filtering
- `POST /api/services` - Create service (Service Provider)
- `GET /api/services/:id` - Get service details
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service
- `GET /api/services/types` - Get service types

### Pet Management Endpoints
- `GET /api/pets` - List pets with filtering
- `POST /api/pets` - Create pet
- `GET /api/pets/:id` - Get pet details
- `PUT /api/pets/:id` - Update pet
- `DELETE /api/pets/:id` - Delete pet
- `GET /api/pets/species` - Get pet species

### Marketplace Endpoints
- `GET /api/listings` - List marketplace items
- `POST /api/listings` - Create listing (Seller)
- `GET /api/listings/:id` - Get listing details
- `PUT /api/listings/:id` - Update listing
- `DELETE /api/listings/:id` - Delete listing
- `GET /api/listings/categories` - Get categories

### Order Management Endpoints
- `GET /api/orders` - List orders (Buyer/Seller)
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id` - Update order status
- `GET /api/orders/buyer/:buyerId` - Buyer's orders
- `GET /api/orders/seller/:sellerId` - Seller's orders

### Example API Usage

```javascript
// Register a seller
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike@example.com',
    password: 'password123',
    role: 'seller'
  })
});

// Create a marketplace listing
const listingResponse = await fetch('/api/listings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-jwt-token'
  },
  body: JSON.stringify({
    title: 'Premium Dog Food',
    description: 'High-quality dry dog food',
    category: 'pet_food',
    price: 45.99,
    condition: 'new',
    quantity: 50,
    images: ['image-url-1', 'image-url-2']
  })
});

// Place an order
const orderResponse = await fetch('/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-jwt-token'
  },
  body: JSON.stringify({
    listingId: 'listing-id',
    quantity: 2,
    paymentMethod: 'online',
    shippingAddress: {
      name: 'John Doe',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      pincode: '10001'
    }
  })
});
```

## 🗄️ Database Schema

### Enhanced User Schema
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  name: String,
  email: String (unique),
  password_hash: String,
  phone: String,
  avatar_url: String,
  user_type: Enum ['pet_owner', 'service_provider', 'breeder', 'admin', 'seller', 'buyer'],
  verified: Boolean,
  email_verified: Boolean,
  phone_verified: Boolean,
  // NEW: Marketplace fields
  kyc_status: Enum ['pending', 'verified', 'rejected'],
  kyc_documents: Object,
  location: Object,
  business_info: Object,
  preferences: Object,
  stripe_customer_id: String,
  stripe_account_id: String,
  last_login: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### NEW: Listing Schema
```javascript
{
  _id: ObjectId,
  seller_id: ObjectId (ref: User),
  title: String,
  description: String,
  category: Enum [...],
  subcategory: String,
  price: Number,
  currency: String,
  condition: Enum ['new', 'like_new', 'good', 'fair', 'poor'],
  quantity: Number,
  images: [String],
  tags: [String],
  location: Object,
  shipping_info: Object,
  status: Enum ['draft', 'active', 'sold', 'inactive', 'removed'],
  featured: Boolean,
  views: Number,
  likes: Number,
  verified: Boolean,
  payment_methods: [String],
  return_policy: String,
  warranty: String,
  specifications: Object,
  createdAt: Date,
  updatedAt: Date
}
```

### NEW: Order Schema
```javascript
{
  _id: ObjectId,
  buyer_id: ObjectId (ref: User),
  seller_id: ObjectId (ref: User),
  listing_id: ObjectId (ref: Listing),
  quantity: Number,
  total_amount: Number,
  shipping_cost: Number,
  status: Enum ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded'],
  payment_status: Enum ['pending', 'paid', 'failed', 'refunded'],
  payment_method: String,
  shipping_address: Object,
  tracking_info: Object,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Authentication & Authorization

The platform uses JWT-based authentication with role-based access control:

### User Roles
- **pet_owner**: Can book services, manage pets
- **service_provider**: Can create services, manage bookings
- **breeder**: Can sell pets, manage breeding records
- **seller**: Can create marketplace listings, manage orders
- **buyer**: Can purchase from marketplace
- **admin**: Full system access

### Authentication Flow
1. **Registration/Login**: User provides credentials
2. **Token Generation**: Server generates JWT access token
3. **Token Storage**: Client stores token securely
4. **API Requests**: Client includes token in Authorization header
5. **Token Validation**: Server validates token on protected routes

## 🎨 UI Components

### Web Frontend Components
- `Header` - Navigation with user menu
- `Footer` - Site footer with links
- `PetModal` - Add/Edit pet form
- `ServiceCard` - Service display card
- `PetCard` - Pet display card
- `ListingCard` - Marketplace listing card
- `OrderCard` - Order display card
- `AuthProvider` - Authentication context
- `ThemeProvider` - Theme management

### Mobile Components
- `TabBarIcon` - Navigation tab icons
- `Header` - Mobile navigation header
- `PetCard` - Mobile pet display
- `ServiceCard` - Mobile service display
- `ListingCard` - Mobile marketplace listing
- `OrderCard` - Mobile order display

## 📱 Mobile Features

- **Cross-platform**: Works on iOS and Android
- **Pet Services**: Book services, manage pets
- **Marketplace**: Browse and purchase items
- **Offline Support**: Cached data for offline viewing
- **Push Notifications**: Real-time updates
- **Camera Integration**: Photo capture for listings
- **Location Services**: GPS-based service discovery
- **Biometric Auth**: Fingerprint/Face ID support

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm run test              # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

### Web Frontend Testing
```bash
cd web-frontend
npm run test              # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

### Mobile Testing
```bash
cd mobile
npm run test              # Run all tests
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
DATABASE_URL=mongodb://localhost:27017/animall_db

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d

# API
API_URL=http://localhost:5000/api
PORT=5000

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_WEB_URL=http://localhost:3000

# AWS (for file uploads)
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_S3_BUCKET=your-bucket

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-password

# Payment (Stripe)
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
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

## 🔄 Version History

- **v1.0.0** - Initial release with pet services
- **v1.1.0** - Added authentication and authorization
- **v1.2.0** - Added file upload support
- **v1.3.0** - Added mobile app
- **v1.4.0** - Added advanced filtering and search
- **v1.5.0** - Added booking and review system
- **v2.0.0** - Added marketplace functionality with listings and orders

## 🎯 Sample Accounts

After running `npm run seed`, you can use these accounts:

- **Pet Owner**: john@example.com / password123
- **Service Provider**: jane@example.com / password123
- **Seller**: mike@example.com / password123
- **Breeder**: sarah@example.com / password123
- **Admin**: admin@example.com / admin123

---

**Animall Platform** - Your complete pet services and marketplace solution 🐾

Connecting pet owners with trusted service providers and sellers for all their pet needs!
