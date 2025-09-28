# 🚀 Production Deployment Guide - Main Branch to kisaanmela.com

This guide shows you how to deploy your Kisaan Mela platform from the main branch to production on kisaanmela.com.

## 🎯 **Deployment Overview**

Your production deployment pipeline:
```
Main Branch → GitHub Actions → Production Server → kisaanmela.com
```

## 📋 **Prerequisites**

### **1. Production Server Setup**
- **Server**: VPS/Cloud instance (4GB+ RAM, 2+ CPU cores)
- **OS**: Ubuntu 20.04+ or CentOS 8+
- **Domain**: kisaanmela.com pointing to your server IP
- **Ports**: 80, 443, 22 open

### **2. DNS Configuration**
Configure these DNS records:
```
A     kisaanmela.com        → YOUR_SERVER_IP
A     www.kisaanmela.com    → YOUR_SERVER_IP
A     api.kisaanmela.com    → YOUR_SERVER_IP
```

### **3. GitHub Secrets**
Add these secrets to your GitHub repository:
```
PRODUCTION_HOST          = your-server-ip-or-domain
PRODUCTION_USER          = your-server-username
PRODUCTION_SSH_KEY       = your-private-ssh-key
SLACK_WEBHOOK           = your-slack-webhook-url (optional)
```

## 🚀 **Deployment Methods**

### **Method 1: Automated GitHub Actions (Recommended)**

#### **Setup GitHub Actions**
1. **Configure Secrets**:
   - Go to GitHub → Settings → Secrets and Variables → Actions
   - Add the required secrets listed above

2. **Push to Main Branch**:
   ```bash
   git checkout main
   git pull origin main
   git push origin main
   ```

3. **Monitor Deployment**:
   - Go to GitHub → Actions tab
   - Watch the deployment pipeline run
   - Check logs for any issues

#### **GitHub Actions Pipeline**
The pipeline automatically:
- ✅ Runs tests on backend and frontend
- ✅ Builds Docker images
- ✅ Deploys to production server
- ✅ Performs health checks
- ✅ Sends notifications
- ✅ Rolls back on failure

### **Method 2: Manual Deployment Script**

#### **On Your Production Server**:

1. **Download and Run Deployment Script**:
   ```bash
   # Download the deployment script
   wget https://raw.githubusercontent.com/yagydev/animalmela-monorepo/main/deploy-production-main.sh
   
   # Make it executable
   chmod +x deploy-production-main.sh
   
   # Run deployment
   ./deploy-production-main.sh
   ```

2. **Follow the Interactive Setup**:
   - The script will guide you through the setup
   - Configure environment variables
   - Set up SSL certificates
   - Deploy the application

#### **Script Features**:
- ✅ Clones/updates from main branch
- ✅ Creates automatic backups
- ✅ Sets up SSL certificates (Let's Encrypt)
- ✅ Configures production environment
- ✅ Builds and starts Docker containers
- ✅ Performs health checks
- ✅ Sets up monitoring

## ⚙️ **Production Environment Configuration**

### **Environment Variables**
The deployment script will create `env.production` with these key variables:

```bash
# Domain Configuration
DOMAIN_NAME=kisaanmela.com
FRONTEND_URL=https://kisaanmela.com
API_URL=https://api.kisaanmela.com

# Database (MongoDB Atlas recommended)
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/kisaanmela_prod

# Security
JWT_SECRET=your-super-secure-jwt-secret-32-chars-minimum
JWT_REFRESH_SECRET=your-super-secure-refresh-secret

# AWS S3 (File Storage)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET=kisaanmela-uploads

# Payment Processing
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable-key

# Communication
SMTP_HOST=smtp.gmail.com
SMTP_USER=noreply@kisaanmela.com
SMTP_PASS=your-app-password

TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+91xxxxxxxxxx
```

## 🔒 **SSL Certificate Setup**

### **Option 1: Let's Encrypt (Recommended)**
```bash
# The deployment script will automatically:
# 1. Install certbot
# 2. Obtain SSL certificates for your domain
# 3. Configure auto-renewal
```

### **Option 2: Custom SSL Certificates**
```bash
# Place your certificates in:
ssl/kisaanmela.com.crt    # Certificate file
ssl/kisaanmela.com.key    # Private key file
```

## 📊 **Monitoring & Management**

### **Check Deployment Status**
```bash
# Check service status
./deploy-production-main.sh status

# View logs
./deploy-production-main.sh logs

# Restart services
./deploy-production-main.sh restart
```

### **Application URLs**
After successful deployment:
- **Website**: https://kisaanmela.com
- **API**: https://api.kisaanmela.com
- **Admin Panel**: https://kisaanmela.com/admin
- **Health Check**: https://api.kisaanmela.com/api/health

### **Docker Container Management**
```bash
# Check running containers
docker ps

# View specific service logs
docker-compose -f /opt/kisaanmela/docker-compose.prod.yml logs backend

# Restart specific service
docker-compose -f /opt/kisaanmela/docker-compose.prod.yml restart backend
```

## 🔄 **Continuous Deployment Workflow**

### **Development to Production Flow**:
1. **Develop**: Work on feature branches
2. **Test**: Create pull requests, run tests
3. **Merge**: Merge to main branch after review
4. **Deploy**: GitHub Actions automatically deploys to production
5. **Monitor**: Check deployment status and application health

### **Update Production**:
```bash
# Method 1: Push to main branch (triggers auto-deployment)
git push origin main

# Method 2: Manual update on server
./deploy-production-main.sh update
```

## 🛡️ **Security & Best Practices**

### **Server Security**:
```bash
# Configure firewall
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable

# Keep system updated
sudo apt update && sudo apt upgrade -y

# Configure fail2ban (optional)
sudo apt install fail2ban
```

### **Application Security**:
- ✅ SSL/TLS encryption enabled
- ✅ Security headers configured
- ✅ Rate limiting implemented
- ✅ Input validation and sanitization
- ✅ JWT token authentication
- ✅ Environment variables secured

## 📈 **Performance Optimization**

### **Production Optimizations**:
- ✅ Docker multi-stage builds
- ✅ Nginx reverse proxy with caching
- ✅ Gzip compression enabled
- ✅ Static asset optimization
- ✅ Database indexing
- ✅ Redis caching layer

### **Monitoring Setup**:
```bash
# The deployment script automatically sets up:
# - Health check monitoring (every 5 minutes)
# - Log rotation
# - Automatic restart on failure
# - Performance monitoring
```

## 🆘 **Troubleshooting**

### **Common Issues**:

1. **SSL Certificate Issues**:
   ```bash
   # Check certificate status
   openssl x509 -in ssl/kisaanmela.com.crt -text -noout
   
   # Renew Let's Encrypt certificate
   sudo certbot renew
   ```

2. **Database Connection Issues**:
   ```bash
   # Check MongoDB connection
   docker logs kisaanmela-mongodb
   
   # Test connection
   docker exec kisaanmela-backend node -e "console.log('Testing DB...')"
   ```

3. **Service Not Starting**:
   ```bash
   # Check all container logs
   docker-compose -f /opt/kisaanmela/docker-compose.prod.yml logs
   
   # Restart specific service
   docker-compose -f /opt/kisaanmela/docker-compose.prod.yml restart backend
   ```

### **Rollback Procedure**:
```bash
# Automatic rollback (if GitHub Actions fails)
# - Pipeline automatically rolls back to previous commit

# Manual rollback
cd /opt/kisaanmela
git log --oneline -5  # Find previous commit
git checkout PREVIOUS_COMMIT_HASH
./deploy-production-main.sh update
```

## 📞 **Support & Maintenance**

### **Regular Maintenance Tasks**:
```bash
# Weekly tasks
./deploy-production-main.sh backup    # Create backup
docker system prune -f               # Clean up unused images

# Monthly tasks
sudo apt update && sudo apt upgrade -y  # System updates
sudo certbot renew                      # Renew SSL certificates
```

### **Monitoring Checklist**:
- [ ] Application health checks passing
- [ ] SSL certificates valid and auto-renewing
- [ ] Database backups working
- [ ] Log files rotating properly
- [ ] Server resources (CPU, memory, disk) healthy
- [ ] Security updates applied

---

## 🎉 **Deployment Complete!**

Your Kisaan Mela platform is now running in production:

- **🌐 Website**: https://kisaanmela.com
- **🔌 API**: https://api.kisaanmela.com  
- **👨‍💼 Admin**: https://kisaanmela.com/admin

**Features Available**:
- ✅ Complete livestock marketplace
- ✅ Real-time chat system
- ✅ Payment processing
- ✅ Service marketplace
- ✅ Mobile app support
- ✅ Admin dashboard
- ✅ SSL security
- ✅ Automated monitoring

**Your platform is ready to serve farmers and livestock traders across India! 🇮🇳🐄**
