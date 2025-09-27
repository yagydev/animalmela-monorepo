#!/bin/bash

# Kisaan Mela Environment Setup Script
# Interactive wizard to configure production environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    Kisaan Mela Setup                        ║"
    echo "║              Production Environment Configuration            ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

print_section() {
    echo -e "${YELLOW}▶ $1${NC}"
    echo "────────────────────────────────────────────────────────────────"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Function to generate secure random string
generate_secret() {
    openssl rand -base64 32 | tr -d "=+/" | cut -c1-32
}

# Function to prompt for input with default value
prompt_input() {
    local prompt="$1"
    local default="$2"
    local var_name="$3"
    
    if [ -n "$default" ]; then
        read -p "$prompt [$default]: " input
        eval "$var_name=\"\${input:-$default}\""
    else
        read -p "$prompt: " input
        eval "$var_name=\"$input\""
    fi
}

# Function to prompt for password
prompt_password() {
    local prompt="$1"
    local var_name="$2"
    
    read -s -p "$prompt: " input
    echo
    eval "$var_name=\"$input\""
}

print_header

echo "This wizard will help you configure your Kisaan Mela production environment."
echo "Press Enter to use default values or type your own values."
echo ""

# Check if env.production already exists
if [ -f "env.production" ]; then
    echo -e "${YELLOW}Warning: env.production already exists.${NC}"
    read -p "Do you want to overwrite it? (y/N): " overwrite
    if [[ ! $overwrite =~ ^[Yy]$ ]]; then
        echo "Exiting without changes."
        exit 0
    fi
fi

# Start configuration
print_section "Basic Configuration"

# Generate secure secrets
JWT_SECRET=$(generate_secret)
JWT_REFRESH_SECRET=$(generate_secret)
MONGO_ROOT_PASSWORD=$(generate_secret)
REDIS_PASSWORD=$(generate_secret)

print_info "Generated secure secrets automatically"

# Database Configuration
print_section "Database Configuration"

echo "Choose your database setup:"
echo "1. MongoDB Atlas (Cloud - Recommended)"
echo "2. Local MongoDB (Docker)"
read -p "Enter your choice (1-2): " db_choice

case $db_choice in
    1)
        echo ""
        print_info "MongoDB Atlas Setup:"
        echo "1. Go to https://cloud.mongodb.com/"
        echo "2. Create a new cluster"
        echo "3. Get your connection string"
        echo ""
        prompt_input "MongoDB Atlas Connection String" "" DATABASE_URL
        ;;
    2)
        DATABASE_URL="mongodb://admin:$MONGO_ROOT_PASSWORD@mongodb:27017/kisaanmela_prod?authSource=admin"
        print_success "Using local MongoDB with Docker"
        ;;
    *)
        echo "Invalid choice, using local MongoDB"
        DATABASE_URL="mongodb://admin:$MONGO_ROOT_PASSWORD@mongodb:27017/kisaanmela_prod?authSource=admin"
        ;;
esac

# AWS Configuration
print_section "AWS S3 Configuration (File Storage)"

echo "You'll need AWS S3 for file uploads. Get your credentials from AWS Console."
prompt_input "AWS Access Key ID" "" AWS_ACCESS_KEY_ID
prompt_input "AWS Secret Access Key" "" AWS_SECRET_ACCESS_KEY
prompt_input "AWS Region" "us-east-1" AWS_REGION
prompt_input "S3 Bucket Name" "kisaanmela-uploads" AWS_S3_BUCKET

# Email Configuration
print_section "Email Configuration"

echo "Configure SMTP for sending emails:"
prompt_input "SMTP Host" "smtp.gmail.com" SMTP_HOST
prompt_input "SMTP Port" "587" SMTP_PORT
prompt_input "SMTP Username/Email" "noreply@kisaanmela.com" SMTP_USER
prompt_password "SMTP Password/App Password" SMTP_PASS
prompt_input "From Email" "noreply@kisaanmela.com" FROM_EMAIL
prompt_input "From Name" "Kisaan Mela" FROM_NAME

# Payment Configuration
print_section "Payment Configuration (Stripe)"

echo "Configure Stripe for payments:"
echo "Get your keys from: https://dashboard.stripe.com/apikeys"
prompt_input "Stripe Secret Key (sk_live_...)" "" STRIPE_SECRET_KEY
prompt_input "Stripe Publishable Key (pk_live_...)" "" STRIPE_PUBLISHABLE_KEY
prompt_input "Stripe Webhook Secret (whsec_...)" "" STRIPE_WEBHOOK_SECRET

# SMS Configuration
print_section "SMS Configuration (Twilio)"

echo "Configure Twilio for SMS:"
echo "Get your credentials from: https://console.twilio.com/"
prompt_input "Twilio Account SID" "" TWILIO_ACCOUNT_SID
prompt_input "Twilio Auth Token" "" TWILIO_AUTH_TOKEN
prompt_input "Twilio Phone Number" "" TWILIO_PHONE_NUMBER

# Create env.production file
print_section "Creating Production Environment File"

cat > env.production << EOF
# Kisaan Mela Production Environment Variables
# Generated on $(date)

# Database Configuration
DATABASE_URL=$DATABASE_URL
DB_NAME=kisaanmela_prod

# JWT Configuration
JWT_SECRET=$JWT_SECRET
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET
JWT_REFRESH_EXPIRE=30d

# API Configuration
API_URL=https://api.kisaanmela.com/api
NEXT_PUBLIC_API_URL=https://api.kisaanmela.com/api
PORT=5000
NODE_ENV=production

# Frontend URLs
NEXT_PUBLIC_WEB_URL=https://kisaanmela.com
FRONTEND_URL=https://kisaanmela.com

# AWS Configuration
AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
AWS_REGION=$AWS_REGION
AWS_S3_BUCKET=$AWS_S3_BUCKET

# Email Configuration
SMTP_HOST=$SMTP_HOST
SMTP_PORT=$SMTP_PORT
SMTP_USER=$SMTP_USER
SMTP_PASS=$SMTP_PASS
FROM_EMAIL=$FROM_EMAIL
FROM_NAME=$FROM_NAME

# Payment Configuration
STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY
STRIPE_PUBLISHABLE_KEY=$STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET=$STRIPE_WEBHOOK_SECRET

# SMS Configuration
TWILIO_ACCOUNT_SID=$TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN=$TWILIO_AUTH_TOKEN
TWILIO_PHONE_NUMBER=$TWILIO_PHONE_NUMBER

# Redis Configuration
REDIS_URL=redis://redis:6379
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=$REDIS_PASSWORD

# MongoDB Root Credentials (for Docker)
MONGO_ROOT_USER=admin
MONGO_ROOT_PASSWORD=$MONGO_ROOT_PASSWORD

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload Limits
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp

# Security
BCRYPT_ROUNDS=12
CORS_ORIGIN=https://kisaanmela.com

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log

# Mobile App Configuration
EXPO_PUBLIC_API_URL=https://api.kisaanmela.com/api
EXPO_PUBLIC_WEB_URL=https://kisaanmela.com

# Development Tools (disabled in production)
ENABLE_SWAGGER=false
ENABLE_GRAPHQL_PLAYGROUND=false

# SSL Configuration
SSL_CERT_PATH=/etc/ssl/certs/kisaanmela.com.crt
SSL_KEY_PATH=/etc/ssl/private/kisaanmela.com.key
EOF

print_success "Environment configuration created successfully!"

echo ""
print_section "Next Steps"

echo "1. Review your configuration:"
echo "   nano env.production"
echo ""
echo "2. Deploy your application:"
echo "   ./deploy-kisaanmela.sh"
echo ""
echo "3. Configure your domain DNS:"
echo "   Point kisaanmela.com to your server IP"
echo "   Point www.kisaanmela.com to your server IP"
echo "   Point api.kisaanmela.com to your server IP"
echo ""
echo "4. Test your deployment:"
echo "   https://kisaanmela.com"
echo "   https://api.kisaanmela.com/api/health"
echo ""

print_success "Setup completed! Your Kisaan Mela is ready for deployment."
