# 🐄 Pashu Marketplace Mobile App

A comprehensive React Native mobile application for livestock trading, connecting buyers, sellers, and service partners in the agricultural ecosystem.

## 🚀 Features

### 🔐 Authentication
- **Mobile OTP Login**: Secure phone number verification
- **Profile Setup**: Role-based onboarding (Buyer, Seller, Service Partner)
- **KYC Integration**: Document verification for sellers
- **JWT Token Management**: Secure authentication with AsyncStorage

### 🐄 Buyer Features
- **Discover Listings**: Browse livestock with advanced filters
- **Search & Filter**: By species, breed, price, location, verification status
- **Listing Details**: Complete animal information with media gallery
- **Contact Options**: Call, WhatsApp, in-app chat
- **Booking System**: Advance payment with Razorpay integration
- **Transport Requests**: Integrated transport service booking
- **Wishlist**: Save favorite listings
- **Order Management**: Track bookings and receipts

### 👨‍🌾 Seller Features
- **Onboarding & KYC**: Mobile OTP, document upload, farm location
- **Create Listings**: Detailed livestock information with media
- **Manage Listings**: Edit, pause, mark sold, promote listings
- **Lead Management**: Handle inquiries and bookings
- **Transport Integration**: Coordinate livestock transport
- **Analytics**: Track listing performance

### 🚚 Service Partners
- **Transporter**: Profile setup, radius configuration, pricing
- **Veterinarian**: Consultation booking, health certificates
- **Insurance Provider**: Quote generation, policy management

### 💬 Communication
- **In-app Chat**: Text, images, location sharing
- **Spam Protection**: Report and block users
- **Real-time Messaging**: Instant communication

### 💳 Payments
- **Razorpay Integration**: Secure payment processing
- **Advance Payments**: Booking confirmations
- **Receipt Management**: Digital invoices and receipts

### 🔔 Notifications
- **FCM Push Notifications**: Real-time updates
- **SMS Integration**: Important alerts
- **WhatsApp Integration**: Order updates
- **Email Notifications**: Comprehensive communication

## 🛠 Tech Stack

- **React Native**: 0.72.6 (RN CLI, not Expo)
- **TypeScript**: Full type safety
- **React Navigation**: Stack + Bottom Tab navigation
- **NativeWind**: Tailwind CSS for React Native
- **AsyncStorage**: JWT token storage
- **Axios**: API communication
- **React Query**: Data fetching and caching
- **React Hook Form**: Form management
- **Razorpay SDK**: Payment processing
- **Firebase**: Push notifications (FCM)
- **Google Maps**: Location services
- **React Native Image Picker**: Media handling

## 📱 Installation & Setup

### Prerequisites

1. **Node.js** (v16 or higher)
2. **React Native CLI**: `npm install -g react-native-cli`
3. **Android Studio** (for Android development)
4. **Xcode** (for iOS development - macOS only)
5. **Java Development Kit (JDK)**: Version 11 or higher

### 1. Clone and Install Dependencies

```bash
cd animall-monorepo/mobile
npm install
```

### 2. Install Required Native Dependencies

```bash
# For Android
cd android && ./gradlew clean && cd ..

# For iOS (macOS only)
cd ios && pod install && cd ..
```

### 3. Environment Configuration

Create a `.env` file in the mobile directory:

```bash
cp env.example .env
```

Update the `.env` file with your configuration:

```env
# API Configuration
API_BASE_URL=http://localhost:5001/api

# Firebase Configuration (for FCM)
FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:android:abcdef123456

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# Google Maps API Key
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### 4. Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication and Cloud Messaging
3. Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
4. Place them in the appropriate directories:
   - Android: `android/app/google-services.json`
   - iOS: `ios/GoogleService-Info.plist`

### 5. Google Maps Setup

1. Get API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Maps SDK for Android/iOS
3. Add API key to your `.env` file

## 🏃‍♂️ Running the App

### Start Metro Bundler

```bash
npm start
# or
npx react-native start --port=8082
```

### Run on Android

```bash
# Make sure Android emulator is running or device is connected
npx react-native run-android --port=8082
```

### Run on iOS (macOS only)

```bash
# Make sure iOS Simulator is running
npx react-native run-ios
```

## 📁 Project Structure

```
src/
├── api/                    # API service wrappers
│   ├── auth.ts            # Authentication API
│   ├── listings.ts        # Listings API
│   ├── orders.ts          # Orders API
│   ├── chat.ts            # Chat API
│   ├── payments.ts        # Payments API
│   └── services.ts        # Services API
├── components/            # Shared UI components
│   ├── common/            # Common components
│   ├── forms/             # Form components
│   └── ui/                # UI components
├── screens/               # Screen components
│   ├── auth/              # Authentication screens
│   ├── buyer/             # Buyer-specific screens
│   ├── seller/            # Seller-specific screens
│   ├── service/           # Service partner screens
│   └── shared/            # Shared screens
├── navigation/            # Navigation configuration
│   ├── AuthStack.tsx      # Authentication stack
│   ├── MainTabs.tsx       # Main tab navigation
│   └── AppNavigator.tsx   # Root navigator
├── context/               # React Context providers
│   └── AuthContext.tsx    # Authentication context
├── utils/                 # Utility functions
│   ├── constants.ts       # App constants
│   ├── validators.ts      # Form validators
│   └── formatters.ts      # Data formatters
├── types/                 # TypeScript type definitions
│   └── index.ts           # Main types
└── assets/                # Images, icons, fonts
    ├── images/
    ├── icons/
    └── fonts/
```

## 🔧 Development

### Code Style

- Use TypeScript for all components
- Follow React Native best practices
- Use functional components with hooks
- Implement proper error handling
- Use NativeWind for styling

### Component Structure

```typescript
interface ComponentProps {
  // Define props interface
}

const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Component logic
  return (
    // JSX with NativeWind classes
  );
};

export default Component;
```

### API Integration

All API calls are centralized in the `/api` directory:

```typescript
import ListingsAPI from '@/api/listings';

// Get listings
const listings = await ListingsAPI.getListings(filters);

// Create listing
const newListing = await ListingsAPI.createListing(listingData);
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🚀 Building for Production

### Android

```bash
# Generate signed APK
cd android
./gradlew assembleRelease

# Generate AAB for Play Store
./gradlew bundleRelease
```

### iOS

```bash
# Build for iOS
npx react-native run-ios --configuration Release
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based auth
- **Input Validation**: All forms validated
- **Secure Storage**: Sensitive data encrypted
- **HTTPS API**: Secure network communication
- **OTP Verification**: Phone number verification

## 📊 Performance

- **Optimized Images**: Lazy loading and compression
- **Efficient Navigation**: Stack and tab navigation
- **Memory Management**: Proper cleanup and optimization
- **Network Optimization**: Efficient API calls with caching

## 🐛 Troubleshooting

### Common Issues

1. **Metro bundler issues**:
   ```bash
   npx react-native start --reset-cache
   ```

2. **Android build issues**:
   ```bash
   cd android
   ./gradlew clean
   cd ..
   npx react-native run-android
   ```

3. **iOS build issues**:
   ```bash
   cd ios
   pod install
   cd ..
   npx react-native run-ios
   ```

4. **Node modules issues**:
   ```bash
   rm -rf node_modules
   npm install
   ```

### Environment Setup

#### Android
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

#### iOS
- Install Xcode from App Store
- Install Xcode Command Line Tools
- Install CocoaPods: `sudo gem install cocoapods`

## 📈 Features Roadmap

- [ ] **Advanced Search**: AI-powered livestock matching
- [ ] **Video Calls**: Direct seller-buyer communication
- [ ] **Livestock Tracking**: GPS tracking for transport
- [ ] **Health Monitoring**: IoT integration for livestock health
- [ ] **Market Analytics**: Price trends and market insights
- [ ] **Multi-language**: Support for regional languages
- [ ] **Offline Mode**: Offline browsing and sync

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Happy coding! 🐄✨**