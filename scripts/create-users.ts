/**
 * Create Default Users for All Roles Script
 * Run with: npm run create-users
 * This script creates users in Firebase Auth and inserts profiles into SQLite
 */

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { config } from '../src/core/config/env.config';
import Database from 'better-sqlite3';
import { cwd } from 'node:process';
import { join } from 'node:path';
import { exit } from 'node:process';

const firebaseConfig = {
  apiKey: config.firebase.apiKey,
  authDomain: config.firebase.authDomain,
  projectId: config.firebase.projectId,
  storageBucket: config.firebase.storageBucket,
  messagingSenderId: config.firebase.messagingSenderId,
  appId: config.firebase.appId,
  measurementId: config.firebase.measurementId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestoreDb = getFirestore(app);

// Initialize SQLite
const dbPath = join(cwd(), 'cameroon_languages.db');
const sqliteDb = new Database(dbPath);

interface UserConfig {
  email: string;
  password: string;
  displayName: string;
  role: 'guest' | 'apprenant' | 'teacher' | 'admin';
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
    email: 'guest@maayegue.app',
    password: 'Guest@2025!',
    displayName: 'Utilisateur Invité',
    role: 'guest',
    level: 1,
    xp: 0,
    coins: 0,
    subscription: 'free'
  }
];

async function createUser(userConfig: UserConfig) {
  try {
    console.log(`Creating user: ${userConfig.email}`);

    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, userConfig.email, userConfig.password);
    const user = userCredential.user;

    // Update display name
    await updateProfile(user, { displayName: userConfig.displayName });

    // Create Firestore profile
    const now = Date.now();
    await setDoc(doc(firestoreDb, 'users', user.uid), {
      role: userConfig.role,
      email: userConfig.email,
      displayName: userConfig.displayName,
      emailVerified: false,
      twoFactorEnabled: false,
      createdAt: now,
      updatedAt: now,
      subscriptionStatus: userConfig.subscription,
      level: userConfig.level,
      xp: userConfig.xp,
      coins: userConfig.coins,
      lastLogin: now,
      preferences: {
        language: 'fr',
        notifications: true,
        theme: 'light'
      }
    });

    // Insert into SQLite
    const insertUser = sqliteDb.prepare(`
      INSERT INTO users (firebase_uid, email, display_name, role, level, xp, coins, subscription, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertUser.run(
      user.uid,
      userConfig.email,
      userConfig.displayName,
      userConfig.role,
      userConfig.level,
      userConfig.xp,
      userConfig.coins,
      userConfig.subscription,
      now,
      now
    );

    console.log(`✅ User ${userConfig.email} created successfully`);
  } catch (error) {
    console.error(`❌ Failed to create user ${userConfig.email}:`, error);
  }
}

async function createDefaultUsers() {
  console.log('🚀 Creating default users...');

  // Ensure users table exists
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS users (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      firebase_uid TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      display_name TEXT,
      role TEXT CHECK(role IN ('guest', 'apprenant', 'teacher', 'admin')) NOT NULL,
      level INTEGER DEFAULT 1,
      xp INTEGER DEFAULT 0,
      coins INTEGER DEFAULT 0,
      subscription TEXT CHECK(subscription IN ('free', 'premium')) DEFAULT 'free',
      created_at INTEGER,
      updated_at INTEGER,
      last_login INTEGER,
      preferences TEXT -- JSON string
    )
  `);

  for (const userConfig of defaultUsers) {
    await createUser(userConfig);
  }

  sqliteDb.close();
  console.log('✨ All default users created successfully!');
}

// Run the script
createDefaultUsers()
  .then(() => {
    console.log('Script completed successfully!');
    exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    exit(1);
  });