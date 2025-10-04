/**
 * Create Default Admin User Script
 * Run with: npm run create-admin
 */

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCe4_2NdHl3zvkukTg18WRTiZC7RecMRw0",
  authDomain: "studio-6750997720-7c22e.firebaseapp.com",
  projectId: "studio-6750997720-7c22e",
  storageBucket: "studio-6750997720-7c22e.firebasestorage.app",
  messagingSenderId: "853678151393",
  appId: "1:853678151393:web:40332d5cd4cedb029cc9a0",
  measurementId: "G-F60NV25RDJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function createAdminUser() {
  try {
    console.log('🚀 Creating default admin user...');

    const adminEmail = 'admin@maayegue.app';
    const adminPassword = 'Admin@MaayegueV1!2025'; // Change this password after first login
    const adminDisplayName = 'Administrateur Ma\'a yegue';

    // Create auth user
    console.log('Creating Firebase Auth user...');
    const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
    const user = userCredential.user;

    // Update display name
    await updateProfile(user, { displayName: adminDisplayName });

    // Create Firestore profile with ADMIN role
    console.log('Creating Firestore profile with ADMIN role...');
    const now = Date.now();
    await setDoc(doc(db, 'users', user.uid), {
      role: 'admin',
      email: adminEmail,
      displayName: adminDisplayName,
      emailVerified: false,
      twoFactorEnabled: false,
      createdAt: now,
      updatedAt: now,
      subscriptionStatus: 'premium', // Admin gets premium
      preferences: {
        language: 'fr',
        targetLanguages: ['ewo', 'dua', 'bml', 'ff', 'bum'],
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
        level: 10, // Admin starts at level 10
        xp: 1000,
        atlasExplorations: 0,
        encyclopediaEntries: 0,
        historicalSitesVisited: 0,
        arVrExperiences: 0,
        marketplacePurchases: 0,
        familyContributions: 0,
        ngondoCoinsEarned: 1000, // Admin gets 1000 coins
        achievementsUnlocked: 0,
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('👤 Display Name:', adminDisplayName);
    console.log('🎭 Role: ADMIN');
    console.log('');
    console.log('⚠️  IMPORTANT: Change the password after first login!');
    console.log('');
    console.log('🌐 Login at: http://localhost:5173/login');
    console.log('');

    process.exit(0);
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      console.error('❌ Error: Admin user already exists!');
      console.log('');
      console.log('To reset the admin user, manually delete it from Firebase Console and run this script again.');
    } else {
      console.error('❌ Error creating admin user:', error.message);
    }
    process.exit(1);
  }
}

createAdminUser();
