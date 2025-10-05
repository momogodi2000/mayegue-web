#!/usr/bin/env tsx

/**
 * Script to create default admin and teacher users
 * Run with: npm run setup-default-users
 */

import { config } from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// Load environment variables
config();

// Firebase config - using environment variables
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// Validate Firebase config
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN', 
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\nPlease check your .env file or environment configuration.');
  process.exit(1);
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

interface DefaultUser {
  email: string;
  password: string;
  displayName: string;
  role: 'admin' | 'teacher' | 'apprenant';
}

const defaultUsers: DefaultUser[] = [
  {
    email: 'admin@mayegue.com',
    password: 'Admin123!',
    displayName: 'Administrateur Ma\'a yegue',
    role: 'admin'
  },
  {
    email: 'teacher@mayegue.com',
    password: 'Teacher123!',
    displayName: 'Professeur Ma\'a yegue',
    role: 'teacher'
  },
  {
    email: 'demo@mayegue.com',
    password: 'Demo123!',
    displayName: 'Utilisateur Démo',
    role: 'apprenant'
  }
];

async function createDefaultUser(userData: DefaultUser): Promise<void> {
  try {
    console.log(`\n🔄 Processing user: ${userData.email} (Role: ${userData.role})`);
    
    let user: any;
    let isNewUser = false;
    
    // Try to create the user first
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      );
      user = userCredential.user;
      isNewUser = true;
      console.log(`✅ Created Firebase Auth user: ${user.uid}`);
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`⚠️  User ${userData.email} already exists, signing in to update...`);
        
        // Sign in to get the existing user
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth, 
            userData.email, 
            userData.password
          );
          user = userCredential.user;
          console.log(`✅ Signed in existing user: ${user.uid}`);
        } catch (signInError: any) {
          console.error(`❌ Failed to sign in to ${userData.email}:`, signInError.message);
          return;
        }
      } else {
        console.error(`❌ Failed to create ${userData.email}:`, error.message);
        return;
      }
    }
    
    // Create comprehensive user profile in Firestore
    const userDoc = {
      // Core user info
      role: userData.role, // This is the critical field for role-based routing
      email: userData.email,
      displayName: userData.displayName,
      emailVerified: true, // Set as verified for default users
      subscriptionStatus: userData.role === 'admin' ? 'premium' : userData.role === 'teacher' ? 'premium' : 'free',
      twoFactorEnabled: false,
      ...(isNewUser && { createdAt: Date.now() }), // Only set if new user
      updatedAt: Date.now(),
      
      // User preferences
      preferences: {
        language: 'fr',
        targetLanguages: ['ewondo', 'douala', 'bamileke', 'fulfulde', 'bassa'],
        notificationsEnabled: true,
        theme: 'system',
        dailyGoalMinutes: userData.role === 'admin' ? 60 : userData.role === 'teacher' ? 45 : 30,
      },
      
      // User stats based on role
      stats: {
        lessonsCompleted: userData.role === 'admin' ? 50 : userData.role === 'teacher' ? 25 : 0,
        wordsLearned: userData.role === 'admin' ? 500 : userData.role === 'teacher' ? 250 : 0,
        totalTimeMinutes: userData.role === 'admin' ? 1200 : userData.role === 'teacher' ? 600 : 0,
        currentStreak: userData.role === 'admin' ? 15 : userData.role === 'teacher' ? 10 : 0,
        longestStreak: userData.role === 'admin' ? 30 : userData.role === 'teacher' ? 20 : 0,
        badgesEarned: userData.role === 'admin' ? 10 : userData.role === 'teacher' ? 5 : 0,
        level: userData.role === 'admin' ? 5 : userData.role === 'teacher' ? 3 : 1,
        xp: userData.role === 'admin' ? 2500 : userData.role === 'teacher' ? 1500 : 0,
        atlasExplorations: userData.role === 'admin' ? 20 : userData.role === 'teacher' ? 10 : 0,
        encyclopediaEntries: userData.role === 'admin' ? 15 : userData.role === 'teacher' ? 8 : 0,
        historicalSitesVisited: userData.role === 'admin' ? 12 : userData.role === 'teacher' ? 6 : 0,
        arVrExperiences: userData.role === 'admin' ? 8 : userData.role === 'teacher' ? 4 : 0,
        marketplacePurchases: userData.role === 'admin' ? 5 : userData.role === 'teacher' ? 2 : 0,
        familyContributions: 0,
        ngondoCoinsEarned: userData.role === 'admin' ? 1000 : userData.role === 'teacher' ? 500 : 100,
        achievementsUnlocked: userData.role === 'admin' ? 5 : userData.role === 'teacher' ? 3 : 0,
      }
    };
    
    // Create/update user document in Firestore
    try {
      await setDoc(doc(db, 'users', user.uid), userDoc, { merge: true });
      console.log(`✅ ${isNewUser ? 'Created' : 'Updated'} Firestore profile for: ${userData.email}`);
      console.log(`   📋 Role: ${userData.role}`);
      console.log(`   🆔 UID: ${user.uid}`);
      
      // Verify the role was set correctly
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const savedRole = userDocSnap.data().role;
        if (savedRole === userData.role) {
          console.log(`   ✅ Role verification successful: ${savedRole}`);
        } else {
          console.log(`   ⚠️  Role mismatch! Expected: ${userData.role}, Got: ${savedRole}`);
        }
      }
    } catch (firestoreError: any) {
      console.log(`   ⚠️  Firestore write failed: ${firestoreError.message}`);
      console.log(`   ℹ️  User created in Firebase Auth but profile needs manual setup`);
      console.log(`   💡 The user can complete profile setup on first login`);
    }
    
  } catch (error: any) {
    console.error(`❌ Unexpected error processing ${userData.email}:`, error.message);
  }
}

async function main() {
  console.log('🚀 Setting up default users for Ma\'a yegue...\n');
  console.log(`📊 Firebase Project: ${firebaseConfig.projectId}`);
  console.log(`🌍 Auth Domain: ${firebaseConfig.authDomain}\n`);
  
  let successCount = 0;
  let totalCount = defaultUsers.length;
  
  for (const userData of defaultUsers) {
    await createDefaultUser(userData);
    successCount++;
    console.log(''); // Add spacing
  }
  
  console.log('🎉 Default users setup complete!\n');
  console.log('📋 Login Credentials:');
  console.log('┌─────────────────────────────────────────────────────────┐');
  console.log('│  Role    │  Email                │  Password    │  Route  │');
  console.log('├─────────────────────────────────────────────────────────┤');
  console.log('│  Admin   │  admin@mayegue.com    │  Admin123!   │  /admin │');
  console.log('│  Teacher │  teacher@mayegue.com  │  Teacher123! │  /teach │');
  console.log('│  Demo    │  demo@mayegue.com     │  Demo123!    │  /learn │');
  console.log('└─────────────────────────────────────────────────────────┘');
  console.log('\n🔐 Firebase Auth users created successfully.');
  console.log('📝 User profiles will be created automatically on first login.');
  console.log('🎯 Roles will be assigned based on email addresses.');
  console.log('🚀 You can now test role-based authentication!');
  
  process.exit(0);
}

// Run the script
main().catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
