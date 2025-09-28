#!/bin/bash

# Simple production deployment script
# This script runs on the production server

set -e

# Configuration
DEPLOY_DIR="/opt/kisaanmela"
BACKUP_DIR="/opt/kisaanmela-backups"

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

# Function to create backup
create_backup() {
    if [ -d "$DEPLOY_DIR" ] && [ "$(ls -A $DEPLOY_DIR)" ]; then
        print_status "Creating backup..."
        BACKUP_NAME="kisaanmela-backup-$(date +%Y%m%d-%H%M%S)"
        cp -r "$DEPLOY_DIR" "$BACKUP_DIR/$BACKUP_NAME"
        print_success "Backup created: $BACKUP_DIR/$BACKUP_NAME"
        
        # Keep only last 5 backups
        cd "$BACKUP_DIR"
        ls -t | tail -n +6 | xargs -r rm -rf
    fi
}

# Function to update repository
update_repository() {
    print_status "Updating repository from main branch..."
    
    if [ -d "$DEPLOY_DIR/.git" ]; then
        cd "$DEPLOY_DIR"
        git fetch origin
        git checkout main
        git pull origin main
        print_success "Repository updated"
    else
        print_error "Repository not found at $DEPLOY_DIR"
        exit 1
    fi
    
    # Show current commit
    CURRENT_COMMIT=$(git rev-parse --short HEAD)
    COMMIT_MESSAGE=$(git log -1 --pretty=format:"%s")
    print_status "Current commit: $CURRENT_COMMIT - $COMMIT_MESSAGE"
}

# Function to deploy application
deploy_application() {
    print_status "Deploying application..."
    
    cd "$DEPLOY_DIR"
    
    # Check if env.production exists
    if [ ! -f "env.production" ]; then
        print_warning "env.production not found, copying from env.example"
        cp env.example env.production
        print_warning "Please update env.production with actual production values"
    fi
    
    # Stop existing containers
    print_status "Stopping existing containers..."
    docker-compose -f docker-compose.prod.yml down --remove-orphans 2>/dev/null || true
    
    # Pull latest images and build
    print_status "Building application containers..."
    docker-compose -f docker-compose.prod.yml --env-file env.production build --no-cache
    
    # Start services
    print_status "Starting application services..."
    docker-compose -f docker-compose.prod.yml --env-file env.production up -d
    
    print_success "Application deployed"
}

# Function to verify deployment
verify_deployment() {
    print_status "Verifying deployment..."
    
    # Wait for services to be ready
    print_status "Waiting for services to start..."
    sleep 30
    
    # Check if containers are running
    if docker-compose -f "$DEPLOY_DIR/docker-compose.prod.yml" ps | grep -q "Up"; then
        print_success "Containers are running"
    else
        print_error "Some containers failed to start"
        docker-compose -f "$DEPLOY_DIR/docker-compose.prod.yml" logs
        exit 1
    fi
    
    # Health checks
    print_status "Running health checks..."
    
    # Backend health check
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
    
    # Frontend health check
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
    
    print_success "All health checks passed"
}

# Function to rollback
rollback() {
    print_status "Rolling back deployment..."
    
    cd "$DEPLOY_DIR"
    
    # Get previous commit
    PREVIOUS_COMMIT=$(git log --oneline -n 2 | tail -n 1 | cut -d' ' -f1)
    
    if [ -z "$PREVIOUS_COMMIT" ]; then
        print_error "No previous commit found for rollback"
        exit 1
    fi
    
    print_status "Rolling back to commit: $PREVIOUS_COMMIT"
    
    # Checkout previous commit
    git checkout $PREVIOUS_COMMIT
    
    # Restart services
    docker-compose -f docker-compose.prod.yml --env-file env.production up -d --build
    
    print_success "Rollback completed"
}

# Main execution
case "${1:-deploy}" in
    deploy)
        print_status "Starting production deployment..."
        create_backup
        update_repository
        deploy_application
        verify_deployment
        print_success "🎉 Deployment completed successfully!"
        ;;
    rollback)
        rollback
        ;;
    verify)
        verify_deployment
        ;;
    *)
        echo "Usage: $0 {deploy|rollback|verify}"
        exit 1
        ;;
esac
