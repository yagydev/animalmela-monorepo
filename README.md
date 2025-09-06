# AnimalMela Platform - Monorepo

A comprehensive pet services platform built with Next.js, React Native, and MongoDB. This monorepo contains the backend API, web frontend, mobile app, and shared code.

## 🏗️ Project Structure

```
animall-monorepo/
│
├── backend/                  # Next.js backend API (Node + MongoDB)
│   ├── pages/api/            # API routes (auth, services, pets, etc.)
│   ├── models/               # Mongoose models
│   ├── lib/                  # DB connection utils
│   ├── middleware/           # JWT auth middleware
│   ├── package.json
│   └── next.config.js
│
├── web-frontend/             # Next.js web frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Pages (Login, Register, Dashboard, etc.)
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
│   ├── App.js
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

4. **Start development servers**
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
  - JWT Authentication
  - MongoDB with Mongoose
  - RESTful API endpoints
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

## 🔧 Development

### Available Scripts

#### Root Level
```bash
npm run dev              # Start backend + web frontend
npm run build            # Build all applications
npm run test             # Run all tests
npm run lint             # Lint all code
npm run clean            # Clean all node_modules
```

#### Backend
```bash
cd backend
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
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

### Services Endpoints
- `GET /api/services` - List services with filtering
- `POST /api/services` - Create service (Service Provider)
- `GET /api/services/:id` - Get service details
- `PUT /api/services/:id` - Update service (Owner/Admin)
- `DELETE /api/services/:id` - Delete service (Owner/Admin)
- `GET /api/services/types` - Get service types
- `POST /api/services/:id/photos` - Upload service photos

### Pets Endpoints
- `GET /api/pets` - List pets with filtering
- `POST /api/pets` - Create pet (Authenticated)
- `GET /api/pets/:id` - Get pet details
- `PUT /api/pets/:id` - Update pet (Owner/Admin)
- `DELETE /api/pets/:id` - Delete pet (Owner/Admin)
- `GET /api/pets/species` - Get pet species
- `POST /api/pets/:id/photos` - Upload pet photos
- `POST /api/pets/:id/vaccinations` - Add vaccination
- `PUT /api/pets/:id/vaccinations/:vaccinationId` - Update vaccination
- `DELETE /api/pets/:id/vaccinations/:vaccinationId` - Delete vaccination

### Example API Usage

```javascript
// Register a new user
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'pet_owner'
  })
});

// Create a service
const serviceResponse = await fetch('/api/services', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-jwt-token'
  },
  body: JSON.stringify({
    title: 'Professional Pet Sitting',
    description: 'In-home pet sitting with 24/7 care',
    serviceType: 'pet_sitting',
    price: 45,
    currency: 'USD',
    features: ['24/7 supervision', 'Daily updates']
  })
});
```

## 🗄️ Database Schema

### Users Collection
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
  user_type: Enum ['pet_owner', 'service_provider', 'breeder', 'admin'],
  verified: Boolean,
  email_verified: Boolean,
  phone_verified: Boolean,
  preferences: Object,
  stripe_customer_id: String,
  stripe_account_id: String,
  last_login: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Services Collection
```javascript
{
  _id: ObjectId,
  provider_id: ObjectId (ref: User),
  title: String,
  description: String,
  service_type: Enum [...],
  price: Number,
  currency: String,
  location: {
    lat: Number,
    lng: Number,
    address: String
  },
  availability: Object,
  service_areas: [String],
  verified: Boolean,
  active: Boolean,
  requirements: Object,
  photos: [String],
  features: [String],
  policies: Object,
  included: [String],
  not_included: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Pets Collection
```javascript
{
  _id: ObjectId,
  owner_id: ObjectId (ref: User),
  name: String,
  species: Enum [...],
  breed: String,
  age: Number,
  weight: Number,
  gender: Enum ['male', 'female', 'unknown'],
  color: String,
  neutered: Boolean,
  description: String,
  medical_notes: String,
  special_needs: [String],
  vaccinations: [{
    name: String,
    date: Date,
    next_due: Date
  }],
  health_info: Object,
  behavior_traits: Object,
  photos: [String],
  gallery: [String],
  emergency_contact: Object,
  vet_info: Object,
  available_for_adoption: Boolean,
  adoption_fee: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Authentication

The platform uses JWT-based authentication with the following flow:

1. **Registration/Login**: User provides credentials
2. **Token Generation**: Server generates JWT access token and refresh token
3. **Token Storage**: Client stores tokens securely
4. **API Requests**: Client includes token in Authorization header
5. **Token Validation**: Server validates token on protected routes

### Token Structure
```javascript
{
  id: "user_id",
  iat: 1234567890,
  exp: 1234567890
}
```

## 🎨 UI Components

### Web Frontend Components
- `Header` - Navigation with user menu
- `Footer` - Site footer with links
- `PetModal` - Add/Edit pet form
- `ServiceCard` - Service display card
- `PetCard` - Pet display card
- `AuthProvider` - Authentication context
- `ThemeProvider` - Theme management

### Mobile Components
- `TabBarIcon` - Navigation tab icons
- `Header` - Mobile navigation header
- `PetCard` - Mobile pet display
- `ServiceCard` - Mobile service display

## 📱 Mobile Features

- **Cross-platform**: Works on iOS and Android
- **Offline Support**: Cached data for offline viewing
- **Push Notifications**: Real-time updates
- **Camera Integration**: Photo capture for pets/services
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

- **v1.0.0** - Initial release with basic CRUD operations
- **v1.1.0** - Added authentication and authorization
- **v1.2.0** - Added file upload support
- **v1.3.0** - Added mobile app
- **v1.4.0** - Added advanced filtering and search
- **v1.5.0** - Added booking and review system

---

**AnimalMela Platform** - Connecting pet owners with trusted service providers 🐾
# animalmela-monorepo
