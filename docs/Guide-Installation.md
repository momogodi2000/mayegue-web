# Guide d'Installation - Ma'a yegue V1.1

## Vue d'ensemble

Ce guide détaille l'installation complète de Ma'a yegue V1.1 avec toutes les nouvelles fonctionnalités.

## Prérequis Système

### Configuration Minimale
- **OS** : Windows 10+, macOS 10.15+, Linux Ubuntu 18.04+
- **Node.js** : Version 18.0.0 ou supérieure
- **npm** : Version 9.0.0 ou supérieure
- **Git** : Version 2.25+ pour le clonage
- **Navigateur** : Chrome 90+, Firefox 88+, Safari 14+

### Configuration Recommandée
- **RAM** : 8 GB minimum, 16 GB recommandé
- **Disque** : 2 GB d'espace libre
- **Connexion** : Internet stable pour les téléchargements

## Installation Rapide

### Commande Unique (Recommandé)

```bash
# Installation complète en une commande
npm install @google/generative-ai leaflet react-leaflet mapbox-gl react-map-gl three @react-three/fiber @react-three/drei wavesurfer.js tone recordrtc simple-peer peerjs @simplewebauthn/browser crypto-js tweetnacl tweetnacl-util recharts d3 swiper react-responsive-carousel react-spring @use-gesture/react react-intersection-observer && npm install --save-dev @types/leaflet @types/mapbox-gl @types/three @types/simple-peer @types/crypto-js @types/d3 @testing-library/user-event @vitest/coverage-v8 @simplewebauthn/server
```

### Vérification de l'Installation

```bash
# Vérifier les versions
node --version
npm --version

# Vérifier l'installation des dépendances
npm list --depth=0
```

## Configuration de l'Environnement

### Variables d'Environnement

Créer le fichier `.env.local` à la racine du projet :

```env
# ============================================
# Ma'a yegue V1.1 - Variables d'Environnement
# ============================================

# Configuration Firebase (existante)
VITE_FIREBASE_API_KEY=votre_clé_api_firebase
VITE_FIREBASE_AUTH_DOMAIN=votre_domaine_auth.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=votre_id_projet
VITE_FIREBASE_STORAGE_BUCKET=votre_bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
VITE_FIREBASE_APP_ID=votre_app_id

# ============================================
# NOUVELLES FONCTIONNALITÉS V1.1
# ============================================

# Intelligence Artificielle
VITE_GEMINI_API_KEY=votre_clé_api_gemini
VITE_GEMINI_MODEL=gemini-2.0-flash-exp

# Cartes Interactives
VITE_MAPBOX_ACCESS_TOKEN=votre_token_mapbox
VITE_MAPBOX_STYLE=mapbox://styles/mapbox/streets-v11

# Communication Temps Réel
VITE_PEER_SERVER_HOST=0.peerjs.com
VITE_PEER_SERVER_PORT=443
VITE_PEER_SERVER_PATH=/
VITE_PEER_SERVER_SECURE=true

# Authentification Biométrique
VITE_WEBAUTHN_RP_NAME=Ma'a yegue
VITE_WEBAUTHN_RP_ID=maayegue.app
VITE_WEBAUTHN_ORIGIN=https://maayegue.app

# Sécurité et Chiffrement
VITE_ENCRYPTION_KEY=votre_clé_32_caractères
VITE_ENCRYPTION_IV=votre_iv_16_caractères

# Pare-feu Web (optionnel)
VITE_WAF_ENDPOINT=votre_endpoint_waf

# Paiements (existants mais documentés)
VITE_CAMPAY_API_KEY=votre_clé_campay
VITE_CAMPAY_USERNAME=votre_username_campay

# Analytics (existant)
VITE_ANALYTICS_ID=votre_id_analytics

# Indicateurs de Fonctionnalités
VITE_ENABLE_AR_VR=true
VITE_ENABLE_MARKETPLACE=true
VITE_ENABLE_VIRTUAL_CLASSES=true
VITE_ENABLE_BIOMETRIC_2FA=true
VITE_ENABLE_NGONDO_COINS=true

# Limites de Taux API
VITE_GEMINI_RATE_LIMIT=100
VITE_MAPBOX_RATE_LIMIT=50000
```

## Obtention des Clés API

### 1. Google Gemini AI

```
1. Accéder à : https://makersuite.google.com/app/apikey
2. Cliquer sur "Créer une clé API"
3. Créer un nouveau projet ou sélectionner un projet existant
4. Copier la clé API dans VITE_GEMINI_API_KEY
```

**Quota par défaut** : 60 requêtes/minute, 1000 requêtes/jour

### 2. Mapbox

```
1. Accéder à : https://account.mapbox.com/
2. S'inscrire/Se connecter
3. Aller dans la section "Tokens"
4. Créer un nouveau token avec les portées :
   - styles:read
   - fonts:read
   - datasets:read
5. Copier le token dans VITE_MAPBOX_ACCESS_TOKEN
```

**Quota gratuit** : 50,000 requêtes/mois

### 3. PeerJS (Gratuit)

```
Configuration par défaut (fonctionne sans clé) :
VITE_PEER_SERVER_HOST=0.peerjs.com
VITE_PEER_SERVER_PORT=443

Pour auto-hébergement : installer PeerJS Server
```

## Structure des Dossiers

### Création Automatique

```powershell
# PowerShell (Windows)
New-Item -ItemType Directory -Force -Path "src\features\atlas\components"
New-Item -ItemType Directory -Force -Path "src\features\atlas\services"
New-Item -ItemType Directory -Force -Path "src\features\atlas\types"
New-Item -ItemType Directory -Force -Path "src\features\atlas\pages"

New-Item -ItemType Directory -Force -Path "src\features\encyclopedia\components"
New-Item -ItemType Directory -Force -Path "src\features\encyclopedia\services"
New-Item -ItemType Directory -Force -Path "src\features\encyclopedia\pages"

New-Item -ItemType Directory -Force -Path "src\features\historical-sites\components"
New-Item -ItemType Directory -Force -Path "src\features\historical-sites\services"
New-Item -ItemType Directory -Force -Path "src\features\historical-sites\pages"

New-Item -ItemType Directory -Force -Path "src\features\marketplace\components"
New-Item -ItemType Directory -Force -Path "src\features\marketplace\services"
New-Item -ItemType Directory -Force -Path "src\features\marketplace\pages"

New-Item -ItemType Directory -Force -Path "src\features\ar-vr\components"
New-Item -ItemType Directory -Force -Path "src\features\ar-vr\services"
New-Item -ItemType Directory -Force -Path "src\features\ar-vr\pages"

New-Item -ItemType Directory -Force -Path "src\features\rpg-gamification\components"
New-Item -ItemType Directory -Force -Path "src\features\rpg-gamification\services"
New-Item -ItemType Directory -Force -Path "src\features\rpg-gamification\pages"

New-Item -ItemType Directory -Force -Path "src\features\ai-features\components"
New-Item -ItemType Directory -Force -Path "src\features\ai-features\services"
New-Item -ItemType Directory -Force -Path "src\features\ai-features\pages"

New-Item -ItemType Directory -Force -Path "src\features\virtual-economy\components"
New-Item -ItemType Directory -Force -Path "src\features\virtual-economy\services"
New-Item -ItemType Directory -Force -Path "src\features\virtual-economy\pages"

New-Item -ItemType Directory -Force -Path "src\core\services\ai"

New-Item -ItemType Directory -Force -Path "src\test\unit\atlas"
New-Item -ItemType Directory -Force -Path "src\test\unit\gemini"
New-Item -ItemType Directory -Force -Path "src\test\integration\marketplace"
New-Item -ItemType Directory -Force -Path "src\test\e2e"
```

### Structure Finale

```
src/
├── features/
│   ├── atlas/               # Atlas linguistique
│   │   ├── components/      # Composants UI
│   │   ├── services/        # Logique métier
│   │   ├── types/          # Types TypeScript
│   │   └── pages/          # Pages/routes
│   │
│   ├── encyclopedia/        # Encyclopédie
│   ├── historical-sites/    # Sites historiques
│   ├── marketplace/         # Marketplace
│   ├── ar-vr/              # AR/VR
│   ├── rpg-gamification/   # RPG
│   ├── ai-features/        # IA
│   └── ... (11 autres)
│
├── core/
│   ├── services/
│   │   ├── ai/             # Service Gemini
│   │   ├── firebase/       # Services Firebase
│   │   └── ...
│   └── ...
│
├── shared/                  # Composants partagés
├── test/                    # Tests
└── ...
```

## Données de Base

### Seed de l'Atlas Linguistique

```bash
# Peupler les 280+ langues camerounaises
npm run seed-languages-atlas
```

### Seed de l'Encyclopédie

```bash
# Peupler l'encyclopédie culturelle
npm run seed-encyclopedia
```

### Seed des Sites Historiques

```bash
# Peupler les sites historiques
npm run seed-historical-sites
```

## Démarrage du Développement

### Serveur de Développement

```bash
# Démarrer Vite dev server
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

### Émulateurs Firebase (Optionnel)

```bash
# Démarrer les émulateurs Firebase
npm run firebase:emulators
```

## Vérifications Post-Installation

### Tests Automatisés

```bash
# Vérification des types TypeScript
npm run type-check

# Linting du code
npm run lint

# Tests unitaires
npm run test

# Build de production
npm run build
```

### Tests Fonctionnels

1. **Authentification**
   - Vérifier la connexion avec différentes méthodes
   - Tester la biométrie 2FA

2. **Atlas Linguistique**
   - Charger la carte interactive
   - Tester les filtres de langues
   - Vérifier les informations détaillées

3. **IA Gemini**
   - Tester le chat conversationnel
   - Vérifier l'analyse de texte
   - Tester la génération de contenu

4. **Marketplace**
   - Créer un produit
   - Tester les paiements (en mode test)
   - Vérifier les commandes

5. **AR/VR**
   - Tester les expériences immersives
   - Vérifier la compatibilité WebXR

## Déploiement

### Build de Production

```bash
# Build optimisé
npm run build

# Aperçu du build
npm run preview
```

### Déploiement Firebase

```bash
# Déploiement hosting uniquement
npm run firebase:deploy:hosting

# Déploiement complet (hosting + functions)
npm run firebase:deploy
```

### Déploiement Netlify

```bash
# Déploiement production
npm run deploy:netlify:prod

# Déploiement staging
npm run deploy:netlify
```

## Dépannage

### Problèmes Courants

#### Erreur : "Gemini AI ne fonctionne pas"

**Solution** :
```
1. Vérifier VITE_GEMINI_API_KEY dans .env
2. Contrôler les quotas Google Cloud Console
3. Vérifier la connectivité réseau
```

#### Erreur : "Carte ne se charge pas"

**Solution** :
```
1. Vérifier VITE_MAPBOX_ACCESS_TOKEN
2. Contrôler les portées du token Mapbox
3. Vérifier la console du navigateur
4. S'assurer que le token a les bonnes permissions
```

#### Erreur : "Connexion WebRTC échoue"

**Solution** :
```
1. Tester avec la configuration PeerJS par défaut
2. Vérifier les paramètres firewall
3. S'assurer d'utiliser HTTPS en production
4. Contrôler les permissions microphone/caméra
```

#### Erreur : "Build échoue"

**Solution** :
```
1. Vérifier les versions Node.js et npm
2. Nettoyer node_modules : rm -rf node_modules && npm install
3. Vérifier les variables d'environnement
4. Contrôler les erreurs TypeScript : npm run type-check
```

### Logs et Debugging

```bash
# Logs détaillés de build
npm run build -- --debug

# Tests avec coverage
npm run test:coverage

# Analyse du bundle
npm run build -- --analyze
```

## Optimisation des Performances

### Métriques de Base

- **First Contentful Paint** : < 1.5s
- **Largest Contentful Paint** : < 2.5s
- **First Input Delay** : < 100ms
- **Cumulative Layout Shift** : < 0.1

### Optimisations Appliquées

```bash
# Analyse de bundle
npm run build -- --stats

# Audit Lighthouse
npm run preview
npx lighthouse http://localhost:4173 --view
```

## Sécurité

### Checklist Pré-Production

- [ ] Rotation de toutes les clés API avant production
- [ ] Activation de la limitation de taux
- [ ] Configuration correcte de CORS
- [ ] Activation des règles de sécurité Firebase
- [ ] Test de la 2FA biométrique
- [ ] Exécution d'un audit de sécurité : `npm audit`
- [ ] Activation des en-têtes CSP
- [ ] Test E2E du chiffrement

## Environnements

### Développement
- Émulateurs Firebase locaux
- Variables de développement
- Logs détaillés activés
- Hot reload activé

### Staging
- Firebase Hosting preview
- Tests d'intégration
- Données de test
- Monitoring activé

### Production
- Firebase Hosting production
- Variables de production
- Chiffrement activé
- Monitoring complet

## Support et Maintenance

### Mise à Jour

```bash
# Mise à jour des dépendances
npm update

# Audit de sécurité
npm audit fix

# Mise à jour Firebase CLI
npm install -g firebase-tools
```

### Monitoring

Configuration du monitoring pour :
- Utilisation de l'API Gemini et quotas
- Appels API Mapbox
- Qualité des connexions WebRTC
- Transactions de paiement
- Métriques d'engagement utilisateur

### Contacts Support

- **Issues Techniques** : dev@maayegue.app
- **Questions API** : api@maayegue.app
- **Facturation** : billing@maayegue.app

Cette installation complète prépare Ma'a yegue V1.1 pour un déploiement en production avec toutes les fonctionnalités avancées activées et optimisées.