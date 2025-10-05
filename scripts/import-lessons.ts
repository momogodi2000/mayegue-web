#!/usr/bin/env tsx

/**
 * Import Lessons from JSON Script
 * This script imports lessons from a JSON file to Firebase
 * Run with: npm run import-lessons
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import lessonsData from './lessons-data.json';

// Firebase configuration for script
const firebaseConfig = {
  apiKey: "AIzaSyBvOkBwv6wJ4nD1eE5fC6dG7hH8iJ9kL0mN",
  authDomain: "studio-6750997720-7c22e.firebaseapp.com",
  projectId: "studio-6750997720-7c22e",
  storageBucket: "studio-6750997720-7c22e.appspot.com",
  messagingSenderId: "6750997720",
  appId: "1:6750997720:web:7c22e8f9c4d5e6f7a8b9c0d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function importLessons() {
  console.log('🚀 Starting import of lessons from JSON...');
  
  try {
    let importedCount = 0;
    
    for (const lesson of lessonsData.lessons) {
      try {
        const docRef = await addDoc(collection(db, 'lessons'), {
          ...lesson,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        
        console.log(`✅ Imported lesson: "${lesson.title}" (ID: ${docRef.id})`);
        importedCount++;
        
      } catch (error) {
        console.error(`❌ Error importing lesson "${lesson.title}":`, error);
      }
    }
    
    console.log(`\n🎉 Successfully imported ${importedCount} out of ${lessonsData.lessons.length} lessons!`);
    
    if (importedCount === lessonsData.lessons.length) {
      console.log('✅ All lessons imported successfully!');
    } else {
      console.log(`⚠️  ${lessonsData.lessons.length - importedCount} lessons failed to import.`);
    }
    
  } catch (error) {
    console.error('❌ Error in importLessons:', error);
    process.exit(1);
  }
}

// Run the script
importLessons()
  .then(() => {
    console.log('✨ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });

export { importLessons };
