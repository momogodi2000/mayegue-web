# 🔥 Firebase Emulator Setup Guide

## Overview
This guide explains how to set up Firebase emulators for local development to avoid Firebase permissions issues during development.

## Prerequisites
- Node.js 16+ installed
- Firebase CLI installed: `npm install -g firebase-tools`
- Firebase project configured

## Installation

### 1. Install Firebase Emulator Suite
```bash
npm install -g firebase-tools
firebase login
firebase init emulators
```

### 2. Configure Emulators
Select the following emulators:
- ✅ Authentication Emulator
- ✅ Firestore Emulator
- ✅ Storage Emulator
- ✅ Functions Emulator (optional)

### 3. Update firebase.json
```json
{
  "emulators": {
    "auth": {
      "port": 9099
    },
    "firestore": {
      "port": 8080
    },
    "storage": {
      "port": 9199
    },
    "ui": {
      "enabled": true,
      "port": 4000
    },
    "singleProjectMode": true
  }
}
```

## Development Setup

### 1. Start Emulators
```bash
firebase emulators:start
```

### 2. Update Environment Variables
Create `.env.local`:
```env
VITE_FIREBASE_USE_EMULATOR=true
VITE_FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
VITE_FIREBASE_FIRESTORE_EMULATOR_HOST=localhost:8080
VITE_FIREBASE_STORAGE_EMULATOR_HOST=localhost:9199
```

### 3. Update Firebase Config
```typescript
// src/core/config/firebase.config.ts
import { connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator } from 'firebase/firestore';
import { connectStorageEmulator } from 'firebase/storage';

// Connect to emulators in development
if (import.meta.env.VITE_FIREBASE_USE_EMULATOR === 'true') {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectStorageEmulator(storage, 'localhost', 9199);
}
```

## Emulator UI
Access the Emulator UI at: http://localhost:4000

### Features:
- **Authentication**: Create test users, manage tokens
- **Firestore**: View/edit data, test rules
- **Storage**: Manage files, test uploads

## Test Users
Create test users in the Emulator UI:

### Admin User
```json
{
  "uid": "admin-test-uid",
  "email": "admin@test.com",
  "customClaims": {
    "role": "admin"
  }
}
```

### Teacher User
```json
{
  "uid": "teacher-test-uid", 
  "email": "teacher@test.com",
  "customClaims": {
    "role": "teacher"
  }
}
```

### Student User
```json
{
  "uid": "student-test-uid",
  "email": "student@test.com", 
  "customClaims": {
    "role": "learner"
  }
}
```

## Development Workflow

### 1. Start Development
```bash
# Terminal 1: Start emulators
firebase emulators:start

# Terminal 2: Start app
npm run dev
```

### 2. Seed Data (Optional)
```bash
# Run seed scripts
npm run seed:emulator
```

### 3. Test Features
- Create users in Emulator UI
- Test content creation
- Verify permissions
- Check data flow

## Production Deployment

### 1. Build for Production
```bash
npm run build
```

### 2. Deploy to Firebase
```bash
firebase deploy
```

### 3. Update Environment
Remove emulator environment variables in production.

## Troubleshooting

### Common Issues

#### 1. Port Conflicts
```bash
# Check if ports are in use
lsof -i :9099  # Auth
lsof -i :8080  # Firestore
lsof -i :9199  # Storage
```

#### 2. Emulator Not Starting
```bash
# Clear Firebase cache
firebase logout
firebase login
firebase emulators:start
```

#### 3. Rules Not Loading
```bash
# Check firestore.rules syntax
firebase firestore:rules:validate
```

#### 4. Authentication Issues
- Ensure emulator is running
- Check custom claims in Emulator UI
- Verify token generation

## Best Practices

### 1. Data Management
- Use emulator data export/import for consistent testing
- Create seed data scripts for common test scenarios
- Separate test data from development data

### 2. Security Rules Testing
- Test all user roles and permissions
- Verify read/write access patterns
- Test edge cases and error scenarios

### 3. Performance
- Monitor emulator performance
- Use appropriate data sizes for testing
- Clean up test data regularly

## Scripts

### Package.json Scripts
```json
{
  "scripts": {
    "emulator:start": "firebase emulators:start",
    "emulator:export": "firebase emulators:export ./emulator-data",
    "emulator:import": "firebase emulators:start --import ./emulator-data",
    "seed:emulator": "node scripts/seed-emulator.js"
  }
}
```

### Seed Script Example
```javascript
// scripts/seed-emulator.js
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function seedData() {
  // Create test users and data
  console.log('Seeding emulator data...');
}

seedData().catch(console.error);
```

## Resources
- [Firebase Emulator Suite Documentation](https://firebase.google.com/docs/emulator-suite)
- [Firestore Emulator](https://firebase.google.com/docs/emulator-suite/connect_firestore)
- [Auth Emulator](https://firebase.google.com/docs/emulator-suite/connect_auth)
- [Storage Emulator](https://firebase.google.com/docs/emulator-suite/connect_storage)
