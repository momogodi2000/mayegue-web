# Guide de Développement - Ma'a yegue V1.1

## Vue d'ensemble

Ce guide s'adresse aux développeurs souhaitant contribuer à Ma'a yegue V1.1. Il couvre l'architecture, les conventions de code, les workflows et les bonnes pratiques.

## Architecture du Projet

### Structure Modulaire

Ma'a yegue suit une architecture modulaire avec séparation claire des responsabilités :

```
src/
├── app/                    # Configuration application
│   ├── App.tsx            # Composant racine
│   ├── main.tsx           # Point d'entrée
│   ├── router.tsx         # Configuration routes
│   └── index.css          # Styles globaux
│
├── features/               # Modules métier
│   ├── atlas/             # Atlas linguistique
│   ├── dictionary/        # Dictionnaire
│   ├── lessons/           # Système de leçons
│   └── ...                # Autres fonctionnalités
│
├── shared/                 # Code partagé
│   ├── components/        # Composants réutilisables
│   ├── hooks/            # Hooks personnalisés
│   ├── utils/            # Utilitaires
│   └── types/            # Types TypeScript
│
├── core/                  # Services core
│   ├── config/           # Configuration
│   ├── services/         # Services principaux
│   └── pwa/              # PWA et service workers
│
└── assets/                # Ressources statiques
```

### Principes Architecturaux

#### 1. Séparation des Responsabilités
- **Features** : Logique métier spécifique
- **Shared** : Code réutilisable
- **Core** : Services transversaux

#### 2. Dependency Injection
- Services injectés via des hooks personnalisés
- Configuration centralisée
- Testabilité améliorée

#### 3. Type Safety
- TypeScript strict activé
- Interfaces complètes pour toutes les entités
- Validation runtime avec Zod

## Configuration de Développement

### Prérequis

```bash
# Node.js 18+
node --version

# npm 9+
npm --version

# Git
git --version
```

### Installation

```bash
# Cloner le repository
git clone https://github.com/maayegue/maayegue-web.git
cd maayegue-web

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env.local
# Éditer .env.local avec vos clés API
```

### Démarrage

```bash
# Serveur de développement
npm run dev

# Avec émulateurs Firebase
npm run firebase:emulators

# Tests
npm run test:watch
```

## Conventions de Code

### TypeScript

#### Configuration Stricte
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

#### Interfaces vs Types
```typescript
// Interfaces pour les objets complexes
interface User {
  id: string;
  name: string;
  email: string;
}

// Types pour les unions et primitives
type UserRole = 'admin' | 'teacher' | 'student';
type UserId = string;
```

#### Nommage
```typescript
// Composants React
const UserProfileCard = () => {};

// Hooks personnalisés
const useUserProfile = () => {};

// Services
class UserService {}

// Types
interface UserData {}
type UserStatus = 'active' | 'inactive';

// Constantes
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = '/api/v1';
```

### React

#### Hooks Personnalisés
```typescript
// useUserProfile.ts
import { useQuery } from '@tanstack/react-query';
import { userService } from '@/core/services/userService';

export const useUserProfile = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => userService.getProfile(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

#### Composants
```typescript
// UserProfileCard.tsx
interface UserProfileCardProps {
  user: User;
  onEdit?: () => void;
}

export const UserProfileCard = ({ user, onEdit }: UserProfileCardProps) => {
  return (
    <div className="user-profile-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      {onEdit && (
        <button onClick={onEdit}>Modifier</button>
      )}
    </div>
  );
};
```

### Gestion d'État

#### Zustand Stores
```typescript
// stores/userStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        currentUser: null,
        isAuthenticated: false,
        setUser: (user) => set({
          currentUser: user,
          isAuthenticated: !!user
        }),
        logout: () => set({
          currentUser: null,
          isAuthenticated: false
        }),
      }),
      {
        name: 'user-store',
      }
    ),
    {
      name: 'user-store',
    }
  )
);
```

#### React Query pour les Données Serveur
```typescript
// hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/core/services/userService';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
```

## Développement de Fonctionnalités

### Structure d'une Feature

Chaque fonctionnalité suit cette structure :

```
src/features/[feature-name]/
├── components/           # Composants UI spécifiques
│   ├── [ComponentName].tsx
│   └── index.ts
├── services/            # Logique métier
│   ├── [serviceName].ts
│   └── index.ts
├── types/               # Types spécifiques
│   ├── [featureTypes].ts
│   └── index.ts
├── pages/               # Pages/routes
│   ├── [PageName].tsx
│   └── index.ts
├── hooks/               # Hooks spécifiques (optionnel)
├── utils/               # Utilitaires (optionnel)
└── index.ts             # Export principal
```

### Exemple : Feature Dictionary

```
src/features/dictionary/
├── components/
│   ├── DictionarySearch.tsx
│   ├── WordCard.tsx
│   └── index.ts
├── services/
│   ├── dictionaryService.ts
│   └── index.ts
├── types/
│   ├── dictionary.ts
│   └── index.ts
├── pages/
│   ├── DictionaryPage.tsx
│   └── index.ts
└── index.ts
```

### Création d'une Nouvelle Feature

1. **Créer la structure**
```bash
mkdir -p src/features/my-feature/{components,services,types,pages}
```

2. **Définir les types**
```typescript
// src/features/my-feature/types/myFeature.ts
export interface MyFeatureData {
  id: string;
  name: string;
  description: string;
}

export interface MyFeatureFilters {
  search?: string;
  category?: string;
}
```

3. **Créer le service**
```typescript
// src/features/my-feature/services/myFeatureService.ts
import { db } from '@/core/config/firebase';

export class MyFeatureService {
  async getAll(filters?: MyFeatureFilters): Promise<MyFeatureData[]> {
    // Implémentation
  }

  async getById(id: string): Promise<MyFeatureData> {
    // Implémentation
  }

  async create(data: Omit<MyFeatureData, 'id'>): Promise<MyFeatureData> {
    // Implémentation
  }
}

export const myFeatureService = new MyFeatureService();
```

4. **Créer les composants**
```typescript
// src/features/my-feature/components/MyFeatureList.tsx
import { useMyFeatures } from '../hooks/useMyFeatures';

export const MyFeatureList = () => {
  const { data: features, isLoading } = useMyFeatures();

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div>
      {features?.map(feature => (
        <div key={feature.id}>{feature.name}</div>
      ))}
    </div>
  );
};
```

5. **Créer la page**
```typescript
// src/features/my-feature/pages/MyFeaturePage.tsx
import { MyFeatureList } from '../components/MyFeatureList';

export const MyFeaturePage = () => {
  return (
    <div>
      <h1>My Feature</h1>
      <MyFeatureList />
    </div>
  );
};
```

6. **Ajouter la route**
```typescript
// src/app/router.tsx
import { MyFeaturePage } from '@/features/my-feature/pages/MyFeaturePage';

const routes = [
  // ... autres routes
  {
    path: '/my-feature',
    element: <MyFeaturePage />,
  },
];
```

## Tests

### Configuration des Tests

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
```

### Tests Unitaires

```typescript
// src/features/my-feature/services/myFeatureService.test.ts
import { describe, it, expect, vi } from 'vitest';
import { myFeatureService } from './myFeatureService';

// Mock Firebase
vi.mock('@/core/config/firebase');

describe('MyFeatureService', () => {
  describe('getAll', () => {
    it('should return all features', async () => {
      const mockFeatures = [{ id: '1', name: 'Test' }];
      
      // Mock implementation
      const result = await myFeatureService.getAll();
      
      expect(result).toEqual(mockFeatures);
    });
  });
});
```

### Tests de Composants

```typescript
// src/features/my-feature/components/MyFeatureList.test.tsx
import { render, screen } from '@testing-library/react';
import { MyFeatureList } from './MyFeatureList';

// Mock du hook
vi.mock('../hooks/useMyFeatures');

describe('MyFeatureList', () => {
  it('should render loading state', () => {
    // Mock loading state
    render(<MyFeatureList />);
    
    expect(screen.getByText('Chargement...')).toBeInTheDocument();
  });

  it('should render features list', () => {
    // Mock data
    render(<MyFeatureList />);
    
    expect(screen.getByText('Feature 1')).toBeInTheDocument();
  });
});
```

### Tests d'Intégration

```typescript
// src/test/integration/myFeatureFlow.test.ts
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MyFeaturePage } from '@/features/my-feature/pages/MyFeaturePage';

describe('My Feature Flow', () => {
  it('should create a new feature', async () => {
    const user = userEvent.setup();
    
    render(<MyFeaturePage />);
    
    // Simuler l'interaction utilisateur
    await user.click(screen.getByRole('button', { name: /ajouter/i }));
    await user.type(screen.getByLabelText(/nom/i), 'Nouvelle Feature');
    await user.click(screen.getByRole('button', { name: /sauvegarder/i }));
    
    // Vérifier le résultat
    await waitFor(() => {
      expect(screen.getByText('Nouvelle Feature')).toBeInTheDocument();
    });
  });
});
```

## Qualité du Code

### Linting

```javascript
// eslint.config.js
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import typescript from '@typescript-eslint/eslint-plugin';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      '@typescript-eslint': typescript,
    },
    rules: {
      // Règles personnalisées
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-unused-vars': 'error',
    },
  },
];
```

### Formatage

```javascript
// prettier.config.js
export default {
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
};
```

### Pré-commit Hooks

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,css,md}": [
      "prettier --write"
    ]
  }
}
```

## Performance

### Optimisations

#### Code Splitting
```typescript
// router.tsx
const AtlasPage = lazy(() => import('@/features/atlas/pages/AtlasPage'));
const DictionaryPage = lazy(() => import('@/features/dictionary/pages/DictionaryPage'));

// Avec Suspense
<Suspense fallback={<PageSkeleton />}>
  <Routes>
    <Route path="/atlas" element={<AtlasPage />} />
    <Route path="/dictionary" element={<DictionaryPage />} />
  </Routes>
</Suspense>
```

#### Memoization
```typescript
import { memo, useMemo, useCallback } from 'react';

const UserCard = memo(({ user, onSelect }) => {
  const displayName = useMemo(() => 
    `${user.firstName} ${user.lastName}`, 
    [user.firstName, user.lastName]
  );

  const handleSelect = useCallback(() => {
    onSelect(user.id);
  }, [onSelect, user.id]);

  return (
    <div onClick={handleSelect}>
      {displayName}
    </div>
  );
});
```

#### Images Optimisées
```typescript
import { lazy, Suspense } from 'react';

// Lazy loading d'images
const LazyImage = ({ src, alt }) => {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
    />
  );
};
```

### Monitoring Performance

```typescript
// utils/performance.ts
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
};

// Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## Sécurité

### Bonnes Pratiques

#### Validation des Entrées
```typescript
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(50),
  age: z.number().min(13).max(120),
});

export const validateUser = (data: unknown) => {
  return userSchema.parse(data);
};
```

#### Sanitisation
```typescript
import DOMPurify from 'dompurify';

export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em'],
    ALLOWED_ATTR: [],
  });
};
```

#### Gestion des Erreurs
```typescript
// utils/errorHandler.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleError = (error: unknown) => {
  if (error instanceof AppError) {
    // Erreur connue de l'app
    console.error(`App Error [${error.code}]:`, error.message);
    return { message: error.message, code: error.code };
  }
  
  // Erreur inconnue
  console.error('Unknown error:', error);
  return { message: 'Une erreur inattendue s\'est produite' };
};
```

## Déploiement

### Build de Production

```bash
# Build optimisé
npm run build

# Analyse du bundle
npm run build -- --analyze

# Preview
npm run preview
```

### Variables d'Environnement

```bash
# Production
NODE_ENV=production
VITE_APP_ENV=production

# Staging
NODE_ENV=staging
VITE_APP_ENV=staging

# Development
NODE_ENV=development
VITE_APP_ENV=development
```

### CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm run test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run build
      - run: npm run firebase:deploy
```

## Contribution

### Workflow Git

```bash
# Créer une branche
git checkout -b feature/nouvelle-fonctionnalite

# Commits atomiques
git commit -m "feat: ajouter la validation des formulaires"

# Rebase avant merge
git fetch origin
git rebase origin/main

# Push
git push origin feature/nouvelle-fonctionnalite
```

### Pull Requests

#### Template PR
```markdown
## Description
Description détaillée des changements

## Type de Changement
- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Breaking change
- [ ] Documentation

## Tests
- [ ] Tests unitaires ajoutés/modifiés
- [ ] Tests d'intégration ajoutés
- [ ] Tests manuels effectués

## Checklist
- [ ] Code respecte les conventions
- [ ] Linting passe
- [ ] Tests passent
- [ ] Documentation mise à jour
```

### Code Review

#### Critères
- **Fonctionnalité** : Le code fait ce qui est demandé
- **Qualité** : Code lisible, maintenable, testé
- **Performance** : Pas de régressions
- **Sécurité** : Pas de vulnérabilités introduites

## Ressources

### Documentation
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)

### Outils
- [ESLint](https://eslint.org)
- [Prettier](https://prettier.io)
- [Vitest](https://vitest.dev)
- [Testing Library](https://testing-library.com)

### Communauté
- [GitHub Issues](https://github.com/maayegue/maayegue-web/issues)
- [Discord](https://discord.gg/maayegue)
- [Forum](https://forum.maayegue.app)

---

Ce guide évolue constamment. Pour les dernières mises à jour, consultez la documentation en ligne ou contactez l'équipe de développement.