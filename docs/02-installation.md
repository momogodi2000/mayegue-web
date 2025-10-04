# Guide d'Installation - Ma'a yegue V1.1.0

## 📋 Prérequis

### Logiciels Requis

- **Node.js** : v18.0.0 ou supérieur
- **npm** : v9.0.0 ou supérieur (ou yarn/pnpm)
- **Git** : Dernière version
- **Navigateur** : Chrome, Firefox, Safari ou Edge (version récente)

### Comptes Nécessaires

1. **Firebase** (Google Cloud)
   - Projet Firebase configuré
   - Authentication activé
   - Firestore Database activé
   - Cloud Storage activé
   - Analytics activé

2. **Google AI** (pour Gemini)
   - Clé API Gemini Pro

3. **Paiements** (optionnel pour développement)
   - Compte CamPay
   - Compte Noupai
   - Compte Stripe

## 🚀 Installation Locale

### 1. Cloner le Repository

```bash
git clone https://github.com/votre-organisation/mayegue-web.git
cd mayegue-web
```

### 2. Installer les Dépendances

```bash
# Avec npm
npm install

# Avec yarn
yarn install

# Avec pnpm
pnpm install
```

### 3. Configuration Firebase

#### 3.1. Créer un Projet Firebase

1. Aller sur [Firebase Console](https://console.firebase.google.com/)
2. Créer un nouveau projet
3. Activer les services suivants :
   - **Authentication** (Email/Password, Google, Facebook)
   - **Firestore Database** (mode production)
   - **Cloud Storage**
   - **Analytics**
   - **Performance Monitoring**

#### 3.2. Récupérer la Configuration

1. Dans Firebase Console : **Project Settings** > **Your apps** > **Web app**
2. Copier la configuration Firebase
3. Créer le fichier `.env` à la racine du projet

### 4. Variables d'Environnement

Créer un fichier `.env` avec les variables suivantes :

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyCe4_2NdHl3zvkukTg18WRTiZC7RecMRw0
VITE_FIREBASE_AUTH_DOMAIN=studio-6750997720-7c22e.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=studio-6750997720-7c22e
VITE_FIREBASE_STORAGE_BUCKET=studio-6750997720-7c22e.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=853678151393
VITE_FIREBASE_APP_ID=1:853678151393:web:40332d5cd4cedb029cc9a0
VITE_FIREBASE_MEASUREMENT_ID=G-F60NV25RDJ

# Application
VITE_APP_NAME=Ma'a yegue
VITE_APP_VERSION=1.1.0
VITE_APP_DESCRIPTION=Application d'apprentissage des langues camerounaises
VITE_APP_ENV=development

# AI Services
VITE_GEMINI_API_KEY=votre_cle_api_gemini
VITE_OPENAI_API_KEY=votre_cle_api_openai (optionnel)

# Payment Services
VITE_CAMPAY_API_URL=https://demo.campay.net/api
VITE_CAMPAY_APP_USER=votre_app_user
VITE_CAMPAY_APP_PASS=votre_app_pass

VITE_NOUPAI_API_URL=https://api.noupai.com
VITE_NOUPAI_CLIENT_ID=votre_client_id
VITE_NOUPAI_CLIENT_SECRET=votre_client_secret

VITE_STRIPE_PUBLIC_KEY=votre_cle_publique_stripe

# API Endpoints
VITE_API_BASE_URL=http://localhost:5001

# Security
VITE_ENCRYPTION_KEY=votre_cle_de_chiffrement
VITE_JWT_SECRET=votre_jwt_secret

# Feature Flags
VITE_ENABLE_AI_CHAT=true
VITE_ENABLE_VOICE_RECOGNITION=true
VITE_ENABLE_OFFLINE_MODE=true
VITE_ENABLE_PAYMENTS=true
VITE_ENABLE_COMMUNITY=true
VITE_ENABLE_GAMIFICATION=true

# Development
VITE_USE_EMULATORS=false
VITE_DEBUG_MODE=true

# Monitoring
VITE_SENTRY_DSN=votre_sentry_dsn (optionnel)
VITE_GOOGLE_ANALYTICS_ID=votre_ga_id (optionnel)
VITE_HOTJAR_ID=votre_hotjar_id (optionnel)
VITE_PERFORMANCE_MONITORING=true

# PWA
VITE_PWA_ENABLED=true
VITE_SW_UPDATE_POPUP=true

# Internationalization
VITE_DEFAULT_LANGUAGE=fr
VITE_SUPPORTED_LANGUAGES=fr,en
```

### 5. Initialiser Firestore

Créer les collections de base dans Firestore :

```bash
# Exécuter le script d'initialisation
npm run init:firestore
```

Ou manuellement dans Firebase Console créer ces collections :
- `users`
- `languages`
- `words`
- `lessons`
- `subscriptions`
- `payment_history`
- `receipts`
- `ethnicGroups`
- `historicalSites`
- `arVrScenes`
- `rpg_players`
- `rpg_achievements`
- `ai_mentors`
- `virtual_grandmothers`

### 6. Lancer le Serveur de Développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## 🏗️ Build de Production

### Build

```bash
npm run build
```

Les fichiers optimisés seront dans le dossier `dist/`

### Preview du Build

```bash
npm run preview
```

### Vérification TypeScript

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## 🚀 Déploiement

### Firebase Hosting

1. Installer Firebase CLI :
```bash
npm install -g firebase-tools
```

2. Se connecter :
```bash
firebase login
```

3. Initialiser Firebase :
```bash
firebase init hosting
```

4. Déployer :
```bash
npm run build
firebase deploy
```

### Vercel

1. Installer Vercel CLI :
```bash
npm install -g vercel
```

2. Déployer :
```bash
vercel
```

### Netlify

1. Installer Netlify CLI :
```bash
npm install -g netlify-cli
```

2. Déployer :
```bash
npm run build
netlify deploy --prod
```

## 🧪 Tests

### Lancer les Tests

```bash
# Tests unitaires
npm run test

# Tests avec couverture
npm run test:coverage

# Tests E2E
npm run test:e2e
```

## 🔧 Dépannage

### Problème : "Module not found"
**Solution** :
```bash
rm -rf node_modules package-lock.json
npm install
```

### Problème : Erreurs Firebase
**Solution** :
- Vérifier que toutes les variables `VITE_FIREBASE_*` sont correctes
- Vérifier que Firebase Authentication et Firestore sont activés
- Vérifier les règles de sécurité Firestore

### Problème : Build échoue
**Solution** :
```bash
npm run type-check
npm run lint
```

### Problème : Port 5173 déjà utilisé
**Solution** :
```bash
# Dans vite.config.ts, changer le port
server: {
  port: 3000
}
```

## 📦 Structure du Projet Après Installation

```
mayegue-web/
├── node_modules/          # Dépendances
├── public/                # Assets statiques
├── src/                   # Code source
│   ├── core/             # Services core
│   ├── features/         # Modules fonctionnels
│   ├── shared/           # Composants partagés
│   └── App.tsx           # Composant principal
├── docs/                  # Documentation
├── scripts/              # Scripts utilitaires
├── dist/                 # Build de production
├── .env                  # Variables d'environnement
├── package.json          # Dépendances npm
├── tsconfig.json         # Configuration TypeScript
├── vite.config.ts        # Configuration Vite
├── tailwind.config.js    # Configuration Tailwind
└── firebase.json         # Configuration Firebase
```

## 🔒 Sécurité

### Règles de Sécurité Firestore

Appliquer les règles de sécurité dans Firebase Console :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }

    // Languages (public en lecture)
    match /languages/{languageId} {
      allow read: if true;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Subscriptions (privé)
    match /subscriptions/{subscriptionId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }
  }
}
```

## ✅ Vérification de l'Installation

Après l'installation, vérifier que :

- ✅ `npm run dev` lance l'application sans erreur
- ✅ La connexion Firebase fonctionne
- ✅ L'authentification est opérationnelle
- ✅ Les variables d'environnement sont correctes
- ✅ `npm run build` génère le build sans erreur
- ✅ Les tests passent : `npm run test`

## 📞 Support

En cas de problème :
1. Consulter la [FAQ](./10-guide-utilisateur.md#faq)
2. Vérifier les [Issues GitHub](https://github.com/votre-organisation/mayegue-web/issues)
3. Contacter le support : support@maayegue.app
