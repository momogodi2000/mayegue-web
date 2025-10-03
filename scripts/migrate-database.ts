/**
 * Database Migration Script
 * Migrates dictionary words and lessons from Python SQLite DB to Firebase
 * Run with: npm run migrate-db
 */

import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';

// Initialize Firebase Admin
const app = initializeApp({
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'studio-6750997720-7c22e',
});

const db = getFirestore(app);

interface DictionaryWord {
  id: string;
  word: string;
  translation: string;
  language: string;
  category?: string;
  pronunciation?: string;
  example?: string;
  audioUrl?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  createdAt: number;
  updatedAt: number;
  createdBy: string;
  published: boolean;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  language: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  words: string[];
  exercises: any[];
  published: boolean;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

// Sample data - Replace with actual data from Python DB
const sampleWords: Omit<DictionaryWord, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    word: 'Mbolo',
    translation: 'Bonjour',
    language: 'Duala',
    category: 'Salutations',
    pronunciation: 'mbo-lo',
    example: 'Mbolo na yo (Bonjour à toi)',
    difficulty: 'beginner',
    createdBy: 'system',
    published: true,
  },
  {
    word: 'Mba\'a ne',
    translation: 'Comment ça va?',
    language: 'Duala',
    category: 'Salutations',
    pronunciation: 'mba-a-ne',
    example: 'Mbolo, mba\'a ne? (Bonjour, comment ça va?)',
    difficulty: 'beginner',
    createdBy: 'system',
    published: true,
  },
  {
    word: 'Akiba',
    translation: 'Bonjour',
    language: 'Ewondo',
    category: 'Salutations',
    pronunciation: 'a-ki-ba',
    example: 'Akiba to (Bonjour à toi)',
    difficulty: 'beginner',
    createdBy: 'system',
    published: true,
  },
  {
    word: 'Mbea bene?',
    translation: 'Comment vas-tu?',
    language: 'Ewondo',
    category: 'Salutations',
    pronunciation: 'mbe-a be-ne',
    example: 'Akiba, mbea bene? (Bonjour, comment vas-tu?)',
    difficulty: 'beginner',
    createdBy: 'system',
    published: true,
  },
];

const sampleLessons: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'Salutations de Base en Duala',
    description: 'Apprenez les salutations essentielles en langue Duala',
    language: 'Duala',
    level: 'beginner',
    duration: 15,
    words: [],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'Comment dit-on "Bonjour" en Duala?',
        options: ['Mbolo', 'Akiba', 'Bonjour', 'Hello'],
        correctAnswer: 0,
      },
      {
        type: 'translation',
        question: 'Traduisez: Mbolo na yo',
        correctAnswer: 'Bonjour à toi',
      },
    ],
    published: true,
    createdBy: 'system',
  },
  {
    title: 'Salutations de Base en Ewondo',
    description: 'Apprenez les salutations essentielles en langue Ewondo',
    language: 'Ewondo',
    level: 'beginner',
    duration: 15,
    words: [],
    exercises: [
      {
        type: 'multiple_choice',
        question: 'Comment dit-on "Bonjour" en Ewondo?',
        options: ['Mbolo', 'Akiba', 'Bonjour', 'Hello'],
        correctAnswer: 1,
      },
      {
        type: 'translation',
        question: 'Traduisez: Akiba to',
        correctAnswer: 'Bonjour à toi',
      },
    ],
    published: true,
    createdBy: 'system',
  },
];

async function migrateDictionary() {
  console.log('📚 Migrating dictionary words to Firestore...\n');

  const batch = db.batch();
  let count = 0;

  for (const wordData of sampleWords) {
    const docRef = db.collection('dictionary').doc();
    const word: DictionaryWord = {
      ...wordData,
      id: docRef.id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    batch.set(docRef, word);
    count++;
    console.log(`✓ Added: ${word.word} (${word.language}) - ${word.translation}`);
  }

  await batch.commit();
  console.log(`\n✅ Migrated ${count} dictionary words\n`);
}

async function migrateLessons() {
  console.log('📖 Migrating lessons to Firestore...\n');

  const batch = db.batch();
  let count = 0;

  for (const lessonData of sampleLessons) {
    const docRef = db.collection('lessons').doc();
    const lesson: Lesson = {
      ...lessonData,
      id: docRef.id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    batch.set(docRef, lesson);
    count++;
    console.log(`✓ Added: ${lesson.title} (${lesson.language}) - ${lesson.level}`);
  }

  await batch.commit();
  console.log(`\n✅ Migrated ${count} lessons\n`);
}

async function checkExistingData() {
  console.log('🔍 Checking for existing data...\n');

  const dictSnapshot = await db.collection('dictionary').limit(1).get();
  const lessonsSnapshot = await db.collection('lessons').limit(1).get();

  if (!dictSnapshot.empty || !lessonsSnapshot.empty) {
    console.log('⚠️  WARNING: Database already contains data!');
    console.log(`   Dictionary entries: ${dictSnapshot.size > 0 ? 'exists' : 'empty'}`);
    console.log(`   Lessons: ${lessonsSnapshot.size > 0 ? 'exists' : 'empty'}\n`);

    const answer = process.argv.includes('--force');
    if (!answer) {
      console.log('💡 Use --force flag to migrate anyway: npm run migrate-db -- --force');
      console.log('🛑 Migration cancelled\n');
      process.exit(0);
    } else {
      console.log('⚡ Force flag detected. Proceeding with migration...\n');
    }
  }
}

async function runMigration() {
  console.log('🚀 Ma\'a yegue - Database Migration Script\n');
  console.log('=' .repeat(50));
  console.log('\n');

  try {
    await checkExistingData();
    await migrateDictionary();
    await migrateLessons();

    console.log('=' .repeat(50));
    console.log('\n✨ Migration completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - ${sampleWords.length} dictionary words`);
    console.log(`   - ${sampleLessons.length} lessons`);
    console.log('\n💡 You can view the data in Firebase Console:');
    console.log('   https://console.firebase.google.com/project/studio-6750997720-7c22e/firestore\n');

    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run migration
runMigration();
