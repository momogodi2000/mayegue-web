#!/bin/bash

# Firebase Local Development Setup
# Sets up Firebase emulators for local development

set -e

echo "🔧 Setting up Firebase local development environment..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI is not installed. Installing..."
    npm install -g firebase-tools
fi

# Check if Java is installed (required for emulators)
if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed. Please install Java 8 or higher for Firebase emulators."
    exit 1
fi

# Login to Firebase (if not already logged in)
if ! firebase projects:list > /dev/null 2>&1; then
    echo "🔐 Please login to Firebase..."
    firebase login
fi

# Set development project
echo "📋 Setting Firebase project to development..."
firebase use development

# Initialize Firebase emulators if not already done
if [ ! -f "firebase.json" ]; then
    echo "🏗️  Initializing Firebase project..."
    firebase init
fi

# Create development environment file if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "📝 Creating development environment file..."
    cp .env.development.example .env.local
    echo "⚠️  Please edit .env.local with your development configuration"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Start Firebase emulators
echo "🚀 Starting Firebase emulators..."
echo "This will start:"
echo "  - Auth Emulator (port 9099)"
echo "  - Firestore Emulator (port 8080)"
echo "  - Storage Emulator (port 9199)"
echo "  - Hosting Emulator (port 5000)"
echo "  - Firebase UI (port 4000)"
echo ""
echo "🌐 Emulator UI will be available at: http://localhost:4000"
echo "🌐 App will be available at: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop emulators"

firebase emulators:start