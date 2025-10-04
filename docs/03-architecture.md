# Architecture - Ma'a yegue V1.1.0

## 🏗️ Vue d'ensemble de l'Architecture

Ma'a yegue suit une architecture modulaire basée sur React avec TypeScript, utilisant Firebase comme Backend-as-a-Service et Google Gemini pour l'intelligence artificielle.

## 📁 Structure du Projet

```
mayegue-web/
├── public/                      # Assets statiques
│   ├── icons/                  # Icônes de l'application
│   ├── images/                 # Images statiques
│   └── manifest.json           # Manifest PWA
│
├── src/                        # Code source
│   ├── core/                   # Modules core
│   │   ├── config/            # Configuration
│   │   │   ├── firebase.config.ts
│   │   │   └── env.config.ts
│   │   ├── services/          # Services core
│   │   │   ├── firebase/     # Services Firebase
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── firestore.service.ts
│   │   │   │   ├── storage.service.ts
│   │   │   │   ├── analytics.service.ts
│   │   │   │   └── user.service.ts
│   │   │   ├── payment/      # Services de paiement
│   │   │   │   ├── payment.service.ts
│   │   │   │   ├── campay.service.ts
│   │   │   │   ├── noupai.service.ts
│   │   │   │   ├── stripe.service.ts
│   │   │   │   └── receipt.service.ts
│   │   │   └── ai/           # Services IA
│   │   │       └── geminiService.ts
│   │   └── hooks/             # Hooks personnalisés
│   │
│   ├── features/               # Modules fonctionnels
│   │   ├── dictionary/        # Dictionnaire
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── services/
│   │   │   ├── store/
│   │   │   └── types/
│   │   ├── lessons/           # Leçons
│   │   ├── atlas/             # Atlas linguistique
│   │   ├── encyclopedia/      # Encyclopédie culturelle
│   │   ├── historical-sites/  # Sites historiques
│   │   ├── ar-vr/            # AR/VR
│   │   ├── rpg-gamification/ # RPG & Gamification
│   │   ├── ai-features/      # Fonctionnalités IA
│   │   ├── community/        # Communauté
│   │   ├── marketplace/      # Marketplace
│   │   ├── payments/         # Pages de paiement
│   │   └── profile/          # Profil utilisateur
│   │
│   ├── shared/                 # Code partagé
│   │   ├── components/        # Composants réutilisables
│   │   │   ├── layout/       # Layout
│   │   │   ├── ui/           # Composants UI
│   │   │   └── common/       # Composants communs
│   │   ├── types/            # Types TypeScript globaux
│   │   ├── utils/            # Utilitaires
│   │   ├── hooks/            # Hooks partagés
│   │   └── constants/        # Constantes
│   │
│   ├── App.tsx                 # Composant principal
│   ├── main.tsx               # Point d'entrée
│   ├── router.tsx             # Configuration des routes
│   └── index.css              # Styles globaux
│
├── docs/                       # Documentation
├── scripts/                    # Scripts utilitaires
├── tests/                      # Tests
├── .env                        # Variables d'environnement
├── package.json                # Dépendances
├── tsconfig.json              # Configuration TypeScript
├── vite.config.ts             # Configuration Vite
├── tailwind.config.js         # Configuration Tailwind
└── firebase.json              # Configuration Firebase
```

## 🎯 Patterns et Principes

### 1. **Séparation des Responsabilités**

Chaque module suit la structure :
- **Components** : Composants React UI
- **Pages** : Pages complètes
- **Services** : Logique métier et API
- **Store** : État global (Zustand)
- **Types** : Types TypeScript

### 2. **Feature-Based Organization**

Chaque fonctionnalité est un module autonome avec ses propres :
- Composants
- Services
- Types
- Store (si nécessaire)

### 3. **Dependency Injection**

Les services sont des singletons exportés :

```typescript
export const dictionaryService = new DictionaryService();
```

### 4. **Type Safety**

TypeScript strict activé pour :
- Sécurité du typage
- Autocomplétion
- Documentation inline

## 🔧 Technologies Utilisées

### Frontend Core

| Technologie | Version | Usage |
|------------|---------|-------|
| React | 18.2.0 | Framework UI |
| TypeScript | 5.2.2 | Langage |
| Vite | 5.0.0 | Build tool |
| React Router | 6.20.0 | Routing |
| Zustand | 4.4.7 | State management |

### UI & Styling

| Technologie | Version | Usage |
|------------|---------|-------|
| Tailwind CSS | 3.4.0 | Styling |
| Headless UI | 1.7.17 | Composants accessibles |
| Heroicons | 2.1.1 | Icônes |
| Framer Motion | 10.16.16 | Animations |

### Firebase

| Service | Usage |
|---------|-------|
| Authentication | Gestion des utilisateurs |
| Firestore | Base de données NoSQL |
| Cloud Storage | Stockage de fichiers |
| Analytics | Suivi utilisateur |
| Performance | Monitoring performance |

### IA & ML

| Service | Usage |
|---------|-------|
| Google Gemini Pro | IA générative |
| Web Speech API | Reconnaissance vocale |

### AR/VR

| Technologie | Usage |
|-------------|-------|
| Three.js | 3D rendering |
| A-Frame | VR framework |
| AR.js | AR web |

### Paiements

| Service | Usage |
|---------|-------|
| CamPay | Mobile Money (MTN/Orange) |
| Noupai | Mobile Money (fallback) |
| Stripe | Cartes bancaires internationales |

## 🔄 Flux de Données

### 1. **Flux d'Authentification**

```
User Input → Auth Service → Firebase Auth → User Context → UI Update
```

### 2. **Flux de Données Firestore**

```
Component → Service → Firestore → Cache → Component
```

### 3. **Flux de Paiement**

```
User → Pricing Page → Payment Service → Provider API → Webhook → Firestore → Receipt
```

### 4. **Flux IA**

```
User Message → AI Service → Gemini API → Response → Context → UI
```

## 🎨 Architecture des Composants

### Composants par Niveau

```
1. Pages (Container Components)
   ├── Récupèrent les données
   ├── Gèrent l'état local
   └── Orchestrent les composants

2. Feature Components
   ├── Logique métier spécifique
   ├── Interaction avec les services
   └── État local complexe

3. Shared Components
   ├── Réutilisables
   ├── Sans logique métier
   └── Props bien définis
```

### Exemple de Composant

```typescript
// Feature Component
interface DictionarySearchProps {
  language: string;
  onWordSelect: (word: Word) => void;
}

export const DictionarySearch: React.FC<DictionarySearchProps> = ({
  language,
  onWordSelect
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Word[]>([]);

  const handleSearch = async () => {
    const words = await dictionaryService.searchWords(searchTerm, language);
    setResults(words);
  };

  return (
    // JSX
  );
};
```

## 🗄️ Gestion de l'État

### 1. **État Local (useState)**
- État UI temporaire
- Formulaires
- Interactions simples

### 2. **État Global (Zustand)**
- Authentification
- Thème
- Préférences utilisateur
- Données partagées

### 3. **État Serveur (React Query - optionnel)**
- Cache des données Firebase
- Synchronisation
- Optimistic updates

## 🔐 Sécurité

### 1. **Authentification**
- Firebase Authentication
- JWT tokens
- Refresh tokens automatique

### 2. **Autorisation**
- Firestore Security Rules
- Vérification côté client
- Rôles utilisateur (admin, teacher, student, family_member)

### 3. **Protection des Données**
- Variables d'environnement (.env)
- Chiffrement des données sensibles
- HTTPS obligatoire

## 📱 Progressive Web App (PWA)

### Fonctionnalités PWA

- ✅ Installable sur mobile/desktop
- ✅ Mode hors ligne (Service Worker)
- ✅ Notifications push
- ✅ Mises à jour automatiques
- ✅ Performance optimale

### Manifest

```json
{
  "name": "Ma'a yegue",
  "short_name": "Ma'a yegue",
  "description": "Apprendre les langues camerounaises",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#4F46E5",
  "background_color": "#FFFFFF",
  "icons": [...]
}
```

## 🚀 Performance

### Optimisations

1. **Code Splitting**
   - Lazy loading des routes
   - Dynamic imports
   - Tree shaking

2. **Caching**
   - Service Worker
   - Firebase cache
   - Image lazy loading

3. **Bundle Optimization**
   - Minification
   - Compression (gzip/brotli)
   - Dead code elimination

4. **Image Optimization**
   - WebP format
   - Responsive images
   - Lazy loading

## 🧪 Tests

### Stratégie de Tests

1. **Unit Tests** (Jest + React Testing Library)
   - Services
   - Hooks
   - Utilitaires

2. **Integration Tests**
   - Composants avec services
   - Flux utilisateur

3. **E2E Tests** (Cypress/Playwright)
   - Parcours complets
   - Scénarios critiques

## 📈 Monitoring

### Outils

- **Firebase Analytics** : Événements utilisateur
- **Performance Monitoring** : Temps de chargement
- **Crashlytics** : Erreurs runtime
- **Sentry** (optionnel) : Error tracking

## 🔄 CI/CD

### Pipeline

```
Push → Lint → Type Check → Tests → Build → Deploy
```

### Outils

- **GitHub Actions** : CI/CD
- **Vercel/Netlify** : Déploiement automatique
- **Firebase Hosting** : Hosting production

## 📦 Build & Deployment

### Environments

1. **Development** : localhost:5173
2. **Staging** : staging.maayegue.app
3. **Production** : maayegue.app

### Variables par Environment

```typescript
const config = {
  development: { apiUrl: 'http://localhost:5001', ... },
  staging: { apiUrl: 'https://api-staging.maayegue.app', ... },
  production: { apiUrl: 'https://api.maayegue.app', ... }
};
```
