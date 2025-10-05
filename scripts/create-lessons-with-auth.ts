#!/usr/bin/env tsx

/**
 * Create Default Lessons with Authentication Script
 * This script creates default lessons using Firebase Admin SDK
 * Run with: npm run create-lessons-with-auth
 */

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Firebase Admin configuration
const firebaseConfig = {
  projectId: "studio-6750997720-7c22e",
  // Note: In production, use service account key file
  // credential: cert(require('./path-to-service-account-key.json'))
};

// Initialize Firebase Admin (only if not already initialized)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);

interface Lesson {
  title: string;
  description: string;
  content: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  category: string;
  duration: number; // in minutes
  exercises: Array<{
    type: 'multiple_choice' | 'translation' | 'pronunciation' | 'cultural';
    question: string;
    options?: string[];
    correctAnswer: string;
    explanation: string;
  }>;
  culturalNotes?: string;
  audioUrl?: string;
  videoUrl?: string;
  imageUrl?: string;
  isActive: boolean;
  createdBy: 'system' | string;
  tags: string[];
}

const defaultLessons: Lesson[] = [
  // Beginner Level Lessons
  {
    title: "Salutations de Base",
    description: "Apprenez les salutations essentielles en dualaba",
    content: `
# Salutations de Base en Dualaba

## Objectifs d'apprentissage
- Maîtriser les salutations de base
- Comprendre le contexte culturel
- Pratiquer la prononciation

## Contenu de la leçon

### Salutations courantes
- **Mbolo** - Bonjour (utilisé toute la journée)
- **Mbolo mingi** - Bonjour avec respect
- **Tosepeli** - Merci
- **Tosepeli mingi** - Merci beaucoup
- **Malamu** - Au revoir
- **Malamu mingi** - Au revoir avec respect

### Contexte culturel
En dualaba, les salutations sont très importantes et reflètent le respect et la politesse. Il est essentiel de saluer les personnes que vous rencontrez, même les inconnus.

### Prononciation
- Le "mb" se prononce comme "m" + "b" rapidement
- Le "ng" se prononce comme dans "sing" en anglais
- L'accent tonique est généralement sur la première syllabe
    `,
    level: 'beginner',
    language: 'dualaba',
    category: 'vocabulaire',
    duration: 15,
    exercises: [
      {
        type: 'multiple_choice',
        question: 'Comment dit-on "bonjour" en dualaba ?',
        options: ['Malamu', 'Mbolo', 'Tosepeli', 'Mingi'],
        correctAnswer: 'Mbolo',
        explanation: 'Mbolo est la salutation standard en dualaba, utilisée toute la journée.'
      },
      {
        type: 'translation',
        question: 'Traduisez: "Merci beaucoup"',
        correctAnswer: 'Tosepeli mingi',
        explanation: 'Tosepeli signifie "merci" et mingi signifie "beaucoup".'
      }
    ],
    culturalNotes: 'Les salutations en dualaba sont un signe de respect et de politesse. Ne pas saluer peut être considéré comme impoli.',
    tags: ['salutations', 'vocabulaire', 'débutant', 'politesse']
  },
  {
    title: "Nombres de 1 à 10",
    description: "Apprenez à compter de 1 à 10 en dualaba",
    content: `
# Nombres de 1 à 10 en Dualaba

## Objectifs d'apprentissage
- Maîtriser les nombres de 1 à 10
- Comprendre leur utilisation dans la vie quotidienne
- Pratiquer la prononciation

## Les nombres

1. **Moko** - Un
2. **Mibale** - Deux
3. **Misato** - Trois
4. **Minei** - Quatre
5. **Mitano** - Cinq
6. **Motoba** - Six
7. **Nsambo** - Sept
8. **Mname** - Huit
9. **Libwa** - Neuf
10. **Zomi** - Dix

### Utilisation pratique
- Compter les objets
- Donner son âge
- Parler de quantités
- Faire des achats

### Prononciation
- Moko : MO-ko
- Mibale : mi-BA-le
- Misato : mi-SA-to
    `,
    level: 'beginner',
    language: 'dualaba',
    category: 'vocabulaire',
    duration: 20,
    exercises: [
      {
        type: 'multiple_choice',
        question: 'Comment dit-on "cinq" en dualaba ?',
        options: ['Moko', 'Mibale', 'Mitano', 'Zomi'],
        correctAnswer: 'Mitano',
        explanation: 'Mitano est le mot pour "cinq" en dualaba.'
      },
      {
        type: 'translation',
        question: 'Traduisez: "trois"',
        correctAnswer: 'Misato',
        explanation: 'Misato signifie "trois" en dualaba.'
      }
    ],
    culturalNotes: 'Les nombres sont utilisés dans de nombreux contextes culturels, notamment dans les cérémonies traditionnelles.',
    tags: ['nombres', 'vocabulaire', 'débutant', 'mathématiques']
  },
  {
    title: "Famille et Relations",
    description: "Vocabulaire de la famille en dualaba",
    content: `
# Famille et Relations en Dualaba

## Objectifs d'apprentissage
- Maîtriser le vocabulaire de la famille
- Comprendre les relations familiales
- Apprendre les termes de respect

## Vocabulaire de la famille

### Membres de la famille
- **Tata** - Père
- **Mama** - Mère
- **Mwan'a** - Enfant
- **Mwana mobali** - Fils
- **Mwana mwasi** - Fille
- **Noko** - Grand-mère
- **Tata noko** - Grand-père
- **Mpangi** - Frère/Sœur
- **Mwana mpangi** - Cousin/Cousine

### Relations étendues
- **Tonton** - Oncle
- **Tantine** - Tante
- **Mwana tonton** - Cousin/Cousine (fils d'oncle)
- **Mwana tantine** - Cousin/Cousine (fille de tante)

### Termes de respect
- **Tata mingi** - Père respecté
- **Mama mingi** - Mère respectée
- **Noko mingi** - Grand-mère respectée

### Contexte culturel
La famille est très importante dans la culture dualaba. Les relations familiales sont respectées et les aînés sont honorés.
    `,
    level: 'beginner',
    language: 'dualaba',
    category: 'vocabulaire',
    duration: 25,
    exercises: [
      {
        type: 'multiple_choice',
        question: 'Comment dit-on "mère" en dualaba ?',
        options: ['Tata', 'Mama', 'Noko', 'Tonton'],
        correctAnswer: 'Mama',
        explanation: 'Mama est le terme pour "mère" en dualaba.'
      },
      {
        type: 'cultural',
        question: 'Quelle est l\'importance de la famille dans la culture dualaba ?',
        options: ['Peu importante', 'Très importante', 'Modérément importante', 'Variable'],
        correctAnswer: 'Très importante',
        explanation: 'La famille est au cœur de la culture dualaba et les relations familiales sont très respectées.'
      }
    ],
    culturalNotes: 'Dans la culture dualaba, la famille étendue est très importante et les aînés sont toujours respectés.',
    tags: ['famille', 'relations', 'vocabulaire', 'culture']
  },

  // Intermediate Level Lessons
  {
    title: "Conversation Quotidienne",
    description: "Dialogues de la vie quotidienne en dualaba",
    content: `
# Conversation Quotidienne en Dualaba

## Objectifs d'apprentissage
- Maîtriser les dialogues de base
- Comprendre les expressions courantes
- Pratiquer la conversation

## Dialogues de base

### Dialogue 1: Se présenter
**A:** Mbolo! Ngom na Marie.
**B:** Mbolo mingi! Ngom na Jean.
**A:** Tosepeli mingi.

### Dialogue 2: Demander des nouvelles
**A:** Mbolo! Malamu?
**B:** Malamu mingi. Yo malamu?
**A:** Malamu mingi, tosepli.

### Dialogue 3: Au marché
**A:** Mbolo! Boni na yango?
**B:** Yango ezali na liboso ya zomi.
**A:** Tosepeli mingi.

### Expressions utiles
- **Ngom na...** - Je m'appelle...
- **Yo malamu?** - Comment allez-vous?
- **Malamu mingi** - Très bien
- **Boni na yango?** - Combien ça coûte?
- **Ezali na liboso ya...** - Ça coûte...

### Grammaire de base
- Structure sujet-verbe-objet
- Utilisation des particules
- Formes de politesse
    `,
    level: 'intermediate',
    language: 'dualaba',
    category: 'conversation',
    duration: 30,
    exercises: [
      {
        type: 'translation',
        question: 'Traduisez: "Je m\'appelle Marie"',
        correctAnswer: 'Ngom na Marie',
        explanation: 'Ngom na signifie "je m\'appelle" en dualaba.'
      },
      {
        type: 'multiple_choice',
        question: 'Comment demandez-vous "Comment allez-vous?" en dualaba?',
        options: ['Mbolo mingi', 'Yo malamu?', 'Tosepeli mingi', 'Malamu mingi'],
        correctAnswer: 'Yo malamu?',
        explanation: 'Yo malamu? est la façon de demander "Comment allez-vous?" en dualaba.'
      }
    ],
    culturalNotes: 'Les conversations en dualaba incluent souvent des marques de respect et de politesse.',
    tags: ['conversation', 'dialogues', 'quotidien', 'grammaire']
  },
  {
    title: "Temps et Saisons",
    description: "Vocabulaire du temps et des saisons en dualaba",
    content: `
# Temps et Saisons en Dualaba

## Objectifs d'apprentissage
- Maîtriser le vocabulaire du temps
- Comprendre les saisons
- Apprendre à parler de la météo

## Vocabulaire du temps

### Unités de temps
- **Mposo** - Semaine
- **Sanza** - Mois
- **Mobu** - Année
- **Mikolo** - Jours
- **Ngonga** - Heure
- **Minuti** - Minute

### Jours de la semaine
- **Eyenga** - Dimanche
- **Mokolo ya liboso** - Lundi
- **Mokolo ya mibale** - Mardi
- **Mokolo ya misato** - Mercredi
- **Mokolo ya minei** - Jeudi
- **Mokolo ya mitano** - Vendredi
- **Mposo** - Samedi

### Saisons
- **Mpela** - Saison sèche
- **Mpela ya mai** - Saison des pluies
- **Mpela ya elanga** - Saison chaude
- **Mpela ya malili** - Saison fraîche

### Météo
- **Mai** - Eau/Pluie
- **Moto** - Chaleur
- **Malili** - Froid
- **Mpepe** - Vent
- **Elanga** - Soleil
- **Mputu** - Nuage

### Expressions temporelles
- **Lelo** - Aujourd'hui
- **Lobi** - Hier
- **Lelo na lobi** - Demain
- **Na ntango nini?** - À quelle heure?
    `,
    level: 'intermediate',
    language: 'dualaba',
    category: 'vocabulaire',
    duration: 35,
    exercises: [
      {
        type: 'multiple_choice',
        question: 'Comment dit-on "aujourd\'hui" en dualaba?',
        options: ['Lelo', 'Lobi', 'Lelo na lobi', 'Na ntango nini'],
        correctAnswer: 'Lelo',
        explanation: 'Lelo signifie "aujourd\'hui" en dualaba.'
      },
      {
        type: 'translation',
        question: 'Traduisez: "saison des pluies"',
        correctAnswer: 'Mpela ya mai',
        explanation: 'Mpela ya mai signifie "saison des pluies" en dualaba.'
      }
    ],
    culturalNotes: 'Les saisons sont importantes dans la culture dualaba car elles rythment les activités agricoles et les cérémonies.',
    tags: ['temps', 'saisons', 'météo', 'vocabulaire']
  },

  // Advanced Level Lessons
  {
    title: "Culture et Traditions",
    description: "Exploration approfondie de la culture dualaba",
    content: `
# Culture et Traditions Dualaba

## Objectifs d'apprentissage
- Comprendre la culture dualaba
- Maîtriser le vocabulaire culturel
- Apprendre les traditions

## Éléments culturels

### Cérémonies traditionnelles
- **Ngondo** - Cérémonie traditionnelle importante
- **Mvet** - Instrument traditionnel et art de la parole
- **Bikutsi** - Danse traditionnelle
- **Sangha** - Association traditionnelle

### Symboles culturels
- **Masque Ngondo** - Symbole de protection spirituelle
- **Tambour** - Instrument de communication
- **Feu sacré** - Symbole de continuité
- **Arbre sacré** - Symbole de sagesse

### Valeurs traditionnelles
- **Respect des aînés** - Valeur fondamentale
- **Solidarité communautaire** - Entraide mutuelle
- **Sagesse ancestrale** - Transmission du savoir
- **Harmonie avec la nature** - Respect de l'environnement

### Vocabulaire culturel
- **Nkumu** - Chef traditionnel
- **Nganga** - Guérisseur traditionnel
- **Muntu** - Personne (dans un contexte spirituel)
- **Nzambe** - Dieu/Créateur
- **Bilima** - Esprits ancestraux

### Traditions orales
- **Lisapo** - Histoire/Conte
- **Mvett** - Épopée traditionnelle
- **Nkumu** - Proverbe
- **Bisengo** - Chant traditionnel

### Rites de passage
- **Initiation** - Passage à l'âge adulte
- **Mariage traditionnel** - Union des familles
- **Funérailles** - Hommage aux ancêtres
- **Naissance** - Accueil du nouveau-né
    `,
    level: 'advanced',
    language: 'dualaba',
    category: 'culture',
    duration: 45,
    exercises: [
      {
        type: 'cultural',
        question: 'Qu\'est-ce que le Ngondo dans la culture dualaba?',
        options: ['Un instrument', 'Une cérémonie', 'Un vêtement', 'Une nourriture'],
        correctAnswer: 'Une cérémonie',
        explanation: 'Le Ngondo est une cérémonie traditionnelle importante dans la culture dualaba.'
      },
      {
        type: 'multiple_choice',
        question: 'Que signifie "Nkumu" en dualaba?',
        options: ['Guérisseur', 'Chef traditionnel', 'Danseur', 'Musicien'],
        correctAnswer: 'Chef traditionnel',
        explanation: 'Nkumu signifie "chef traditionnel" en dualaba.'
      }
    ],
    culturalNotes: 'La culture dualaba est riche en traditions orales et en cérémonies qui renforcent les liens communautaires.',
    tags: ['culture', 'traditions', 'cérémonies', 'valeurs', 'spiritualité']
  },
  {
    title: "Grammaire Avancée",
    description: "Structures grammaticales complexes en dualaba",
    content: `
# Grammaire Avancée en Dualaba

## Objectifs d'apprentissage
- Maîtriser les structures complexes
- Comprendre la syntaxe avancée
- Apprendre les nuances grammaticales

## Structures grammaticales

### Phrases complexes
- **Coordination** - Liens entre propositions
- **Subordination** - Propositions dépendantes
- **Conditionnelles** - Phrases avec "si"
- **Temporelles** - Relations temporelles

### Temps verbaux avancés
- **Passé composé** - Actions accomplies
- **Plus-que-parfait** - Antériorité
- **Futur antérieur** - Antériorité future
- **Conditionnel** - Hypothèses

### Modes et aspects
- **Impératif** - Ordres et conseils
- **Subjonctif** - Souhaits et hypothèses
- **Optatif** - Souhaits et prières
- **Négatif** - Formes de négation

### Syntaxe complexe
- **Ordre des mots** - Flexibilité syntaxique
- **Emphase** - Mise en relief
- **Questions complexes** - Interrogations indirectes
- **Discours rapporté** - Style indirect

### Particules avancées
- **Particles de temps** - Nuances temporelles
- **Particles de lieu** - Localisation précise
- **Particles de manière** - Adverbes complexes
- **Particles de cause** - Relations causales

### Exemples pratiques

#### Phrases conditionnelles
- **Soki** - Si (condition)
- **Kasi** - Mais (opposition)
- **Mpe** - Et (addition)
- **To** - Ou (alternative)

#### Temps composés
- **Na moni** - J'ai vu (passé composé)
- **Na koyeba** - Je savais (imparfait)
- **Na koya** - Je vais (futur)

#### Négation complexe
- **Te** - Ne... pas (négation simple)
- **Mpe te** - Ni... ni (négation multiple)
- **Kasi te** - Mais pas (opposition négative)
    `,
    level: 'advanced',
    language: 'dualaba',
    category: 'grammaire',
    duration: 50,
    exercises: [
      {
        type: 'multiple_choice',
        question: 'Comment exprime-t-on une condition avec "si" en dualaba?',
        options: ['Kasi', 'Mpe', 'Soki', 'To'],
        correctAnswer: 'Soki',
        explanation: 'Soki est la particule pour exprimer une condition en dualaba.'
      },
      {
        type: 'translation',
        question: 'Traduisez: "J\'ai vu" (passé composé)',
        correctAnswer: 'Na moni',
        explanation: 'Na moni est la forme du passé composé pour "j\'ai vu" en dualaba.'
      }
    ],
    culturalNotes: 'La grammaire dualaba reflète la logique et la pensée traditionnelle de la culture.',
    tags: ['grammaire', 'syntaxe', 'temps', 'particules', 'structures']
  }
];

async function createDefaultLessonsWithAuth() {
  console.log('🚀 Starting creation of default lessons with Firebase Admin...');
  
  try {
    let createdCount = 0;
    
    for (const lesson of defaultLessons) {
      try {
        const docRef = await db.collection('lessons').add({
          ...lesson,
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true,
          createdBy: 'system'
        });
        
        console.log(`✅ Created lesson: "${lesson.title}" (ID: ${docRef.id})`);
        createdCount++;
        
      } catch (error) {
        console.error(`❌ Error creating lesson "${lesson.title}":`, error);
      }
    }
    
    console.log(`\n🎉 Successfully created ${createdCount} out of ${defaultLessons.length} lessons!`);
    
    if (createdCount === defaultLessons.length) {
      console.log('✅ All default lessons created successfully!');
    } else {
      console.log(`⚠️  ${defaultLessons.length - createdCount} lessons failed to create.`);
    }
    
  } catch (error) {
    console.error('❌ Error in createDefaultLessonsWithAuth:', error);
    process.exit(1);
  }
}

// Run the script
createDefaultLessonsWithAuth()
  .then(() => {
    console.log('✨ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });

export { createDefaultLessonsWithAuth };
