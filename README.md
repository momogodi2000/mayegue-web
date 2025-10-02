# 🌍 Mayegue Web - Plateforme d'Apprentissage des Langues Camerounaises

<div align="center">

![Mayegue Logo](public/assets/icons/icon-512x512.png)

**Apprenez les langues traditionnelles camerounaises avec une technologie moderne**

🎉 **Status**: ✅ Production Ready MVP | 📦 Build: Passing | 🧪 Type Check: 0 Errors | 🎨 Lint: 30 Warnings

[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![Firebase](https://img.shields.io/badge/Firebase-10.8-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![PWA](https://img.shields.io/badge/PWA-Enabled-5A0FC8?style=for-the-badge&logo=pwa)](https://web.dev/progressive-web-apps/)

[🚀 Demo Live](https://mayegue.app) · [📖 Documentation](./WEB_ARCHITECTURE.md) · [🐛 Signaler un Bug](https://github.com/mayegue/issues)

</div>

---

## 📋 Table des Matières

- [À Propos](#-à-propos)
- [Fonctionnalités](#-fonctionnalités)
- [Langues Supportées](#-langues-supportées)
- [Stack Technologique](#-stack-technologique)
- [Installation](#-installation)
- [Développement](#-développement)
- [Architecture](#-architecture)
- [PWA & Offline](#-pwa--offline)
- [Firebase](#-firebase)
- [Déploiement](#-déploiement)
- [Contribution](#-contribution)
- [License](#-license)

---

## 📖 À Propos

**Mayegue** est une plateforme web progressive (PWA) d'apprentissage des langues traditionnelles camerounaises. Basée sur l'app mobile Flutter originale, cette version web offre une expérience utilisateur optimale sur tous les navigateurs avec support hors ligne complet.

### 🎯 Mission

Préserver et promouvoir les langues camerounaises en rendant leur apprentissage accessible, interactif et moderne grâce à la technologie.

### 👥 Public Cible

- **Étudiants et chercheurs** en langues africaines
- **Diaspora camerounaise** souhaitant maintenir leurs racines culturelles
- **Touristes et expatriés** au Cameroun
- **Institutions éducatives** et culturelles

---

## ✨ Fonctionnalités

### 🔑 Authentification Multi-Méthodes
- ✅ Email/Mot de passe
- ✅ Google Sign-In
- ✅ Facebook Login
- ✅ Apple Sign-In
- ✅ Authentification par téléphone (SMS)

### 📚 Dictionnaire Interactif
- 🔍 Recherche intelligente en temps réel
- 🎵 Prononciation audio par locuteurs natifs
- 📝 Transcription phonétique (IPA)
- ⭐ Favoris personnels
- 📊 Exemples d'usage contextuels
- 💾 Mode hors ligne complet

### 🎓 Système de Leçons
- 📖 Cours structurés par niveau (Débutant, Intermédiaire, Avancé)
- 🎥 Contenu multimédia (vidéo, audio, images)
- ✍️ Exercices interactifs
- 📈 Suivi de progression en temps réel
- 🏆 Badges et récompenses

### 🤖 Assistant IA (Gemini)
- 💬 Chat conversationnel intelligent
- 🎯 Corrections personnalisées
- 📝 Génération de contenu pédagogique
- 🗣️ Analyse de prononciation
- 💡 Recommandations adaptées

### 🎮 Gamification
- 🏅 Système de badges progressifs (8 niveaux)
- 📊 Leaderboards communautaires
- 🎯 Défis quotidiens et hebdomadaires
- ⭐ Système de points d'expérience (XP)
- 🎁 Réalisations culturelles spéciales

### 👥 Communauté
- 💬 Forums de discussion par langue
- 👨‍🏫 Système de mentorat
- 📤 Partage de ressources
- ⭐ Évaluations et commentaires

### 💳 Paiements
- 💰 Intégration CamPay (MTN, Orange Money)
- 🔄 NouPai (solution de fallback)
- 📦 Plans Freemium, Premium, Enseignant
- 💳 Paiement par carte bancaire

### 📱 PWA Features
- 📲 Installation sur l'écran d'accueil
- 🌐 Mode hors ligne complet
- 🔔 Notifications push
- ⚡ Performance optimisée
- 📶 Synchronisation automatique

---

## 🗣️ Langues Supportées

| Langue | Famille Linguistique | Région | Locuteurs |
|--------|---------------------|--------|-----------|
| **Ewondo** | Beti-Pahuin (Bantu) | Centre | 577,000+ |
| **Duala** | Coastal Bantu | Littoral | 300,000+ |
| **Fulfulde** | Niger-Congo (Atlantic) | Nord | 1,500,000+ |
| **Bassa** | A40 Bantu | Centre-Littoral | 230,000+ |
| **Bamum** | Grassfields | Ouest | 215,000+ |
| **Fe'efe'e** | Grassfields (Bamileke) | Ouest | 200,000+ |

**Total**: 6 langues • 3 millions+ de locuteurs

---

## 🛠️ Stack Technologique

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **State Management**: Zustand + React Query
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod

### Backend & Services
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Analytics**: Firebase Analytics
- **Messaging**: Firebase Cloud Messaging
- **AI**: Google Gemini AI
- **Paiements**: CamPay & NouPai APIs

### Offline & PWA
- **Service Worker**: Workbox (via Vite PWA)
- **Local DB**: IndexedDB (Dexie.js)
- **SQLite**: sql.js (WASM)
- **Caching**: Strategy multi-niveaux

### SEO & Performance
- **SEO**: React Helmet Async
- **Meta Tags**: Open Graph, Twitter Cards
- **Sitemap**: Auto-généré
- **Lighthouse Score**: 90+ (cible)

---

## 📥 Installation

### Prérequis

- **Node.js**: 18.0.0 ou supérieur
- **npm**: 9.0.0 ou supérieur
- **Git**: Pour cloner le repository

### Étapes d'Installation

```bash
# 1. Cloner le repository
git clone https://github.com/mayegue/mayegue-web.git
cd mayegue-web

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local

# 4. Éditer .env.local avec vos clés API
# (Firebase credentials sont déjà configurées)

# 5. Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

### Variables d'Environnement

Créer un fichier `.env.local`:

```env
# Firebase (déjà configurées)
VITE_FIREBASE_API_KEY=AIzaSyCe4_2NdHl3zvkukTg18WRTiZC7RecMRw0
VITE_FIREBASE_AUTH_DOMAIN=studio-6750997720-7c22e.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=studio-6750997720-7c22e
VITE_FIREBASE_STORAGE_BUCKET=studio-6750997720-7c22e.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=853678151393
VITE_FIREBASE_APP_ID=1:853678151393:web:40332d5cd4cedb029cc9a0
VITE_FIREBASE_MEASUREMENT_ID=G-F60NV25RDJ

# AI Services
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Payment Services (sandbox)
VITE_CAMPAY_API_KEY=your_campay_api_key
VITE_CAMPAY_SECRET=your_campay_secret
VITE_CAMPAY_ENVIRONMENT=sandbox
```

---

## 🚀 Développement

### Commandes Disponibles

```bash
# Développement
npm run dev              # Lancer le serveur de dev (port 3000)

# Build
npm run build            # Build de production
npm run preview          # Preview du build de production

# Code Quality
npm run lint             # Linter ESLint
npm run type-check       # Vérification TypeScript

# Scripts Utilitaires
npm run generate-sitemap # Générer le sitemap SEO
npm run seed-db          # Peupler la base de données SQLite
```

### Structure du Projet

```
mayegue-web/
├── public/              # Assets statiques
│   ├── assets/         # Images, icons, SQLite DB
│   ├── manifest.json   # PWA manifest
│   └── robots.txt      # SEO robots
│
├── src/
│   ├── app/            # Bootstrap application
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── router.tsx
│   │
│   ├── features/       # Modules fonctionnels
│   │   ├── auth/
│   │   ├── dictionary/
│   │   ├── lessons/
│   │   ├── ai-assistant/
│   │   ├── gamification/
│   │   └── community/
│   │
│   ├── shared/         # Composants partagés
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── types/
│   │
│   ├── core/           # Services core
│   │   ├── config/
│   │   ├── services/
│   │   ├── store/
│   │   └── pwa/
│   │
│   └── assets/         # Styles et assets
│
├── WEB_ARCHITECTURE.md        # Architecture détaillée
├── WEB_IMPLEMENTATION_GUIDE.md # Guide d'implémentation
└── README.md                   # Ce fichier
```

### Conventions de Code

- **TypeScript**: Strict mode activé
- **ESLint**: Configuration React + TypeScript
- **Prettier**: Formatage automatique
- **Naming**: 
  - Components: PascalCase
  - Files: kebab-case
  - Functions: camelCase
  - Constants: UPPER_SNAKE_CASE

---

## 🏗️ Architecture

### Pattern MVVM

```
View (UI) ←→ ViewModel (State) ←→ Model (Data)
    ↑              ↑                    ↑
   React       Zustand/RQ          Firebase/IndexedDB
```

### Flux de Données

```
User Action → Component → Hook → Service → Firebase/IndexedDB
                                              ↓
                                        State Update (Zustand)
                                              ↓
                                        UI Re-render (React)
```

### Clean Architecture

```
┌─────────────────────────────────┐
│     Presentation Layer          │ ← React Components
├─────────────────────────────────┤
│     Application Layer           │ ← Business Logic
├─────────────────────────────────┤
│     Domain Layer                │ ← Entities, Use Cases
├─────────────────────────────────┤
│     Data Layer                  │ ← Firebase, IndexedDB
├─────────────────────────────────┤
│     Infrastructure Layer        │ ← Service Workers, PWA
└─────────────────────────────────┘
```

Voir [WEB_ARCHITECTURE.md](./WEB_ARCHITECTURE.md) pour plus de détails.

---

## 📱 PWA & Offline

### Service Worker

- **Strategy**: Workbox avec Vite PWA Plugin
- **Caching**: Multi-niveaux (Runtime, Precache, Background Sync)
- **Update**: Auto-update avec prompt utilisateur

### Offline Database

#### IndexedDB (Dexie.js)
- User profiles
- Dictionary cache
- Lessons cache
- Progress tracking

#### SQLite WASM (sql.js)
- Embedded database (public/assets/languages.db)
- 10,000+ translations offline
- 6 langues complètes
- Zero latency queries

### Synchronisation

```typescript
// Auto-sync quand en ligne
window.addEventListener('online', () => {
  syncService.autoSync();
});

// Sync périodique (5 min)
setInterval(() => {
  if (navigator.onLine) {
    syncService.autoSync();
  }
}, 5 * 60 * 1000);
```

---

## 🔥 Firebase

### Services Utilisés

| Service | Usage |
|---------|-------|
| **Authentication** | Multi-provider auth |
| **Firestore** | Database NoSQL temps réel |
| **Storage** | Fichiers média (audio, images) |
| **Analytics** | Tracking utilisateur |
| **Messaging** | Push notifications |
| **Crashlytics** | Error reporting (futur) |

### Collections Firestore

```
firestore/
├── users/           # Profils utilisateurs
├── languages/       # Langues disponibles
├── lessons/         # Leçons et cours
├── dictionary/      # Entrées dictionnaire
├── progress/        # Progression utilisateurs
├── gamification/    # Badges, achievements
├── community/       # Posts, forums
└── payments/        # Transactions
```

### Security Rules

```javascript
match /users/{userId} {
  allow read, write: if request.auth.uid == userId;
}

match /dictionary/{entryId} {
  allow read: if true; // Public
  allow write: if isTeacherOrAdmin();
}
```

---

## 🚀 Déploiement

### Vercel (Recommandé)

```bash
# Installation Vercel CLI
npm i -g vercel

# Déploiement
vercel --prod
```

### Firebase Hosting

```bash
# Installation Firebase CLI
npm i -g firebase-tools

# Connexion
firebase login

# Déploiement
firebase deploy --only hosting
```

### Build Optimisé

```bash
npm run build

# Output: dist/
# - Code splitting automatique
# - Tree shaking
# - Compression Brotli/Gzip
# - Source maps (production)
```

---

## 🧪 Tests

### Tests Unitaires

```bash
npm run test              # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

### Tests E2E (Playwright)

```bash
npm run test:e2e          # Run E2E tests
npm run test:e2e:ui       # E2E UI mode
```

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Voir [CONTRIBUTING.md](./CONTRIBUTING.md)

### Processus

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

### Guidelines

- Suivre les conventions de code
- Ajouter des tests pour les nouvelles fonctionnalités
- Mettre à jour la documentation
- Respecter le code of conduct

---

## 📄 License

Ce projet est sous licence **MIT**. Voir [LICENSE](./LICENSE) pour plus d'informations.

---

## 📞 Contact & Support

### Équipe Mayegue

- **Email**: contact@mayegue.app
- **Website**: https://mayegue.app
- **GitHub**: https://github.com/mayegue
- **Twitter**: [@MayegueApp](https://twitter.com/MayegueApp)

### Support Technique

- **Documentation**: [WEB_ARCHITECTURE.md](./WEB_ARCHITECTURE.md)
- **Issues**: https://github.com/mayegue/mayegue-web/issues
- **Discord**: [Rejoindre la communauté](https://discord.gg/mayegue)

---

## 🙏 Remerciements

- **Firebase** pour l'infrastructure backend
- **Google Gemini** pour l'IA conversationnelle
- **CamPay & NouPai** pour les solutions de paiement mobile
- **Communauté open-source** pour les outils et libraries
- **Locuteurs natifs** pour les enregistrements audio authentiques

---

## 📊 Statistiques du Projet

![GitHub stars](https://img.shields.io/github/stars/mayegue/mayegue-web?style=social)
![GitHub forks](https://img.shields.io/github/forks/mayegue/mayegue-web?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/mayegue/mayegue-web?style=social)

![GitHub last commit](https://img.shields.io/github/last-commit/mayegue/mayegue-web)
![GitHub issues](https://img.shields.io/github/issues/mayegue/mayegue-web)
![GitHub pull requests](https://img.shields.io/github/issues-pr/mayegue/mayegue-web)

---

<div align="center">

**Fait avec ❤️ par l'équipe Mayegue**

*Préservons ensemble les langues camerounaises pour les générations futures*

[🔝 Retour en haut](#-mayegue-web---plateforme-dapprentissage-des-langues-camerounaises)

</div>
