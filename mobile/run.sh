#!/bin/bash

# Animall Mobile App Run Script
# This script helps you run the React Native app with all necessary setup

echo "🐕 Welcome to Animall Mobile App!"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the mobile app root directory"
    exit 1
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for required tools
echo "🔍 Checking requirements..."

if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if React Native CLI is installed
if ! command_exists npx; then
    echo "❌ npx is not available. Please install it."
    exit 1
fi

echo "✅ Dependencies installed"

# Function to run Android
run_android() {
    echo "🤖 Starting Android app..."
    echo "Make sure you have:"
    echo "1. Android Studio installed"
    echo "2. Android SDK configured"
    echo "3. An Android device connected or emulator running"
    echo ""
    
    # Check if Android SDK is available
    if [ -z "$ANDROID_HOME" ]; then
        echo "⚠️  ANDROID_HOME is not set. Please set it in your environment."
        echo "   Example: export ANDROID_HOME=/Users/username/Library/Android/sdk"
    fi
    
    npx react-native run-android
}

# Function to run iOS
run_ios() {
    echo "🍎 Starting iOS app..."
    echo "Make sure you have:"
    echo "1. Xcode installed"
    echo "2. iOS Simulator or physical device"
    echo ""
    
    # Install iOS dependencies
    if [ -d "ios" ]; then
        echo "📱 Installing iOS dependencies..."
        cd ios && pod install && cd ..
    fi
    
    npx react-native run-ios
}

# Function to start Metro bundler
start_metro() {
    echo "🚀 Starting Metro bundler..."
    npx react-native start
}

# Main menu
echo ""
echo "What would you like to do?"
echo "1) Run Android app"
echo "2) Run iOS app"
echo "3) Start Metro bundler only"
echo "4) Clean and rebuild"
echo "5) Exit"
echo ""

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        run_android
        ;;
    2)
        run_ios
        ;;
    3)
        start_metro
        ;;
    4)
        echo "🧹 Cleaning project..."
        npx react-native clean
        npm install
        if [ -d "ios" ]; then
            cd ios && pod install && cd ..
        fi
        echo "✅ Project cleaned and rebuilt"
        ;;
    5)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🎉 Animall Mobile App is ready!"
echo "Happy coding! 🐕"
