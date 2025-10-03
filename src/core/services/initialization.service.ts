/**
 * App Initialization Service
 * Runs initialization tasks when app starts
 */

import { getFirestore, collection, getDocs, limit, query } from 'firebase/firestore';
import { app } from '../config/firebase.config';

const db = getFirestore(app);

interface InitializationResult {
  dictionaryPopulated: boolean;
  lessonsPopulated: boolean;
  errors: string[];
}

/**
 * Check if database collections are populated
 */
async function checkDatabasePopulation(): Promise<InitializationResult> {
  const result: InitializationResult = {
    dictionaryPopulated: false,
    lessonsPopulated: false,
    errors: [],
  };

  try {
    // Check dictionary
    const dictQuery = query(collection(db, 'dictionary'), limit(1));
    const dictSnapshot = await getDocs(dictQuery);
    result.dictionaryPopulated = !dictSnapshot.empty;

    // Check lessons
    const lessonsQuery = query(collection(db, 'lessons'), limit(1));
    const lessonsSnapshot = await getDocs(lessonsQuery);
    result.lessonsPopulated = !lessonsSnapshot.empty;

    console.log('📊 Database Status:');
    console.log(`   Dictionary: ${result.dictionaryPopulated ? '✓ Populated' : '✗ Empty'}`);
    console.log(`   Lessons: ${result.lessonsPopulated ? '✓ Populated' : '✗ Empty'}`);

    if (!result.dictionaryPopulated || !result.lessonsPopulated) {
      console.log('\n💡 Tip: Run "npm run migrate-db" to populate the database with initial data');
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('❌ Error checking database:', errorMessage);
    result.errors.push(errorMessage);
  }

  return result;
}

/**
 * Initialize the application
 * Called when the app starts
 */
export async function initializeApp(): Promise<void> {
  console.log('🚀 Initializing Ma\'a yegue application...\n');

  try {
    // Check database population
    await checkDatabasePopulation();

    // Check service worker registration (PWA)
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          console.log('✓ Service Worker registered');
        } else {
          console.log('ℹ Service Worker not yet registered');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.warn('⚠ Service Worker check failed:', errorMessage);
      }
    }

    // Check online status
    if (!navigator.onLine) {
      console.warn('⚠ Application is offline');
    } else {
      console.log('✓ Application is online');
    }

    // Log environment
    console.log('\n📍 Environment:', import.meta.env.MODE);
    console.log('🔧 Firebase Project:', import.meta.env.VITE_FIREBASE_PROJECT_ID);

    console.log('\n✅ Initialization complete!\n');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('❌ Initialization failed:', errorMessage);
    throw error;
  }
}

/**
 * Show initialization warning if database is empty
 */
export function showDatabaseWarningIfNeeded(): void {
  // This will be called from the UI to show a banner/toast if needed
  checkDatabasePopulation().then((result) => {
    if (!result.dictionaryPopulated && import.meta.env.DEV) {
      console.warn(
        '\n⚠️  Database Warning:\n' +
          '   Dictionary is empty. Run: npm run migrate-db\n' +
          '   This will populate the database with initial words and lessons.\n'
      );
    }
  });
}
