#!/usr/bin/env node

/**
 * Firebase Cleanup Script
 * Run this script to clean up unused collections and migrate data to V1.1 structure
 * 
 * Usage:
 * npm run cleanup-firebase
 * or
 * npx ts-node scripts/cleanup-firebase.ts
 */

import { firebaseCleanupService } from '../src/core/services/firebase/firebase-cleanup';
import { config } from '../src/core/config/env.config';

async function main() {
  try {
    console.log('🚀 Starting Firebase Cleanup for V1.1...');
    console.log(`Environment: ${config.appVersion}`);
    console.log('');

    // Get initial stats
    console.log('📊 Getting initial statistics...');
    const initialStats = await firebaseCleanupService.getCleanupStats();
    console.log('Initial Stats:', initialStats);
    console.log('');

    // Clean up unused collections
    console.log('🧹 Cleaning up unused collections...');
    await firebaseCleanupService.cleanupUnusedCollections();
    console.log('');

    // Migrate to V1.1 structure
    console.log('🔄 Migrating data to V1.1 structure...');
    await firebaseCleanupService.migrateToV1Structure();
    console.log('');

    // Get final stats
    console.log('📊 Getting final statistics...');
    const finalStats = await firebaseCleanupService.getCleanupStats();
    console.log('Final Stats:', finalStats);
    console.log('');

    // Summary
    console.log('✅ Firebase Cleanup Completed Successfully!');
    console.log('');
    console.log('Summary:');
    console.log(`- Total Collections: ${finalStats.totalCollections}`);
    console.log(`- Total Documents: ${finalStats.totalDocuments}`);
    console.log(`- Orphaned Documents: ${finalStats.orphanedDocuments}`);
    console.log(`- Migration Needed: ${finalStats.migrationNeeded}`);
    console.log('');
    console.log('🎉 Your Firebase database is now ready for V1.1!');

  } catch (error) {
    console.error('❌ Firebase Cleanup Failed:', error);
    process.exit(1);
  }
}

// Run the cleanup
main();
