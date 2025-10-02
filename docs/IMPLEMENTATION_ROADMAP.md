# 🗺️ Ma’a yegue Web - Roadmap d'Implémentation Détaillé

**Version**: 1.0.0  
**Dernière mise à jour**: 30 Septembre 2025  
**Durée estimée totale**: 5-7 semaines (2-3 développeurs)

---

## 📅 Planning Global

```
┌─────────────────────────────────────────────────────────────┐
│ Phase 1: Foundation      │ Semaines 1-2 │ Services Core   │
│ Phase 2: UI Components   │ Semaine 3    │ Design System   │
│ Phase 3: Features        │ Semaines 4-6 │ Main Features   │
│ Phase 4: Polish & Deploy │ Semaine 7    │ Production      │
└─────────────────────────────────────────────────────────────┘
```

---

## 📍 Phase 1: Foundation (Semaines 1-2)

### ✅ Semaine 1 - Jour 1-2: Configuration (COMPLÉTÉ)

**Statut**: ✅ 100% Terminé

```
✅ Project initialization (npm)
✅ Dependencies configuration (package.json)
✅ TypeScript setup (tsconfig.json)
✅ Vite configuration (vite.config.ts)
✅ Tailwind CSS setup (tailwind.config.js)
✅ Firebase configuration (firebase.config.ts)
✅ Environment variables (.env.local)
✅ PWA manifest (manifest.json)
✅ SEO basics (robots.txt, meta tags)
✅ Global styles (globals.css)
✅ Router setup (router.tsx)
✅ Documentation (6 fichiers, 4000+ lignes)
```

**Livrables**:
- ✅ 30+ fichiers de configuration
- ✅ Architecture complète documentée
- ✅ Firebase configuré et testé
- ✅ PWA ready
- ✅ SEO optimized

### ⏳ Semaine 1 - Jour 3-5: Services Firebase

**Statut**: ⏳ À faire

**Tâches** (16 heures):

#### 1. Auth Service (4h)

```typescript
// src/core/services/firebase/auth.service.ts

import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '@/core/config/firebase.config';

export class AuthService {
  // Email/Password (1h)
  async signInWithEmail(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async signUpWithEmail(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  async resetPassword(email: string) {
    return sendPasswordResetEmail(auth, email);
  }

  // Social Auth (2h)
  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }

  async signInWithFacebook() {
    const provider = new FacebookAuthProvider();
    return signInWithPopup(auth, provider);
  }

  async signInWithApple() {
    const provider = new OAuthProvider('apple.com');
    return signInWithPopup(auth, provider);
  }

  // Utils (1h)
  async signOut() {
    return signOut(auth);
  }

  onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  getCurrentUser() {
    return auth.currentUser;
  }
}

export const authService = new AuthService();
```

**Tests à créer**:
```typescript
// tests/unit/services/auth.service.test.ts
describe('AuthService', () => {
  test('should sign in with email', async () => {});
  test('should sign up with email', async () => {});
  test('should sign in with Google', async () => {});
});
```

#### 2. Firestore Service (4h)

```typescript
// src/core/services/firebase/firestore.service.ts

import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot
} from 'firebase/firestore';
import { db } from '@/core/config/firebase.config';

export class FirestoreService {
  // Generic CRUD (2h)
  async getCollection<T>(collectionName: string): Promise<T[]> {
    const snapshot = await getDocs(collection(db, collectionName));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
  }

  async getDocument<T>(collectionName: string, docId: string): Promise<T | null> {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as T : null;
  }

  async addDocument<T>(collectionName: string, data: T): Promise<string> {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
  }

  async updateDocument<T>(collectionName: string, docId: string, data: Partial<T>): Promise<void> {
    const docRef = doc(db, collectionName, docId);
    return updateDoc(docRef, data);
  }

  async deleteDocument(collectionName: string, docId: string): Promise<void> {
    const docRef = doc(db, collectionName, docId);
    return deleteDoc(docRef);
  }

  // Queries (2h)
  async queryCollection<T>(
    collectionName: string,
    filters: Array<{ field: string; operator: any; value: any }> = [],
    orderByField?: string,
    limitCount?: number
  ): Promise<T[]> {
    let q = collection(db, collectionName) as any;

    filters.forEach(filter => {
      q = query(q, where(filter.field, filter.operator, filter.value));
    });

    if (orderByField) {
      q = query(q, orderBy(orderByField));
    }

    if (limitCount) {
      q = query(q, limit(limitCount));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
  }

  // Real-time listeners
  onCollectionChange<T>(
    collectionName: string,
    callback: (data: T[]) => void
  ) {
    return onSnapshot(collection(db, collectionName), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
      callback(data);
    });
  }
}

export const firestoreService = new FirestoreService();
```

#### 3. Storage Service (2h)

```typescript
// src/core/services/firebase/storage.service.ts

import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  uploadBytesResumable,
  getMetadata
} from 'firebase/storage';
import { storage } from '@/core/config/firebase.config';

export class StorageService {
  async uploadFile(
    path: string, 
    file: File, 
    onProgress?: (progress: number) => void
  ): Promise<string> {
    const storageRef = ref(storage, path);

    if (onProgress) {
      // Upload with progress
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(progress);
          },
          reject,
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(url);
          }
        );
      });
    } else {
      // Simple upload
      await uploadBytes(storageRef, file);
      return getDownloadURL(storageRef);
    }
  }

  async getFileURL(path: string): Promise<string> {
    const storageRef = ref(storage, path);
    return getDownloadURL(storageRef);
  }

  async deleteFile(path: string): Promise<void> {
    const storageRef = ref(storage, path);
    return deleteObject(storageRef);
  }

  async getFileMetadata(path: string) {
    const storageRef = ref(storage, path);
    return getMetadata(storageRef);
  }
}

export const storageService = new StorageService();
```

#### 4. Analytics Service (2h)

```typescript
// src/core/services/firebase/analytics.service.ts

import { logEvent, setUserId, setUserProperties } from 'firebase/analytics';
import { analytics } from '@/core/config/firebase.config';

export class AnalyticsService {
  logEvent(eventName: string, params?: Record<string, any>) {
    if (!analytics) return;
    logEvent(analytics, eventName, {
      ...params,
      platform: 'web',
      timestamp: new Date().toISOString(),
    });
  }

  // User events
  logPageView(pageName: string) {
    this.logEvent('page_view', {
      page_name: pageName,
      page_location: window.location.href,
    });
  }

  logLogin(method: string) {
    this.logEvent('login', { method });
  }

  logSignUp(method: string) {
    this.logEvent('sign_up', { method });
  }

  // Learning events
  logLessonStarted(lessonId: string, languageId: string) {
    this.logEvent('lesson_started', { lesson_id: lessonId, language_id: languageId });
  }

  logLessonCompleted(lessonId: string, score: number) {
    this.logEvent('lesson_completed', { lesson_id: lessonId, score });
  }

  logDictionarySearch(query: string, languageId: string) {
    this.logEvent('dictionary_search', { search_term: query, language_id: languageId });
  }

  // User properties
  setUser(userId: string, role: string) {
    if (!analytics) return;
    setUserId(analytics, userId);
    setUserProperties(analytics, { user_role: role, platform: 'web' });
  }
}

export const analyticsService = new AnalyticsService();
```

#### 5. Messaging Service (2h)

```typescript
// src/core/services/firebase/messaging.service.ts

import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '@/core/config/firebase.config';

export class MessagingService {
  async requestPermission(): Promise<string | null> {
    if (!messaging) return null;

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await getToken(messaging, {
          vapidKey: 'YOUR_VAPID_KEY' // À obtenir de Firebase Console
        });
        console.log('FCM Token:', token);
        return token;
      }
      return null;
    } catch (error) {
      console.error('Notification permission denied:', error);
      return null;
    }
  }

  onMessageReceived(callback: (payload: any) => void) {
    if (!messaging) return () => {};
    return onMessage(messaging, callback);
  }
}

export const messagingService = new MessagingService();
```

#### 6. Test des Services (2h)

```typescript
// tests/integration/firebase-services.test.ts

import { authService } from '@/core/services/firebase/auth.service';
import { firestoreService } from '@/core/services/firebase/firestore.service';

describe('Firebase Services Integration', () => {
  test('should connect to Firebase', async () => {
    expect(auth).toBeDefined();
    expect(db).toBeDefined();
  });

  test('should authenticate user', async () => {
    const result = await authService.signInWithEmail('test@test.com', 'password');
    expect(result.user).toBeDefined();
  });

  test('should read from Firestore', async () => {
    const data = await firestoreService.getCollection('languages');
    expect(data.length).toBeGreaterThan(0);
  });
});
```

**Livrable Semaine 1**:
- ✅ Projet configuré
- ✅ Firebase services créés et testés
- ✅ Documentation complète

---

### ⏳ Semaine 2 - Jour 1-3: Offline Services

**Tâches** (20 heures):

#### 1. IndexedDB Service (6h)

```typescript
// src/core/services/offline/indexedDb.service.ts

import Dexie, { Table } from 'dexie';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'visitor' | 'learner' | 'teacher' | 'admin';
  photoURL?: string;
  lastSync?: Date;
}

export interface DictionaryEntry {
  id: string;
  frenchText: string;
  languageId: string;
  translation: string;
  pronunciation?: string;
  category?: string;
  audioUrl?: string;
  cached: boolean;
  cachedAt: Date;
}

export interface LessonCache {
  id: string;
  title: string;
  description: string;
  languageId: string;
  level: string;
  content: any;
  cachedAt: Date;
}

export interface ProgressCache {
  id: string;
  userId: string;
  lessonId: string;
  completed: boolean;
  score?: number;
  syncStatus: 'pending' | 'synced';
  updatedAt: Date;
}

class Ma’a yegueDB extends Dexie {
  users!: Table<User>;
  dictionary!: Table<DictionaryEntry>;
  lessons!: Table<LessonCache>;
  progress!: Table<ProgressCache>;

  constructor() {
    super('Ma’a yegueDB');
    
    this.version(1).stores({
      users: 'id, email',
      dictionary: 'id, languageId, category, frenchText, cached',
      lessons: 'id, languageId, level, cachedAt',
      progress: 'id, userId, lessonId, syncStatus, updatedAt'
    });
  }

  // Helper methods
  async cacheUserProfile(user: User) {
    return this.users.put(user);
  }

  async getCachedDictionary(languageId?: string) {
    if (languageId) {
      return this.dictionary.where('languageId').equals(languageId).toArray();
    }
    return this.dictionary.toArray();
  }

  async searchDictionary(term: string, languageId?: string) {
    let query = this.dictionary.where('frenchText').startsWithIgnoreCase(term);
    
    if (languageId) {
      query = query.and(entry => entry.languageId === languageId);
    }

    return query.limit(20).toArray();
  }

  async cacheLesson(lesson: LessonCache) {
    return this.lessons.put({ ...lesson, cachedAt: new Date() });
  }

  async getPendingProgress(userId: string) {
    return this.progress
      .where('userId').equals(userId)
      .and(p => p.syncStatus === 'pending')
      .toArray();
  }

  async markProgressSynced(progressId: string) {
    return this.progress.update(progressId, { syncStatus: 'synced' });
  }
}

export const indexedDb = new Ma’a yegueDB();
```

**Tests**:
```typescript
describe('IndexedDB Service', () => {
  test('should cache user profile', async () => {});
  test('should search dictionary', async () => {});
  test('should track pending progress', async () => {});
});
```

#### 2. SQLite Service (8h)

```typescript
// src/core/services/offline/sqlite.service.ts

import initSqlJs, { Database } from 'sql.js';

export interface SQLiteLanguage {
  id: string;
  name: string;
  family: string;
  region: string;
  speakers: number;
  description: string;
  isoCode: string;
}

export interface SQLiteTranslation {
  id: number;
  frenchText: string;
  languageId: string;
  translation: string;
  pronunciation: string;
  category: string;
  usageNotes?: string;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
}

class SQLiteService {
  private db: Database | null = null;
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Load SQL.js WASM
      const SQL = await initSqlJs({
        locateFile: (file) => `/sql-wasm/${file}`
      });

      // Load database from assets
      const response = await fetch('/assets/languages.db');
      if (!response.ok) {
        throw new Error('Failed to load languages.db');
      }

      const buffer = await response.arrayBuffer();
      this.db = new SQL.Database(new Uint8Array(buffer));
      this.initialized = true;

      console.log('✅ SQLite database loaded successfully');
    } catch (error) {
      console.error('❌ Failed to initialize SQLite:', error);
      throw error;
    }
  }

  async getLanguages(): Promise<SQLiteLanguage[]> {
    this.ensureInitialized();
    
    const result = this.db!.exec('SELECT * FROM languages ORDER BY name');
    if (result.length === 0) return [];

    const columns = result[0].columns;
    const values = result[0].values;

    return values.map(row => {
      const obj: any = {};
      columns.forEach((col, index) => {
        obj[col] = row[index];
      });
      return obj as SQLiteLanguage;
    });
  }

  async searchDictionary(
    searchTerm: string, 
    languageId?: string, 
    category?: string
  ): Promise<SQLiteTranslation[]> {
    this.ensureInitialized();

    let sql = 'SELECT * FROM translations WHERE french_text LIKE ?';
    const params: any[] = [`%${searchTerm}%`];

    if (languageId) {
      sql += ' AND language_id = ?';
      params.push(languageId);
    }

    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }

    sql += ' LIMIT 50';

    const result = this.db!.exec(sql, params);
    if (result.length === 0) return [];

    const columns = result[0].columns;
    const values = result[0].values;

    return values.map(row => {
      const obj: any = {};
      columns.forEach((col, index) => {
        obj[col] = row[index];
      });
      return obj as SQLiteTranslation;
    });
  }

  async getTranslationsByCategory(
    category: string, 
    languageId?: string
  ): Promise<SQLiteTranslation[]> {
    this.ensureInitialized();

    let sql = 'SELECT * FROM translations WHERE category = ?';
    const params: any[] = [category];

    if (languageId) {
      sql += ' AND language_id = ?';
      params.push(languageId);
    }

    sql += ' ORDER BY french_text LIMIT 100';

    const result = this.db!.exec(sql, params);
    if (result.length === 0) return [];

    const columns = result[0].columns;
    const values = result[0].values;

    return values.map(row => {
      const obj: any = {};
      columns.forEach((col, index) => {
        obj[col] = row[index];
      });
      return obj as SQLiteTranslation;
    });
  }

  private ensureInitialized() {
    if (!this.initialized || !this.db) {
      throw new Error('SQLite database not initialized. Call initialize() first.');
    }
  }

  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.initialized = false;
    }
  }
}

export const sqliteService = new SQLiteService();

// Auto-initialize
sqliteService.initialize().catch(console.error);
```

**Important**: Créer le fichier `public/assets/languages.db` avec le script Python:

```bash
python docs/database-scripts/create_cameroon_db.py
# Output: languages.db → Copier vers public/assets/
```

#### 3. Sync Service (6h)

```typescript
// src/core/services/offline/syncService.ts

import { indexedDb } from './indexedDb.service';
import { firestoreService } from '../firebase/firestore.service';

interface SyncTask {
  type: 'create' | 'update' | 'delete';
  collection: string;
  docId?: string;
  data: any;
  timestamp: Date;
}

class SyncService {
  private syncQueue: SyncTask[] = [];
  private isSyncing = false;
  private syncInterval: number | null = null;

  constructor() {
    // Auto-sync when online
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.autoSync());
    }
  }

  // Sync dictionary from Firebase to IndexedDB
  async syncDictionary(): Promise<void> {
    if (!navigator.onLine) {
      console.log('📴 Offline: Using cached dictionary');
      return;
    }

    try {
      console.log('🔄 Syncing dictionary...');
      
      const entries = await firestoreService.getCollection<DictionaryEntry>('dictionary');
      
      await indexedDb.dictionary.bulkPut(
        entries.map(entry => ({ 
          ...entry, 
          cached: true, 
          cachedAt: new Date() 
        }))
      );

      console.log(`✅ Dictionary synced: ${entries.length} entries`);
    } catch (error) {
      console.error('❌ Dictionary sync failed:', error);
    }
  }

  // Sync lessons from Firebase to IndexedDB
  async syncLessons(languageId?: string): Promise<void> {
    if (!navigator.onLine) return;

    try {
      console.log('🔄 Syncing lessons...');

      const lessons = languageId
        ? await firestoreService.queryCollection('lessons', [
            { field: 'languageId', operator: '==', value: languageId }
          ])
        : await firestoreService.getCollection('lessons');

      await indexedDb.lessons.bulkPut(
        lessons.map(lesson => ({ 
          ...lesson, 
          cachedAt: new Date() 
        }))
      );

      console.log(`✅ Lessons synced: ${lessons.length} lessons`);
    } catch (error) {
      console.error('❌ Lessons sync failed:', error);
    }
  }

  // Sync progress from IndexedDB to Firebase
  async syncProgress(userId: string): Promise<void> {
    if (!navigator.onLine) {
      console.log('📴 Offline: Progress will sync when online');
      return;
    }

    try {
      const pendingProgress = await indexedDb.getPendingProgress(userId);

      for (const progress of pendingProgress) {
        await firestoreService.updateDocument('progress', progress.id, progress);
        await indexedDb.markProgressSynced(progress.id);
      }

      console.log(`✅ Progress synced: ${pendingProgress.length} items`);
    } catch (error) {
      console.error('❌ Progress sync failed:', error);
    }
  }

  // Auto-sync all data
  async autoSync(userId?: string): Promise<void> {
    if (this.isSyncing || !navigator.onLine) return;

    this.isSyncing = true;
    console.log('🔄 Auto-sync started...');

    try {
      await Promise.all([
        this.syncDictionary(),
        this.syncLessons(),
        userId ? this.syncProgress(userId) : Promise.resolve(),
      ]);

      console.log('✅ Auto-sync completed');
    } catch (error) {
      console.error('❌ Auto-sync failed:', error);
    } finally {
      this.isSyncing = false;
    }
  }

  // Start periodic sync
  startPeriodicSync(userId?: string, intervalMinutes = 5): void {
    if (this.syncInterval) return;

    this.syncInterval = window.setInterval(() => {
      this.autoSync(userId);
    }, intervalMinutes * 60 * 1000);

    console.log(`🔄 Periodic sync started (every ${intervalMinutes} min)`);
  }

  // Stop periodic sync
  stopPeriodicSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log('⏹️ Periodic sync stopped');
    }
  }
}

export const syncService = new SyncService();

// Start auto-sync on app load
if (typeof window !== 'undefined') {
  syncService.startPeriodicSync();
}
```

**Livrable Semaine 2**:
- ✅ Offline services complets
- ✅ Sync bidirectionnel Firebase ↔ IndexedDB
- ✅ SQLite WASM intégré
- ✅ Tests d'intégration

---

## 📍 Phase 2: UI Components (Semaine 3)

### ⏳ Semaine 3 - Jour 1-3: Design System

**Tâches** (20 heures):

#### 1. Button Component (2h)

```typescript
// src/shared/components/ui/Button.tsx

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    icon,
    className, 
    disabled,
    ...props 
  }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(
          'btn',
          {
            'btn-primary': variant === 'primary',
            'btn-secondary': variant === 'secondary',
            'btn-outline': variant === 'outline',
            'btn-ghost': variant === 'ghost',
            'btn-danger bg-red-600 hover:bg-red-700': variant === 'danger',
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2': size === 'md',
            'px-6 py-3 text-lg': size === 'lg',
            'opacity-50 cursor-not-allowed': disabled || loading,
          },
          className
        )}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

#### 2. Input Component (2h)

```typescript
// src/shared/components/ui/Input.tsx

import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, fullWidth, className, ...props }, ref) => {
    return (
      <div className={clsx('mb-4', { 'w-full': fullWidth })}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            className={clsx(
              'input',
              {
                'pl-10': icon,
                'border-red-500 focus:border-red-500 focus:ring-red-500': error,
              },
              className
            )}
            {...props}
          />
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
```

#### 3. Card Component (1h)

```typescript
// src/shared/components/ui/Card.tsx

import { HTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  variant = 'default', 
  padding = 'md',
  className, 
  ...props 
}) => {
  return (
    <div
      className={clsx(
        'card',
        {
          'shadow-sm': variant === 'default',
          'border-2': variant === 'bordered',
          'shadow-lg': variant === 'elevated',
          'p-0': padding === 'none',
          'p-3': padding === 'sm',
          'p-6': padding === 'md',
          'p-8': padding === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
```

#### 4. Modal Component (3h)

```typescript
// src/shared/components/ui/Modal.tsx

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
}) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 dark:bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className={`w-full ${sizeClasses[size]} transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all`}>
                {(title || showCloseButton) && (
                  <div className="flex items-center justify-between mb-4">
                    {title && (
                      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                        {title}
                      </Dialog.Title>
                    )}
                    {showCloseButton && (
                      <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                      >
                        <XMarkIcon className="h-6 w-6" />
                      </button>
                    )}
                  </div>
                )}
                
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
```

**Suite à implémenter** (Jour 4-5):
- Dropdown component
- Tabs component
- Tooltip component
- Badge component
- Avatar component

**Livrable Semaine 3**:
- ✅ Design system complet
- ✅ 10+ composants UI réutilisables
- ✅ Storybook documentation (optionnel)

---

## 📊 Résumé de l'État Actuel

### ✅ Complété (100%)

```
✅ Project setup & configuration
✅ TypeScript + Vite + React
✅ Tailwind CSS custom theme
✅ Firebase configuration
✅ PWA manifest & service worker config
✅ SEO optimization (meta tags, robots.txt)
✅ Routing architecture
✅ Environment management
✅ Global styles
✅ Types définitions
✅ Documentation complète (6 fichiers)
```

### ⏳ En Cours (20%)

```
🏗️ Firebase services implementation
🏗️ Offline services (IndexedDB + SQLite)
🏗️ Sync service
```

### 📋 À Faire (0%)

```
⏳ UI Components library
⏳ Authentication pages
⏳ Dictionary feature
⏳ Lessons feature
⏳ AI Assistant
⏳ Gamification
⏳ Community
⏳ Payments
⏳ Testing suite
⏳ Production deployment
```

---

## 🎯 Prochaine Action Immédiate

```bash
# 1. Installer les dépendances
npm install

# 2. Créer .env.local (copier les variables de .env.example)

# 3. Lancer le dev server
npm run dev

# 4. Ouvrir http://localhost:3000

# 5. Commencer par implémenter:
# src/core/services/firebase/auth.service.ts
```

**Estimation**: L'app de base (auth + dictionary) sera fonctionnelle en **2-3 semaines** avec 2 développeurs.

---

**Votre projet web est maintenant parfaitement configuré et documenté! 🚀**
