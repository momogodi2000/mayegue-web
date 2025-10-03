# 📦 Installation des Dépendances de Paiement

## Packages NPM Requis

Pour que le système de paiement fonctionne, vous devez installer les packages suivants:

### 1. Stripe JavaScript SDK

```bash
npm install @stripe/stripe-js
```

**Utilisé pour**: Intégration paiements par carte bancaire (Stripe)

### 2. Axios (Déjà installé)

```bash
npm install axios
```

**Utilisé pour**: Requêtes HTTP vers Campay et Noupai APIs

---

## Installation Complète

Exécutez cette commande pour installer tous les packages de paiement:

```bash
npm install @stripe/stripe-js axios
```

---

## Vérification de l'Installation

Après installation, vérifiez que les types TypeScript fonctionnent:

```bash
npm run type-check
```

---

## Erreurs TypeScript à Corriger

### 1. profileStore.ts

**Erreur**: `Property 'emailVerified' is missing in type 'User'`

**Solution**: Ajouter `emailVerified: false` dans le mock user de `profileStore.ts`

```typescript
// src/features/profile/store/profileStore.ts ligne 44
{
  id: 'mock-user',
  email: 'user@example.com',
  displayName: 'User',
  photoURL: '',
  role: 'apprenant' as UserRole,
  emailVerified: false, // AJOUTER CETTE LIGNE
  createdAt: new Date(),
  // ...
}
```

### 2. usePerformance.ts et performance.ts

Ces erreurs sont dans les utilitaires de performance, pas liées aux paiements.

**Fichiers à corriger**:
- `src/shared/hooks/usePerformance.ts`
- `src/shared/utils/performance.ts`

**Actions**:
- Supprimer variables inutilisées: `debounce`, `key`, `setBundleSize`, `fallback`
- Ajouter types manquants pour `this`
- Corriger imports React

---

## Configuration .env

Assurez-vous que votre `.env` contient:

```env
# Campay
VITE_CAMPAY_USERNAME="your-username"
VITE_CAMPAY_PASSWORD="your-password"
VITE_CAMPAY_MODE="sandbox"

# Noupai
VITE_NOUPAI_API_KEY="your-api-key"
VITE_NOUPAI_MERCHANT_ID="your-merchant-id"
VITE_NOUPAI_MODE="test"

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Payment Config
VITE_PAYMENT_RETRY_ATTEMPTS="3"
VITE_PAYMENT_TIMEOUT="120000"
VITE_PAYMENT_ENABLE_FALLBACK="true"
VITE_PAYMENT_CURRENCIES="XAF,USD,EUR"
```

---

## Commandes de Test

### Test Type Checking

```bash
npm run type-check
```

### Test Build

```bash
npm run build
```

### Test Dev Server

```bash
npm run dev
```

---

## Problèmes Connus

### Timeout lors de npm install

Si `npm install @stripe/stripe-js` timeout:

**Solutions**:

1. **Augmenter timeout npm:**
   ```bash
   npm config set fetch-timeout 120000
   npm install @stripe/stripe-js
   ```

2. **Utiliser yarn si disponible:**
   ```bash
   yarn add @stripe/stripe-js
   ```

3. **Installer manuellement:**
   - Télécharger package depuis npmjs.com
   - Installer localement

4. **Vérifier connexion internet:**
   - Vérifier proxy/firewall
   - Essayer avec réseau différent

---

## Vérification Finale

Après installation et corrections, vérifiez:

```bash
# 1. Type checking
npm run type-check

# 2. Build
npm run build

# 3. Dev server
npm run dev
```

Tous doivent réussir sans erreurs critiques.

---

## Support

En cas de problème:
1. Vérifier versions Node.js et npm (`node -v` et `npm -v`)
2. Supprimer `node_modules` et `package-lock.json`, puis `npm install`
3. Vérifier logs dans `npm-debug.log`
4. Contacter: dev@maayegue.com
