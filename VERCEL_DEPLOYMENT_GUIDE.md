# Vercel Deployment Guide for Kisaanmela

## 🚀 Quick Deployment Steps

### 1. Prerequisites
- GitHub repository connected to Vercel
- MongoDB Atlas account (for production database)
- Required API keys (Google Maps, OpenWeather, Razorpay)

### 2. Environment Variables Setup
In your Vercel dashboard, add these environment variables:

#### Required Variables:
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kisaanmela
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
JWT_SECRET=your_jwt_secret_key_for_production
```

#### Optional Variables:
```
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
WHATSAPP_PHONE_NUMBER=+919876543210
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

### 3. Deployment Configuration
The project is configured with:
- **Node.js Version**: 18.x (Vercel compatible)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Framework**: Next.js
- **Region**: Mumbai (bom1)

### 4. Database Setup
1. Create a MongoDB Atlas cluster
2. Create a database named `kisaanmela`
3. Add your MongoDB URI to environment variables
4. Run the seed script to populate initial data:
   ```bash
   npm run seed
   ```

### 5. API Keys Setup
1. **Google Maps API**:
   - Enable Maps JavaScript API
   - Enable Directions API
   - Add your domain to allowed origins

2. **OpenWeather API**:
   - Sign up at openweathermap.org
   - Get your API key
   - Add to environment variables

3. **Razorpay** (for payments):
   - Create Razorpay account
   - Get API keys from dashboard
   - Add to environment variables

### 6. Deployment Process
1. Push code to main branch
2. Vercel will automatically deploy
3. Check deployment logs for any issues
4. Test all functionality on production

### 7. Post-Deployment Checklist
- [ ] Test navigation and all pages
- [ ] Verify API endpoints are working
- [ ] Check database connectivity
- [ ] Test payment integration (if enabled)
- [ ] Verify Google Maps integration
- [ ] Test weather widget
- [ ] Check mobile responsiveness

### 8. Troubleshooting
- **Build Failures**: Check Node.js version compatibility
- **API Errors**: Verify environment variables
- **Database Issues**: Check MongoDB connection string
- **Map Issues**: Verify Google Maps API key and domain settings

### 9. Performance Optimization
- Enable Vercel Analytics
- Configure CDN settings
- Optimize images and assets
- Monitor Core Web Vitals

### 10. Security Considerations
- Use strong JWT secrets
- Enable HTTPS only
- Configure CORS properly
- Regular security updates

## 📞 Support
For deployment issues, check:
1. Vercel deployment logs
2. Environment variables configuration
3. API key permissions
4. Database connectivity

---
**Last Updated**: October 2024
**Version**: 1.0.0
