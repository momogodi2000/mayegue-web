/**
 * App Initialization Service
 * Runs initialization tasks when app starts
 */

import { sqliteService } from './offline/sqlite.service';
import { hybridAuthService } from './auth/hybrid-auth.service';

/**
 * Initialize the application
 * Called when the app starts
 */
export async function initializeApp(): Promise<void> {
  console.log('🚀 Initializing Ma\'a yegue application...\n');

  const errors: string[] = [];

  // Initialize SQLite database with automatic migration and seed data
  try {
    await sqliteService.initialize();
    console.log('✓ SQLite database initialized');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.warn('⚠ SQLite initialization failed:', errorMessage);
    console.warn('⚠ App will continue without local database features');
    errors.push(`SQLite: ${errorMessage}`);
  }

  // Initialize hybrid authentication service
  try {
    await hybridAuthService.initialize();
    console.log('✓ Authentication service initialized');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('❌ Auth initialization failed:', errorMessage);
    errors.push(`Auth: ${errorMessage}`);
    // Auth is critical, but we'll continue to show the error to the user
  }

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

  if (errors.length > 0) {
    console.warn('\n⚠ Initialization completed with warnings:', errors);
  } else {
    console.log('\n✅ Initialization complete!\n');
  }
}
