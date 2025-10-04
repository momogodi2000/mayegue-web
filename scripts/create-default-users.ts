/**
 * Create Default Users for All Roles Script
 * Run with: npm run create-users
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

interface UserConfig {
  email: string;
  password: string;
  displayName: string;
  role: 'apprenant' | 'teacher' | 'admin';
  level: number;
  xp: number;
  coins: number;
  subscription: 'free' | 'premium';
}

const defaultUsers: UserConfig[] = [
  {
    email: 'admin@maayegue.app',
    password: 'Admin@2025!',
    displayName: 'Administrateur Principal',
    role: 'admin',
    level: 15,
    xp: 5000,
    coins: 10000,
    subscription: 'premium'
  },
  {
    email: 'teacher@maayegue.app',
    password: 'Teacher@2025!',
    displayName: 'Prof. Jean Nkolo',
    role: 'teacher',
    level: 10,
    xp: 3000,
    coins: 5000,
    subscription: 'premium'
  },
  {
    email: 'apprenant@maayegue.app',
    password: 'Learner@2025!',
    displayName: 'Marie Tchamba',
    role: 'apprenant',
    level: 5,
    xp: 1000,
    coins: 500,
    subscription: 'free'
  },
  {
    email: 'apprenant2@maayegue.app',
    password: 'Learner@2025!',
    displayName: 'Paul Fotso',
    role: 'apprenant',
    level: 3,
    xp: 500,
    coins: 200,
    subscription: 'premium'
  },
  {
    email: 'teacher2@maayegue.app',
    password: 'Teacher@2025!',
    displayName: 'Dr. Aminatou Sali',
    role: 'teacher',
    level: 12,
    xp: 4000,
    coins: 6000,
    subscription: 'premium'
  }
];

async function createUser(config: UserConfig) {
  try {
    console.log(`\n📝 Creating user: ${config.email}...`);

    // Create auth user
    const userCredential = await createUserWithEmailAndPassword(auth, config.email, config.password);
    const user = userCredential.user;

    // Update display name
    await updateProfile(user, { displayName: config.displayName });

    // Create Firestore profile
    const now = Date.now();
    await setDoc(doc(db, 'users', user.uid), {
      role: config.role,
      email: config.email,
      displayName: config.displayName,
      emailVerified: false,
      twoFactorEnabled: false,
      createdAt: now,
      updatedAt: now,
      subscriptionStatus: config.subscription,
      preferences: {
        language: 'fr',
        targetLanguages: config.role === 'admin' ? ['ewo', 'dua', 'bml', 'ff', 'bum'] : ['ewo'],
        notificationsEnabled: true,
        theme: 'system',
        dailyGoalMinutes: config.role === 'teacher' ? 60 : 30,
      },
      stats: {
        lessonsCompleted: Math.floor(config.level * 2),
        wordsLearned: Math.floor(config.level * 20),
        totalTimeMinutes: Math.floor(config.level * 45),
        currentStreak: Math.floor(config.level / 2),
        longestStreak: Math.floor(config.level),
        badgesEarned: Math.floor(config.level / 3),
        level: config.level,
        xp: config.xp,
        atlasExplorations: Math.floor(config.level),
        encyclopediaEntries: Math.floor(config.level * 3),
        historicalSitesVisited: Math.floor(config.level / 2),
        arVrExperiences: Math.floor(config.level / 2),
        marketplacePurchases: 0,
        familyContributions: 0,
        ngondoCoinsEarned: config.coins,
        achievementsUnlocked: Math.floor(config.level / 2),
      }
    });

    console.log(`✅ User created: ${config.displayName}`);
    console.log(`   📧 Email: ${config.email}`);
    console.log(`   🔑 Password: ${config.password}`);
    console.log(`   🎭 Role: ${config.role.toUpperCase()}`);
    console.log(`   📊 Level: ${config.level} | XP: ${config.xp} | Coins: ${config.coins}`);

    return true;
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      console.log(`⚠️  User ${config.email} already exists, skipping...`);
    } else {
      console.error(`❌ Error creating user ${config.email}:`, error.message);
    }
    return false;
  }
}

async function createAllUsers() {
  console.log('🚀 Creating default users for Ma\'a yegue...\n');
  console.log('═'.repeat(60));

  let successCount = 0;
  let skipCount = 0;

  for (const userConfig of defaultUsers) {
    const success = await createUser(userConfig);
    if (success) successCount++;
    else skipCount++;

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n' + '═'.repeat(60));
  console.log(`\n✨ Summary:`);
  console.log(`   ✅ Created: ${successCount} users`);
  console.log(`   ⚠️  Skipped: ${skipCount} users (already exist)`);
  console.log(`\n📝 Default User Credentials:\n`);

  console.log('   ADMIN:');
  console.log('   📧 admin@maayegue.app');
  console.log('   🔑 Admin@2025!\n');

  console.log('   TEACHERS:');
  console.log('   📧 teacher@maayegue.app  🔑 Teacher@2025!');
  console.log('   📧 teacher2@maayegue.app 🔑 Teacher@2025!\n');

  console.log('   LEARNERS:');
  console.log('   📧 apprenant@maayegue.app  🔑 Learner@2025!');
  console.log('   📧 apprenant2@maayegue.app 🔑 Learner@2025!\n');

  console.log('⚠️  IMPORTANT: Change these passwords after first login!\n');
  console.log('🌐 Login at: http://localhost:5173/login\n');

  process.exit(0);
}

createAllUsers().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
