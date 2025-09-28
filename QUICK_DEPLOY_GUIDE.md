# 🚀 Quick Production Deployment Guide

## ✅ **SSH Issue Fixed!**

The SSH syntax error in the GitHub Actions workflow has been resolved. Here are your deployment options:

---

## 🎯 **Option 1: Automated GitHub Actions (Recommended)**

### **Setup GitHub Secrets**
Go to your GitHub repository → Settings → Secrets and Variables → Actions

Add these secrets:
```
PRODUCTION_HOST          = your-server-ip-address
PRODUCTION_USER          = your-server-username
PRODUCTION_SSH_KEY       = your-private-ssh-key-content
SLACK_WEBHOOK           = your-slack-webhook-url (optional)
```

### **Deploy Automatically**
```bash
# Just push to main branch - deployment happens automatically!
git add .
git commit -m "Deploy to production"
git push origin main
```

**The GitHub Actions pipeline will:**
1. ✅ Run tests
2. ✅ Build Docker images  
3. ✅ Deploy to your server
4. ✅ Run health checks
5. ✅ Notify you of status
6. ✅ Auto-rollback on failure

---

## 🎯 **Option 2: Manual Server Deployment**

### **On Your Production Server:**

1. **Initial Setup** (one-time):
   ```bash
   # Create deployment directory
   sudo mkdir -p /opt/kisaanmela
   sudo chown $USER:$USER /opt/kisaanmela
   
   # Clone repository
   git clone -b main https://github.com/yagydev/animalmela-monorepo.git /opt/kisaanmela
   cd /opt/kisaanmela
   
   # Setup environment
   cp env.example env.production
   # Edit env.production with your actual values
   nano env.production
   ```

2. **Deploy/Update**:
   ```bash
   # Download and run deployment script
   cd /opt/kisaanmela
   wget https://raw.githubusercontent.com/yagydev/animalmela-monorepo/main/scripts/deploy-to-production.sh
   chmod +x deploy-to-production.sh
   ./deploy-to-production.sh deploy
   ```

---

## 🎯 **Option 3: One-Command Deployment**

### **From Your Local Machine:**

```bash
# Deploy to production server
ssh your-user@your-server "
  cd /opt/kisaanmela && 
  git pull origin main && 
  docker-compose -f docker-compose.prod.yml --env-file env.production up -d --build
"
```

---

## 🔧 **Management Commands**

### **Check Status:**
```bash
ssh your-user@your-server "cd /opt/kisaanmela && docker-compose -f docker-compose.prod.yml ps"
```

### **View Logs:**
```bash
ssh your-user@your-server "cd /opt/kisaanmela && docker-compose -f docker-compose.prod.yml logs -f"
```

### **Restart Services:**
```bash
ssh your-user@your-server "cd /opt/kisaanmela && docker-compose -f docker-compose.prod.yml restart"
```

### **Rollback:**
```bash
ssh your-user@your-server "cd /opt/kisaanmela && /tmp/deploy-to-production.sh rollback"
```

---

## 🌐 **After Deployment**

Your Kisaan Mela platform will be available at:

- **🌐 Website**: https://kisaanmela.com
- **🔌 API**: https://api.kisaanmela.com  
- **👨‍💼 Admin**: https://kisaanmela.com/admin
- **❤️ Health Check**: https://api.kisaanmela.com/api/health

---

## 🆘 **Troubleshooting**

### **If GitHub Actions Fails:**
1. Check the Actions tab in your GitHub repository
2. Look at the error logs
3. Verify your GitHub secrets are correct
4. Make sure your server is accessible via SSH

### **If Manual Deployment Fails:**
1. Check if Docker is running: `docker ps`
2. Check if ports are available: `netstat -tlnp | grep :80`
3. Check environment file: `cat /opt/kisaanmela/env.production`
4. Check container logs: `docker-compose logs`

### **Common Issues:**
- **Port 80/443 in use**: Stop other web servers (`sudo systemctl stop apache2 nginx`)
- **Permission denied**: Make sure user owns `/opt/kisaanmela` directory
- **Git pull fails**: Check if repository is accessible and credentials are correct

---

## 🎉 **Success!**

Once deployed, your complete Kisaan Mela platform will be running with:

- ✅ **Livestock Marketplace** - Buy/sell animals
- ✅ **Real-time Chat** - Buyer-seller communication  
- ✅ **Payment Processing** - Secure transactions
- ✅ **Service Marketplace** - Veterinary, transport, etc.
- ✅ **Admin Dashboard** - Platform management
- ✅ **Mobile App Support** - iOS/Android ready
- ✅ **SSL Security** - HTTPS enabled
- ✅ **Auto-monitoring** - Health checks

**Your platform is ready to serve farmers across India! 🇮🇳🐄**

---

## 📞 **Need Help?**

If you encounter any issues:
1. Check the deployment logs
2. Verify your server meets the requirements (4GB RAM, Docker installed)
3. Ensure your domain DNS is pointing to the server
4. Make sure all required ports (80, 443, 22) are open

The deployment is now much more reliable with the fixed SSH syntax! 🚀
