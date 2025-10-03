/**
 * Script to create a default admin user in Firebase
 * Run with: npm run create-admin
 */

import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import * as readline from 'readline';

// Firebase Admin SDK will use credentials from GOOGLE_APPLICATION_CREDENTIALS env var
// or from the default service account if running in Cloud Functions/Cloud Run
const app = initializeApp({
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'studio-6750997720-7c22e',
});

const auth = getAuth(app);
const db = getFirestore(app);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function createAdminUser() {
  console.log('🔐 Ma\'a yegue - Default Admin User Creation\n');

  try {
    // Get admin credentials
    const email = await question('Enter admin email (default: admin@maayegue.com): ') || 'admin@maayegue.com';
    const password = await question('Enter admin password (min 6 chars, default: Admin@2025): ') || 'Admin@2025';
    const displayName = await question('Enter display name (default: Admin): ') || 'Admin';

    console.log('\n📝 Creating admin user...');

    // Check if user already exists
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(email);
      console.log('⚠️  User already exists. Updating role to admin...');
    } catch (error: any) {
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

  } catch (error: any) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  } finally {
    rl.close();
    process.exit(0);
  }
}

// Run the script
createAdminUser();
