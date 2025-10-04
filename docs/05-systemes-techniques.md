# Systèmes Techniques - Ma'a yegue V1.1.0

## 💳 Système de Paiement

### Plans d'Abonnement

| Plan | Prix | Durée | Utilisateurs | Fonctionnalités |
|------|------|-------|--------------|-----------------|
| **Freemium** | 0 FCFA | Illimité | 1 | 5 leçons/mois, dict. de base, IA limité |
| **Premium** | 2,500 FCFA | 1 mois | 1 | Tout illimité + Atlas + AR/VR |
| **Premium Annuel** | 25,000 FCFA | 12 mois | 1 | Premium + 20% économie + bonus |
| **Famille** | 5,000 FCFA | 1 mois | 6 | Tout Premium + mode famille |
| **Enseignant** | 8,000 FCFA | 1 mois | 1+100 | Famille + outils pédagogiques |
| **Entreprise** | Sur devis | Custom | Illimité | Tout + API + support 24/7 |

### Intégration CamPay (Principal)

```typescript
interface CampayPaymentRequest {
  amount: string;
  currency: 'XAF';
  from: string; // Numéro de téléphone
  description: string;
  external_reference: string;
}

// Workflow
1. Utilisateur sélectionne un plan
2. Saisit son numéro Mobile Money
3. paymentService.initializePayment()
4. CamPay envoie notification USSD
5. Utilisateur confirme avec code PIN
6. Webhook reçoit confirmation
7. Abonnement activé
8. Reçu généré et envoyé par email
```

### Intégration Noupai (Fallback)

Utilisé si CamPay est indisponible :
- Même flux que CamPay
- Priorité secondaire
- Timeout de 30s avant basculement

### Intégration Stripe (International)

Pour les paiements par carte bancaire :
- Cartes Visa/Mastercard/Amex
- 3D Secure obligatoire
- Conversion automatique XAF ↔ USD/EUR

### Gestion des Reçus

```typescript
interface Receipt {
  id: string;
  userId: string;
  transactionId: string;
  amount: number;
  currency: string;
  plan: string;
  provider: 'campay' | 'noupai' | 'stripe';
  status: 'pending' | 'successful' | 'failed';
  receiptUrl: string; // PDF dans Cloud Storage
  emailSent: boolean;
  createdAt: Date;
}

// Service
receiptService.generateReceipt(transaction)
receiptService.sendByEmail(userId, receiptId)
receiptService.downloadPDF(receiptId)
```

---

## 🔐 Système d'Authentification

### Firebase Authentication

#### Méthodes Supportées
- **Email/Password** : Inscription classique
- **Google** : OAuth 2.0
- **Facebook** : Social login
- **Apple** : Sign in with Apple (iOS)
- **Anonyme** : Compte temporaire

#### Flux d'Inscription

```typescript
1. Utilisateur remplit le formulaire
2. authService.signUpWithEmail(email, password, displayName)
3. Firebase crée le compte
4. userService.ensureUserProfile() crée le profil Firestore
5. Email de vérification envoyé
6. Redirection vers tableau de bord
```

#### Gestion des Rôles

```typescript
type UserRole =
  | 'apprenant'        // Utilisateur standard
  | 'teacher'          // Enseignant
  | 'admin'            // Administrateur
  | 'family_member';   // Membre d'une famille

// Vérification
const hasPermission = (user: User, permission: string) => {
  const rolePermissions = {
    apprenant: ['read:lessons', 'write:progress'],
    teacher: ['read:lessons', 'write:lessons', 'read:students'],
    admin: ['*'], // Toutes les permissions
    family_member: ['read:family', 'write:progress']
  };
  return rolePermissions[user.role]?.includes(permission);
};
```

#### Comptes Familiaux

```typescript
interface FamilyAccount {
  id: string;
  ownerId: string; // Parent principal
  members: FamilyMember[];
  subscription: UserSubscription;
  settings: {
    parentalControls: boolean;
    contentFiltering: boolean;
    screenTimeLimit: number; // minutes/jour
    ageRestrictions: boolean;
  };
  createdAt: Date;
}
```

#### 2FA (Two-Factor Authentication)

```typescript
// Activation 2FA
const enable2FA = async (userId: string) => {
  const verificationId = await PhoneAuthProvider.verify(phoneNumber);
  const credential = PhoneAuthProvider.credential(verificationId, code);
  await multiFactor(user).enroll(credential, 'Phone number');
};

// Connexion avec 2FA
const signInWith2FA = async (email: string, password: string, code: string) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  // Si 2FA requis
  const resolver = result.resolver;
  const credential = PhoneAuthProvider.credential(verificationId, code);
  await resolver.resolveSignIn(credential);
};
```

#### Authentification Biométrique (Future)

```typescript
// Web Authentication API
const enableBiometric = async () => {
  const credential = await navigator.credentials.create({
    publicKey: {
      challenge: new Uint8Array(32),
      rp: { name: "Ma'a yegue" },
      user: {
        id: new Uint8Array(16),
        name: user.email,
        displayName: user.displayName
      },
      pubKeyCredParams: [{ alg: -7, type: "public-key" }]
    }
  });
  // Stocker dans Firestore
};
```

---

## 🗄️ Base de Données Firestore

### Collections Principales

#### users
```typescript
interface UserDoc {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  subscription?: string; // ID de subscription
  familyId?: string;
  ngondoCoins: number;
  stats: UserStats;
  preferences: UserPreferences;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### subscriptions
```typescript
interface SubscriptionDoc {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  startDate: Timestamp;
  endDate: Timestamp;
  autoRenew: boolean;
  paymentMethod: string;
  createdAt: Timestamp;
}
```

#### languages
```typescript
interface LanguageDoc {
  id: string;
  name: string;
  nativeName: string;
  family: string;
  speakers: number;
  region: string[];
  endangerment: string;
  audioSample: string;
  flagEmoji: string;
}
```

#### words
```typescript
interface WordDoc {
  id: string;
  word: string;
  language: string;
  translation: { [key: string]: string };
  pronunciation: string;
  audio: string;
  category: string;
  difficulty: number;
  examples: string[];
}
```

#### lessons
```typescript
interface LessonDoc {
  id: string;
  title: string;
  language: string;
  difficulty: number;
  type: string;
  content: LessonContent;
  exercises: Exercise[];
  estimatedTime: number;
  xpReward: number;
}
```

### Règles de Sécurité

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return request.auth.uid == userId;
    }

    function isAdmin() {
      return isAuthenticated() &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Users
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isOwner(userId) || isAdmin();
    }

    // Languages (public)
    match /languages/{languageId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Words (public en lecture)
    match /words/{wordId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Lessons
    match /lessons/{lessonId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }

    // Subscriptions
    match /subscriptions/{subscriptionId} {
      allow read: if isAuthenticated() &&
        resource.data.userId == request.auth.uid;
      allow create, update: if isAuthenticated();
      allow delete: if isAdmin();
    }

    // Payment history
    match /payment_history/{paymentId} {
      allow read: if isAuthenticated() &&
        resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated();
      allow update, delete: if isAdmin();
    }
  }
}
```

### Indexes Composés

```json
{
  "indexes": [
    {
      "collectionGroup": "words",
      "fields": [
        { "fieldPath": "language", "order": "ASCENDING" },
        { "fieldPath": "difficulty", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "lessons",
      "fields": [
        { "fieldPath": "language", "order": "ASCENDING" },
        { "fieldPath": "type", "order": "ASCENDING" },
        { "fieldPath": "difficulty", "order": "ASCENDING" }
      ]
    }
  ]
}
```

### Migrations V1.1

```typescript
// Script de migration
async function migrateToV1_1() {
  const users = await getDocs(collection(db, 'users'));

  for (const userDoc of users.docs) {
    const userId = userDoc.id;
    const data = userDoc.data();

    // Ajouter les nouveaux champs V1.1
    await updateDoc(doc(db, 'users', userId), {
      ngondoCoins: data.ngondoCoins || 100,
      familyId: data.familyId || null,
      'stats.atlasExplorations': 0,
      'stats.encyclopediaEntries': 0,
      'stats.historicalSitesVisited': 0,
      'stats.arVrExperiences': 0,
      'stats.marketplacePurchases': 0,
      'stats.familyContributions': 0,
      'stats.ngondoCoinsEarned': 0,
      'stats.achievementsUnlocked': 0
    });
  }
}
```

---

## 🤖 Services IA

### Google Gemini Pro Integration

```typescript
class GeminiService {
  private model: GenerativeModel;

  constructor() {
    const genAI = new GoogleGenerativeAI(config.ai.geminiApiKey);
    this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async generateResponse(
    prompt: string,
    context?: string,
    options?: {
      temperature?: number;
      maxOutputTokens?: number;
      topP?: number;
    }
  ): Promise<string> {
    const fullPrompt = context ? `${context}\n\n${prompt}` : prompt;

    const result = await this.model.generateContent({
      contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
      generationConfig: {
        temperature: options?.temperature ?? 0.7,
        maxOutputTokens: options?.maxOutputTokens ?? 1000,
        topP: options?.topP ?? 0.8
      }
    });

    return result.response.text();
  }

  async chat(messages: ConversationMessage[]): Promise<string> {
    const chat = this.model.startChat({
      history: messages.map(m => ({
        role: m.type === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }))
    });

    const result = await chat.sendMessage(messages[messages.length - 1].content);
    return result.response.text();
  }
}
```

### Cas d'Usage

#### 1. Mentor IA
```typescript
const mentorPrompt = `
Tu es un mentor bienveillant pour l'apprentissage du ${language}.
Personnalité: ${mentor.personality}
Niveau de l'étudiant: ${student.level}

Explique de manière simple et encourageante.
Utilise des exemples culturels camerounais.
Adapte-toi au niveau de l'étudiant.
`;

const response = await geminiService.generateResponse(
  userQuestion,
  mentorPrompt,
  { temperature: 0.7 }
);
```

#### 2. Grand-mère Virtuelle
```typescript
const grandmotherPrompt = `
Tu es une grand-mère camerounaise sage et aimante.
Tu partages des histoires, recettes et sagesse ancestrale.
Ton ton est chaleureux et patient.
Tu enseignes avec amour et respect des traditions.
`;
```

#### 3. Analyse Adaptive
```typescript
const analysisPrompt = `
Analyse cette performance d'apprentissage:
- Précision: ${data.accuracy}%
- Vitesse: ${data.speed}
- Cohérence: ${data.consistency}%

Fournis:
1. Forces identifiées
2. Faiblesses détectées
3. Recommandations spécifiques
4. Plan d'action personnalisé
`;
```

---

## 🥽 Services AR/VR

### Three.js Integration

```typescript
class AR VRRenderer {
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private renderer: THREE.WebGLRenderer;

  init3DScene(container: HTMLElement) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });

    // Ajouter des objets 3D culturels
    this.loadCulturalObjects();

    // Animation loop
    this.animate();
  }

  loadCulturalObjects() {
    const loader = new GLTFLoader();
    loader.load('/models/traditional-house.glb', (gltf) => {
      this.scene.add(gltf.scene);
    });
  }

  enableAR() {
    this.renderer.xr.enabled = true;
    // AR.js ou WebXR
  }

  enableVR() {
    this.renderer.xr.enabled = true;
    // VR button
    document.body.appendChild(VRButton.createButton(this.renderer));
  }
}
```

---

## 📊 Analytics & Monitoring

### Firebase Analytics

```typescript
// Événements trackés
analyticsService.trackEvent('lesson_completed', {
  lessonId: lesson.id,
  language: lesson.language,
  difficulty: lesson.difficulty,
  score: score,
  timeSpent: duration
});

analyticsService.trackEvent('payment_successful', {
  planId: plan.id,
  amount: plan.price,
  provider: 'campay',
  userId: user.id
});

analyticsService.trackEvent('achievement_unlocked', {
  achievementId: achievement.id,
  category: achievement.category,
  userId: user.id
});
```

### Performance Monitoring

```typescript
// Mesure des temps de chargement
const trace = performance.trace('load_dictionary');
trace.start();
await dictionaryService.searchWords(query);
trace.stop();

// Métriques custom
trace.putMetric('words_count', results.length);
trace.putAttribute('language', language);
```
