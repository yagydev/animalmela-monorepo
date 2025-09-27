# 🚀 Production Deployment Guide for kisaanmela.com

This guide will help you deploy the AnimalMela platform to production on your `kisaanmela.com` domain.

## 📋 Prerequisites

Before deploying, ensure you have:

1. **Server Requirements:**
   - Ubuntu 20.04+ or similar Linux distribution
   - 4GB+ RAM, 2+ CPU cores
   - 50GB+ storage space
   - Docker and Docker Compose installed

2. **Domain Setup:**
   - Domain `kisaanmela.com` pointing to your server IP
   - DNS A records configured:
     - `kisaanmela.com` → Your server IP
     - `www.kisaanmela.com` → Your server IP
     - `api.kisaanmela.com` → Your server IP (optional)

3. **Required Accounts:**
   - MongoDB Atlas account (or local MongoDB)
   - AWS account for S3 storage
   - Stripe account for payments
   - Email service (Gmail/SendGrid)
   - Twilio account for SMS

## 🔧 Step 1: Server Setup

### Install Docker and Docker Compose

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### Clone Repository

```bash
git clone https://github.com/yagydev/animalmela-monorepo.git
cd animalmela-monorepo
```

## ⚙️ Step 2: Environment Configuration

### Update Production Environment

Edit `.env.production` file with your actual values:

```bash
nano .env.production
```

**Critical values to update:**

```env
# Domain Configuration
DOMAIN_NAME=kisaanmela.com
FRONTEND_URL=https://kisaanmela.com
API_URL=https://api.kisaanmela.com

# Database (MongoDB Atlas recommended)
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/kisaanmela?retryWrites=true&w=majority

# JWT Secrets (generate secure random strings)
JWT_SECRET=your-super-secure-jwt-secret-32-chars-minimum
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-32-chars-minimum

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET=kisaanmela-uploads

# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable-key

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_USER=noreply@kisaanmela.com
SMTP_PASS=your-app-password

# SMS Configuration
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+1234567890
```

## 🚀 Step 3: Deploy with Docker

### Option A: Full Docker Deployment (Recommended)

```bash
# Make deployment script executable
chmod +x deploy.sh

# Deploy with Docker
./deploy.sh docker
```

### Option B: Manual Docker Commands

```bash
# Build and start all services
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d --build

# Check status
docker ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

## 🔒 Step 4: SSL Certificate Setup

The deployment automatically sets up Let's Encrypt SSL certificates. If you need to manually renew:

```bash
# Renew certificates
docker-compose -f docker-compose.prod.yml run --rm certbot renew

# Reload Nginx
docker-compose -f docker-compose.prod.yml exec nginx nginx -s reload
```

## 📊 Step 5: Verify Deployment

### Check Services

```bash
# Check all containers are running
docker ps

# Test endpoints
curl https://kisaanmela.com/health
curl https://kisaanmela.com/api/health
```

### Test Functionality

1. **Website**: Visit https://kisaanmela.com
2. **API**: Test https://kisaanmela.com/api/health
3. **Registration**: Try creating a new account
4. **Login**: Test user authentication
5. **Services**: Browse pet services
6. **Mobile**: Test mobile app connectivity

## 🔧 Step 6: Post-Deployment Configuration

### Database Setup

```bash
# Access MongoDB container
docker exec -it animall-mongodb mongosh

# Create indexes (if needed)
docker exec -it animall-backend node scripts/createIndexes.js

# Seed initial data (optional)
docker exec -it animall-backend node scripts/seed.js
```

### Monitoring Setup

```bash
# View application logs
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f web-frontend

# Monitor resource usage
docker stats
```

## 📱 Step 7: Mobile App Configuration

Update mobile app configuration to point to production:

```javascript
// mobile/src/config/api.ts
const API_BASE_URL = 'https://kisaanmela.com/api';
```

## 🔄 Step 8: Continuous Deployment

### Setup Auto-Deployment (Optional)

Create a webhook for automatic deployments:

```bash
# Create deployment webhook script
cat > webhook-deploy.sh << 'EOF'
#!/bin/bash
cd /path/to/animalmela-monorepo
git pull origin main
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d --build
EOF

chmod +x webhook-deploy.sh
```

## 🛡️ Security Checklist

- [ ] SSL certificates installed and auto-renewing
- [ ] Firewall configured (ports 80, 443, 22 only)
- [ ] Strong passwords for all services
- [ ] Regular backups configured
- [ ] Monitoring and alerts set up
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Environment variables secured

## 📈 Monitoring and Maintenance

### Regular Tasks

```bash
# Update containers
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d

# Backup database
docker exec animall-mongodb mongodump --out /backup

# Clean up old images
docker system prune -f
```

### Log Management

```bash
# Rotate logs
docker-compose -f docker-compose.prod.yml logs --tail=1000 > app.log

# Monitor disk usage
df -h
du -sh /var/lib/docker/
```

## 🆘 Troubleshooting

### Common Issues

1. **SSL Certificate Issues:**
   ```bash
   # Check certificate status
   docker-compose -f docker-compose.prod.yml logs certbot
   
   # Manual certificate generation
   docker-compose -f docker-compose.prod.yml run --rm certbot certonly --webroot --webroot-path=/var/www/certbot --email admin@kisaanmela.com --agree-tos --no-eff-email -d kisaanmela.com -d www.kisaanmela.com
   ```

2. **Database Connection Issues:**
   ```bash
   # Check MongoDB logs
   docker-compose -f docker-compose.prod.yml logs mongodb
   
   # Test connection
   docker exec -it animall-backend node -e "console.log('Testing DB connection...')"
   ```

3. **Service Not Starting:**
   ```bash
   # Check specific service logs
   docker-compose -f docker-compose.prod.yml logs [service-name]
   
   # Restart specific service
   docker-compose -f docker-compose.prod.yml restart [service-name]
   ```

## 📞 Support

For deployment issues:
1. Check logs: `docker-compose -f docker-compose.prod.yml logs -f`
2. Verify environment variables in `.env.production`
3. Ensure all external services (MongoDB, AWS, Stripe) are configured
4. Check domain DNS settings

## 🎉 Success!

Your AnimalMela platform should now be live at:
- **Website**: https://kisaanmela.com
- **API**: https://kisaanmela.com/api
- **Admin**: https://kisaanmela.com/admin

The platform includes:
- ✅ Pet services marketplace
- ✅ User authentication
- ✅ Payment processing
- ✅ Real-time messaging
- ✅ Mobile app support
- ✅ Admin dashboard
- ✅ SSL security
- ✅ Auto-scaling
- ✅ Monitoring

Welcome to your production pet services platform! 🐾
