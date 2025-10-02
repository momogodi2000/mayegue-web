import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getMessaging, isSupported as isMessagingSupported } from 'firebase/messaging';
import { config } from './env.config';

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
export const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (only in browser and if supported)
let analyticsInstance: ReturnType<typeof getAnalytics> | null = null;
isSupported().then(yes => {
  if (yes) {
    analyticsInstance = getAnalytics(app);
  }
});
export const analytics = analyticsInstance;

// Initialize Messaging (only if supported)
let messagingInstance: ReturnType<typeof getMessaging> | null = null;
isMessagingSupported().then(yes => {
  if (yes && 'serviceWorker' in navigator) {
    messagingInstance = getMessaging(app);
  }
});
export const messaging = messagingInstance;

// Export production flag
export const isProduction = config.environment === 'production';

// Connect to emulators in development
if (config.dev.useEmulators && !isProduction) {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectStorageEmulator(storage, 'localhost', 9199);
}

// Log Firebase initialization
console.log('🔥 Firebase initialized:', {
  projectId: firebaseConfig.projectId,
  environment: import.meta.env.MODE,
});
