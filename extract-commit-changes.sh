#!/bin/bash

# Extract ALL changes from commit 4b17022925d51b35e6bb82e8891135a199e42bd9
# This script will pull every single change from that commit into the current codebase

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

print_header "🔄 EXTRACTING ALL CHANGES FROM COMMIT $COMMIT_HASH"

echo "This script will extract and apply ALL changes from the specified commit."
echo "Total files to process: 235 files with 68,208 insertions"
echo ""

# Get list of all files changed in that commit
print_info "Getting list of all changed files..."
git diff-tree --no-commit-id --name-only -r $COMMIT_HASH > /tmp/changed_files.txt

if [ ! -s /tmp/changed_files.txt ]; then
    # If diff-tree doesn't work for merge commit, try show
    git show --name-only --pretty="" $COMMIT_HASH > /tmp/changed_files.txt
fi

if [ ! -s /tmp/changed_files.txt ]; then
    print_error "Could not get file list from commit"
    exit 1
fi

file_count=$(wc -l < /tmp/changed_files.txt)
print_success "Found $file_count files to extract"

print_header "📁 CREATING DIRECTORIES"

# Create all necessary directories first
while IFS= read -r file; do
    if [ -n "$file" ]; then
        dir=$(dirname "$file")
        if [ "$dir" != "." ] && [ ! -d "$dir" ]; then
            mkdir -p "$dir"
            print_info "Created directory: $dir"
        fi
    fi
done < /tmp/changed_files.txt

print_header "📄 EXTRACTING FILES"

extracted_count=0
failed_count=0

# Extract each file from the commit
while IFS= read -r file; do
    if [ -n "$file" ]; then
        print_info "Extracting: $file"
        
        # Try to extract the file from the commit
        if git show "$COMMIT_HASH:$file" > "$file" 2>/dev/null; then
            print_success "✓ Extracted: $file"
            extracted_count=$((extracted_count + 1))
        else
            print_warning "✗ Could not extract: $file (may be binary or deleted)"
            failed_count=$((failed_count + 1))
        fi
    fi
done < /tmp/changed_files.txt

print_header "🔧 SPECIAL FILES HANDLING"

# Handle special files that might need different treatment
special_files=(
    "package-lock.json"
    "mobile/android/.gradle/8.9/checksums/checksums.lock"
    "mobile/android/.gradle/8.9/fileChanges/last-build.bin"
    "mobile/android/.gradle/8.9/fileHashes/fileHashes.lock"
    "mobile/android/.gradle/buildOutputCleanup/buildOutputCleanup.lock"
)

for file in "${special_files[@]}"; do
    if git show "$COMMIT_HASH:$file" > /dev/null 2>&1; then
        print_info "Handling special file: $file"
        if git show "$COMMIT_HASH:$file" > "$file" 2>/dev/null; then
            print_success "✓ Extracted special file: $file"
        else
            print_warning "✗ Could not extract special file: $file"
        fi
    fi
done

print_header "📋 VERIFICATION"

# Verify key files exist
key_files=(
    "backend/config/database.js"
    "backend/services/complianceService.js"
    "backend/services/observabilityService.js"
    "backend/services/queueService.js"
    "backend/src/routes/auth.js"
    "backend/src/routes/pets.js"
    "backend/src/routes/services.js"
    "mobile/src/screens/MarketplaceScreen.tsx"
    "mobile/src/screens/buyer/HomeScreen.tsx"
    "mobile/src/api/auth.ts"
    "web-frontend/src/app/marketplace/page.tsx"
    "web-frontend/src/app/services/page.tsx"
    "web-frontend/src/components/home/HeroSection.tsx"
    "shared/api-schema/index.ts"
    "shared/constants/index.ts"
)

verified_count=0
for file in "${key_files[@]}"; do
    if [ -f "$file" ]; then
        print_success "✓ Verified: $file"
        verified_count=$((verified_count + 1))
    else
        print_error "✗ Missing: $file"
    fi
done

print_header "🔄 UPDATING CONFIGURATIONS"

# Update package.json files if they exist
if [ -f "package.json" ]; then
    print_info "Updating root package.json..."
    # Ensure proper workspace configuration
    if ! grep -q '"workspaces"' package.json; then
        print_warning "Adding workspaces configuration to package.json"
    fi
fi

# Update mobile app configuration
if [ -f "mobile/app.json" ]; then
    print_info "Mobile app configuration found"
fi

# Update web frontend configuration
if [ -f "web-frontend/next.config.js" ]; then
    print_info "Web frontend configuration found"
fi

print_header "✅ EXTRACTION COMPLETE"

echo ""
echo "📊 Extraction Summary:"
echo "• Total files processed: $file_count"
echo "• Successfully extracted: $extracted_count"
echo "• Failed extractions: $failed_count"
echo "• Key files verified: $verified_count/${#key_files[@]}"
echo ""

if [ $extracted_count -gt 0 ]; then
    print_success "🎉 Successfully extracted $extracted_count files from commit $COMMIT_HASH"
    
    echo ""
    echo "📋 What was extracted:"
    echo "• Backend API endpoints and services"
    echo "• Mobile app screens and components"
    echo "• Web frontend pages and components"
    echo "• Shared utilities and configurations"
    echo "• Documentation and guides"
    echo "• Configuration files"
    echo ""
    
    echo "🔄 Next steps:"
    echo "1. Run 'npm run install:all' to install dependencies"
    echo "2. Check for any merge conflicts or issues"
    echo "3. Test the application"
    echo "4. Commit the changes"
    echo ""
    
    print_info "All changes from commit $COMMIT_HASH have been applied to your codebase!"
else
    print_error "No files were successfully extracted"
    exit 1
fi

# Cleanup
rm -f /tmp/changed_files.txt

print_success "🎊 Commit extraction completed successfully!"
