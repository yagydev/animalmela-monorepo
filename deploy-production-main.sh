#!/bin/bash

# Production Deployment Script for kisaanmela.com
# Deploys from main branch to production environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="kisaanmela.com"
REPO_URL="https://github.com/yagydev/animalmela-monorepo.git"
DEPLOY_DIR="/opt/kisaanmela"
BACKUP_DIR="/opt/kisaanmela-backups"
SERVICE_NAME="kisaanmela"

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

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
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
    
    # Check if Git is installed
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed. Please install Git first."
        exit 1
    fi
    
    print_success "All prerequisites are installed"
}

# Function to create deployment directory
setup_deployment_directory() {
    print_status "Setting up deployment directory..."
    
    # Create deployment directory if it doesn't exist
    if [ ! -d "$DEPLOY_DIR" ]; then
        sudo mkdir -p "$DEPLOY_DIR"
        sudo chown $USER:$USER "$DEPLOY_DIR"
        print_success "Created deployment directory: $DEPLOY_DIR"
    fi
    
    # Create backup directory
    if [ ! -d "$BACKUP_DIR" ]; then
        sudo mkdir -p "$BACKUP_DIR"
        sudo chown $USER:$USER "$BACKUP_DIR"
        print_success "Created backup directory: $BACKUP_DIR"
    fi
}

# Function to clone or update repository
update_repository() {
    print_status "Updating repository from main branch..."
    
    if [ -d "$DEPLOY_DIR/.git" ]; then
        # Repository exists, update it
        cd "$DEPLOY_DIR"
        
        # Stash any local changes
        git stash push -m "Auto-stash before deployment $(date)"
        
        # Fetch latest changes
        git fetch origin
        
        # Switch to main branch and pull latest
        git checkout main
        git pull origin main
        
        print_success "Repository updated from main branch"
    else
        # Clone repository
        print_status "Cloning repository..."
        git clone -b main "$REPO_URL" "$DEPLOY_DIR"
        cd "$DEPLOY_DIR"
        print_success "Repository cloned from main branch"
    fi
    
    # Show current commit
    CURRENT_COMMIT=$(git rev-parse --short HEAD)
    COMMIT_MESSAGE=$(git log -1 --pretty=format:"%s")
    print_status "Current commit: $CURRENT_COMMIT - $COMMIT_MESSAGE"
}

# Function to backup current deployment
backup_current_deployment() {
    print_status "Creating backup of current deployment..."
    
    if [ -d "$DEPLOY_DIR" ] && [ "$(ls -A $DEPLOY_DIR)" ]; then
        BACKUP_NAME="kisaanmela-backup-$(date +%Y%m%d-%H%M%S)"
        
        # Create backup
        sudo cp -r "$DEPLOY_DIR" "$BACKUP_DIR/$BACKUP_NAME"
        
        # Keep only last 5 backups
        cd "$BACKUP_DIR"
        ls -t | tail -n +6 | xargs -r sudo rm -rf
        
        print_success "Backup created: $BACKUP_DIR/$BACKUP_NAME"
    else
        print_warning "No existing deployment to backup"
    fi
}

# Function to setup production environment
setup_production_environment() {
    print_status "Setting up production environment..."
    
    cd "$DEPLOY_DIR"
    
    # Check if production environment file exists
    if [ ! -f "env.production" ]; then
        print_warning "env.production not found. Creating from template..."
        
        # Copy from example and customize for production
        cp env.example env.production
        
        # Update domain-specific values
        sed -i "s/DOMAIN_NAME=.*/DOMAIN_NAME=$DOMAIN/" env.production
        sed -i "s/FRONTEND_URL=.*/FRONTEND_URL=https:\/\/$DOMAIN/" env.production
        sed -i "s/API_URL=.*/API_URL=https:\/\/api.$DOMAIN/" env.production
        sed -i "s/NEXT_PUBLIC_API_URL=.*/NEXT_PUBLIC_API_URL=https:\/\/api.$DOMAIN/" env.production
        sed -i "s/NEXT_PUBLIC_WEB_URL=.*/NEXT_PUBLIC_WEB_URL=https:\/\/$DOMAIN/" env.production
        
        print_warning "Please update env.production with your actual production values:"
        print_warning "- Database connection strings"
        print_warning "- JWT secrets (generate secure random strings)"
        print_warning "- AWS S3 credentials"
        print_warning "- Stripe API keys"
        print_warning "- Email/SMS service credentials"
        
        read -p "Press Enter after updating env.production..."
    fi
    
    # Validate critical environment variables
    if grep -q "CHANGE_THIS" env.production; then
        print_error "Please update env.production with actual values. Found placeholder 'CHANGE_THIS' values."
        exit 1
    fi
    
    print_success "Production environment configured"
}

# Function to setup SSL certificates
setup_ssl_certificates() {
    print_status "Setting up SSL certificates..."
    
    cd "$DEPLOY_DIR"
    
    # Create SSL directory
    mkdir -p ssl
    
    if [ ! -f "ssl/$DOMAIN.crt" ] || [ ! -f "ssl/$DOMAIN.key" ]; then
        print_status "SSL certificates not found. Choose an option:"
        echo "1. Use Let's Encrypt (Recommended for production)"
        echo "2. Use existing certificates"
        echo "3. Generate self-signed certificates (Development only)"
        
        read -p "Enter your choice (1-3): " ssl_choice
        
        case $ssl_choice in
            1)
                setup_letsencrypt_certificates
                ;;
            2)
                print_status "Please place your SSL certificates in:"
                print_status "  ssl/$DOMAIN.crt (certificate file)"
                print_status "  ssl/$DOMAIN.key (private key file)"
                read -p "Press Enter when certificates are in place..."
                ;;
            3)
                generate_self_signed_certificates
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

# Function to setup Let's Encrypt certificates
setup_letsencrypt_certificates() {
    print_status "Setting up Let's Encrypt certificates..."
    
    # Install certbot if not present
    if ! command -v certbot &> /dev/null; then
        print_status "Installing certbot..."
        sudo apt-get update
        sudo apt-get install -y certbot
    fi
    
    # Stop any existing web server
    sudo systemctl stop nginx 2>/dev/null || true
    sudo systemctl stop apache2 2>/dev/null || true
    
    # Get certificate
    print_status "Obtaining SSL certificate for $DOMAIN..."
    print_warning "Make sure your domain is pointing to this server!"
    
    sudo certbot certonly --standalone \
        -d "$DOMAIN" \
        -d "www.$DOMAIN" \
        -d "api.$DOMAIN" \
        --email "admin@$DOMAIN" \
        --agree-tos \
        --non-interactive
    
    # Copy certificates to project directory
    sudo cp "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" "ssl/$DOMAIN.crt"
    sudo cp "/etc/letsencrypt/live/$DOMAIN/privkey.pem" "ssl/$DOMAIN.key"
    sudo chown $USER:$USER "ssl/$DOMAIN.crt" "ssl/$DOMAIN.key"
    
    print_success "Let's Encrypt certificates configured"
}

# Function to generate self-signed certificates
generate_self_signed_certificates() {
    print_warning "Generating self-signed certificates (NOT for production use)"
    
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout "ssl/$DOMAIN.key" \
        -out "ssl/$DOMAIN.crt" \
        -subj "/C=IN/ST=State/L=City/O=KisaanMela/CN=$DOMAIN"
    
    print_success "Self-signed certificates generated"
}

# Function to build and deploy application
deploy_application() {
    print_status "Building and deploying application..."
    
    cd "$DEPLOY_DIR"
    
    # Stop existing containers
    print_status "Stopping existing containers..."
    docker-compose -f docker-compose.prod.yml down --remove-orphans 2>/dev/null || true
    
    # Pull latest images and build
    print_status "Building application containers..."
    docker-compose -f docker-compose.prod.yml --env-file env.production build --no-cache
    
    # Start services
    print_status "Starting application services..."
    docker-compose -f docker-compose.prod.yml --env-file env.production up -d
    
    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    sleep 30
    
    print_success "Application deployed successfully"
}

# Function to verify deployment
verify_deployment() {
    print_status "Verifying deployment..."
    
    # Check if containers are running
    if docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
        print_success "All containers are running"
    else
        print_error "Some containers failed to start"
        docker-compose -f docker-compose.prod.yml logs
        exit 1
    fi
    
    # Check backend health
    print_status "Checking backend health..."
    for i in {1..10}; do
        if curl -f -s "http://localhost:5000/api/health" > /dev/null 2>&1; then
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
        if curl -f -s "http://localhost:3000" > /dev/null 2>&1; then
            print_success "Frontend is healthy"
            break
        fi
        if [ $i -eq 10 ]; then
            print_error "Frontend health check failed"
            exit 1
        fi
        sleep 5
    done
    
    print_success "All services are healthy"
}

# Function to setup monitoring
setup_monitoring() {
    print_status "Setting up monitoring..."
    
    cd "$DEPLOY_DIR"
    
    # Create monitoring script
    cat > monitor-kisaanmela.sh << 'EOF'
#!/bin/bash
# Simple monitoring script for Kisaan Mela

LOG_FILE="/var/log/kisaanmela-monitor.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

# Check if containers are running
if ! docker-compose -f /opt/kisaanmela/docker-compose.prod.yml ps | grep -q "Up"; then
    echo "$DATE - ERROR: Some containers are not running" >> $LOG_FILE
    # Restart containers
    cd /opt/kisaanmela
    docker-compose -f docker-compose.prod.yml up -d
fi

# Check backend health
if ! curl -f -s http://localhost:5000/api/health > /dev/null; then
    echo "$DATE - ERROR: Backend health check failed" >> $LOG_FILE
fi

# Check frontend
if ! curl -f -s http://localhost:3000 > /dev/null; then
    echo "$DATE - ERROR: Frontend health check failed" >> $LOG_FILE
fi

echo "$DATE - Monitoring check completed" >> $LOG_FILE
EOF

    chmod +x monitor-kisaanmela.sh
    
    # Add to crontab (run every 5 minutes)
    (crontab -l 2>/dev/null; echo "*/5 * * * * $DEPLOY_DIR/monitor-kisaanmela.sh") | crontab -
    
    print_success "Monitoring setup completed"
}

# Function to setup log rotation
setup_log_rotation() {
    print_status "Setting up log rotation..."
    
    sudo tee /etc/logrotate.d/kisaanmela << EOF
/opt/kisaanmela/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
    postrotate
        docker-compose -f /opt/kisaanmela/docker-compose.prod.yml restart > /dev/null 2>&1 || true
    endscript
}
EOF

    print_success "Log rotation configured"
}

# Function to display deployment summary
display_summary() {
    print_success "🎉 Deployment completed successfully!"
    echo ""
    echo "=================================================="
    echo "         KISAAN MELA PRODUCTION DEPLOYMENT"
    echo "=================================================="
    echo ""
    echo "🌐 Your application is now running at:"
    echo "   Website: https://$DOMAIN"
    echo "   API: https://api.$DOMAIN"
    echo "   Admin: https://$DOMAIN/admin"
    echo ""
    echo "📊 Application Status:"
    docker-compose -f "$DEPLOY_DIR/docker-compose.prod.yml" ps
    echo ""
    echo "📁 Deployment Details:"
    echo "   Deploy Directory: $DEPLOY_DIR"
    echo "   Backup Directory: $BACKUP_DIR"
    echo "   Current Commit: $(cd $DEPLOY_DIR && git rev-parse --short HEAD)"
    echo "   Branch: main"
    echo ""
    echo "🔧 Management Commands:"
    echo "   View logs: docker-compose -f $DEPLOY_DIR/docker-compose.prod.yml logs -f"
    echo "   Restart: docker-compose -f $DEPLOY_DIR/docker-compose.prod.yml restart"
    echo "   Stop: docker-compose -f $DEPLOY_DIR/docker-compose.prod.yml down"
    echo "   Update: $0"
    echo ""
    echo "📝 Next Steps:"
    echo "   1. Test all functionality on https://$DOMAIN"
    echo "   2. Update DNS records if needed"
    echo "   3. Configure monitoring alerts"
    echo "   4. Set up automated backups"
    echo ""
    print_success "🐄 Your Kisaan Mela platform is now live in production!"
}

# Main deployment function
main() {
    echo "🚀 Starting Production Deployment for Kisaan Mela"
    echo "=================================================="
    echo "Domain: $DOMAIN"
    echo "Repository: $REPO_URL"
    echo "Branch: main"
    echo "Deploy Directory: $DEPLOY_DIR"
    echo "=================================================="
    echo ""
    
    # Confirm deployment
    read -p "Are you sure you want to deploy to production? (y/N): " confirm
    if [[ ! $confirm =~ ^[Yy]$ ]]; then
        print_warning "Deployment cancelled"
        exit 0
    fi
    
    # Execute deployment steps
    check_prerequisites
    setup_deployment_directory
    backup_current_deployment
    update_repository
    setup_production_environment
    setup_ssl_certificates
    deploy_application
    verify_deployment
    setup_monitoring
    setup_log_rotation
    display_summary
}

# Handle script arguments
case "${1:-deploy}" in
    deploy)
        main
        ;;
    update)
        print_status "Updating deployment from main branch..."
        cd "$DEPLOY_DIR"
        git pull origin main
        docker-compose -f docker-compose.prod.yml --env-file env.production up -d --build
        print_success "Update completed"
        ;;
    logs)
        cd "$DEPLOY_DIR"
        docker-compose -f docker-compose.prod.yml logs -f
        ;;
    status)
        cd "$DEPLOY_DIR"
        docker-compose -f docker-compose.prod.yml ps
        ;;
    restart)
        cd "$DEPLOY_DIR"
        docker-compose -f docker-compose.prod.yml restart
        print_success "Services restarted"
        ;;
    stop)
        cd "$DEPLOY_DIR"
        docker-compose -f docker-compose.prod.yml down
        print_success "Services stopped"
        ;;
    backup)
        backup_current_deployment
        ;;
    *)
        echo "Usage: $0 {deploy|update|logs|status|restart|stop|backup}"
        echo ""
        echo "Commands:"
        echo "  deploy   - Full production deployment from main branch"
        echo "  update   - Update deployment with latest main branch"
        echo "  logs     - Show application logs"
        echo "  status   - Show service status"
        echo "  restart  - Restart all services"
        echo "  stop     - Stop all services"
        echo "  backup   - Create backup of current deployment"
        exit 1
        ;;
esac
