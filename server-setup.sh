#!/bin/bash

# Kisaan Mela Server Setup Script
# Run this on your fresh Ubuntu 20.04+ server

set -e

echo "🚀 Setting up Kisaan Mela Production Server..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root. Create a user first:"
   echo "adduser kisaanmela"
   echo "usermod -aG sudo kisaanmela"
   echo "su - kisaanmela"
   exit 1
fi

print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

print_status "Installing essential packages..."
sudo apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release

print_status "Installing Docker..."
# Remove old Docker versions
sudo apt remove -y docker docker-engine docker.io containerd runc || true

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Add user to docker group
sudo usermod -aG docker $USER

print_status "Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

print_status "Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

print_status "Installing Nginx (for Let's Encrypt)..."
sudo apt install -y nginx

print_status "Installing Certbot for SSL certificates..."
sudo apt install -y certbot python3-certbot-nginx

print_status "Configuring firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

print_status "Creating application directory..."
sudo mkdir -p /opt/kisaanmela
sudo chown $USER:$USER /opt/kisaanmela
cd /opt/kisaanmela

print_status "Cloning Kisaan Mela repository..."
git clone https://github.com/yourusername/animall-monorepo.git .

print_status "Setting up log directories..."
mkdir -p logs/nginx uploads ssl

print_status "Installing application dependencies..."
npm install

print_success "✅ Server setup completed!"

echo ""
print_status "Next steps:"
echo "1. Logout and login again to apply Docker group changes:"
echo "   exit"
echo "   ssh user@your-server-ip"
echo ""
echo "2. Verify Docker installation:"
echo "   docker --version"
echo "   docker-compose --version"
echo ""
echo "3. Configure your domain DNS to point to this server"
echo ""
echo "4. Run the environment setup:"
echo "   cd /opt/kisaanmela"
echo "   ./setup-kisaanmela-env.sh"
echo ""
echo "5. Deploy your application:"
echo "   ./deploy-kisaanmela.sh"

print_success "🎉 Your server is ready for Kisaan Mela deployment!"
