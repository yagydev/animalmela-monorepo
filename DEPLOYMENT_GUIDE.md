# Kisaan Mela Production Deployment Guide

## 🚀 Quick Start

Deploy your Kisaan Mela platform to production in 3 simple steps:

```bash
# 1. Setup environment
./setup-kisaanmela-env.sh

# 2. Deploy to production
./deploy-kisaanmela.sh

# 3. Access your platform
# Website: https://kisaanmela.com
# API: https://api.kisaanmela.com
```

## 📋 Prerequisites

### Server Requirements
- **OS**: Ubuntu 20.04+ or CentOS 8+
- **RAM**: Minimum 4GB (8GB+ recommended)
- **Storage**: 50GB+ SSD
- **CPU**: 2+ cores
- **Network**: Static IP address

### Software Requirements
- Docker 20.10+
- Docker Compose 2.0+
- Git
- OpenSSL (for SSL certificates)

### Domain Setup
Configure these DNS records for your domain `kisaanmela.com`:

```
A     kisaanmela.com        → YOUR_SERVER_IP
A     www.kisaanmela.com    → YOUR_SERVER_IP
A     api.kisaanmela.com    → YOUR_SERVER_IP
```

## 🔧 Installation

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/animall-monorepo.git
cd animall-monorepo
```

### 2. Install Docker

**Ubuntu/Debian:**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

**CentOS/RHEL:**
```bash
sudo yum install -y docker docker-compose
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
```

### 3. Configure Environment

Run the interactive setup wizard:

```bash
./setup-kisaanmela-env.sh
```

This will guide you through:
- Database configuration (MongoDB Atlas or local)
- AWS S3 setup for file storage
- Email configuration (SMTP)
- Payment setup (Stripe)
- SMS configuration (Twilio)

### 4. Deploy Application

```bash
./deploy-kisaanmela.sh
```

The deployment script will:
- Setup SSL certificates (Let's Encrypt or self-signed)
- Initialize MongoDB with proper schemas and indexes
- Build and start all Docker containers
- Configure Nginx reverse proxy
- Perform health checks

## 🔐 SSL Certificate Setup

### Option 1: Let's Encrypt (Recommended)

The deployment script will automatically setup Let's Encrypt certificates:

```bash
./deploy-kisaanmela.sh ssl
```

### Option 2: Custom SSL Certificates

Place your certificates in the `ssl/` directory:

```bash
ssl/
├── kisaanmela.com.crt    # Certificate file
└── kisaanmela.com.key    # Private key file
```

### Option 3: Self-Signed (Development Only)

For testing purposes only:

```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/kisaanmela.com.key \
  -out ssl/kisaanmela.com.crt \
  -subj "/C=IN/ST=State/L=City/O=KisaanMela/CN=kisaanmela.com"
```

## 🗄️ Database Configuration

### MongoDB Atlas (Recommended)

1. Create account at [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a new cluster
3. Get connection string
4. Update `env.production` with your connection string

### Local MongoDB

The deployment uses Docker MongoDB with automatic initialization:

- Database: `kisaanmela_prod`
- Collections: users, listings, orders, chats, services, payments, reviews
- Indexes: Optimized for performance
- Default admin: `admin@kisaanmela.com`

## ☁️ External Services Setup

### AWS S3 (File Storage)

1. Create AWS account
2. Create S3 bucket: `kisaanmela-uploads`
3. Create IAM user with S3 permissions
4. Update environment variables:
   ```
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_S3_BUCKET=kisaanmela-uploads
   ```

### Stripe (Payments)

1. Create Stripe account
2. Get API keys from dashboard
3. Update environment variables:
   ```
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

### Twilio (SMS)

1. Create Twilio account
2. Get phone number and credentials
3. Update environment variables:
   ```
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=your_phone_number
   ```

## 🔧 Management Commands

### View Logs
```bash
./deploy-kisaanmela.sh logs
```

### Restart Services
```bash
./deploy-kisaanmela.sh restart
```

### Stop Services
```bash
./deploy-kisaanmela.sh stop
```

### Update Application
```bash
git pull origin main
./deploy-kisaanmela.sh
```

## 📊 Monitoring & Health Checks

### Health Endpoints

- **Backend**: `https://api.kisaanmela.com/api/health`
- **Frontend**: `https://kisaanmela.com`

### Container Status
```bash
docker-compose -f docker-compose.prod.yml ps
```

### View Container Logs
```bash
docker-compose -f docker-compose.prod.yml logs -f [service_name]
```

### Resource Usage
```bash
docker stats
```

## 🔒 Security Features

### Built-in Security
- SSL/TLS encryption
- Rate limiting (API: 10 req/s, Login: 1 req/s)
- CORS protection
- Security headers (XSS, CSRF, etc.)
- Input validation and sanitization
- JWT authentication with refresh tokens

### Firewall Configuration
```bash
# Allow only necessary ports
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

## 🚀 Performance Optimization

### Nginx Optimizations
- Gzip compression enabled
- Static file caching
- Connection keep-alive
- Worker process optimization

### Database Optimizations
- Proper indexing for all collections
- Connection pooling
- Query optimization

### Application Optimizations
- Redis caching for sessions
- Image compression and optimization
- CDN-ready static assets

## 📱 Mobile App Deployment

### Build Mobile App
```bash
cd mobile
npm install
npx expo build:android
npx expo build:ios
```

### Update API URLs
Ensure mobile app points to production API:
```javascript
// mobile/src/config/api.js
export const API_BASE_URL = 'https://api.kisaanmela.com/api';
```

## 🔄 Backup & Recovery

### Database Backup
```bash
# Create backup
docker exec kisaanmela-mongodb mongodump --db kisaanmela_prod --out /backup

# Restore backup
docker exec kisaanmela-mongodb mongorestore --db kisaanmela_prod /backup/kisaanmela_prod
```

### File Backup
```bash
# Backup uploads
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz uploads/

# Backup SSL certificates
tar -czf ssl-backup-$(date +%Y%m%d).tar.gz ssl/
```

## 🐛 Troubleshooting

### Common Issues

**1. SSL Certificate Issues**
```bash
# Check certificate validity
openssl x509 -in ssl/kisaanmela.com.crt -text -noout

# Renew Let's Encrypt certificate
sudo certbot renew
```

**2. Database Connection Issues**
```bash
# Check MongoDB logs
docker logs kisaanmela-mongodb

# Test connection
docker exec kisaanmela-mongodb mongo kisaanmela_prod --eval "db.stats()"
```

**3. Application Not Starting**
```bash
# Check all container logs
docker-compose -f docker-compose.prod.yml logs

# Restart specific service
docker-compose -f docker-compose.prod.yml restart backend
```

**4. High Memory Usage**
```bash
# Check container resource usage
docker stats

# Restart containers to free memory
docker-compose -f docker-compose.prod.yml restart
```

### Log Locations
- **Nginx**: `logs/nginx/`
- **Application**: `logs/app.log`
- **Docker**: `docker-compose logs`

## 📞 Support

### Getting Help
1. Check this documentation
2. Review application logs
3. Check Docker container status
4. Verify environment configuration

### Maintenance Mode
To enable maintenance mode:
```bash
# Update database settings
docker exec kisaanmela-mongodb mongo kisaanmela_prod --eval "db.settings.updateOne({}, {\$set: {maintenance: true}})"
```

## 🎉 Success!

Your Kisaan Mela platform is now running in production!

- **Website**: https://kisaanmela.com
- **API**: https://api.kisaanmela.com
- **Admin Panel**: https://kisaanmela.com/admin
- **Default Admin**: admin@kisaanmela.com

Remember to:
1. Change default admin password
2. Configure monitoring and alerts
3. Set up regular backups
4. Monitor application performance
5. Keep dependencies updated

Happy farming! 🌾🐄