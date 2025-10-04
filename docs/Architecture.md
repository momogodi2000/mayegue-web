# Architecture de Ma'a yegue V1.1

## Vue d'ensemble

Ma'a yegue est une plateforme web progressive (PWA) moderne pour l'apprentissage des langues traditionnelles camerounaises. La version 1.1.0 introduit une architecture modulaire et évolutive avec plus de 18 fonctionnalités principales.

## Architecture Générale

### Pattern MVVM (Model-View-ViewModel)

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   View (UI)     │◄──►│ ViewModel (État)│◄──►│  Model (Données)│
│                 │    │                 │    │                 │
│ React Components│    │ Zustand + RQ   │    │ Firebase + IDB  │
│ Tailwind CSS    │    │ Hooks React     │    │ SQLite WASM    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Architecture en Couches

```
┌─────────────────────────────────────┐
│     Couche Présentation             │
│     - Composants React              │
│     - Pages et Routes               │
│     - UI/UX (Tailwind, Framer)      │
├─────────────────────────────────────┤
│     Couche Application              │
│     - Logique métier                │
│     - Gestion d'état (Zustand)      │
│     - Services d'application        │
├─────────────────────────────────────┤
│     Couche Domaine                  │
│     - Entités métier                │
│     - Cas d'usage                   │
│     - Règles métier                 │
├─────────────────────────────────────┤
│     Couche Données                  │
│     - Firebase Firestore            │
│     - IndexedDB (Dexie)             │
│     - SQLite WASM                   │
├─────────────────────────────────────┤
│     Couche Infrastructure           │
│     - Service Workers (PWA)         │
│     - APIs externes                 │
│     - Stockage local                │
└─────────────────────────────────────┘
```

## Structure du Projet

```
maayegue-web/
├── public/                    # Assets statiques
│   ├── assets/               # Images, icônes, base SQLite
│   ├── manifest.json         # Manifest PWA
│   └── robots.txt            # SEO
│
├── src/
│   ├── app/                  # Bootstrap application
│   │   ├── App.tsx          # Composant principal
│   │   ├── main.tsx         # Point d'entrée
│   │   ├── router.tsx       # Configuration routes
│   │   └── index.css        # Styles globaux
│   │
│   ├── features/             # Modules fonctionnels
│   │   ├── atlas/           # Atlas linguistique
│   │   ├── encyclopedia/    # Encyclopédie culturelle
│   │   ├── historical-sites/# Sites historiques
│   │   ├── marketplace/     # Marketplace culturel
│   │   ├── ar-vr/           # AR/VR immersif
│   │   ├── rpg-gamification/# RPG gamification
│   │   ├── ai-features/     # Fonctionnalités IA
│   │   ├── dictionary/      # Dictionnaire
│   │   ├── lessons/         # Leçons
│   │   ├── auth/            # Authentification
│   │   ├── profile/         # Profil utilisateur
│   │   ├── community/       # Communauté
│   │   ├── payments/        # Paiements
│   │   └── ... (15+ autres)
│   │
│   ├── shared/               # Composants partagés
│   │   ├── components/      # Composants réutilisables
│   │   │   ├── ui/         # Composants UI de base
│   │   │   ├── forms/      # Composants de formulaires
│   │   │   └── layouts/    # Layouts
│   │   ├── hooks/          # Hooks personnalisés
│   │   ├── utils/          # Utilitaires
│   │   ├── constants/      # Constantes
│   │   └── types/          # Types TypeScript
│   │
│   ├── core/                 # Services core
│   │   ├── config/          # Configuration
│   │   ├── services/        # Services principaux
│   │   │   ├── ai/         # Service IA Gemini
│   │   │   ├── firebase/   # Services Firebase
│   │   │   ├── offline/    # Services hors ligne
│   │   │   └── payment/    # Services paiement
│   │   ├── store/           # Stores Zustand
│   │   └── pwa/             # PWA et service workers
│   │
│   └── assets/               # Assets importés
│       ├── styles/          # Styles CSS/SCSS
│       ├── icons/           # Icônes SVG
│       └── databases/       # Bases de données
│
├── docs/                     # Documentation
├── scripts/                  # Scripts utilitaires
├── types/                    # Types globaux
└── test/                     # Tests
    ├── unit/                # Tests unitaires
    ├── integration/         # Tests d'intégration
    └── e2e/                 # Tests end-to-end
```

## Technologies Principales

### Frontend
- **React 18** - Framework UI avec hooks et concurrent features
- **TypeScript 5.3** - Typage statique strict
- **Vite 5** - Build tool ultra-rapide avec HMR
- **Tailwind CSS 3.4** - Framework CSS utilitaire
- **Framer Motion** - Animations et transitions fluides

### État et Données
- **Zustand** - Gestion d'état légère et performante
- **TanStack Query** - Gestion des requêtes API et cache
- **Dexie.js** - Wrapper IndexedDB pour données locales
- **sql.js** - SQLite en WebAssembly pour base embarquée

### Backend & Services
- **Firebase** - Suite complète (Auth, Firestore, Storage, Analytics)
- **Google Gemini AI** - IA conversationnelle et analyse
- **WebXR** - Réalité augmentée et virtuelle
- **WebRTC** - Communication temps réel (classes virtuelles)

### PWA & Performance
- **Workbox** - Service workers et stratégies de cache
- **Vite PWA Plugin** - Génération automatique PWA
- **React Helmet Async** - Gestion SEO et meta tags

## Fonctionnalités Clés de l'Architecture

### 1. Modularité
Chaque fonctionnalité est un module indépendant avec sa propre structure :
- `components/` - Composants UI spécifiques
- `services/` - Logique métier et appels API
- `types/` - Interfaces TypeScript
- `pages/` - Pages et routes
- `hooks/` - Hooks personnalisés

### 2. Lazy Loading
Toutes les pages et composants lourds sont chargés paresseusement :
```typescript
const AtlasPage = lazy(() => import('@/features/atlas/pages/AtlasPage'));
const EncyclopediaPage = lazy(() => import('@/features/encyclopedia/pages/EncyclopediaPage'));
```

### 3. Type Safety
TypeScript strict avec interfaces complètes pour toutes les entités :
```typescript
interface Language {
  id: string;
  name: string;
  family: string;
  region: string;
  speakers: number;
  coordinates: [number, number];
  endangered: boolean;
}
```

### 4. Gestion d'État Centralisée
Zustand pour l'état global, TanStack Query pour les données serveur :
```typescript
// Store Zustand
interface AppStore {
  user: User | null;
  theme: 'light' | 'dark';
  language: string;
  setUser: (user: User) => void;
}

// Queries React Query
const useLanguages = () => {
  return useQuery({
    queryKey: ['languages'],
    queryFn: () => languageService.getAll(),
  });
};
```

### 5. Cache Multi-Niveaux
Stratégie de cache optimisée pour performance :
- **Memory Cache** - Données fréquemment utilisées
- **IndexedDB** - Cache persistant hors ligne
- **Service Worker** - Cache HTTP avec stratégies Workbox
- **Firebase Cache** - Cache côté serveur

### 6. Sécurité
Mesures de sécurité intégrées :
- **Firebase Security Rules** - Contrôle d'accès aux données
- **Input Validation** - Zod pour validation des données
- **Content Moderation** - IA pour modération du contenu
- **Encryption** - Chiffrement des données sensibles

## Performance & Optimisation

### Métriques Cibles
- **First Contentful Paint** : < 1.5s
- **Largest Contentful Paint** : < 2.5s
- **First Input Delay** : < 100ms
- **Cumulative Layout Shift** : < 0.1
- **Lighthouse Score** : > 90

### Optimisations Implémentées
- **Code Splitting** - Division automatique du bundle
- **Tree Shaking** - Suppression du code mort
- **Image Optimization** - WebP avec responsive sizing
- **Bundle Analysis** - Monitoring de la taille des bundles
- **Preloading** - Préchargement des ressources critiques

## Évolutivité

### Architecture Modulaire
L'architecture permet l'ajout facile de nouvelles fonctionnalités :
1. Créer un nouveau dossier dans `features/`
2. Implémenter les composants, services et types
3. Ajouter les routes dans le router
4. Intégrer dans la navigation

### API Design
APIs RESTful avec conventions cohérentes :
- **GET** `/api/languages` - Liste des langues
- **POST** `/api/languages` - Créer une langue
- **PUT** `/api/languages/:id` - Mettre à jour
- **DELETE** `/api/languages/:id` - Supprimer

### Base de Données
Structure Firestore optimisée pour les requêtes :
```
firestore/
├── languages/         # Collection langues
├── users/            # Collection utilisateurs
├── lessons/          # Collection leçons
├── dictionary/       # Collection dictionnaire
├── marketplace/      # Collection marketplace
└── analytics/        # Collection analytics
```

## Monitoring & Observabilité

### Métriques Collectées
- **Performance** - Core Web Vitals, temps de chargement
- **Utilisation** - Pages vues, sessions, événements
- **Erreurs** - Logs d'erreurs, crash reports
- **Business** - Conversions, rétention, engagement

### Outils
- **Firebase Analytics** - Analytics et événements
- **Sentry** - Error tracking et monitoring
- **Lighthouse CI** - Tests de performance automatisés
- **Custom Dashboards** - Métriques métier personnalisées

## Déploiement & CI/CD

### Environnements
- **Development** - Développement local avec emulators
- **Staging** - Tests d'intégration sur Firebase Hosting
- **Production** - Déploiement automatisé sur Firebase

### Pipeline CI/CD
1. **Lint & Type Check** - Vérification code quality
2. **Tests** - Tests unitaires et d'intégration
3. **Build** - Construction du bundle optimisé
4. **Deploy** - Déploiement automatique
5. **Monitoring** - Vérification post-déploiement

Cette architecture assure que Ma'a yegue peut évoluer pour supporter des millions d'utilisateurs tout en maintenant des performances optimales et une expérience utilisateur exceptionnelle.