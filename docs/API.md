# API de Ma'a yegue V1.1

## Vue d'ensemble

L'API de Ma'a yegue est construite autour de Firebase comme backend principal, complété par des services IA et des intégrations tierces.

## Architecture API

### Services Principaux

```
┌─────────────────────────────────────┐
│           API Gateway               │
│         (Firebase Functions)        │
├─────────────────────────────────────┤
│         Business Logic              │
│         (Cloud Functions)           │
├─────────────────────────────────────┤
│         Data Access Layer           │
│         (Firestore + Realtime DB)   │
├─────────────────────────────────────┤
│         External Services           │
│         (Gemini AI, Payments, etc.) │
└─────────────────────────────────────┘
```

## Firebase Services

### Firestore Collections

#### Utilisateurs (`users`)
```typescript
interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  languages: string[]; // Langues apprises
  level: 'beginner' | 'intermediate' | 'advanced';
  xp: number;
  coins: number; // Ngondo Coins
  createdAt: Timestamp;
  lastLogin: Timestamp;
  preferences: UserPreferences;
  achievements: string[];
  progress: LearningProgress;
}
```

#### Langues (`languages`)
```typescript
interface Language {
  id: string;
  name: string;
  nativeName: string;
  family: string;
  region: string;
  speakers: number;
  coordinates: [number, number];
  endangered: boolean;
  endangermentLevel: 'vulnerable' | 'definitely_endangered' | 'severely_endangered' | 'critically_endangered';
  dialects: string[];
  culturalNotes: string;
}
```

#### Leçons (`lessons`)
```typescript
interface Lesson {
  id: string;
  languageId: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  module: string; // grammar, vocabulary, conversation
  content: LessonContent;
  exercises: Exercise[];
  duration: number; // minutes
  prerequisites: string[]; // lesson IDs
  tags: string[];
}
```

#### Dictionnaire (`dictionary`)
```typescript
interface DictionaryEntry {
  id: string;
  languageId: string;
  word: string;
  phonetic: string; // IPA
  translations: {
    [language: string]: string;
  };
  examples: Example[];
  audioUrl?: string;
  imageUrl?: string;
  category: string;
  difficulty: number;
  tags: string[];
}
```

#### Marketplace (`marketplace`)
```typescript
interface Product {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  category: 'artisanat' | 'alimentation' | 'experience' | 'service';
  price: number;
  currency: 'XAF' | 'EUR' | 'USD';
  images: string[];
  location: string;
  inStock: boolean;
  rating: number;
  reviews: Review[];
}
```

#### Encyclopédie (`encyclopedia`)
```typescript
interface EncyclopediaEntry {
  id: string;
  type: 'ethnic_group' | 'tradition' | 'cuisine' | 'craft' | 'story';
  title: string;
  content: string;
  region: string;
  ethnicGroup?: string;
  media: Media[];
  relatedEntries: string[];
  tags: string[];
}
```

### Firebase Auth

#### Méthodes d'Authentification
- **Email/Password** : Authentification classique
- **Google** : OAuth 2.0
- **Facebook** : OAuth 2.0
- **Apple** : Sign In with Apple
- **Phone** : SMS OTP
- **Anonymous** : Session temporaire

#### Règles de Sécurité
```javascript
// Exemple de règles Firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Utilisateurs - lecture/écriture propre
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Langues - lecture publique
    match /languages/{languageId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Leçons - accès selon abonnement
    match /lessons/{lessonId} {
      allow read: if isAuthenticated() && hasAccess();
    }
  }
}
```

## Service IA Gemini

### Interface Principale
```typescript
interface GeminiService {
  // Initialisation
  initialize(): Promise<void>;

  // Chat conversationnel
  chat(
    userId: string,
    message: string,
    context: ConversationContext
  ): Promise<ChatResponse>;

  // Analyse de texte
  analyzeText(
    text: string,
    language: string,
    analysisType: 'grammar' | 'pronunciation' | 'cultural'
  ): Promise<AnalysisResult>;

  // Génération de contenu
  generateContent(
    prompt: string,
    type: 'lesson' | 'exercise' | 'story',
    context: ContentContext
  ): Promise<GeneratedContent>;

  // Modération
  moderateContent(content: string): Promise<ModerationResult>;
}
```

### Contextes de Conversation
```typescript
interface ConversationContext {
  userId: string;
  language: string;
  learningLevel: 'beginner' | 'intermediate' | 'advanced';
  culturalContext?: string;
  conversationHistory: Message[];
  preferences: UserPreferences;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: any;
}
```

### Types d'Analyse
- **Grammaticale** : Correction syntaxique et morphologique
- **Phonétique** : Analyse de prononciation
- **Culturelle** : Contexte et signification culturelle
- **Pédagogique** : Feedback d'apprentissage

## APIs de Paiement

### CamPay Integration
```typescript
interface CamPayService {
  // Initialisation de paiement
  initiatePayment(paymentData: PaymentRequest): Promise<PaymentResponse>;

  // Vérification de statut
  checkPaymentStatus(reference: string): Promise<PaymentStatus>;

  // Remboursement
  refundPayment(reference: string, amount: number): Promise<RefundResponse>;
}

interface PaymentRequest {
  amount: number;
  currency: 'XAF';
  description: string;
  callbackUrl: string;
  returnUrl: string;
  payerName: string;
  payerEmail: string;
}
```

### NouPai Integration
```typescript
interface NouPaiService {
  // Paiement mobile
  mobilePayment(request: MobilePaymentRequest): Promise<PaymentResponse>;

  // Paiement par carte
  cardPayment(request: CardPaymentRequest): Promise<PaymentResponse>;
}
```

## APIs Cartographiques

### Mapbox Integration
```typescript
interface MapService {
  // Chargement de carte
  loadMap(container: string, options: MapOptions): Promise<MapInstance>;

  // Ajout de marqueurs
  addMarkers(map: MapInstance, markers: MarkerData[]): void;

  // Géocodage
  geocode(address: string): Promise<GeocodeResult>;

  // Géocodage inverse
  reverseGeocode(coordinates: [number, number]): Promise<ReverseGeocodeResult>;
}
```

### Leaflet Integration
```typescript
interface LeafletService {
  // Création de carte
  createMap(element: HTMLElement, options: L.MapOptions): L.Map;

  // Clustering
  createClusterGroup(): L.MarkerClusterGroup;

  // Contrôles personnalisés
  addCustomControl(map: L.Map, control: L.Control): void;
}
```

## APIs Médias

### Stockage Firebase
```typescript
interface StorageService {
  // Upload de fichier
  uploadFile(
    file: File,
    path: string,
    metadata?: UploadMetadata
  ): Promise<UploadResult>;

  // Téléchargement
  downloadFile(path: string): Promise<Blob>;

  // URL signée
  getDownloadURL(path: string): Promise<string>;

  // Suppression
  deleteFile(path: string): Promise<void>;
}
```

### Audio Processing
```typescript
interface AudioService {
  // Enregistrement
  startRecording(options: RecordingOptions): Promise<MediaRecorder>;

  // Analyse audio
  analyzeAudio(audioBlob: Blob): Promise<AudioAnalysis>;

  // Synthèse vocale
  textToSpeech(text: string, language: string): Promise<Blob>;
}
```

## APIs Temps Réel

### WebRTC pour Classes Virtuelles
```typescript
interface WebRTCService {
  // Création de room
  createRoom(options: RoomOptions): Promise<Room>;

  // Rejoindre room
  joinRoom(roomId: string, userId: string): Promise<Participant>;

  // Streaming audio/vidéo
  startStream(stream: MediaStream): Promise<void>;

  // Messagerie
  sendMessage(message: ChatMessage): void;
}
```

### Firestore Real-time
```typescript
interface RealtimeService {
  // Écoute de collection
  listenToCollection(
    collection: string,
    callback: (data: any[]) => void
  ): Unsubscribe;

  // Écoute de document
  listenToDocument(
    path: string,
    callback: (data: any) => void
  ): Unsubscribe;
}
```

## APIs Externes

### Google Gemini AI
```typescript
interface GeminiAPI {
  // Génération de contenu
  generateContent(request: GenerateContentRequest): Promise<GenerateContentResponse>;

  // Chat session
  startChat(request: StartChatRequest): Promise<ChatSession>;

  // Embeddings
  embedContent(request: EmbedContentRequest): Promise<EmbedContentResponse>;
}
```

### Analytics
```typescript
interface AnalyticsService {
  // Événement personnalisé
  logEvent(name: string, parameters?: Record<string, any>): void;

  // Événement e-commerce
  logPurchase(transaction: TransactionData): void;

  // Propriétés utilisateur
  setUserProperties(properties: Record<string, any>): void;
}
```

## Gestion d'Erreurs

### Types d'Erreurs
```typescript
enum APIErrorType {
  NETWORK_ERROR = 'network_error',
  AUTHENTICATION_ERROR = 'auth_error',
  PERMISSION_ERROR = 'permission_error',
  VALIDATION_ERROR = 'validation_error',
  RATE_LIMIT_ERROR = 'rate_limit_error',
  SERVICE_UNAVAILABLE = 'service_unavailable'
}

interface APIError {
  type: APIErrorType;
  message: string;
  code: string;
  details?: any;
  retryable: boolean;
}
```

### Gestion Centralisée
```typescript
class ErrorHandler {
  static handle(error: APIError): void {
    // Log error
    console.error('API Error:', error);

    // Show user-friendly message
    toast.error(getErrorMessage(error));

    // Retry if applicable
    if (error.retryable) {
      // Implement retry logic
    }

    // Report to monitoring
    reportError(error);
  }
}
```

## Sécurité API

### Authentification
- **JWT Tokens** : Pour les appels API externes
- **API Keys** : Pour les services tiers
- **OAuth 2.0** : Pour les intégrations sociales

### Autorisation
- **Role-Based Access Control** : Admin, Teacher, Student
- **Resource-Based Permissions** : Par collection/document
- **Attribute-Based Access** : Selon les propriétés utilisateur

### Chiffrement
- **Données au Repos** : AES-256
- **Données en Transit** : TLS 1.3
- **Clés Sensibles** : Gestion sécurisée avec KMS

## Rate Limiting

### Limites par Service
```typescript
const RATE_LIMITS = {
  gemini: { requests: 100, period: '1h' },
  mapbox: { requests: 50000, period: '1d' },
  payments: { requests: 1000, period: '1h' },
  storage: { requests: 10000, period: '1d' }
};
```

### Implémentation
- **Token Bucket** : Pour les requêtes régulières
- **Fixed Window** : Pour les limites strictes
- **Sliding Window** : Pour les analyses temporelles

## Monitoring & Logging

### Métriques Collectées
- **Latence** : Temps de réponse par endpoint
- **Taux d'Erreur** : Erreurs par service
- **Utilisation** : Requêtes par minute/heure
- **Performance** : CPU, mémoire, bande passante

### Outils
- **Firebase Functions Logs** : Logs automatiques
- **Cloud Monitoring** : Métriques GCP
- **Custom Dashboards** : Visualisations personnalisées
- **Alertes** : Notifications en temps réel

## Versioning & Évolutivité

### Versioning API
- **URL Versioning** : `/api/v1/endpoint`
- **Header Versioning** : `Accept-Version: v1.1`
- **Semantic Versioning** : `MAJOR.MINOR.PATCH`

### Backward Compatibility
- **Deprecation Warnings** : Avertissements 6 mois avant suppression
- **Migration Guides** : Documentation pour les changements
- **Fallbacks** : Support des anciennes versions

Cette architecture API assure une évolutivité maximale tout en maintenant la sécurité, la performance et la fiabilité du système.