# 🚀 Kisaan Mela Production Deployment Walkthrough

## Complete Step-by-Step Guide

### Phase 1: Server Preparation

#### 1.1 Get Your Server
**Recommended Specs:**
- **RAM**: 4GB minimum (8GB recommended)
- **CPU**: 2+ cores
- **Storage**: 50GB+ SSD
- **OS**: Ubuntu 20.04 LTS or newer
- **Network**: Static IP address

**Recommended Providers:**
```bash
# Budget Options ($20/month)
DigitalOcean Droplet - 4GB RAM, 2 vCPUs, 80GB SSD
Linode VPS - 4GB RAM, 2 vCPUs, 80GB SSD
Vultr Cloud Compute - 4GB RAM, 2 vCPUs, 80GB SSD

# Enterprise Options ($30-40/month)
AWS EC2 t3.medium - 4GB RAM, 2 vCPUs, EBS storage
Google Cloud e2-medium - 4GB RAM, 2 vCPUs, SSD storage
```

#### 1.2 Initial Server Setup
```bash
# Connect to your server
ssh root@YOUR_SERVER_IP

# Create application user
adduser kisaanmela
usermod -aG sudo kisaanmela
su - kisaanmela

# Download and run server setup
wget https://raw.githubusercontent.com/yourusername/animall-monorepo/main/server-setup.sh
chmod +x server-setup.sh
./server-setup.sh
```

#### 1.3 Verify Installation
```bash
# Logout and login to apply Docker group changes
exit
ssh kisaanmela@YOUR_SERVER_IP

# Verify installations
docker --version          # Should show Docker 20.10+
docker-compose --version  # Should show Docker Compose 2.0+
node --version            # Should show Node.js 18+
nginx -v                  # Should show Nginx version
```

### Phase 2: Domain Configuration

#### 2.1 Configure DNS Records
In your domain registrar (GoDaddy, Namecheap, etc.):

```
Type    Name                Value               TTL
A       kisaanmela.com      YOUR_SERVER_IP      300
A       www                 YOUR_SERVER_IP      300  
A       api                 YOUR_SERVER_IP      300
```

#### 2.2 Verify DNS Propagation
```bash
# Check if DNS is working
dig kisaanmela.com A
dig www.kisaanmela.com A
dig api.kisaanmela.com A

# Should return your server IP
```

**Wait for DNS propagation (can take up to 48 hours)**

### Phase 3: Application Deployment

#### 3.1 Navigate to Application Directory
```bash
cd /opt/kisaanmela
```

#### 3.2 Run Interactive Environment Setup
```bash
./setup-kisaanmela-env.sh
```

**This wizard will configure:**

**Database Options:**
- Option 1: MongoDB Atlas (Recommended)
  - Create account at https://cloud.mongodb.com/
  - Create cluster and get connection string
  - Paste connection string when prompted

- Option 2: Local MongoDB (Docker)
  - Uses containerized MongoDB
  - Automatically configured

**AWS S3 Configuration:**
```bash
# You'll need:
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_S3_BUCKET=kisaanmela-uploads
```

**Email Configuration:**
```bash
# For Gmail:
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@kisaanmela.com
SMTP_PASS=your-app-password  # Generate in Gmail settings
```

**Stripe Configuration:**
```bash
# Get from https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Twilio Configuration:**
```bash
# Get from https://console.twilio.com/
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...
```

#### 3.3 Deploy Application
```bash
./deploy-kisaanmela.sh
```

**The deployment will:**
1. Setup SSL certificates (Let's Encrypt)
2. Initialize MongoDB with schemas
3. Build Docker containers
4. Start all services
5. Configure Nginx reverse proxy
6. Run health checks

### Phase 4: SSL Certificate Setup

#### 4.1 Let's Encrypt (Recommended)
The deployment script will automatically:
- Install certbot
- Obtain SSL certificates
- Configure auto-renewal

#### 4.2 Manual Certificate Verification
```bash
# Check certificate status
sudo certbot certificates

# Test auto-renewal
sudo certbot renew --dry-run
```

### Phase 5: Verification & Testing

#### 5.1 Check Service Status
```bash
# Check all containers
docker-compose -f docker-compose.prod.yml ps

# Should show all services as "Up"
```

#### 5.2 Test Application Endpoints
```bash
# Test backend health
curl https://api.kisaanmela.com/api/health

# Test frontend
curl https://kisaanmela.com

# Both should return 200 OK
```

#### 5.3 Test in Browser
- **Main Website**: https://kisaanmela.com
- **API Health**: https://api.kisaanmela.com/api/health
- **Admin Panel**: https://kisaanmela.com/admin

#### 5.4 Default Admin Login
```
Email: admin@kisaanmela.com
Password: (set during first login)
```

### Phase 6: Mobile App Updates

#### 6.1 Update Mobile App Configuration
```javascript
// mobile/src/config/api.js
export const API_BASE_URL = 'https://api.kisaanmela.com/api';
export const WEB_URL = 'https://kisaanmela.com';
```

#### 6.2 Build and Deploy Mobile Apps
```bash
cd mobile

# Install dependencies
npm install

# Build for production
npx expo build:android --release-channel production
npx expo build:ios --release-channel production
```

### Phase 7: Go Live Checklist

#### 7.1 Security Checklist
- [ ] SSL certificates installed and working
- [ ] Firewall configured (ports 22, 80, 443 only)
- [ ] Default admin password changed
- [ ] All API keys are production values
- [ ] Rate limiting configured
- [ ] Security headers enabled

#### 7.2 Performance Checklist
- [ ] Database indexes created
- [ ] Redis caching enabled
- [ ] Nginx gzip compression working
- [ ] Static files cached properly
- [ ] CDN configured (optional)

#### 7.3 Monitoring Checklist
- [ ] Health check endpoints responding
- [ ] Log files being written
- [ ] Container health checks passing
- [ ] Backup procedures tested

#### 7.4 Business Checklist
- [ ] Payment gateway tested with small transaction
- [ ] SMS notifications working
- [ ] Email notifications working
- [ ] File uploads to S3 working
- [ ] Mobile apps submitted to stores

### Phase 8: Launch & Monitoring

#### 8.1 Soft Launch
1. Test with internal team
2. Invite beta users
3. Monitor for issues
4. Fix any problems

#### 8.2 Public Launch
1. Update mobile apps in stores
2. Announce on social media
3. Monitor server resources
4. Scale if needed

#### 8.3 Ongoing Monitoring
```bash
# Check system resources
htop
df -h
docker stats

# View application logs
./deploy-kisaanmela.sh logs

# Monitor health endpoints
watch -n 30 'curl -s https://api.kisaanmela.com/api/health'
```

## 🚨 Troubleshooting Common Issues

### SSL Certificate Issues
```bash
# Check certificate status
openssl x509 -in ssl/kisaanmela.com.crt -text -noout

# Renew Let's Encrypt certificate
sudo certbot renew
```

### Database Connection Issues
```bash
# Check MongoDB logs
docker logs kisaanmela-mongodb

# Test connection
docker exec kisaanmela-mongodb mongo kisaanmela_prod --eval "db.stats()"
```

### Application Not Starting
```bash
# Check all logs
docker-compose -f docker-compose.prod.yml logs

# Restart specific service
docker-compose -f docker-compose.prod.yml restart backend
```

### High Memory Usage
```bash
# Check resource usage
docker stats

# Restart to free memory
docker-compose -f docker-compose.prod.yml restart
```

## 📞 Support Resources

### Log Locations
- **Application**: `/opt/kisaanmela/logs/app.log`
- **Nginx**: `/opt/kisaanmela/logs/nginx/`
- **Docker**: `docker-compose logs`

### Useful Commands
```bash
# View real-time logs
./deploy-kisaanmela.sh logs

# Restart services
./deploy-kisaanmela.sh restart

# Stop services
./deploy-kisaanmela.sh stop

# Update application
git pull origin main
./deploy-kisaanmela.sh
```

## 🎉 Success!

Your **Kisaan Mela** platform is now live and ready to serve farmers across India!

**Platform URLs:**
- 🏠 **Website**: https://kisaanmela.com
- 🔌 **API**: https://api.kisaanmela.com  
- 👨‍💼 **Admin**: https://kisaanmela.com/admin

**Features Ready:**
- 🐄 Livestock marketplace
- 💬 Real-time chat
- 💳 Secure payments
- 📱 Mobile apps
- 🚚 Service bookings
- 📊 Analytics dashboard

**Happy farming!** 🌾🇮🇳
