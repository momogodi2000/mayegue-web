#!/bin/bash

# Firebase Production Deployment Script
# Run this script to deploy to production

set -e

echo "🚀 Starting Mayegue production deployment..."

# Check if required tools are installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI is not installed. Please install it first:"
    echo "npm install -g firebase-tools"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js and npm first."
    exit 1
fi

# Check if logged in to Firebase
if ! firebase projects:list > /dev/null 2>&1; then
    echo "❌ Please login to Firebase first:"
    echo "firebase login"
    exit 1
fi

# Ensure we're using the production project
echo "📋 Setting Firebase project to production..."
firebase use production

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Check environment variables
if [ ! -f ".env.production" ]; then
    echo "❌ .env.production file not found!"
    echo "Please create .env.production based on .env.production.example"
    exit 1
fi

# Run type checking
echo "🔍 Running type checking..."
npm run type-check

# Run linting
echo "🧹 Running linting..."
npm run lint

# Run tests (if any)
if npm run test:ci > /dev/null 2>&1; then
    echo "🧪 Running tests..."
    npm run test:ci
fi

# Build the application
echo "🏗️  Building production app..."
npm run build

# Check if build directory exists
if [ ! -d "dist" ]; then
    echo "❌ Build failed - dist directory not found"
    exit 1
fi

# Deploy Firestore rules and indexes
echo "🛡️  Deploying Firestore rules and indexes..."
firebase deploy --only firestore

# Deploy Storage rules
echo "📁 Deploying Storage rules..."
firebase deploy --only storage

# Deploy hosting
echo "🌐 Deploying web app..."
firebase deploy --only hosting

# Get hosting URL
PROJECT_ID=$(firebase use | grep "Now using project" | cut -d' ' -f4)
HOSTING_URL="https://${PROJECT_ID}.web.app"

echo ""
echo "✅ Deployment completed successfully!"
echo "🌐 App URL: ${HOSTING_URL}"
echo "📊 Firebase Console: https://console.firebase.google.com/project/${PROJECT_ID}"
echo ""
echo "🔍 Next steps:"
echo "1. Verify the app is working correctly"
echo "2. Check Firebase Console for any issues"
echo "3. Monitor performance and analytics"
echo ""
echo "📝 Don't forget to:"
echo "- Update DNS records if using custom domain"
echo "- Set up monitoring alerts"
echo "- Configure CI/CD pipeline"