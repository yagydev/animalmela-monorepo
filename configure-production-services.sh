#!/bin/bash

# Production Services Configuration Script
# This script guides you through setting up external services for production

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

print_step() {
    echo -e "${GREEN}[STEP]${NC} $1"
}

print_header "🚀 PRODUCTION SERVICES CONFIGURATION"

echo "This script will guide you through setting up external services for production:"
echo "• MongoDB Atlas (Database)"
echo "• AWS S3 (File Storage)"
echo "• Stripe (Payments)"
echo "• Email Service (Notifications)"
echo "• Domain & SSL (Security)"
echo ""

read -p "Do you want to continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Configuration cancelled."
    exit 1
fi

# Create production environment file if it doesn't exist
if [ ! -f ".env.production" ]; then
    cp env.example .env.production
    print_info "Created .env.production from template"
fi

print_header "1. MONGODB ATLAS SETUP"

echo "MongoDB Atlas is a fully managed cloud database service."
echo ""
echo "📋 Setup Steps:"
echo "1. Go to https://cloud.mongodb.com/"
echo "2. Create a free account and verify email"
echo "3. Create a new cluster (M0 free tier is fine for testing)"
echo "4. Create a database user with admin privileges"
echo "5. Configure network access (allow access from anywhere for now)"
echo "6. Get your connection string"
echo ""

read -p "Have you completed the MongoDB Atlas setup? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    read -p "Enter your MongoDB Atlas connection string: " MONGODB_URL
    
    # Update .env.production
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s|DATABASE_URL=.*|DATABASE_URL=$MONGODB_URL|" .env.production
    else
        sed -i "s|DATABASE_URL=.*|DATABASE_URL=$MONGODB_URL|" .env.production
    fi
    
    print_success "MongoDB Atlas configured"
else
    print_warning "Skipping MongoDB Atlas setup"
    echo "📚 Setup guide: docs/mongodb-atlas-setup.md"
fi

print_header "2. AWS S3 SETUP"

echo "AWS S3 is required for storing uploaded files (pet photos, documents, etc.)"
echo ""
echo "📋 Setup Steps:"
echo "1. Go to AWS Console (https://aws.amazon.com/)"
echo "2. Create an AWS account (requires credit card)"
echo "3. Go to S3 service and create a new bucket"
echo "4. Configure bucket permissions for public read access"
echo "5. Go to IAM and create a new user with S3 permissions"
echo "6. Generate access keys for the user"
echo ""

read -p "Have you completed the AWS S3 setup? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    read -p "Enter your AWS Access Key ID: " AWS_ACCESS_KEY_ID
    read -s -p "Enter your AWS Secret Access Key: " AWS_SECRET_ACCESS_KEY
    echo
    read -p "Enter your AWS Region [us-east-1]: " AWS_REGION
    AWS_REGION=${AWS_REGION:-us-east-1}
    read -p "Enter your S3 Bucket Name: " AWS_S3_BUCKET
    
    # Update .env.production
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s|AWS_ACCESS_KEY_ID=.*|AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID|" .env.production
        sed -i '' "s|AWS_SECRET_ACCESS_KEY=.*|AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY|" .env.production
        sed -i '' "s|AWS_REGION=.*|AWS_REGION=$AWS_REGION|" .env.production
        sed -i '' "s|AWS_S3_BUCKET=.*|AWS_S3_BUCKET=$AWS_S3_BUCKET|" .env.production
    else
        sed -i "s|AWS_ACCESS_KEY_ID=.*|AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID|" .env.production
        sed -i "s|AWS_SECRET_ACCESS_KEY=.*|AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY|" .env.production
        sed -i "s|AWS_REGION=.*|AWS_REGION=$AWS_REGION|" .env.production
        sed -i "s|AWS_S3_BUCKET=.*|AWS_S3_BUCKET=$AWS_S3_BUCKET|" .env.production
    fi
    
    print_success "AWS S3 configured"
else
    print_warning "Skipping AWS S3 setup"
    echo "📚 Setup guide: docs/aws-s3-setup.md"
fi

print_header "3. STRIPE PAYMENT SETUP"

echo "Stripe handles all payment processing for your platform."
echo ""
echo "📋 Setup Steps:"
echo "1. Go to https://stripe.com/"
echo "2. Create a Stripe account"
echo "3. Complete business verification (required for live payments)"
echo "4. Go to Developers > API Keys"
echo "5. Get your live secret and publishable keys"
echo "6. Set up webhooks for payment events"
echo ""

read -p "Have you completed the Stripe setup? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    read -s -p "Enter your Stripe Live Secret Key (sk_live_...): " STRIPE_SECRET_KEY
    echo
    read -p "Enter your Stripe Live Publishable Key (pk_live_...): " STRIPE_PUBLISHABLE_KEY
    read -s -p "Enter your Stripe Webhook Secret (whsec_...): " STRIPE_WEBHOOK_SECRET
    echo
    
    # Update .env.production
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s|STRIPE_SECRET_KEY=.*|STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY|" .env.production
        sed -i '' "s|STRIPE_PUBLISHABLE_KEY=.*|STRIPE_PUBLISHABLE_KEY=$STRIPE_PUBLISHABLE_KEY|" .env.production
        sed -i '' "s|STRIPE_WEBHOOK_SECRET=.*|STRIPE_WEBHOOK_SECRET=$STRIPE_WEBHOOK_SECRET|" .env.production
    else
        sed -i "s|STRIPE_SECRET_KEY=.*|STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY|" .env.production
        sed -i "s|STRIPE_PUBLISHABLE_KEY=.*|STRIPE_PUBLISHABLE_KEY=$STRIPE_PUBLISHABLE_KEY|" .env.production
        sed -i "s|STRIPE_WEBHOOK_SECRET=.*|STRIPE_WEBHOOK_SECRET=$STRIPE_WEBHOOK_SECRET|" .env.production
    fi
    
    print_success "Stripe configured"
else
    print_warning "Skipping Stripe setup"
    echo "📚 Setup guide: docs/stripe-setup.md"
fi

print_header "4. EMAIL SERVICE SETUP"

echo "Email service is required for user notifications and verification."
echo ""
echo "Choose an email service:"
echo "1. Gmail (with app-specific password)"
echo "2. SendGrid"
echo "3. Other SMTP service"
echo "4. Skip for now"
echo ""

read -p "Choose option (1-4): " email_choice

case $email_choice in
    1)
        echo ""
        echo "📋 Gmail Setup:"
        echo "1. Enable 2-factor authentication on your Gmail account"
        echo "2. Go to Google Account > Security > App passwords"
        echo "3. Generate an app password for 'Mail'"
        echo ""
        
        read -p "Have you generated a Gmail app password? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            read -p "Enter your Gmail address: " SMTP_USER
            read -s -p "Enter your Gmail app password: " SMTP_PASS
            echo
            
            SMTP_HOST="smtp.gmail.com"
            SMTP_PORT="587"
            
            # Update .env.production
            if [[ "$OSTYPE" == "darwin"* ]]; then
                sed -i '' "s|SMTP_HOST=.*|SMTP_HOST=$SMTP_HOST|" .env.production
                sed -i '' "s|SMTP_PORT=.*|SMTP_PORT=$SMTP_PORT|" .env.production
                sed -i '' "s|SMTP_USER=.*|SMTP_USER=$SMTP_USER|" .env.production
                sed -i '' "s|SMTP_PASS=.*|SMTP_PASS=$SMTP_PASS|" .env.production
            else
                sed -i "s|SMTP_HOST=.*|SMTP_HOST=$SMTP_HOST|" .env.production
                sed -i "s|SMTP_PORT=.*|SMTP_PORT=$SMTP_PORT|" .env.production
                sed -i "s|SMTP_USER=.*|SMTP_USER=$SMTP_USER|" .env.production
                sed -i "s|SMTP_PASS=.*|SMTP_PASS=$SMTP_PASS|" .env.production
            fi
            
            print_success "Gmail email service configured"
        fi
        ;;
    2)
        echo ""
        echo "📋 SendGrid Setup:"
        echo "1. Go to https://sendgrid.com/"
        echo "2. Create account and verify"
        echo "3. Go to Settings > API Keys"
        echo "4. Create API key with full access"
        echo ""
        
        read -p "Have you created a SendGrid API key? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            read -s -p "Enter your SendGrid API Key: " SENDGRID_API_KEY
            echo
            
            SMTP_HOST="smtp.sendgrid.net"
            SMTP_PORT="587"
            SMTP_USER="apikey"
            SMTP_PASS="$SENDGRID_API_KEY"
            
            # Update .env.production
            if [[ "$OSTYPE" == "darwin"* ]]; then
                sed -i '' "s|SMTP_HOST=.*|SMTP_HOST=$SMTP_HOST|" .env.production
                sed -i '' "s|SMTP_PORT=.*|SMTP_PORT=$SMTP_PORT|" .env.production
                sed -i '' "s|SMTP_USER=.*|SMTP_USER=$SMTP_USER|" .env.production
                sed -i '' "s|SMTP_PASS=.*|SMTP_PASS=$SMTP_PASS|" .env.production
            else
                sed -i "s|SMTP_HOST=.*|SMTP_HOST=$SMTP_HOST|" .env.production
                sed -i "s|SMTP_PORT=.*|SMTP_PORT=$SMTP_PORT|" .env.production
                sed -i "s|SMTP_USER=.*|SMTP_USER=$SMTP_USER|" .env.production
                sed -i "s|SMTP_PASS=.*|SMTP_PASS=$SMTP_PASS|" .env.production
            fi
            
            print_success "SendGrid email service configured"
        fi
        ;;
    3)
        echo ""
        read -p "Enter SMTP Host: " SMTP_HOST
        read -p "Enter SMTP Port [587]: " SMTP_PORT
        SMTP_PORT=${SMTP_PORT:-587}
        read -p "Enter SMTP Username: " SMTP_USER
        read -s -p "Enter SMTP Password: " SMTP_PASS
        echo
        
        # Update .env.production
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s|SMTP_HOST=.*|SMTP_HOST=$SMTP_HOST|" .env.production
            sed -i '' "s|SMTP_PORT=.*|SMTP_PORT=$SMTP_PORT|" .env.production
            sed -i '' "s|SMTP_USER=.*|SMTP_USER=$SMTP_USER|" .env.production
            sed -i '' "s|SMTP_PASS=.*|SMTP_PASS=$SMTP_PASS|" .env.production
        else
            sed -i "s|SMTP_HOST=.*|SMTP_HOST=$SMTP_HOST|" .env.production
            sed -i "s|SMTP_PORT=.*|SMTP_PORT=$SMTP_PORT|" .env.production
            sed -i "s|SMTP_USER=.*|SMTP_USER=$SMTP_USER|" .env.production
            sed -i "s|SMTP_PASS=.*|SMTP_PASS=$SMTP_PASS|" .env.production
        fi
        
        print_success "Custom SMTP service configured"
        ;;
    4)
        print_warning "Skipping email service setup"
        ;;
esac

print_header "5. DOMAIN & SSL SETUP"

echo "For production deployment, you'll need:"
echo "• A domain name (e.g., animall.com)"
echo "• SSL certificates for security"
echo ""

read -p "Do you have a domain name ready? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter your domain name (e.g., animall.com): " DOMAIN_NAME
    
    WEB_URL="https://$DOMAIN_NAME"
    API_URL="https://api.$DOMAIN_NAME/api"
    
    # Update .env.production
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s|NEXT_PUBLIC_WEB_URL=.*|NEXT_PUBLIC_WEB_URL=$WEB_URL|" .env.production
        sed -i '' "s|NEXT_PUBLIC_API_URL=.*|NEXT_PUBLIC_API_URL=$API_URL|" .env.production
        sed -i '' "s|FRONTEND_URL=.*|FRONTEND_URL=$WEB_URL|" .env.production
        sed -i '' "s|API_URL=.*|API_URL=$API_URL|" .env.production
        sed -i '' "s|CORS_ORIGIN=.*|CORS_ORIGIN=$WEB_URL|" .env.production
    else
        sed -i "s|NEXT_PUBLIC_WEB_URL=.*|NEXT_PUBLIC_WEB_URL=$WEB_URL|" .env.production
        sed -i "s|NEXT_PUBLIC_API_URL=.*|NEXT_PUBLIC_API_URL=$API_URL|" .env.production
        sed -i "s|FRONTEND_URL=.*|FRONTEND_URL=$WEB_URL|" .env.production
        sed -i "s|API_URL=.*|API_URL=$API_URL|" .env.production
        sed -i "s|CORS_ORIGIN=.*|CORS_ORIGIN=$WEB_URL|" .env.production
    fi
    
    print_success "Domain configuration updated"
    
    echo ""
    echo "📋 SSL Certificate Setup:"
    echo "• For Docker deployment: Use Let's Encrypt with Certbot"
    echo "• For Vercel deployment: SSL is automatic"
    echo "• For manual deployment: Configure SSL with your web server"
    echo ""
    echo "📚 Detailed guide: docs/domain-ssl-setup.md"
else
    print_warning "Skipping domain setup"
    echo "📚 Setup guide: docs/domain-ssl-setup.md"
fi

print_header "✅ CONFIGURATION COMPLETE"

echo ""
echo "🎉 Production services configuration completed!"
echo ""
echo "📋 Configuration Summary:"
echo "• Environment file: .env.production"
echo "• MongoDB: $(grep -q "mongodb+srv" .env.production 2>/dev/null && echo "Configured" || echo "Not configured")"
echo "• AWS S3: $(grep -q "AKIA" .env.production 2>/dev/null && echo "Configured" || echo "Not configured")"
echo "• Stripe: $(grep -q "sk_live" .env.production 2>/dev/null && echo "Configured" || echo "Not configured")"
echo "• Email: $(grep -q "@" .env.production 2>/dev/null && echo "Configured" || echo "Not configured")"
echo ""

echo "🚀 Ready for Production Deployment!"
echo ""
echo "📋 Next Steps:"
echo "1. Review your .env.production file"
echo "2. Test services in development mode"
echo "3. Choose your deployment method:"
echo "   • Docker: ./deploy.sh docker"
echo "   • Vercel: ./deploy.sh vercel"
echo "   • Manual: ./deploy.sh manual"
echo ""

print_success "Your platform is ready for production!"
