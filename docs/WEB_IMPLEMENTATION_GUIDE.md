# 📚 Mayegue Web - Guide d'Implémentation

## 🎯 Résumé du Projet

**Mayegue Web** est la version progressive web app (PWA) de l'application mobile d'apprentissage des langues camerounaises. Cette documentation fournit un guide complet pour continuer le développement.

## ✅ Ce Qui a Été Créé

### 1. Configuration du Projet

✅ **Structure de Base**
- `package.json` avec toutes les dépendances nécessaires
- Configuration TypeScript (`tsconfig.json`)
- Configuration Vite (`vite.config.ts`)
- Configuration Tailwind CSS (`tailwind.config.js`)
- Configuration ESLint

✅ **Firebase Configuration**
- `src/core/config/firebase.config.ts` - Initialisation Firebase
- `src/core/config/env.config.ts` - Gestion des variables d'environnement
- Configuration PWA avec Vite PWA Plugin

✅ **Architecture de Base**
- `index.html` - Point d'entrée avec SEO optimisé
- `src/app/main.tsx` - Bootstrap de l'application
- `src/app/App.tsx` - Composant principal
- `src/app/router.tsx` - Configuration du routage

✅ **PWA Configuration**
- `public/manifest.json` - Manifest PWA
- `public/robots.txt` - SEO robots
- Service Worker avec Workbox (via Vite PWA)

✅ **Styles Globaux**
- `src/assets/styles/globals.css` - Styles Tailwind personnalisés
- Thème dark/light configuré
- Composants utilitaires CSS

---

## 🚧 Ce Qui Reste à Implémenter

### 1. Services Firebase (Priorité Haute)

#### 1.1 Authentication Service
```typescript
// src/core/services/firebase/auth.service.ts
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from '@/core/config/firebase.config';

export class AuthService {
  // Email/Password
  async signInWithEmail(email: string, password: string) { }
  async signUpWithEmail(email: string, password: string) { }
  
  // Social Auth
  async signInWithGoogle() { }
  async signInWithFacebook() { }
  async signInWithApple() { }
  
  // Phone Auth
  async signInWithPhone(phoneNumber: string) { }
  
  // Utils
  async signOut() { }
  onAuthStateChange(callback: (user: User | null) => void) { }
  getCurrentUser(): User | null { }
}
```

#### 1.2 Firestore Service
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
  limit
} from 'firebase/firestore';
import { db } from '@/core/config/firebase.config';

export class FirestoreService {
  // Generic CRUD
  async getCollection<T>(collectionName: string): Promise<T[]> { }
  async getDocument<T>(collectionName: string, docId: string): Promise<T | null> { }
  async addDocument<T>(collectionName: string, data: T): Promise<string> { }
  async updateDocument<T>(collectionName: string, docId: string, data: Partial<T>): Promise<void> { }
  async deleteDocument(collectionName: string, docId: string): Promise<void> { }
  
  // Queries
  async queryCollection<T>(
    collectionName: string,
    filters: Array<{ field: string; operator: string; value: any }>,
    orderByField?: string,
    limitCount?: number
  ): Promise<T[]> { }
}
```

#### 1.3 Storage Service
```typescript
// src/core/services/firebase/storage.service.ts
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/core/config/firebase.config';

export class StorageService {
  async uploadFile(path: string, file: File): Promise<string> { }
  async getFileURL(path: string): Promise<string> { }
  async deleteFile(path: string): Promise<void> { }
}
```

### 2. Offline Database (Priorité Haute)

#### 2.1 IndexedDB Service
```typescript
// src/core/services/offline/indexedDb.service.ts
import Dexie, { Table } from 'dexie';

// Définir les interfaces
interface User { }
interface DictionaryEntry { }
interface LessonCache { }
interface ProgressCache { }

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

#### 2.2 SQLite WASM Service
```typescript
// src/core/services/offline/sqlite.service.ts
import initSqlJs from 'sql.js';

export class SQLiteService {
  private db: any;

  async initialize() {
    const SQL = await initSqlJs({
      locateFile: (file) => `/sql-wasm/${file}`
    });
    
    // Load database from public/assets/languages.db
    const response = await fetch('/assets/languages.db');
    const buffer = await response.arrayBuffer();
    this.db = new SQL.Database(new Uint8Array(buffer));
  }

  async query<T>(sql: string, params?: any[]): Promise<T[]> { }
  
  // Dictionary queries
  async searchDictionary(searchTerm: string, languageId?: string) { }
  async getTranslationsByCategory(category: string, languageId: string) { }
  async getLanguages() { }
}
```

#### 2.3 Sync Service
```typescript
// src/core/services/offline/syncService.ts
class SyncService {
  private syncQueue: Array<SyncTask> = [];
  private isSyncing = false;

  async syncDictionary() { }
  async syncLessons() { }
  async syncProgress(userId: string) { }
  async autoSync() { }
}

export const syncService = new SyncService();
```

### 3. Features à Implémenter

#### 3.1 Authentication Feature
- [ ] LoginPage
- [ ] RegisterPage
- [ ] SocialAuth components
- [ ] ProtectedRoute component
- [ ] useAuth hook
- [ ] Auth store (Zustand)

#### 3.2 Dictionary Feature
- [ ] DictionaryPage
- [ ] DictionarySearch component
- [ ] WordCard component
- [ ] PronunciationPlayer component
- [ ] useDictionary hook
- [ ] useOfflineDictionary hook
- [ ] Dictionary store

#### 3.3 Lessons Feature
- [ ] LessonsPage
- [ ] LessonDetailPage
- [ ] LessonCard component
- [ ] LessonPlayer component
- [ ] ProgressTracker component
- [ ] useLessons hook
- [ ] Lessons store

#### 3.4 AI Assistant Feature
- [ ] AIAssistantPage
- [ ] ChatInterface component
- [ ] AIResponseCard component
- [ ] useGeminiAI hook
- [ ] Gemini service integration

#### 3.5 Gamification Feature
- [ ] GamificationPage
- [ ] BadgeDisplay component
- [ ] Leaderboard component
- [ ] ProgressBar component
- [ ] Gamification service

#### 3.6 Community Feature
- [ ] CommunityPage
- [ ] ForumPost component
- [ ] CommentSection component
- [ ] Community service

#### 3.7 Payments Feature
- [ ] PricingPage
- [ ] PaymentForm component
- [ ] SubscriptionPlans component
- [ ] CamPay service
- [ ] NouPai service

### 4. Shared Components

#### 4.1 UI Components
- [ ] Button
- [ ] Input
- [ ] Modal
- [ ] Card
- [ ] Loading/Skeleton
- [ ] Toast
- [ ] Dropdown
- [ ] Tabs

#### 4.2 Layout Components
- [ ] Header
- [ ] Footer
- [ ] Sidebar
- [ ] Layout
- [ ] MobileNav

#### 4.3 SEO Components
- [ ] SEOHead component (React Helmet)
- [ ] Sitemap generation script
- [ ] Structured data (JSON-LD)

### 5. Hooks Personnalisés

```typescript
// src/shared/hooks/
- useAuth.ts
- useOnlineStatus.ts
- useLocalStorage.ts
- useDebounce.ts
- useMediaQuery.ts
- useClickOutside.ts
- useScrollPosition.ts
```

### 6. State Management (Zustand)

```typescript
// src/core/store/
- authStore.ts
- dictionaryStore.ts
- lessonsStore.ts
- appStore.ts (theme, language, etc.)
- offlineStore.ts
```

### 7. Types TypeScript

```typescript
// src/shared/types/
- user.types.ts
- dictionary.types.ts
- lesson.types.ts
- language.types.ts
- api.types.ts
- common.types.ts
```

---

## 🔧 Commandes de Développement

### Installation des Dépendances
```bash
npm install
```

### Développement
```bash
npm run dev
```

### Build de Production
```bash
npm run build
```

### Preview de Production
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

### Type Checking
```bash
npm run type-check
```

### Génération Sitemap
```bash
npm run generate-sitemap
```

### Seed Database
```bash
npm run seed-db
```

---

## 📂 Structure des Fichiers à Créer

### Prochaines Étapes Immédiates

1. **Créer les services Firebase** (1-2 heures)
   - auth.service.ts
   - firestore.service.ts
   - storage.service.ts
   - analytics.service.ts

2. **Créer les services offline** (2-3 heures)
   - indexedDb.service.ts
   - sqlite.service.ts
   - syncService.ts

3. **Créer les composants UI de base** (2-3 heures)
   - Button, Input, Modal, Card, Loading

4. **Créer les composants Layout** (1-2 heures)
   - Header, Footer, Sidebar, Layout

5. **Implémenter l'authentification** (3-4 heures)
   - Auth pages, forms, hooks, store

6. **Implémenter le dictionnaire** (4-5 heures)
   - Dictionary pages, components, hooks

7. **PWA Service Worker** (1-2 heures)
   - serviceWorkerRegistration.ts
   - Offline fallback page

---

## 🔑 Variables d'Environnement Requises

Créer un fichier `.env.local` avec:

```env
# Firebase (déjà configurées)
VITE_FIREBASE_API_KEY=AIzaSyCe4_2NdHl3zvkukTg18WRTiZC7RecMRw0
VITE_FIREBASE_AUTH_DOMAIN=studio-6750997720-7c22e.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=studio-6750997720-7c22e
VITE_FIREBASE_STORAGE_BUCKET=studio-6750997720-7c22e.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=853678151393
VITE_FIREBASE_APP_ID=1:853678151393:web:40332d5cd4cedb029cc9a0
VITE_FIREBASE_MEASUREMENT_ID=G-F60NV25RDJ

# AI Services (à obtenir)
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Payment Services (à obtenir)
VITE_CAMPAY_API_KEY=your_campay_api_key
VITE_CAMPAY_SECRET=your_campay_secret
VITE_CAMPAY_ENVIRONMENT=sandbox
VITE_NOUPAI_API_KEY=your_noupai_api_key

# App
VITE_APP_NAME=Mayegue
VITE_APP_URL=https://mayegue.app
VITE_APP_VERSION=1.0.0
```

---

## 🚀 Plan de Déploiement

### 1. Déploiement sur Vercel (Recommandé)

```bash
# Installation Vercel CLI
npm i -g vercel

# Déploiement
vercel --prod
```

### 2. Configuration Vercel

Créer `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/sw.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    }
  ]
}
```

### 3. Alternative: Firebase Hosting

```bash
# Installation Firebase CLI
npm i -g firebase-tools

# Initialisation
firebase init hosting

# Déploiement
firebase deploy --only hosting
```

---

## 📊 Métriques de Performance Cibles

- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Input Delay (FID)**: < 100ms
- **Bundle Size**: < 500KB (initial load)

---

## 🔒 Checklist de Sécurité

- [ ] Firebase Security Rules configurées
- [ ] HTTPS forcé
- [ ] Content Security Policy (CSP) activé
- [ ] Variables d'environnement sécurisées
- [ ] Validation des entrées utilisateur
- [ ] Protection CSRF
- [ ] Rate limiting sur les API
- [ ] Authentification sécurisée

---

## 📝 Documentation à Créer

1. **Guide Utilisateur Web** - Instructions pour utiliser l'app web
2. **Guide Développeur** - Conventions de code, architecture
3. **Guide API** - Documentation des endpoints Firebase
4. **Guide de Contribution** - Comment contribuer au projet

---

## 🎯 Roadmap

### Phase 1 (Semaine 1-2)
- ✅ Configuration initiale du projet
- ✅ Firebase configuration
- ✅ Routing setup
- ✅ PWA configuration
- 🔲 Services Firebase
- 🔲 Services offline
- 🔲 Composants UI de base

### Phase 2 (Semaine 3-4)
- 🔲 Authentification complète
- 🔲 Dictionnaire avec recherche
- 🔲 Leçons basiques
- 🔲 Sync offline

### Phase 3 (Semaine 5-6)
- 🔲 AI Assistant (Gemini)
- 🔲 Gamification
- 🔲 Communauté
- 🔲 Profil utilisateur

### Phase 4 (Semaine 7-8)
- 🔲 Paiements (CamPay/NouPai)
- 🔲 Optimisation SEO
- 🔲 Tests E2E
- 🔲 Déploiement production

---

## 📞 Support & Contact

Pour toute question sur l'implémentation:
- Documentation: `WEB_ARCHITECTURE.md`
- Email: dev@mayegue.app
- GitHub Issues: [lien vers repo]

---

**Note**: Ce guide sera mis à jour au fur et à mesure de l'avancement du projet.
