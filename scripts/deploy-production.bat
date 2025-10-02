@echo off
REM Firebase Production Deployment Script for Windows
REM Run this script to deploy to production

echo 🚀 Starting Ma’a yegue production deployment...

REM Check if Firebase CLI is installed
firebase --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Firebase CLI is not installed. Please install it first:
    echo npm install -g firebase-tools
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install Node.js and npm first.
    exit /b 1
)

REM Check if logged in to Firebase
firebase projects:list >nul 2>&1
if errorlevel 1 (
    echo ❌ Please login to Firebase first:
    echo firebase login
    exit /b 1
)

REM Ensure we're using the production project
echo 📋 Setting Firebase project to production...
firebase use production

REM Install dependencies
echo 📦 Installing dependencies...
npm ci

REM Check environment variables
if not exist ".env.production" (
    echo ❌ .env.production file not found!
    echo Please create .env.production based on .env.production.example
    exit /b 1
)

REM Run type checking
echo 🔍 Running type checking...
npm run type-check

REM Run linting
echo 🧹 Running linting...
npm run lint

REM Run tests (if any)
npm run test:ci >nul 2>&1
if not errorlevel 1 (
    echo 🧪 Running tests...
    npm run test:ci
)

REM Build the application
echo 🏗️  Building production app...
npm run build

REM Check if build directory exists
if not exist "dist" (
    echo ❌ Build failed - dist directory not found
    exit /b 1
)

REM Deploy Firestore rules and indexes
echo 🛡️  Deploying Firestore rules and indexes...
firebase deploy --only firestore

REM Deploy Storage rules
echo 📁 Deploying Storage rules...
firebase deploy --only storage

REM Deploy hosting
echo 🌐 Deploying web app...
firebase deploy --only hosting

REM Get project info
for /f "tokens=4" %%i in ('firebase use ^| findstr "Now using project"') do set PROJECT_ID=%%i
set HOSTING_URL=https://%PROJECT_ID%.web.app

echo.
echo ✅ Deployment completed successfully!
echo 🌐 App URL: %HOSTING_URL%
echo 📊 Firebase Console: https://console.firebase.google.com/project/%PROJECT_ID%
echo.
echo 🔍 Next steps:
echo 1. Verify the app is working correctly
echo 2. Check Firebase Console for any issues
echo 3. Monitor performance and analytics
echo.
echo 📝 Don't forget to:
echo - Update DNS records if using custom domain
echo - Set up monitoring alerts
echo - Configure CI/CD pipeline