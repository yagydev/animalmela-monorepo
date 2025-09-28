#!/bin/bash

# Kisaan Mela Production Deployment Script
# Domain: kisaanmela.com

set -e

echo "🚀 Starting Kisaan Mela Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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
   print_error "This script should not be run as root for security reasons"
   exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if env.production exists
if [ ! -f "env.production" ]; then
    print_error "env.production file not found. Please create it first."
    print_status "You can copy from env.example and modify the values:"
    print_status "cp env.example env.production"
    exit 1
fi

# Function to setup SSL certificates
setup_ssl() {
    print_status "Setting up SSL certificates for kisaanmela.com..."
    
    # Create SSL directory if it doesn't exist
    mkdir -p ssl
    
    if [ ! -f "ssl/kisaanmela.com.crt" ] || [ ! -f "ssl/kisaanmela.com.key" ]; then
        print_warning "SSL certificates not found in ssl/ directory"
        print_status "Please choose an option:"
        echo "1. Use Let's Encrypt (Recommended)"
        echo "2. Use existing certificates"
        echo "3. Generate self-signed certificates (Development only)"
        
        read -p "Enter your choice (1-3): " ssl_choice
        
        case $ssl_choice in
            1)
                setup_letsencrypt
                ;;
            2)
                print_status "Please place your SSL certificates in:"
                print_status "  ssl/kisaanmela.com.crt (certificate)"
                print_status "  ssl/kisaanmela.com.key (private key)"
                read -p "Press Enter when certificates are in place..."
                ;;
            3)
                generate_self_signed
                ;;
            *)
                print_error "Invalid choice"
                exit 1
                ;;
        esac
    else
        print_success "SSL certificates found"
    fi
}

# Function to setup Let's Encrypt
setup_letsencrypt() {
    print_status "Setting up Let's Encrypt certificates..."
    
    # Install certbot if not present
    if ! command -v certbot &> /dev/null; then
        print_status "Installing certbot..."
        sudo apt-get update
        sudo apt-get install -y certbot
    fi
    
    # Create webroot directory
    mkdir -p /var/www/certbot
    
    print_status "Obtaining SSL certificate for kisaanmela.com..."
    print_warning "Make sure your domain is pointing to this server!"
    
    # Get certificate
    sudo certbot certonly --webroot \
        -w /var/www/certbot \
        -d kisaanmela.com \
        -d www.kisaanmela.com \
        -d api.kisaanmela.com \
        --email admin@kisaanmela.com \
        --agree-tos \
        --non-interactive
    
    # Copy certificates to ssl directory
    sudo cp /etc/letsencrypt/live/kisaanmela.com/fullchain.pem ssl/kisaanmela.com.crt
    sudo cp /etc/letsencrypt/live/kisaanmela.com/privkey.pem ssl/kisaanmela.com.key
    sudo chown $USER:$USER ssl/kisaanmela.com.*
    
    print_success "Let's Encrypt certificates configured"
}

# Function to generate self-signed certificates
generate_self_signed() {
    print_warning "Generating self-signed certificates (NOT for production use)"
    
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout ssl/kisaanmela.com.key \
        -out ssl/kisaanmela.com.crt \
        -subj "/C=IN/ST=State/L=City/O=KisaanMela/CN=kisaanmela.com"
    
    print_success "Self-signed certificates generated"
}

# Function to setup MongoDB initialization
setup_mongodb() {
    print_status "Setting up MongoDB initialization..."
    
    cat > mongo-init.js << EOF
// MongoDB initialization script for Kisaan Mela
db = db.getSiblingDB('kisaanmela_prod');

// Create collections
db.createCollection('users');
db.createCollection('listings');
db.createCollection('orders');
db.createCollection('chats');
db.createCollection('services');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "phone": 1 }, { unique: true });
db.listings.createIndex({ "category": 1 });
db.listings.createIndex({ "location": 1 });
db.listings.createIndex({ "price": 1 });
db.listings.createIndex({ "createdAt": -1 });
db.orders.createIndex({ "userId": 1 });
db.orders.createIndex({ "sellerId": 1 });
db.orders.createIndex({ "status": 1 });
db.chats.createIndex({ "participants": 1 });
db.services.createIndex({ "type": 1 });
db.services.createIndex({ "location": 1 });

print('Kisaan Mela database initialized successfully');
EOF
    
    print_success "MongoDB initialization script created"
}

# Function to update Next.js config for production
update_nextjs_config() {
    print_status "Updating Next.js configuration for production..."
    
    # Update web-frontend next.config.js
    if [ -f "web-frontend/next.config.js" ]; then
        # Backup original
        cp web-frontend/next.config.js web-frontend/next.config.js.backup
        
        # Update config
        cat > web-frontend/next.config.js << EOF
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../'),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kisaanmela-uploads.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'kisaanmela-uploads.s3.us-east-1.amazonaws.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.kisaanmela.com/api/:path*',
      },
    ];
  },
};

const path = require('path');
module.exports = nextConfig;
EOF
        
        print_success "Next.js configuration updated"
    fi
}

# Function to create health check files
create_health_checks() {
    print_status "Creating health check files..."
    
    # Backend health check
    cat > backend/healthcheck.js << EOF
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/health',
  method: 'GET',
  timeout: 3000
};

const req = http.request(options, (res) => {
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

req.on('error', () => {
  process.exit(1);
});

req.on('timeout', () => {
  req.destroy();
  process.exit(1);
});

req.end();
EOF
    
    print_success "Health check files created"
}

# Main deployment function
deploy() {
    print_status "Starting deployment process..."
    
    # Setup SSL certificates
    setup_ssl
    
    # Setup MongoDB
    setup_mongodb
    
    # Update Next.js config
    update_nextjs_config
    
    # Create health checks
    create_health_checks
    
    # Stop existing containers
    print_status "Stopping existing containers..."
    docker-compose -f docker-compose.prod.yml down --remove-orphans
    
    # Build and start containers
    print_status "Building and starting containers..."
    docker-compose -f docker-compose.prod.yml up --build -d
    
    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    sleep 30
    
    # Check service health
    check_services
    
    print_success "🎉 Kisaan Mela deployed successfully!"
    print_status "Your application is now running at:"
    print_status "  🌐 Website: https://kisaanmela.com"
    print_status "  🔌 API: https://api.kisaanmela.com"
    print_status ""
    print_status "Next steps:"
    print_status "1. Configure your domain DNS to point to this server"
    print_status "2. Update your environment variables in env.production"
    print_status "3. Set up your external services (MongoDB Atlas, AWS S3, Stripe, etc.)"
    print_status "4. Test your application thoroughly"
}

# Function to check service health
check_services() {
    print_status "Checking service health..."
    
    # Check if containers are running
    if docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
        print_success "Containers are running"
    else
        print_error "Some containers failed to start"
        docker-compose -f docker-compose.prod.yml logs
        exit 1
    fi
    
    # Check backend health
    print_status "Checking backend health..."
    for i in {1..10}; do
        if curl -f http://localhost:5000/api/health &>/dev/null; then
            print_success "Backend is healthy"
            break
        fi
        if [ $i -eq 10 ]; then
            print_error "Backend health check failed"
            exit 1
        fi
        sleep 5
    done
    
    # Check frontend
    print_status "Checking frontend..."
    for i in {1..10}; do
        if curl -f http://localhost:3000 &>/dev/null; then
            print_success "Frontend is healthy"
            break
        fi
        if [ $i -eq 10 ]; then
            print_error "Frontend health check failed"
            exit 1
        fi
        sleep 5
    done
}

# Function to show logs
show_logs() {
    docker-compose -f docker-compose.prod.yml logs -f
}

# Function to stop deployment
stop_deployment() {
    print_status "Stopping Kisaan Mela deployment..."
    docker-compose -f docker-compose.prod.yml down
    print_success "Deployment stopped"
}

# Function to restart deployment
restart_deployment() {
    print_status "Restarting Kisaan Mela deployment..."
    docker-compose -f docker-compose.prod.yml restart
    print_success "Deployment restarted"
}

# Main script logic
case "${1:-deploy}" in
    deploy)
        deploy
        ;;
    logs)
        show_logs
        ;;
    stop)
        stop_deployment
        ;;
    restart)
        restart_deployment
        ;;
    ssl)
        setup_ssl
        ;;
    *)
        echo "Usage: $0 {deploy|logs|stop|restart|ssl}"
        echo ""
        echo "Commands:"
        echo "  deploy   - Deploy Kisaan Mela to production"
        echo "  logs     - Show application logs"
        echo "  stop     - Stop the deployment"
        echo "  restart  - Restart the deployment"
        echo "  ssl      - Setup SSL certificates only"
        exit 1
        ;;
esac