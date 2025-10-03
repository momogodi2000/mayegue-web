# 📘 Documentation Développeur - Ma'a yegue

## Table des Matières

1. [Vue d'Ensemble](#vue-densemble)
2. [Architecture de l'Application](#architecture-de-lapplication)
3. [Structure du Projet](#structure-du-projet)
4. [Technologies Utilisées](#technologies-utilisées)
5. [Installation et Configuration](#installation-et-configuration)
6. [Modules Principaux](#modules-principaux)
7. [Services et API](#services-et-api)
8. [Base de Données Firebase](#base-de-données-firebase)
9. [Authentification et Autorisation](#authentification-et-autorisation)
10. [Système de Paiement](#système-de-paiement)
11. [Guide de Développement](#guide-de-développement)
12. [Tests](#tests)
13. [Déploiement](#déploiement)
14. [Dépannage](#dépannage)

---

## Vue d'Ensemble

**Ma'a yegue** est une application web progressive (PWA) pour l'apprentissage des langues camerounaises. L'application utilise React.js avec TypeScript pour le frontend et Firebase pour tout le backend (authentification, base de données, stockage, analytics).

### Objectifs de l'Application

- Préserver les langues camerounaises traditionnelles
- Faciliter l'apprentissage interactif des langues locales
- Créer une communauté d'apprenants et d'enseignants
- Utiliser l'IA pour améliorer l'expérience d'apprentissage

### Public Cible

1. **Apprenants** (`apprenant`) - Utilisateurs réguliers qui apprennent les langues
2. **Enseignants** (`teacher`) - Créateurs de contenu et de leçons
3. **Administrateurs** (`admin`) - Gestion complète de la plateforme
4. **Visiteurs** (`visitor`) - Utilisateurs non connectés avec accès limité

---

## Architecture de l'Application

### Architecture Globale

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + TypeScript)             │
├─────────────────────────────────────────────────────────────┤
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │   Pages    │  │ Components │  │   Hooks    │            │
│  └────────────┘  └────────────┘  └────────────┘            │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │   Routes   │  │   Stores   │  │  Services  │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                    FIREBASE BACKEND                          │
├─────────────────────────────────────────────────────────────┤
│  Authentication │ Firestore │ Storage │ Analytics │ FCM     │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                  SERVICES EXTERNES                           │
├─────────────────────────────────────────────────────────────┤
│     Campay      │   Noupai   │   Stripe   │  Google AI     │
└─────────────────────────────────────────────────────────────┘
```

### Patterns de Conception Utilisés

1. **Component-Based Architecture** (React)
2. **State Management** (Zustand)
3. **Service Layer Pattern** (Services séparés pour API)
4. **Repository Pattern** (Firestore services)
5. **Strategy Pattern** (Payment providers)
6. **Observer Pattern** (Real-time listeners)

---

## Structure du Projet

```
mayegue-web/
├── public/                      # Fichiers statiques
│   ├── assets/                  # Images, fonts, etc.
│   ├── locales/                 # Fichiers de traduction
│   └── manifest.json            # PWA manifest
│
├── src/
│   ├── app/                     # Configuration app
│   │   └── router.tsx           # Routes principales
│   │
│   ├── core/                    # Logique métier centrale
│   │   ├── config/              # Configuration
│   │   │   ├── firebase.config.ts
│   │   │   └── env.config.ts
│   │   └── services/            # Services backend
│   │       ├── firebase/        # Services Firebase
│   │       │   ├── auth.service.ts
│   │       │   ├── user.service.ts
│   │       │   ├── firestore.service.ts
│   │       │   ├── storage.service.ts
│   │       │   └── messaging.service.ts
│   │       └── payment/         # Services paiement
│   │           ├── payment.types.ts
│   │           ├── campay.service.ts
│   │           ├── noupai.service.ts
│   │           ├── stripe.service.ts
│   │           └── payment.service.ts
│   │
│   ├── features/                # Fonctionnalités par module
│   │   ├── auth/                # Authentification
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   ├── RegisterPage.tsx
│   │   │   │   ├── ForgotPasswordPage.tsx
│   │   │   │   └── ResetPasswordPage.tsx
│   │   │   └── store/
│   │   │       └── authStore.ts
│   │   │
│   │   ├── users/               # Gestion utilisateurs
│   │   │   ├── guest/           # Dashboard visiteur
│   │   │   ├── apprenant/       # Dashboard apprenant
│   │   │   ├── teacher/         # Dashboard enseignant
│   │   │   └── admin/           # Dashboard admin
│   │   │
│   │   ├── dictionary/          # Dictionnaire
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   └── store/
│   │   │
│   │   ├── lessons/             # Leçons
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   └── store/
│   │   │
│   │   ├── ai-assistant/        # Assistant IA
│   │   │   ├── components/
│   │   │   └── pages/
│   │   │
│   │   ├── community/           # Communauté
│   │   │   ├── components/
│   │   │   └── pages/
│   │   │
│   │   ├── gamification/        # Gamification
│   │   │   ├── components/
│   │   │   └── pages/
│   │   │
│   │   ├── payments/            # Paiements
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   └── hooks/
│   │   │
│   │   └── profile/             # Profil utilisateur
│   │       ├── components/
│   │       ├── pages/
│   │       └── store/
│   │
│   ├── shared/                  # Code partagé
│   │   ├── components/          # Composants réutilisables
│   │   │   ├── auth/            # Composants auth
│   │   │   │   ├── ProtectedRoute.tsx
│   │   │   │   ├── RoleRoute.tsx
│   │   │   │   └── RoleRedirect.tsx
│   │   │   ├── layout/          # Layout
│   │   │   │   └── Layout.tsx
│   │   │   ├── ui/              # UI components
│   │   │   │   ├── ThemeToggle.tsx
│   │   │   │   ├── NewsletterSubscription.tsx
│   │   │   │   └── LoadingScreen.tsx
│   │   │   └── pwa/             # PWA components
│   │   │       ├── PWAInstallPrompt.tsx
│   │   │       └── PWAInstallButton.tsx
│   │   │
│   │   ├── hooks/               # Custom hooks
│   │   │   ├── useTheme.ts
│   │   │   └── usePerformance.ts
│   │   │
│   │   ├── types/               # Types TypeScript
│   │   │   └── user.types.ts
│   │   │
│   │   └── utils/               # Utilitaires
│   │       └── performance.ts
│   │
│   └── main.tsx                 # Point d'entrée
│
├── scripts/                     # Scripts utilitaires
│   ├── create-admin.ts          # Création admin
│   ├── seed-database.ts         # Seed database
│   └── generate-sitemap.ts      # Génération sitemap
│
├── docs/                        # Documentation
│   ├── DOCUMENTATION_DEVELOPPEUR_FR.md
│   ├── GUIDE_UTILISATEUR_FR.md
│   └── database-scripts/
│       └── create_cameroon_db.py
│
├── .env                         # Variables d'environnement
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

---

## Technologies Utilisées

### Frontend

| Technologie | Version | Usage |
|------------|---------|-------|
| **React** | 18.2.0 | Framework UI |
| **TypeScript** | 5.3.3 | Typage statique |
| **Vite** | 5.0.11 | Build tool |
| **React Router** | 6.22.0 | Routing |
| **Zustand** | 4.5.0 | State management |
| **Tailwind CSS** | 3.4.1 | Styles |
| **Framer Motion** | 11.0.3 | Animations |
| **React Hook Form** | 7.49.3 | Gestion formulaires |
| **Zod** | 3.22.4 | Validation schémas |
| **Axios** | 1.6.5 | Requêtes HTTP |

### Backend (Firebase)

| Service | Usage |
|---------|-------|
| **Authentication** | Gestion utilisateurs, OAuth, 2FA |
| **Firestore** | Base de données NoSQL |
| **Storage** | Stockage fichiers (images, audio) |
| **Analytics** | Statistiques d'usage |
| **Cloud Messaging** | Notifications push |

### Services Externes

| Service | Usage |
|---------|-------|
| **Campay** | Paiements Mobile Money (Cameroun) |
| **Noupai** | Paiements Mobile Money (Fallback) |
| **Stripe** | Paiements carte bancaire internationaux |

### Dev Tools

| Tool | Usage |
|------|-------|
| **ESLint** | Linting code |
| **Vitest** | Tests unitaires |
| **Firebase Emulator** | Tests locaux |
| **tsx** | Exécution scripts TypeScript |

---

## Installation et Configuration

### Prérequis

```bash
Node.js >= 18.0.0
npm >= 9.0.0
Git
```

### Installation

```bash
# 1. Cloner le projet
git clone https://github.com/votre-repo/mayegue-web.git
cd mayegue-web

# 2. Installer les dépendances
npm install

# 3. Copier le fichier .env
cp .env.example .env

# 4. Configurer Firebase
# Aller sur https://console.firebase.google.com
# Créer un projet et copier les credentials dans .env

# 5. Démarrer le serveur de développement
npm run dev
```

### Configuration Firebase

1. **Créer un projet Firebase**:
   - Aller sur https://console.firebase.google.com
   - Créer un nouveau projet
   - Nom: `mayegue-production`

2. **Activer les services**:
   - Authentication → Email/Password, Google, Phone
   - Firestore Database → Mode production
   - Storage → Règles par défaut
   - Analytics → Activer

3. **Obtenir les credentials**:
   ```
   Project Settings → General → Your apps → Web app
   ```

4. **Remplir `.env`**:
   ```env
   VITE_FIREBASE_API_KEY="..."
   VITE_FIREBASE_AUTH_DOMAIN="..."
   VITE_FIREBASE_PROJECT_ID="..."
   VITE_FIREBASE_STORAGE_BUCKET="..."
   VITE_FIREBASE_MESSAGING_SENDER_ID="..."
   VITE_FIREBASE_APP_ID="..."
   VITE_FIREBASE_MEASUREMENT_ID="..."
   ```

### Configuration des Services de Paiement

#### Campay

1. Créer un compte sur https://www.campay.net
2. Obtenir les credentials API
3. Ajouter au `.env`:
   ```env
   VITE_CAMPAY_API_KEY="..."
   VITE_CAMPAY_USERNAME="..."
   VITE_CAMPAY_PASSWORD="..."
   ```

#### Noupai

1. Créer un compte marchand sur https://noupai.com
2. Compléter le KYC
3. Ajouter au `.env`:
   ```env
   VITE_NOUPAI_API_KEY="..."
   VITE_NOUPAI_MERCHANT_ID="..."
   ```

#### Stripe

1. Créer un compte sur https://stripe.com
2. Mode test activé par défaut
3. Ajouter au `.env`:
   ```env
   VITE_STRIPE_PUBLISHABLE_KEY="pk_test_..."
   ```

---

## Modules Principaux

### 1. Module d'Authentification

**Emplacement**: `src/features/auth/`

**Fonctionnalités**:
- Inscription (email/password)
- Connexion (email/password, Google OAuth)
- 2FA (SMS)
- Réinitialisation mot de passe
- Vérification email

**Flux d'Authentification**:

```typescript
// 1. Inscription
const register = async (email: string, password: string) => {
  // Créer utilisateur Firebase
  const user = await authService.signUpWithEmail(email, password);

  // Email de vérification envoyé automatiquement

  // Créer profil Firestore avec rôle "apprenant" par défaut
  await userService.ensureUserProfile(user.id, {
    email,
    displayName: email.split('@')[0]
  });

  return user;
};

// 2. Connexion
const login = async (email: string, password: string) => {
  const user = await authService.signInWithEmail(email, password);

  // Redirection basée sur le rôle
  if (user.role === 'apprenant') navigate('/dashboard/apprenant');
  if (user.role === 'teacher') navigate('/dashboard/teacher');
  if (user.role === 'admin') navigate('/dashboard/admin');

  return user;
};

// 3. Google OAuth
const googleLogin = async () => {
  const user = await authService.signInWithGoogle();
  // Profil créé automatiquement si n'existe pas
  return user;
};
```

**Service**: `src/core/services/firebase/auth.service.ts`

**Store**: `src/features/auth/store/authStore.ts` (Zustand)

---

### 2. Module Dictionnaire

**Emplacement**: `src/features/dictionary/`

**Fonctionnalités**:
- Recherche de mots
- Traduction multi-langues
- Audio prononciation
- Exemples d'utilisation
- Favoris

**Structure de Données**:

```typescript
interface DictionaryEntry {
  id: string;
  word: string;
  language: string; // ewondo, duala, fulfulde, etc.
  translations: {
    french: string;
    english: string;
  };
  pronunciation: string;
  audioUrl?: string;
  examples: {
    sentence: string;
    translation: string;
  }[];
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  createdBy: string; // userId
  createdAt: number;
}
```

**Collection Firestore**: `dictionary`

**Règles d'Accès**:
- Lecture: Tous (public)
- Écriture: Teachers et Admins uniquement

---

### 3. Module Leçons

**Emplacement**: `src/features/lessons/`

**Fonctionnalités**:
- Liste des leçons par langue
- Progression utilisateur
- Exercices interactifs
- Quiz
- Certificats

**Structure de Données**:

```typescript
interface Lesson {
  id: string;
  title: string;
  description: string;
  language: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // minutes
  content: {
    type: 'text' | 'audio' | 'video' | 'exercise';
    data: any;
  }[];
  exercises: Exercise[];
  requiredLesson?: string; // ID leçon prérequise
  createdBy: string;
  isPublished: boolean;
  createdAt: number;
  updatedAt: number;
}

interface UserProgress {
  userId: string;
  lessonId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number; // 0-100
  score?: number;
  completedAt?: number;
  timeSpent: number; // secondes
}
```

**Collections Firestore**:
- `lessons` - Leçons
- `user_progress` - Progression utilisateurs

---

### 4. Module Assistant IA

**Emplacement**: `src/features/ai-assistant/`

**Fonctionnalités**:
- Chat conversationnel
- Aide à la prononciation
- Suggestions de vocabulaire
- Correction de phrases

**Intégration**:

```typescript
// Utilise Google Gemini AI via Firebase Functions
const chatWithAI = async (message: string, context: any) => {
  const response = await axios.post('/api/ai/chat', {
    message,
    context,
    language: currentLanguage,
  });

  return response.data;
};
```

**Limitations**:
- Visiteurs: 5 messages/jour
- Apprenants: 50 messages/jour
- Premium: Illimité

---

### 5. Module Paiements

**Emplacement**: `src/features/payments/`

**Voir documentation détaillée**: `PAYMENT_SYSTEM_IMPLEMENTATION.md`

**Providers**:
1. Campay (Mobile Money - Priorité 1)
2. Noupai (Mobile Money - Fallback)
3. Stripe (Cartes internationales)

**Flux de Paiement**:

```typescript
// 1. Sélection du plan
const selectPlan = (planId: string) => {
  const plan = plans.find(p => p.id === planId);
  setSelectedPlan(plan);
};

// 2. Choix méthode de paiement
const selectMethod = (method: 'mobile_money' | 'credit_card') => {
  setPaymentMethod(method);
};

// 3. Initialisation paiement
const initiatePayment = async () => {
  const result = await paymentService.processPayment({
    amount: selectedPlan.price,
    currency: 'XAF',
    method: paymentMethod,
    userId: user.id,
    description: `Abonnement ${selectedPlan.name}`,
  });

  if (result.success) {
    // Rediriger vers page de succès
    navigate('/payment/success');
  } else {
    // Afficher erreur
    showError(result.message);
  }
};
```

---

## Services et API

### Service Firebase Auth

**Fichier**: `src/core/services/firebase/auth.service.ts`

**Méthodes Principales**:

```typescript
class AuthService {
  // Inscription email/password
  async signUpWithEmail(email: string, password: string, displayName?: string): Promise<User>

  // Connexion email/password
  async signInWithEmail(email: string, password: string): Promise<User>

  // Connexion Google OAuth
  async signInWithGoogle(): Promise<User>

  // Déconnexion
  async signOut(): Promise<void>

  // Réinitialisation mot de passe
  async requestPasswordReset(email: string): Promise<void>

  // 2FA - Configuration
  async setupRecaptcha(elementId: string): Promise<RecaptchaVerifier>
  async enrollPhoneMFA(phoneNumber: string, recaptcha: RecaptchaVerifier): Promise<string>

  // 2FA - Vérification
  async verifyPhoneMFA(verificationId: string, code: string): Promise<void>

  // Observer changements auth
  onAuthStateChange(callback: (user: User | null) => void): () => void
}
```

**Exemple d'Utilisation**:

```typescript
import { authService } from '@/core/services/firebase/auth.service';

// Inscription
try {
  const user = await authService.signUpWithEmail(
    'user@example.com',
    'password123',
    'John Doe'
  );
  console.log('Utilisateur créé:', user);
} catch (error) {
  console.error('Erreur inscription:', error);
}

// Observer l'état d'auth
useEffect(() => {
  const unsubscribe = authService.onAuthStateChange((user) => {
    if (user) {
      setUser(user);
    } else {
      setUser(null);
    }
  });

  return () => unsubscribe();
}, []);
```

---

### Service Firestore

**Fichier**: `src/core/services/firebase/firestore.service.ts`

**Pattern Générique**:

```typescript
class FirestoreService<T> {
  constructor(private collectionName: string) {}

  // Créer
  async create(data: T): Promise<string> {
    const docRef = await addDoc(collection(db, this.collectionName), data);
    return docRef.id;
  }

  // Lire
  async get(id: string): Promise<T | null> {
    const docRef = doc(db, this.collectionName, id);
    const snap = await getDoc(docRef);
    return snap.exists() ? snap.data() as T : null;
  }

  // Mettre à jour
  async update(id: string, data: Partial<T>): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await updateDoc(docRef, data);
  }

  // Supprimer
  async delete(id: string): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await deleteDoc(docRef);
  }

  // Requête
  async query(constraints: QueryConstraint[]): Promise<T[]> {
    const q = query(collection(db, this.collectionName), ...constraints);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
  }

  // Écouter changements en temps réel
  onSnapshot(callback: (data: T[]) => void): () => void {
    const unsubscribe = onSnapshot(
      collection(db, this.collectionName),
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as T));
        callback(data);
      }
    );
    return unsubscribe;
  }
}
```

**Exemple d'Utilisation**:

```typescript
// Service pour les leçons
class LessonService extends FirestoreService<Lesson> {
  constructor() {
    super('lessons');
  }

  async getByLanguage(language: string): Promise<Lesson[]> {
    return this.query([
      where('language', '==', language),
      where('isPublished', '==', true),
      orderBy('createdAt', 'desc')
    ]);
  }

  async getUserProgress(userId: string, lessonId: string): Promise<UserProgress | null> {
    const progressRef = doc(db, 'user_progress', `${userId}_${lessonId}`);
    const snap = await getDoc(progressRef);
    return snap.exists() ? snap.data() as UserProgress : null;
  }
}

export const lessonService = new LessonService();
```

---

## Base de Données Firebase

### Collections Firestore

#### 1. `users`

```javascript
{
  // Document ID = userId from Firebase Auth
  email: string,
  displayName: string,
  role: 'visitor' | 'apprenant' | 'teacher' | 'admin',
  phoneNumber?: string,
  emailVerified: boolean,
  twoFactorEnabled: boolean,
  subscriptionStatus: 'free' | 'premium' | 'trial',
  createdAt: timestamp,
  updatedAt: timestamp,
  preferences: {
    language: 'fr' | 'en',
    targetLanguages: string[],
    theme: 'light' | 'dark' | 'system',
    notificationsEnabled: boolean,
    dailyGoalMinutes: number
  },
  stats: {
    lessonsCompleted: number,
    wordsLearned: number,
    totalTimeMinutes: number,
    currentStreak: number,
    longestStreak: number,
    badgesEarned: number,
    level: number,
    xp: number
  }
}
```

**Index Requis**:
- `email` (ASC)
- `role` (ASC), `createdAt` (DESC)

#### 2. `dictionary`

```javascript
{
  id: string,
  word: string,
  language: string,
  translations: {
    french: string,
    english: string
  },
  pronunciation: string,
  audioUrl?: string,
  examples: [
    {
      sentence: string,
      translation: string
    }
  ],
  category: string,
  difficulty: 'beginner' | 'intermediate' | 'advanced',
  createdBy: string, // userId
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**Index Requis**:
- `language` (ASC), `word` (ASC)
- `language` (ASC), `category` (ASC)
- `createdBy` (ASC), `createdAt` (DESC)

#### 3. `lessons`

```javascript
{
  id: string,
  title: string,
  description: string,
  language: string,
  level: 'beginner' | 'intermediate' | 'advanced',
  duration: number,
  content: any[],
  exercises: any[],
  requiredLesson?: string,
  createdBy: string,
  isPublished: boolean,
  enrolledCount: number,
  completionRate: number,
  averageRating: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**Index Requis**:
- `language` (ASC), `isPublished` (ASC), `level` (ASC)
- `createdBy` (ASC), `createdAt` (DESC)

#### 4. `transactions`

```javascript
{
  id: string,
  userId: string,
  amount: number,
  currency: 'XAF' | 'USD' | 'EUR',
  provider: 'campay' | 'noupai' | 'stripe',
  method: 'mobile_money' | 'credit_card',
  status: 'pending' | 'completed' | 'failed' | 'refunded',
  description: string,
  externalReference: string,
  providerTransactionId?: string,
  errorCode?: string,
  errorMessage?: string,
  metadata: any,
  createdAt: timestamp,
  updatedAt: timestamp,
  completedAt?: timestamp
}
```

**Index Requis**:
- `userId` (ASC), `createdAt` (DESC)
- `status` (ASC), `createdAt` (DESC)
- `provider` (ASC), `status` (ASC)

#### 5. `admin_wallets`

```javascript
{
  userId: string, // Admin user ID
  balance: number,
  currency: 'XAF',
  pendingBalance: number,
  totalEarnings: number,
  totalWithdrawals: number,
  lastUpdated: timestamp
}
```

#### 6. `newsletter_subscriptions`

```javascript
{
  email: string,
  subscribedAt: timestamp,
  status: 'active' | 'unsubscribed',
  source: 'website_footer' | 'landing_page' | 'checkout',
  preferences: {
    frequency: 'daily' | 'weekly' | 'monthly',
    categories: string[]
  }
}
```

**Index Requis**:
- `email` (ASC)
- `status` (ASC), `subscribedAt` (DESC)

### Règles de Sécurité Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Fonctions helper
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    function isAdmin() {
      return isAuthenticated() &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    function isTeacher() {
      return isAuthenticated() &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['teacher', 'admin'];
    }

    // Users
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && isOwner(userId);
      allow update: if isOwner(userId) || isAdmin();
      allow delete: if isAdmin();
    }

    // Dictionary
    match /dictionary/{entryId} {
      allow read: if true; // Public
      allow create, update, delete: if isTeacher();
    }

    // Lessons
    match /lessons/{lessonId} {
      allow read: if resource.data.isPublished || isTeacher();
      allow create, update, delete: if isTeacher();
    }

    // Transactions
    match /transactions/{transactionId} {
      allow read: if isOwner(resource.data.userId) || isAdmin();
      allow create: if isAuthenticated();
      allow update: if isAdmin();
      allow delete: if false; // Jamais supprimer
    }

    // Admin wallets
    match /admin_wallets/{walletId} {
      allow read, write: if isAdmin();
    }

    // Newsletter
    match /newsletter_subscriptions/{subId} {
      allow create: if true; // Anyone can subscribe
      allow read, update, delete: if isAdmin();
    }
  }
}
```

---

## Authentification et Autorisation

### Système de Rôles

**Hiérarchie**:
```
admin (4)
  ├── Accès complet système
  ├── Gestion utilisateurs
  ├── Gestion contenu
  └── Analytics & finances

teacher (3)
  ├── Création contenu
  ├── Gestion leçons/dictionnaire
  └── Modération communauté

apprenant (2) - RÔLE PAR DÉFAUT
  ├── Accès leçons
  ├── Dictionnaire complet
  ├── Communauté
  └── Assistant IA

visitor (1)
  ├── Dictionnaire limité (500 mots)
  ├── Leçons démo (10)
  └── Assistant IA limité (5/jour)
```

### Protection des Routes

**Composant**: `ProtectedRoute.tsx`

```typescript
export const ProtectedRoute = () => {
  const { user, loading } = useAuthStore();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
};
```

**Usage dans Router**:

```typescript
<Route element={<ProtectedRoute />}>
  <Route path="dashboard" element={<RoleRedirect />} />
  <Route path="dashboard/apprenant" element={<ApprenantDashboard />} />

  <Route element={<RoleRoute allow={["teacher", "admin"]} />}>
    <Route path="dashboard/teacher" element={<TeacherDashboard />} />
  </Route>

  <Route element={<RoleRoute allow={["admin"]} />}>
    <Route path="dashboard/admin" element={<AdminDashboard />} />
  </Route>
</Route>
```

### Redirection Basée sur Rôle

**Composant**: `RoleRedirect.tsx`

```typescript
export const RoleRedirect = () => {
  const { user } = useAuthStore();

  if (!user) return <Navigate to="/login" replace />;

  const roleToPath: Record<string, string> = {
    visitor: '/dashboard/guest',
    apprenant: '/dashboard/apprenant',
    teacher: '/dashboard/teacher',
    admin: '/dashboard/admin',
  };

  return <Navigate to={roleToPath[user.role]} replace />;
};
```

### 2FA (Two-Factor Authentication)

**Configuration**:

```typescript
// 1. Setup reCAPTCHA
const verifier = await authService.setupRecaptcha('recaptcha-container');

// 2. Envoyer code SMS
const verificationId = await authService.enrollPhoneMFA(
  '+237XXXXXXXXX',
  verifier
);

// 3. Vérifier code
await authService.verifyPhoneMFA(verificationId, '123456');
```

**Utilisation dans UI**:

```tsx
function Setup2FA() {
  const [step, setStep] = useState(1);
  const [verificationId, setVerificationId] = useState('');

  const handleSendCode = async () => {
    const verifier = await authService.setupRecaptcha('recaptcha');
    const vid = await authService.enrollPhoneMFA(phoneNumber, verifier);
    setVerificationId(vid);
    setStep(2);
  };

  const handleVerifyCode = async () => {
    await authService.verifyPhoneMFA(verificationId, code);
    toast.success('2FA activé!');
  };

  return (
    <div>
      {step === 1 && (
        <>
          <input type="tel" value={phoneNumber} />
          <div id="recaptcha"></div>
          <button onClick={handleSendCode}>Envoyer code</button>
        </>
      )}

      {step === 2 && (
        <>
          <input type="text" maxLength={6} value={code} />
          <button onClick={handleVerifyCode}>Vérifier</button>
        </>
      )}
    </div>
  );
}
```

---

## Système de Paiement

**Documentation complète**: Voir `PAYMENT_SYSTEM_IMPLEMENTATION.md`

### Vue d'Ensemble Rapide

**Providers**:
1. **Campay** - Mobile Money (MTN, Orange)
2. **Noupai** - Mobile Money (Fallback)
3. **Stripe** - Cartes bancaires

**Fallback Automatique**:
```
Campay disponible? → Oui → Utiliser Campay
                   → Non → Noupai disponible? → Oui → Utiliser Noupai
                                              → Non → Erreur
```

**Gestion Erreurs**:
- Solde insuffisant → Message utilisateur, pas de retry
- Timeout → Retry automatique avec provider suivant
- Service down → Fallback automatique

**Wallet Admin**:
- Solde en temps réel
- Transactions listées
- Export CSV
- Statistiques détaillées

---

## Guide de Développement

### Conventions de Code

#### Nommage

```typescript
// PascalCase pour composants et types
interface User {}
function UserProfile() {}

// camelCase pour variables et fonctions
const userName = 'John';
function getUserData() {}

// UPPER_CASE pour constantes
const API_URL = 'https://api.example.com';
const MAX_RETRIES = 3;

// kebab-case pour fichiers
user-profile.component.tsx
auth.service.ts
```

#### Structure Composant

```typescript
// 1. Imports
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserIcon } from '@heroicons/react/24/outline';

// 2. Types/Interfaces
interface Props {
  userId: string;
  onUpdate?: () => void;
}

// 3. Composant
export function UserProfile({ userId, onUpdate }: Props) {
  // 3.1. Hooks
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  // 3.2. Effects
  useEffect(() => {
    loadUser();
  }, [userId]);

  // 3.3. Functions
  const loadUser = async () => {
    // Implementation
  };

  const handleUpdate = () => {
    // Implementation
    onUpdate?.();
  };

  // 3.4. Render
  return (
    <div className="user-profile">
      {/* JSX */}
    </div>
  );
}
```

### Gestion d'État (Zustand)

**Pattern Standard**:

```typescript
import { create } from 'zustand';

interface State {
  // État
  items: Item[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchItems: () => Promise<void>;
  addItem: (item: Item) => void;
  updateItem: (id: string, data: Partial<Item>) => void;
  deleteItem: (id: string) => void;
}

export const useStore = create<State>((set, get) => ({
  // État initial
  items: [],
  loading: false,
  error: null,

  // Actions
  fetchItems: async () => {
    set({ loading: true });
    try {
      const items = await api.getItems();
      set({ items, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addItem: (item) => {
    set(state => ({
      items: [...state.items, item]
    }));
  },

  updateItem: (id, data) => {
    set(state => ({
      items: state.items.map(item =>
        item.id === id ? { ...item, ...data } : item
      )
    }));
  },

  deleteItem: (id) => {
    set(state => ({
      items: state.items.filter(item => item.id !== id)
    }));
  },
}));
```

### Custom Hooks

**Pattern Standard**:

```typescript
// useFirestoreQuery.ts
export function useFirestoreQuery<T>(
  collectionName: string,
  constraints?: QueryConstraint[]
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, collectionName),
      ...(constraints || [])
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as T[];
        setData(items);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName]);

  return { data, loading, error };
}

// Usage
const { data: lessons, loading } = useFirestoreQuery<Lesson>(
  'lessons',
  [where('language', '==', 'ewondo')]
);
```

### Gestion des Erreurs

**Pattern Toast**:

```typescript
import toast from 'react-hot-toast';

async function handleAction() {
  try {
    await someAsyncOperation();
    toast.success('Opération réussie!');
  } catch (error) {
    if (error instanceof FirebaseError) {
      toast.error(getFirebaseErrorMessage(error.code));
    } else {
      toast.error('Une erreur est survenue');
    }
    console.error(error);
  }
}

function getFirebaseErrorMessage(code: string): string {
  const messages: Record<string, string> = {
    'auth/email-already-in-use': 'Cet email est déjà utilisé',
    'auth/invalid-email': 'Email invalide',
    'auth/weak-password': 'Mot de passe trop faible',
    'auth/user-not-found': 'Utilisateur non trouvé',
    'auth/wrong-password': 'Mot de passe incorrect',
  };

  return messages[code] || 'Erreur inconnue';
}
```

---

## Tests

### Configuration

**Fichier**: `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
```

### Tests Unitaires

```typescript
// user.service.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { userService } from './user.service';

describe('UserService', () => {
  beforeEach(() => {
    // Setup
  });

  it('should create user with apprenant role by default', async () => {
    const user = await userService.createUser({
      email: 'test@example.com',
      displayName: 'Test User'
    });

    expect(user.role).toBe('apprenant');
  });

  it('should update user role', async () => {
    await userService.updateUserRole('user123', 'teacher');
    const user = await userService.getUser('user123');

    expect(user.role).toBe('teacher');
  });
});
```

### Tests Composants

```typescript
// LoginPage.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LoginPage from './LoginPage';

describe('LoginPage', () => {
  it('should render login form', () => {
    render(<LoginPage />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /connexion/i })).toBeInTheDocument();
  });

  it('should submit form with credentials', async () => {
    const mockLogin = vi.fn();
    render(<LoginPage onLogin={mockLogin} />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });

    fireEvent.change(screen.getByLabelText(/mot de passe/i), {
      target: { value: 'password123' }
    });

    fireEvent.click(screen.getByRole('button', { name: /connexion/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });
});
```

### Lancer les Tests

```bash
# Tests unitaires
npm run test

# Tests avec watch mode
npm run test:watch

# Tests avec coverage
npm run test:coverage
```

---

## Déploiement

### Build Production

```bash
# 1. Vérifier types TypeScript
npm run type-check

# 2. Linter
npm run lint

# 3. Tests
npm run test

# 4. Build
npm run build

# Output dans dist/
```

### Déploiement Firebase Hosting

```bash
# 1. Installer Firebase CLI
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Initialiser (si pas déjà fait)
firebase init hosting

# 4. Build
npm run build

# 5. Déployer
firebase deploy --only hosting

# Ou utiliser le script
npm run firebase:deploy:hosting
```

### Variables d'Environnement Production

```env
# .env.production
VITE_APP_ENV="production"
VITE_FIREBASE_API_KEY="..."
VITE_FIREBASE_PROJECT_ID="..."
# etc.

# NE PAS COMMIT!
```

### CI/CD avec GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Firebase Hosting

on:
  push:
    branches:
      - main

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test

      - name: Build
        run: npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          # autres variables...

      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: your-project-id
```

---

## Dépannage

### Erreurs Communes

#### 1. Firebase Not Initialized

**Erreur**:
```
Firebase: No Firebase App '[DEFAULT]' has been created
```

**Solution**:
- Vérifier `.env` contient toutes les variables Firebase
- Redémarrer le serveur de dev après modification `.env`

#### 2. CORS Errors

**Erreur**:
```
Access to fetch at '...' has been blocked by CORS policy
```

**Solution**:
- Vérifier domaine autorisé dans Firebase Console
- Pour paiements: Configurer CORS côté API provider

#### 3. Build Errors

**Erreur**:
```
Module not found: Can't resolve '@/...'
```

**Solution**:
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}

// vite.config.ts
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
```

#### 4. Firestore Permission Denied

**Erreur**:
```
Missing or insufficient permissions
```

**Solution**:
- Vérifier règles de sécurité Firestore
- Vérifier utilisateur est authentifié
- Vérifier rôle utilisateur correspond aux règles

### Debugging

#### Console Logs

```typescript
// Development only
if (import.meta.env.DEV) {
  console.log('Debug:', data);
}
```

#### Firebase Emulator

```bash
# Lancer emulators
npm run firebase:emulators

# Dans code
if (import.meta.env.DEV) {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
}
```

#### React DevTools

- Installer extension Chrome/Firefox
- Inspecter composants et state
- Profiler performances

---

## Ressources

### Documentation Officielle

- **React**: https://react.dev/
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Vite**: https://vitejs.dev/
- **Firebase**: https://firebase.google.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Zustand**: https://docs.pmnd.rs/zustand

### Outils Utiles

- **VS Code Extensions**:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - Firebase Explorer
  - GitLens

- **Chrome Extensions**:
  - React Developer Tools
  - Redux DevTools (si besoin)
  - Firebase Tools

### Support

- **GitHub Issues**: https://github.com/votre-repo/issues
- **Email**: dev@maayegue.com
- **Slack**: [Lien workspace]

---

**Documentation maintenue par l'équipe Ma'a yegue**
**Dernière mise à jour**: Janvier 2025
