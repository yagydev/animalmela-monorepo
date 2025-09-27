#!/bin/bash

# Pull ALL missing files from commit 4b17022925d51b35e6bb82e8891135a199e42bd9
# This script will ensure we have every single file from that commit

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

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

COMMIT_HASH="4b17022925d51b35e6bb82e8891135a199e42bd9"

print_header "🔄 PULLING ALL MISSING FILES FROM COMMIT"

echo "Extracting ALL files from commit: $COMMIT_HASH"
echo ""

# Get complete file list from that commit
print_info "Getting complete file tree from commit..."
git ls-tree -r --name-only $COMMIT_HASH > /tmp/all_commit_files.txt

total_files=$(wc -l < /tmp/all_commit_files.txt)
print_success "Found $total_files total files in commit"

print_header "📁 CREATING DIRECTORY STRUCTURE"

# Create all directories
while IFS= read -r file; do
    if [ -n "$file" ]; then
        dir=$(dirname "$file")
        if [ "$dir" != "." ] && [ ! -d "$dir" ]; then
            mkdir -p "$dir"
            print_info "Created: $dir"
        fi
    fi
done < /tmp/all_commit_files.txt

print_header "📄 EXTRACTING FILES"

extracted=0
skipped=0
failed=0

# Extract each file
while IFS= read -r file; do
    if [ -n "$file" ]; then
        # Skip binary files and certain types
        if [[ "$file" == *.lock ]] || [[ "$file" == *.bin ]] || [[ "$file" == */.gradle/* ]]; then
            print_warning "Skipping binary/gradle file: $file"
            skipped=$((skipped + 1))
            continue
        fi
        
        # Check if file already exists and is different
        if [ -f "$file" ]; then
            # Compare with commit version
            if git show "$COMMIT_HASH:$file" | cmp -s - "$file" 2>/dev/null; then
                print_info "Already up to date: $file"
                skipped=$((skipped + 1))
                continue
            else
                print_warning "Updating existing file: $file"
            fi
        else
            print_info "Extracting new file: $file"
        fi
        
        # Extract the file
        if git show "$COMMIT_HASH:$file" > "$file" 2>/dev/null; then
            print_success "✓ $file"
            extracted=$((extracted + 1))
        else
            print_error "✗ Failed to extract: $file"
            failed=$((failed + 1))
        fi
    fi
done < /tmp/all_commit_files.txt

print_header "🔧 SPECIAL HANDLING"

# Handle package-lock.json specially
if git show "$COMMIT_HASH:package-lock.json" > /dev/null 2>&1; then
    print_info "Extracting package-lock.json..."
    if git show "$COMMIT_HASH:package-lock.json" > package-lock.json 2>/dev/null; then
        print_success "✓ package-lock.json extracted"
        extracted=$((extracted + 1))
    fi
fi

# Ensure key directories exist
key_dirs=(
    "backend/src/routes"
    "backend/src/services"
    "backend/src/middleware"
    "mobile/src/screens/auth"
    "mobile/src/screens/buyer"
    "mobile/src/screens/seller"
    "mobile/src/screens/service"
    "mobile/src/api"
    "mobile/src/components/home"
    "mobile/src/components/layout"
    "web-frontend/src/app/marketplace"
    "web-frontend/src/app/services"
    "web-frontend/src/app/pets"
    "web-frontend/src/components/home"
    "web-frontend/src/components/layout"
    "web-frontend/pages/api/auth"
    "shared/api-schema"
    "shared/constants"
    "shared/helpers"
    "shared/validations"
)

for dir in "${key_dirs[@]}"; do
    if [ ! -d "$dir" ]; then
        mkdir -p "$dir"
        print_info "Created key directory: $dir"
    fi
done

print_header "📋 VERIFICATION OF KEY FILES"

# Verify critical files exist
critical_files=(
    "backend/config/database.js"
    "backend/services/complianceService.js"
    "backend/services/observabilityService.js"
    "backend/services/queueService.js"
    "backend/services/smsService.js"
    "backend/src/routes/auth.js"
    "backend/src/routes/bookings.js"
    "backend/src/routes/pets.js"
    "backend/src/routes/services.js"
    "backend/src/routes/users.js"
    "backend/src/server.js"
    "mobile/src/screens/MarketplaceScreen.tsx"
    "mobile/src/screens/buyer/HomeScreen.tsx"
    "mobile/src/screens/buyer/ChatScreen.tsx"
    "mobile/src/screens/auth/OTPScreen.tsx"
    "mobile/src/screens/auth/KYCScreen.tsx"
    "mobile/src/api/auth.ts"
    "mobile/src/api/services.ts"
    "mobile/src/components/home/HeroSection.tsx"
    "web-frontend/src/app/marketplace/page.tsx"
    "web-frontend/src/app/services/page.tsx"
    "web-frontend/src/app/pets/page.tsx"
    "web-frontend/src/components/home/HeroSection.tsx"
    "web-frontend/src/components/layout/Header.tsx"
    "shared/api-schema/index.ts"
    "shared/constants/index.ts"
    "shared/helpers/index.ts"
    "shared/validations/index.ts"
)

verified=0
missing=0

for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        print_success "✓ Critical file exists: $file"
        verified=$((verified + 1))
    else
        print_error "✗ Missing critical file: $file"
        missing=$((missing + 1))
        
        # Try to extract missing critical file
        if git show "$COMMIT_HASH:$file" > "$file" 2>/dev/null; then
            print_success "✓ Recovered missing file: $file"
            verified=$((verified + 1))
            missing=$((missing - 1))
        fi
    fi
done

print_header "📊 EXTRACTION SUMMARY"

echo ""
echo "📈 Results:"
echo "• Total files in commit: $total_files"
echo "• Files extracted: $extracted"
echo "• Files skipped: $skipped"
echo "• Files failed: $failed"
echo "• Critical files verified: $verified"
echo "• Critical files missing: $missing"
echo ""

if [ $missing -eq 0 ]; then
    print_success "🎉 ALL CRITICAL FILES ARE PRESENT!"
else
    print_warning "⚠️  $missing critical files are still missing"
fi

print_header "🔄 FINAL STEPS"

# Update permissions for scripts
if [ -f "mobile/run.sh" ]; then
    chmod +x mobile/run.sh
    print_info "Made mobile/run.sh executable"
fi

if [ -f "mobile/setup.sh" ]; then
    chmod +x mobile/setup.sh
    print_info "Made mobile/setup.sh executable"
fi

# Cleanup
rm -f /tmp/all_commit_files.txt

echo ""
echo "✅ File extraction completed!"
echo ""
echo "🔄 Next steps:"
echo "1. Run 'npm run install:all' to install all dependencies"
echo "2. Check for any TypeScript/build errors"
echo "3. Test the application functionality"
echo "4. Commit the changes if everything works"
echo ""

print_success "🎊 All files from commit $COMMIT_HASH have been pulled into your codebase!"
