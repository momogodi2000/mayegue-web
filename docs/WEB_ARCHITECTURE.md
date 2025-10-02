# 🌐 Mayegue Web - Architecture Technique Complète

## 📋 Vue d'Ensemble

**Mayegue Web** est la version web progressive (PWA) de l'application mobile d'apprentissage des langues camerounaises. Cette version offre une expérience utilisateur optimale sur tous les navigateurs avec support hors ligne complet.

### Stack Technologique

- **Framework**: React 18+ avec TypeScript
- **Build Tool**: Vite 5+ (ultra-rapide)
- **Styling**: Tailwind CSS 3+
- **Backend**: Firebase (Auth, Firestore, Storage, Analytics, Messaging)
- **AI**: Google Gemini AI
- **Paiements**: CamPay & NouPai API
- **Offline DB**: IndexedDB (avec Dexie.js) + SQLite WASM
- **PWA**: Workbox pour Service Workers
- **SEO**: React Helmet, SSR avec Vite SSR
- **État Global**: Zustand + React Query
- **Routing**: React Router v6

---

## 🏗️ Architecture Système

### Architecture en Couches

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  React Components | Tailwind CSS | Responsive Design        │
├─────────────────────────────────────────────────────────────┤
│                    APPLICATION LAYER                         │
│  Business Logic | State Management (Zustand) | Hooks         │
├─────────────────────────────────────────────────────────────┤
│                    DOMAIN LAYER                              │
│  Entities | Use Cases | Repositories (Interfaces)            │
├─────────────────────────────────────────────────────────────┤
│                    DATA LAYER                                │
│  Firebase Services | IndexedDB | SQLite WASM | API Clients   │
├─────────────────────────────────────────────────────────────┤
│                    INFRASTRUCTURE LAYER                      │
│  Service Workers | Caching | PWA | Network Layer            │
└─────────────────────────────────────────────────────────────┘
```

### Flux de Données

```
User Interaction → React Components → State Management (Zustand)
                                              ↓
                                    Business Logic Layer
                                              ↓
                      ┌─────────────────────────────────────┐
                      │                                     │
                Firebase (Online)              IndexedDB/SQLite (Offline)
                      │                                     │
                      └─────────────────────────────────────┘
                                    Sync Service
                                              ↓
                                    UI Update (React Query)
```

---

## 📁 Structure du Projet

```
mayegue-web/
├── public/
│   ├── favicon.ico
│   ├── manifest.json          # PWA Manifest
│   ├── robots.txt             # SEO
│   ├── sitemap.xml            # SEO
│   ├── sw.js                  # Service Worker
│   ├── assets/
│   │   ├── languages.db       # SQLite offline database
│   │   ├── icons/             # App icons (192x192, 512x512)
│   │   └── images/
│   └── locales/               # i18n translations
│       ├── fr.json
│       └── en.json
│
├── src/
│   ├── app/
│   │   ├── App.tsx            # Main App component
│   │   ├── main.tsx           # Entry point
│   │   └── router.tsx         # React Router configuration
│   │
│   ├── features/              # Feature-based modules
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── RegisterForm.tsx
│   │   │   │   └── SocialAuth.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.ts
│   │   │   ├── services/
│   │   │   │   └── authService.ts
│   │   │   ├── store/
│   │   │   │   └── authStore.ts
│   │   │   └── types/
│   │   │       └── auth.types.ts
│   │   │
│   │   ├── dictionary/
│   │   │   ├── components/
│   │   │   │   ├── DictionarySearch.tsx
│   │   │   │   ├── WordCard.tsx
│   │   │   │   └── PronunciationPlayer.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useDictionary.ts
│   │   │   │   └── useOfflineDictionary.ts
│   │   │   ├── services/
│   │   │   │   ├── dictionaryService.ts
│   │   │   │   └── offlineDbService.ts
│   │   │   └── store/
│   │   │       └── dictionaryStore.ts
│   │   │
│   │   ├── lessons/
│   │   │   ├── components/
│   │   │   │   ├── LessonCard.tsx
│   │   │   │   ├── LessonPlayer.tsx
│   │   │   │   └── ProgressTracker.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useLessons.ts
│   │   │   └── services/
│   │   │       └── lessonService.ts
│   │   │
│   │   ├── ai-assistant/
│   │   │   ├── components/
│   │   │   │   ├── ChatInterface.tsx
│   │   │   │   └── AIResponseCard.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useGeminiAI.ts
│   │   │   └── services/
│   │   │       └── geminiService.ts
│   │   │
│   │   ├── gamification/
│   │   │   ├── components/
│   │   │   │   ├── BadgeDisplay.tsx
│   │   │   │   ├── Leaderboard.tsx
│   │   │   │   └── ProgressBar.tsx
│   │   │   └── services/
│   │   │       └── gamificationService.ts
│   │   │
│   │   ├── community/
│   │   │   ├── components/
│   │   │   │   ├── ForumPost.tsx
│   │   │   │   └── CommentSection.tsx
│   │   │   └── services/
│   │   │       └── communityService.ts
│   │   │
│   │   ├── payments/
│   │   │   ├── components/
│   │   │   │   ├── PaymentForm.tsx
│   │   │   │   └── SubscriptionPlans.tsx
│   │   │   └── services/
│   │   │       ├── campayService.ts
│   │   │       └── noupaiService.ts
│   │   │
│   │   └── profile/
│   │       ├── components/
│   │       │   ├── UserProfile.tsx
│   │       │   └── SettingsPanel.tsx
│   │       └── services/
│   │           └── profileService.ts
│   │
│   ├── shared/                # Shared components & utilities
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Loading.tsx
│   │   │   │   └── Toast.tsx
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── Layout.tsx
│   │   │   └── seo/
│   │   │       └── SEOHead.tsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useLocalStorage.ts
│   │   │   ├── useOnline.ts
│   │   │   ├── useMediaQuery.ts
│   │   │   └── useDebounce.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── constants.ts
│   │   │   ├── validators.ts
│   │   │   ├── formatters.ts
│   │   │   └── helpers.ts
│   │   │
│   │   └── types/
│   │       ├── common.types.ts
│   │       └── api.types.ts
│   │
│   ├── core/                  # Core services & configuration
│   │   ├── config/
│   │   │   ├── firebase.config.ts
│   │   │   ├── env.config.ts
│   │   │   └── app.config.ts
│   │   │
│   │   ├── services/
│   │   │   ├── firebase/
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── firestore.service.ts
│   │   │   │   ├── storage.service.ts
│   │   │   │   ├── analytics.service.ts
│   │   │   │   └── messaging.service.ts
│   │   │   ├── offline/
│   │   │   │   ├── indexedDb.service.ts
│   │   │   │   ├── sqlite.service.ts
│   │   │   │   └── syncService.ts
│   │   │   └── api/
│   │   │       ├── httpClient.ts
│   │   │       └── apiEndpoints.ts
│   │   │
│   │   ├── store/
│   │   │   ├── rootStore.ts
│   │   │   └── slices/
│   │   │       ├── appSlice.ts
│   │   │       └── offlineSlice.ts
│   │   │
│   │   └── pwa/
│   │       ├── serviceWorkerRegistration.ts
│   │       ├── workbox.config.ts
│   │       └── offlineHandler.ts
│   │
│   ├── assets/
│   │   ├── styles/
│   │   │   ├── globals.css
│   │   │   └── tailwind.css
│   │   ├── images/
│   │   └── fonts/
│   │
│   └── types/
│       └── global.d.ts
│
├── scripts/
│   ├── seed-database.ts      # Script to populate SQLite DB
│   └── generate-sitemap.ts   # SEO sitemap generation
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.local                 # Local environment variables
├── .env.production            # Production environment variables
├── index.html                 # HTML entry point
├── vite.config.ts             # Vite configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
├── package.json
├── vercel.json                # Vercel deployment config
└── README.md
```

---

## 🔥 Configuration Firebase

### Firebase Services Configuration

```typescript
// src/core/config/firebase.config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "studio-6750997720-7c22e.firebaseapp.com",
  projectId: "studio-6750997720-7c22e",
  storageBucket: "studio-6750997720-7c22e.firebasestorage.app",
  messagingSenderId: "853678151393",
  appId: "1:853678151393:web:40332d5cd4cedb029cc9a0",
  measurementId: "G-F60NV25RDJ"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
export const messaging = getMessaging(app);
```

### Firestore Security Rules (Web-specific)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function getRole() {
      return isAuthenticated() ? 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role : null;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isOwner(userId);
    }
    
    // Dictionary - public read, authenticated write
    match /dictionary/{entryId} {
      allow read: if true;
      allow write: if isAuthenticated();
    }
    
    // Lessons - public read, teacher/admin write
    match /lessons/{lessonId} {
      allow read: if true;
      allow write: if getRole() in ['teacher', 'admin'];
    }
  }
}
```

---

## 💾 Offline Database (SQLite + IndexedDB)

### SQLite Database Schema

```sql
-- Languages table
CREATE TABLE languages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    family TEXT,
    region TEXT,
    speakers INTEGER,
    description TEXT,
    iso_code TEXT
);

-- Translations table
CREATE TABLE translations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    french_text TEXT NOT NULL,
    language_id TEXT NOT NULL,
    translation TEXT NOT NULL,
    category TEXT,
    pronunciation TEXT,
    usage_notes TEXT,
    difficulty_level TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (language_id) REFERENCES languages(id)
);

-- Categories table
CREATE TABLE categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT
);

-- Lessons (offline cache)
CREATE TABLE lessons_cache (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    language_id TEXT,
    content TEXT,
    level TEXT,
    synced_at TIMESTAMP,
    FOREIGN KEY (language_id) REFERENCES languages(id)
);
```

### IndexedDB Schema (Dexie.js)

```typescript
// src/core/services/offline/indexedDb.service.ts
import Dexie, { Table } from 'dexie';

interface User {
  id: string;
  email: string;
  displayName: string;
  role: string;
  lastSync?: Date;
}

interface DictionaryEntry {
  id: string;
  frenchText: string;
  languageId: string;
  translation: string;
  pronunciation?: string;
  category?: string;
  cached?: boolean;
}

interface LessonCache {
  id: string;
  title: string;
  content: string;
  languageId: string;
  cachedAt: Date;
}

interface ProgressCache {
  id: string;
  userId: string;
  lessonId: string;
  progress: number;
  syncStatus: 'pending' | 'synced';
}

class MayegueDB extends Dexie {
  users!: Table<User>;
  dictionary!: Table<DictionaryEntry>;
  lessons!: Table<LessonCache>;
  progress!: Table<ProgressCache>;

  constructor() {
    super('MayegueDB');
    this.version(1).stores({
      users: 'id, email',
      dictionary: 'id, languageId, category, frenchText',
      lessons: 'id, languageId, cachedAt',
      progress: 'id, userId, lessonId, syncStatus'
    });
  }
}

export const db = new MayegueDB();
```

---

## 🔌 Système de Synchronisation

### Sync Service Architecture

```typescript
// src/core/services/offline/syncService.ts
import { db as indexedDb } from './indexedDb.service';
import { db as firestore } from '../../config/firebase.config';

class SyncService {
  private syncQueue: Array<SyncTask> = [];
  private isSyncing = false;

  async syncDictionary() {
    if (!navigator.onLine) {
      console.log('Offline: Using cached dictionary');
      return;
    }

    try {
      // Fetch from Firestore
      const snapshot = await firestore.collection('dictionary').get();
      
      // Update IndexedDB
      const entries = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        cached: true
      }));
      
      await indexedDb.dictionary.bulkPut(entries);
      
      console.log('Dictionary synced successfully');
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }

  async syncProgress(userId: string) {
    const pendingProgress = await indexedDb.progress
      .where('syncStatus')
      .equals('pending')
      .toArray();

    for (const progress of pendingProgress) {
      try {
        await firestore.collection('progress').doc(progress.id).set(progress);
        
        // Update sync status
        await indexedDb.progress.update(progress.id, {
          syncStatus: 'synced'
        });
      } catch (error) {
        console.error('Progress sync failed:', error);
      }
    }
  }

  async autoSync() {
    if (navigator.onLine && !this.isSyncing) {
      this.isSyncing = true;
      
      await this.syncDictionary();
      await this.syncProgress(/* current user id */);
      
      this.isSyncing = false;
    }
  }
}

export const syncService = new SyncService();

// Auto-sync every 5 minutes when online
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => syncService.autoSync());
  setInterval(() => syncService.autoSync(), 5 * 60 * 1000);
}
```

---

## 🚀 PWA Configuration

### Manifest.json

```json
{
  "name": "Mayegue - Langues Camerounaises",
  "short_name": "Mayegue",
  "description": "Apprenez les langues traditionnelles camerounaises",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#10B981",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/assets/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/assets/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "shortcuts": [
    {
      "name": "Dictionnaire",
      "url": "/dictionary",
      "description": "Accéder au dictionnaire"
    },
    {
      "name": "Leçons",
      "url": "/lessons",
      "description": "Continuer l'apprentissage"
    }
  ],
  "categories": ["education", "productivity"],
  "screenshots": [
    {
      "src": "/assets/screenshots/home.png",
      "sizes": "1280x720",
      "type": "image/png"
    }
  ]
}
```

### Service Worker (Workbox)

```typescript
// public/sw.js - Generated by Vite PWA Plugin
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// Precache static assets
precacheAndRoute(self.__WB_MANIFEST);

// Cache Firebase Firestore requests
registerRoute(
  ({url}) => url.hostname === 'firestore.googleapis.com',
  new NetworkFirst({
    cacheName: 'firestore-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60, // 5 minutes
      }),
    ],
  })
);

// Cache images
registerRoute(
  ({request}) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

// Cache audio files
registerRoute(
  ({request}) => request.destination === 'audio',
  new CacheFirst({
    cacheName: 'audio-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
      }),
    ],
  })
);

// Cache API requests with stale-while-revalidate
registerRoute(
  ({url}) => url.pathname.startsWith('/api/'),
  new StaleWhileRevalidate({
    cacheName: 'api-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60, // 1 hour
      }),
    ],
  })
);

// Offline fallback
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/offline.html');
      })
    );
  }
});
```

---

## 🎨 Responsive Design Strategy

### Tailwind CSS Configuration

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        },
        secondary: {
          500: '#3B82F6',
          600: '#2563EB',
        },
        cameroon: {
          green: '#009639',
          red: '#CE1126',
          yellow: '#FCDD09',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      screens: {
        'xs': '475px',
        '3xl': '1920px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
```

### Responsive Breakpoints Strategy

- **Mobile First**: Design pour mobile (320px+)
- **Tablet**: 768px+
- **Desktop**: 1024px+
- **Large Desktop**: 1440px+
- **Ultra Wide**: 1920px+

---

## 🔍 SEO Optimization

### SEO Head Component

```typescript
// src/shared/components/seo/SEOHead.tsx
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'Mayegue - Apprenez les Langues Camerounaises',
  description = 'Plateforme d\'apprentissage des langues traditionnelles camerounaises: Ewondo, Duala, Fulfulde et plus encore.',
  keywords = ['langues camerounaises', 'ewondo', 'duala', 'apprentissage', 'cameroun'],
  image = '/assets/og-image.png',
  url = 'https://mayegue.app',
  type = 'website'
}) => {
  const fullTitle = `${title} | Mayegue`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Mayegue" />
      <meta property="og:locale" content="fr_FR" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional SEO */}
      <link rel="canonical" href={url} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="French" />
      <meta name="author" content="Mayegue Team" />
      
      {/* PWA Meta Tags */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Mayegue" />
      <meta name="theme-color" content="#10B981" />
    </Helmet>
  );
};
```

### Sitemap Generation

```typescript
// scripts/generate-sitemap.ts
import { writeFileSync } from 'fs';

const SITE_URL = 'https://mayegue.app';

const routes = [
  { path: '/', priority: 1.0, changefreq: 'daily' },
  { path: '/dictionary', priority: 0.9, changefreq: 'daily' },
  { path: '/lessons', priority: 0.9, changefreq: 'weekly' },
  { path: '/ai-assistant', priority: 0.8, changefreq: 'weekly' },
  { path: '/community', priority: 0.7, changefreq: 'daily' },
  { path: '/pricing', priority: 0.8, changefreq: 'monthly' },
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`).join('\n')}
</urlset>`;

writeFileSync('public/sitemap.xml', sitemap);
console.log('✅ Sitemap generated successfully');
```

---

## 🔐 Sécurité Web

### Content Security Policy

```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; 
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
               font-src 'self' https://fonts.gstatic.com; 
               img-src 'self' data: https:; 
               connect-src 'self' https://*.firebaseio.com https://*.googleapis.com">
```

### Environment Variables Security

```typescript
// src/core/config/env.config.ts
export const ENV = {
  FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
  FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY,
  CAMPAY_API_KEY: import.meta.env.VITE_CAMPAY_API_KEY,
  IS_PRODUCTION: import.meta.env.PROD,
} as const;

// Validation
Object.entries(ENV).forEach(([key, value]) => {
  if (!value && ENV.IS_PRODUCTION) {
    throw new Error(`Missing environment variable: ${key}`);
  }
});
```

---

## 📊 Analytics & Monitoring

### Firebase Analytics Integration

```typescript
// src/core/services/firebase/analytics.service.ts
import { logEvent, setUserId, setUserProperties } from 'firebase/analytics';
import { analytics } from '../../config/firebase.config';

export class AnalyticsService {
  static logPageView(pageName: string) {
    logEvent(analytics, 'page_view', {
      page_name: pageName,
      page_location: window.location.href,
      page_path: window.location.pathname,
    });
  }

  static logLessonStarted(lessonId: string, languageId: string) {
    logEvent(analytics, 'lesson_started', {
      lesson_id: lessonId,
      language_id: languageId,
      platform: 'web',
    });
  }

  static logDictionarySearch(query: string, languageId: string) {
    logEvent(analytics, 'dictionary_search', {
      search_term: query,
      language_id: languageId,
    });
  }

  static setUser(userId: string, role: string) {
    setUserId(analytics, userId);
    setUserProperties(analytics, {
      user_role: role,
      platform: 'web',
    });
  }
}
```

---

## 🚀 Performance Optimization

### Code Splitting Strategy

```typescript
// src/app/router.tsx
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Lazy load routes
const Dictionary = lazy(() => import('../features/dictionary/DictionaryPage'));
const Lessons = lazy(() => import('../features/lessons/LessonsPage'));
const AIAssistant = lazy(() => import('../features/ai-assistant/AIAssistantPage'));

export const AppRouter = () => (
  <BrowserRouter>
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dictionary" element={<Dictionary />} />
        <Route path="/lessons" element={<Lessons />} />
        <Route path="/ai-assistant" element={<AIAssistant />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);
```

### Image Optimization

- **WebP Format**: Images converties en WebP
- **Lazy Loading**: Images chargées à la demande
- **Responsive Images**: `srcset` pour différentes tailles
- **CDN**: Firebase Storage avec CDN intégré

### Bundle Size Optimization

```javascript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}']
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          'ui-vendor': ['@headlessui/react', '@heroicons/react'],
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  }
});
```

---

## 📝 Conclusion

Cette architecture assure:

✅ **Performance**: Chargement rapide avec code splitting et lazy loading  
✅ **Offline-First**: Fonctionnalité complète hors ligne  
✅ **SEO**: Optimisation pour les moteurs de recherche  
✅ **PWA**: Installation et expérience app-like  
✅ **Responsive**: Adapté à tous les écrans  
✅ **Scalable**: Architecture modulaire et extensible  
✅ **Secure**: Sécurité au niveau Firebase et application  
✅ **Maintainable**: Code TypeScript typé et structure claire  

**Technologies**: React + TypeScript + Vite + Tailwind CSS + Firebase + PWA
