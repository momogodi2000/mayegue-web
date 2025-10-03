#!/usr/bin/env node

/**
 * Script to create a default admin user in Firebase
 * This version uses Firebase emulators for local development
 * Run with: npm run create-admin
 */

const admin = require('firebase-admin');

// Check if we should use emulators (for local development)
const useEmulators = process.env.FIREBASE_AUTH_EMULATOR_HOST || process.env.NODE_ENV === 'development';

console.log('🔐 Ma\'a yegue - Default Admin User Creation\n');

// Initialize Firebase Admin with proper configuration
const app = admin.initializeApp({
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'maayegue-dev-environment',
});

// Configure emulators if running locally
if (useEmulators) {
  console.log('🔧 Using Firebase emulators for local development');
  process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
  process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
}

const auth = admin.auth();
const db = admin.firestore();

// Use environment variables or defaults to avoid readline issues
function getEnvOrDefault(envVar, defaultValue, description) {
  const value = process.env[envVar] || process.argv.find(arg => arg.startsWith(`--${envVar.toLowerCase()}=`))?.split('=')[1];
  if (value) {
    console.log(`✓ Using ${description}: ${value}`);
    return value;
  }
  console.log(`✓ Using default ${description}: ${defaultValue}`);
  return defaultValue;
}

async function createAdminUser() {
  try {
    console.log('💡 Tip: You can pass arguments like: npm run create-admin -- --email=admin@test.com --password=Pass123 --name=Admin\n');

    // Get user input or use defaults
    const email = getEnvOrDefault('EMAIL', 'admin@maayegue.com', 'email');
    const password = getEnvOrDefault('PASSWORD', 'Admin@2025!', 'password');
    const displayName = getEnvOrDefault('NAME', 'Admin', 'display name');

    console.log('\n📝 Creating admin user...');

    // Check if user already exists
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(email);
      console.log('⚠️  User already exists. Updating role to admin...');
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        // Create new user
        userRecord = await auth.createUser({
          email,
          password,
          displayName,
          emailVerified: true, // Admin is pre-verified
        });
        console.log('✅ Admin user created in Firebase Authentication');
      } else {
        throw error;
      }
    }

    // Create/Update user document in Firestore with admin role
    const userDocRef = db.collection('users').doc(userRecord.uid);
    await userDocRef.set({
      email,
      displayName,
      role: 'admin',
      emailVerified: true,
      subscriptionStatus: 'premium',
      twoFactorEnabled: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      preferences: {
        language: 'fr',
        targetLanguages: [],
        notificationsEnabled: true,
        theme: 'system',
        dailyGoalMinutes: 30,
      },
      stats: {
        lessonsCompleted: 0,
        wordsLearned: 0,
        totalTimeMinutes: 0,
        currentStreak: 0,
        longestStreak: 0,
        badgesEarned: 0,
        level: 1,
        xp: 0,
      }
    }, { merge: true });

    // Set custom claims for admin
    await auth.setCustomUserClaims(userRecord.uid, { admin: true, role: 'admin' });

    console.log('\n✅ Admin user successfully created/updated!');
    console.log('\n📋 Admin Details:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Display Name: ${displayName}`);
    console.log(`   User ID: ${userRecord.uid}`);
    console.log(`   Role: admin (with full privileges)`);
    console.log('\n⚠️  IMPORTANT: Change the password after first login!\n');

    // Create initial admin permissions document
    const permissionsRef = db.collection('admin_permissions').doc(userRecord.uid);
    await permissionsRef.set({
      userId: userRecord.uid,
      permissions: {
        manageUsers: true,
        manageLessons: true,
        manageDictionary: true,
        manageSubscriptions: true,
        viewAnalytics: true,
        sendNotifications: true,
        manageContent: true,
        systemSettings: true,
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    console.log('✅ Admin permissions configured\n');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message || error);
    process.exit(1);
  }
}

// Run the script
createAdminUser();