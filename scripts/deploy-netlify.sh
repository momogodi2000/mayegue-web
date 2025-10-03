#!/bin/bash

# Deploy to Netlify Script
# This script builds the application and deploys it to Netlify

set -e  # Exit on any error

echo "🚀 Starting Netlify deployment process..."

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI is not installed. Installing..."
    npm install -g netlify-cli
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the project root directory."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run linting
echo "🔍 Running linter..."
npm run lint

# Run type checking
echo "🔧 Running type check..."
npm run type-check

# Run tests
echo "🧪 Running tests..."
npm run test:ci

# Build the application
echo "🏗️ Building application..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed: dist directory not found"
    exit 1
fi

# Deploy to Netlify
echo "🌐 Deploying to Netlify..."

# Check if this is a production deployment
if [ "$1" = "production" ] || [ "$1" = "prod" ]; then
    echo "🚀 Deploying to production..."
    netlify deploy --prod --dir=dist
else
    echo "🔄 Deploying preview..."
    netlify deploy --dir=dist
fi

echo "✅ Deployment completed successfully!"

# Show deployment URL
echo "🔗 Your site is available at:"
netlify status --json | jq -r '.site_url // .deploy_url // "URL not available"'

echo "📊 Deployment summary:"
echo "- Build directory: dist"
echo "- Deployment type: $([ "$1" = "production" ] || [ "$1" = "prod" ] && echo "Production" || echo "Preview")"
echo "- Timestamp: $(date)"

echo "🎉 Deployment process completed!"
