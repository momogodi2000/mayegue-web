# Fonctionnalités - Ma'a yegue V1.1.0

## 📖 1. Dictionnaire Interactif

### Caractéristiques

- **15,000+ mots** dans toutes les langues camerounaises
- **Recherche multilingue** instantanée
- **Prononciation audio** par locuteurs natifs
- **Exemples contextuels** d'utilisation
- **Étymologie** et histoire des mots
- **Variations dialectales**
- **Images illustratives**
- **Mode hors ligne**

### Fonctionnalités Avancées

#### Recherche Intelligente
```
- Recherche par mot-clé
- Recherche phonétique
- Suggestions automatiques
- Recherche inverse (français → langue locale)
- Filtres par langue, catégorie, difficulté
```

#### Détails du Mot
```
- Traduction multilingue
- Classe grammaticale
- Genre et nombre
- Conjugaisons/déclinaisons
- Synonymes et antonymes
- Expressions idiomatiques
- Proverbes associés
```

### Technologie

- Service: `dictionaryService.ts`
- Store: Zustand pour cache local
- Offline: IndexedDB pour stockage hors ligne

---

## 🎓 2. Leçons Adaptatives

### Types de Leçons

1. **Leçons de Base**
   - Alphabet et prononciation
   - Salutations courantes
   - Nombres et comptage
   - Jours et mois

2. **Leçons Thématiques**
   - Famille et relations
   - Nourriture et boissons
   - Métiers et professions
   - Animaux et nature
   - Santé et corps humain

3. **Leçons Culturelles**
   - Cérémonies traditionnelles
   - Contes et légendes
   - Proverbes et sagesse
   - Musique et danses

### Système Adaptatif IA

```typescript
interface AdaptiveLearning {
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  currentLevel: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: LearningRecommendation[];
  performanceMetrics: {
    accuracy: number;
    speed: number;
    retention: number;
  };
}
```

### Laboratoire de Prononciation

- **Reconnaissance vocale** en temps réel
- **Analyse de prononciation** avec IA
- **Feedback visuel** (spectrogramme)
- **Exercices guidés** par phonème
- **Enregistrement et comparaison**

### Expériences AR/VR

- **Scènes immersives** contextuelles
- **Interactions 3D** avec objets
- **Environnements culturels** authentiques
- **Gamification** des exercices

---

## 🗺️ 3. Atlas Linguistique Interactif

### Carte Interactive

```
- Visualisation des 280+ langues du Cameroun
- 10 régions administratives
- 260+ groupes ethniques
- Familles linguistiques (Niger-Congo, Afro-Asiatique, Nilo-Saharienne)
```

### Informations par Langue

```typescript
interface Language {
  id: string;
  name: string;
  nativeName: string;
  family: string;
  subFamily: string;
  speakers: number;
  region: string[];
  endangerment: 'safe' | 'vulnerable' | 'endangered' | 'critically_endangered' | 'extinct';
  writingSystem: string[];
  audioSample: string;
  flagEmoji: string;
}
```

### Fonctionnalités

1. **Carte Cliquable**
   - Zoom sur régions
   - Filtres par famille linguistique
   - Densité de locuteurs
   - Niveau de danger

2. **Visualisations**
   - Arbre des familles linguistiques
   - Timeline d'évolution
   - Migrations historiques
   - Influence des langues

3. **Statistiques**
   - Nombre de locuteurs
   - Distribution géographique
   - Taux d'apprentissage
   - Tendances

---

## 📚 4. Encyclopédie Culturelle

### Catégories

#### 4.1 Traditions & Coutumes
- Cérémonies de mariage
- Rites de passage
- Funérailles traditionnelles
- Fêtes et célébrations
- Protocoles royaux

#### 4.2 Mythes & Légendes
- Contes des origines
- Créatures mythologiques
- Héros légendaires
- Cosmogonie

#### 4.3 Proverbes & Sagesse
- Proverbes par thème
- Devinettes
- Maximes
- Philosophie africaine

#### 4.4 Artisanat
- Sculpture sur bois
- Poterie
- Tissage
- Perles et bijoux
- Instruments de musique

#### 4.5 Gastronomie
- Plats traditionnels
- Recettes authentiques
- Techniques culinaires
- Ingrédients locaux

#### 4.6 Musique & Danses
- Instruments traditionnels
- Rythmes et styles
- Danses rituelles
- Chants et griots

---

## 🏛️ 5. Sites Historiques

### Fonctionnalités

#### Visites Virtuelles 360°
- **100+ sites** documentés
- **Photos panoramiques** haute résolution
- **Vidéos immersives** 4K
- **Navigation interactive**

#### Contexte Historique
```
- Histoire détaillée
- Personnages clés
- Événements marquants
- Importance culturelle
- État de conservation
```

#### Guides Audio
- **Multilingues** (français, anglais, langues locales)
- **Narration professionnelle**
- **Durée adaptée**
- **Points d'intérêt**

#### Reconstitutions AR
- **Visualisation** des sites dans le passé
- **Comparaison** avant/après
- **Animations** historiques

#### Géolocalisation
- **Carte interactive**
- **Itinéraires** de visite
- **Proximité** géographique
- **Tour guidé** virtuel

### Sites Inclus

```
- Palais des rois Bamoun (Foumban)
- Chutes de la Lobé (Kribi)
- Lac Nyos
- Mont Cameroun
- Réserve de Dja
- Sites UNESCO
- ... et 90+ autres
```

---

## 🥽 6. Expériences AR/VR

### Types de Scènes

#### 6.1 Scènes Culturelles
- Marchés traditionnels
- Villages ancestraux
- Cérémonies
- Festivals

#### 6.2 Scènes Historiques
- Événements marquants
- Personnages célèbres
- Batailles et conquêtes

#### 6.3 Scènes Naturelles
- Faune et flore
- Paysages
- Écosystèmes

#### 6.4 Scènes Éducatives
- Leçons immersives
- Exercices interactifs
- Jeux culturels

### Modes d'Interaction

```typescript
type ARMode = 'marker' | 'markerless' | 'location' | 'face';
type VRMode = 'cardboard' | 'standalone' | 'pc';

interface ARScene {
  id: string;
  type: 'cultural' | 'historical' | 'natural' | 'educational';
  mode: ARMode | VRMode;
  interactions: ARInteraction[];
  culturalElements: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  duration: number; // minutes
}
```

### Interactions
- **Tap** sur objets 3D
- **Gestes** de manipulation
- **Voix** pour dialogues
- **Quiz** intégrés
- **Collecte** d'objets virtuels

---

## 🎮 7. RPG & Gamification

### Système de Progression

#### Niveaux & XP
```typescript
interface Player {
  level: number; // 1-100
  experience: number;
  experienceToNext: number;
  totalExperience: number;
  prestige: number; // Cycles après niveau 100
}
```

#### Sources d'XP
- Leçons complétées : 50-200 XP
- Mots appris : 10 XP/mot
- Quiz réussis : 30-100 XP
- Visites AR/VR : 100-500 XP
- Contributions : 20-1000 XP

### Ngondo Coins 💰

#### Gagner des Coins
- Connexion quotidienne : 10 coins
- Objectifs atteints : 50-200 coins
- Achievements débloqués : 100-1000 coins
- Compétitions : 500-5000 coins
- Invitations : 100 coins/ami

#### Dépenser des Coins
- Items cosmétiques : 50-500 coins
- Boosts XP : 100-1000 coins
- Débloquages premium : 500-2000 coins
- Cadeaux virtuels : 50-500 coins

### Quêtes

#### Types de Quêtes
1. **Quotidiennes** (5 par jour)
   - Apprendre 10 mots nouveaux
   - Compléter 3 leçons
   - Réussir 5 quiz
   - Visiter 2 sites AR

2. **Hebdomadaires** (3 par semaine)
   - Maintenir un streak de 7 jours
   - Atteindre 1000 XP
   - Débloquer 5 achievements
   - Explorer 10 scènes AR/VR

3. **Mensuelles** (1 par mois)
   - Apprendre une nouvelle langue
   - Compléter un parcours thématique
   - Atteindre un nouveau prestige
   - Gagner une compétition

4. **Événementielles**
   - Fêtes nationales
   - Événements culturels
   - Challenges communautaires

### Achievements 🏆

#### Catégories
- **Apprentissage** : 100+ achievements
- **Social** : 50+ achievements
- **Exploration** : 75+ achievements
- **Compétition** : 40+ achievements
- **Spéciaux** : 25+ achievements

### Inventaire & Équipement

```typescript
interface InventoryItem {
  id: string;
  type: 'avatar' | 'background' | 'badge' | 'boost' | 'gift';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  tradeable: boolean;
  durability?: number; // Pour items consommables
}
```

### Compétitions & Ligues

#### Formats
- **1v1** : Duels linguistiques
- **Team** : Équipes de 3-5
- **Battle Royale** : 100 participants
- **Marathon** : Endurance 24h

#### Récompenses
- Ngondo Coins
- Items exclusifs
- Titres et badges
- Classement global

---

## 🤖 8. Intelligence Artificielle

### 8.1 Mentor IA (Gemini)

#### Personnalisation
```typescript
interface AIMentor {
  id: string;
  userId: string;
  personality: 'encouraging' | 'strict' | 'humorous' | 'professional';
  expertise: string[]; // Langues spécialisées
  adaptationLevel: number; // 1-10
  conversationHistory: ConversationMessage[];
}
```

#### Fonctionnalités
- **Conversations** naturelles en français
- **Explications** grammaticales
- **Corrections** personnalisées
- **Encouragements** adaptatifs
- **Progression** suivie
- **Rappels** intelligents

### 8.2 Grand-mère Virtuelle

#### Rôle
- **Transmission** culturelle
- **Contes** et histoires
- **Recettes** traditionnelles
- **Sagesse** ancestrale
- **Lien** intergénérationnel

#### Interactions
```
- Écouter des histoires
- Apprendre des recettes
- Découvrir des proverbes
- Poser des questions culturelles
- Partager des souvenirs
```

### 8.3 Apprentissage Adaptatif

#### Analyse en Temps Réel
- **Performance** mesurée
- **Difficultés** détectées
- **Ajustement** automatique
- **Recommandations** personnalisées

#### Insights Générés
```typescript
interface AdaptiveInsight {
  type: 'strength' | 'weakness' | 'opportunity' | 'recommendation';
  title: string;
  description: string;
  actionable: boolean;
  priority: 'low' | 'medium' | 'high';
  confidence: number; // 0-1
}
```

---

## 👨‍👩‍👧‍👦 9. Mode Famille

### Compte Famille

#### Capacités
- **6 profils** maximum
- **Suivi** individuel et collectif
- **Partage** de progression
- **Contrôles** parentaux
- **Statistiques** familiales

### Arbre Linguistique Familial

```typescript
interface FamilyTree {
  id: string;
  familyId: string;
  members: FamilyMember[];
  languages: {
    native: string[];
    learning: string[];
    heritage: string[];
  };
  achievements: FamilyAchievement[];
}
```

### Mode "Apprendre avec Grand-mère"

- **Sessions** intergénérationnelles
- **Transmission** orale
- **Enregistrements** familiaux
- **Mémoires** partagées

---

## 🌐 10. Communauté & Marketplace

### Forums de Discussion
- Entraide linguistique
- Partage culturel
- Questions/Réponses
- Modération IA

### Tandem Linguistique
- **Matching** automatique
- **Échanges** vidéo/audio/texte
- **Planning** de sessions
- **Suivi** de progression

### Événements
- Webinaires culturels
- Concours mensuels
- Rencontres virtuelles
- Festivals en ligne

### Marketplace
- **Contenus** créés par la communauté
- **Leçons** personnalisées
- **Ressources** culturelles
- **Commissions** équitables (70/30)

---

## 📊 Statistiques & Analytics

### Tableau de Bord Utilisateur

```
- Temps d'apprentissage total
- Mots appris
- Leçons complétées
- Niveau actuel
- Streak actuel/record
- XP gagné
- Achievements débloqués
- Classement global
```

### Rapports Détaillés

- **Hebdomadaires** : Résumé de la semaine
- **Mensuels** : Rapport de progression
- **Annuels** : Bilan de l'année
- **Comparaisons** : Vs mois précédent

### Exports
- PDF
- CSV
- Certificats officiels
