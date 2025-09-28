# 📱 Mobile App Store Deployment Guide

## iOS App Store Deployment

### Prerequisites
- Apple Developer Account ($99/year)
- Xcode installed on macOS
- App Store Connect access

### 1. Update App Configuration
```javascript
// mobile/app.json
{
  "expo": {
    "name": "Kisaan Mela",
    "slug": "kisaan-mela",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.kisaanmela.app",
      "buildNumber": "1.0.0"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      },
      "package": "com.kisaanmela.app",
      "versionCode": 1
    },
    "extra": {
      "apiUrl": "https://api.kisaanmela.com/api",
      "webUrl": "https://kisaanmela.com"
    }
  }
}
```

### 2. Build iOS App
```bash
cd mobile

# Install EAS CLI
npm install -g @expo/eas-cli

# Login to Expo
eas login

# Configure EAS Build
eas build:configure

# Build for iOS
eas build --platform ios --profile production
```

### 3. App Store Connect Setup
1. **Create App Record**
   - Login to App Store Connect
   - Click "My Apps" → "+"
   - Fill app information:
     - Name: "Kisaan Mela"
     - Bundle ID: com.kisaanmela.app
     - SKU: kisaan-mela-ios
     - Language: English (Primary), Hindi

2. **App Information**
   - Category: Business
   - Subcategory: Agriculture
   - Content Rights: No
   - Age Rating: 4+ (No Restricted Content)

3. **Pricing and Availability**
   - Price: Free
   - Availability: India (primary), Global (optional)

4. **App Store Listing**
   ```
   App Name: Kisaan Mela - Livestock Marketplace
   
   Subtitle: Buy & Sell Cattle, Poultry, Goats
   
   Description:
   Kisaan Mela is India's premier digital livestock marketplace connecting farmers, buyers, and service providers. Buy and sell cattle, poultry, goats, sheep, and access veterinary services, transport, and insurance.
   
   Features:
   • Browse livestock by category and location
   • Direct chat with sellers
   • Secure payment processing
   • Veterinary service booking
   • Transport arrangement
   • Insurance services
   • Real-time notifications
   
   Keywords: livestock, cattle, farming, agriculture, marketplace, animals, veterinary, transport
   
   Support URL: https://kisaanmela.com/support
   Marketing URL: https://kisaanmela.com
   ```

### 4. Upload Build
```bash
# After EAS build completes, download IPA
# Upload to App Store Connect via Xcode or Transporter app
```

## Google Play Store Deployment

### Prerequisites
- Google Play Console Account ($25 one-time fee)
- Google Developer Account

### 1. Build Android App
```bash
cd mobile

# Build for Android
eas build --platform android --profile production

# Or build APK locally
npx expo build:android --release-channel production
```

### 2. Google Play Console Setup
1. **Create Application**
   - Login to Google Play Console
   - Click "Create app"
   - App details:
     - App name: "Kisaan Mela"
     - Default language: English (India)
     - App or game: App
     - Free or paid: Free

2. **Store Listing**
   ```
   App name: Kisaan Mela - Livestock Marketplace
   
   Short description:
   India's digital livestock marketplace. Buy & sell cattle, poultry, goats. Access veterinary services.
   
   Full description:
   Kisaan Mela revolutionizes livestock trading in India by connecting farmers, buyers, and service providers on a single digital platform.
   
   🐄 LIVESTOCK MARKETPLACE
   • Buy and sell cattle, buffaloes, cows, bulls
   • Poultry trading - chickens, ducks, turkeys
   • Goat and sheep marketplace
   • Browse by breed, age, price, location
   
   💬 DIRECT COMMUNICATION
   • Chat directly with sellers
   • Share photos and videos
   • Negotiate prices
   • Schedule farm visits
   
   💳 SECURE TRANSACTIONS
   • Safe payment processing
   • Escrow protection
   • Multiple payment methods
   • Transaction history
   
   🚚 COMPREHENSIVE SERVICES
   • Veterinary consultations
   • Animal transport booking
   • Livestock insurance
   • Breeding services
   • Feed and nutrition advice
   
   📍 LOCATION-BASED SEARCH
   • Find livestock near you
   • Filter by distance
   • Local market prices
   • Regional breed preferences
   
   🔔 SMART NOTIFICATIONS
   • New listings alerts
   • Price drop notifications
   • Service reminders
   • Chat messages
   
   Join thousands of farmers already using Kisaan Mela to grow their livestock business!
   
   Category: Business
   Tags: livestock, cattle, farming, agriculture, marketplace, animals, veterinary
   ```

3. **Content Rating**
   - Target audience: General audience
   - Content: No sensitive content
   - Rating: Everyone

4. **App Content**
   - Privacy Policy: https://kisaanmela.com/privacy
   - Target audience: 18+ (business app)
   - Ads: No ads initially
   - In-app purchases: No

### 3. Upload APK/AAB
```bash
# Upload the built APK/AAB file to Google Play Console
# Go to Release → Production → Create new release
```

## App Store Assets Required

### iOS App Store
**Screenshots (Required for each device type):**
- iPhone 6.7": 1290 x 2796 pixels (3 required)
- iPhone 6.5": 1242 x 2688 pixels (3 required)  
- iPhone 5.5": 1242 x 2208 pixels (3 required)
- iPad Pro 12.9": 2048 x 2732 pixels (3 required)

**App Icon:**
- 1024 x 1024 pixels (PNG, no transparency)

### Google Play Store
**Screenshots:**
- Phone: 1080 x 1920 pixels minimum (2-8 screenshots)
- 7-inch tablet: 1200 x 1920 pixels (optional)
- 10-inch tablet: 1800 x 2560 pixels (optional)

**App Icon:**
- 512 x 512 pixels (PNG, 32-bit)

**Feature Graphic:**
- 1024 x 500 pixels (JPG or PNG, no transparency)

## App Store Optimization (ASO)

### Keywords Strategy
**Primary Keywords:**
- livestock marketplace
- cattle trading
- animal farming
- agriculture app
- livestock business

**Secondary Keywords:**
- cow trading
- goat marketplace  
- poultry business
- veterinary services
- farm animals

### Localization (India Market)
**Hindi Translations:**
- App Name: किसान मेला - पशुधन बाज़ार
- Description: भारत का डिजिटल पशुधन बाज़ार

**Regional Languages:**
- Tamil, Telugu, Gujarati, Marathi, Bengali

## Launch Strategy

### Soft Launch (Week 1-2)
1. **Limited Release**
   - Release in 2-3 states initially
   - Monitor user feedback
   - Fix critical issues

2. **Beta Testing**
   - Invite 100-200 farmers
   - Collect feedback via in-app surveys
   - Iterate based on feedback

### Full Launch (Week 3-4)
1. **National Release**
   - Release across India
   - Press release and media outreach
   - Social media campaign

2. **Marketing Push**
   - Influencer partnerships with farming YouTubers
   - Agricultural fair demonstrations
   - Farmer cooperative partnerships

## Post-Launch Monitoring

### Key Metrics to Track
- **Downloads**: Daily/weekly install rates
- **Retention**: Day 1, 7, 30 retention rates
- **Ratings**: Maintain 4.0+ rating
- **Reviews**: Respond to all reviews within 24 hours
- **Crashes**: Keep crash rate below 1%

### Update Schedule
- **Bug fixes**: Weekly if needed
- **Feature updates**: Monthly
- **Major releases**: Quarterly

### App Store Compliance
- **Privacy Policy**: Keep updated with data practices
- **Terms of Service**: Clear user agreements
- **Content Guidelines**: Follow platform policies
- **Age Rating**: Maintain appropriate rating

## Success Metrics

### Month 1 Goals
- 1,000+ downloads
- 4.0+ rating on both stores
- 50+ active listings
- 100+ registered farmers

### Month 3 Goals  
- 10,000+ downloads
- 4.2+ rating
- 500+ active listings
- 1,000+ registered users
- 100+ successful transactions

### Month 6 Goals
- 50,000+ downloads
- 4.5+ rating
- 2,000+ active listings
- 5,000+ registered users
- 1,000+ successful transactions

## Support & Maintenance

### Customer Support
- **In-app support**: Chat/ticket system
- **Email**: support@kisaanmela.com
- **Phone**: +91-XXXX-XXXX (business hours)
- **WhatsApp**: Business account for quick queries

### Regular Updates
- **Security patches**: Monthly
- **Feature enhancements**: Based on user feedback
- **Performance optimization**: Ongoing
- **Bug fixes**: As needed

Your mobile apps are now ready to revolutionize livestock trading in India! 🇮🇳🐄📱
