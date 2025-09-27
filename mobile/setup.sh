#!/bin/bash

# Pashu Marketplace Mobile App Setup Script
# This script helps set up the React Native mobile app

echo "🐄 Setting up Pashu Marketplace Mobile App..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if React Native CLI is installed
if ! command -v react-native &> /dev/null; then
    echo "📦 Installing React Native CLI..."
    npm install -g react-native-cli
fi

echo "✅ React Native CLI installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install missing babel plugin
echo "📦 Installing babel-plugin-module-resolver..."
npm install babel-plugin-module-resolver --save-dev

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
    echo "⚠️  Please update .env file with your configuration"
fi

# Android setup
if [ -d "android" ]; then
    echo "🤖 Setting up Android..."
    cd android
    ./gradlew clean
    cd ..
    echo "✅ Android setup complete"
fi

# iOS setup (macOS only)
if [[ "$OSTYPE" == "darwin"* ]] && [ -d "ios" ]; then
    echo "🍎 Setting up iOS..."
    if command -v pod &> /dev/null; then
        cd ios
        pod install
        cd ..
        echo "✅ iOS setup complete"
    else
        echo "⚠️  CocoaPods not installed. Please install CocoaPods for iOS development."
    fi
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📱 To run the app:"
echo "   Android: npm run android"
echo "   iOS:     npm run ios"
echo "   Metro:   npm start"
echo ""
echo "📚 For more information, check the README.md file"
echo ""
echo "🐄 Happy coding with Pashu Marketplace!"
