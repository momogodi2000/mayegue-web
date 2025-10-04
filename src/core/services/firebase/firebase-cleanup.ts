import { firestoreService } from './firestore.service';

/**
 * Firebase Cleanup Service
 * Handles cleanup of unused collections and data migration
 */
export class FirebaseCleanupService {
  /**
   * Clean up unused collections and test data
   */
  async cleanupUnusedCollections(): Promise<void> {
    try {
      console.log('Starting Firebase cleanup...');

      // Collections to check for cleanup
      const collectionsToCheck = [
        'test_collection',
        'temp_data',
        'old_users',
        'legacy_payments',
        'unused_analytics'
      ];

      for (const collection of collectionsToCheck) {
        await this.cleanupCollection(collection);
      }

      // Clean up orphaned documents
      await this.cleanupOrphanedDocuments();

      console.log('Firebase cleanup completed successfully');
    } catch (error) {
      console.error('Firebase cleanup failed:', error);
      throw error;
    }
  }

  /**
   * Clean up a specific collection if it exists and is unused
   */
  private async cleanupCollection(collectionName: string): Promise<void> {
    try {
      // Check if collection exists by trying to get one document
      const documents = await firestoreService.queryCollection(collectionName, [], undefined, 1);
      
      if (documents.length > 0) {
        console.log(`Found ${documents.length} documents in ${collectionName}`);
        
        // For test collections, delete all documents
        if (collectionName.includes('test') || collectionName.includes('temp')) {
          await this.deleteAllDocuments(collectionName);
          console.log(`Cleaned up ${collectionName}`);
        }
      } else {
        console.log(`Collection ${collectionName} is empty or doesn't exist`);
      }
    } catch (error) {
      // Collection doesn't exist, which is fine
      console.log(`Collection ${collectionName} doesn't exist`);
    }
  }

  /**
   * Delete all documents in a collection
   */
  private async deleteAllDocuments(collectionName: string): Promise<void> {
    try {
      const documents = await firestoreService.getCollection<{ id: string }>(collectionName);

      for (const doc of documents) {
        await firestoreService.deleteDocument(collectionName, doc.id);
      }
      
      console.log(`Deleted ${documents.length} documents from ${collectionName}`);
    } catch (error) {
      console.error(`Failed to delete documents from ${collectionName}:`, error);
    }
  }

  /**
   * Clean up orphaned documents (documents that reference non-existent users, etc.)
   */
  private async cleanupOrphanedDocuments(): Promise<void> {
    try {
      console.log('Checking for orphaned documents...');

      // Check for orphaned payment history
      await this.cleanupOrphanedPaymentHistory();

      // Check for orphaned subscriptions
      await this.cleanupOrphanedSubscriptions();

      // Check for orphaned user stats
      await this.cleanupOrphanedUserStats();

      console.log('Orphaned documents cleanup completed');
    } catch (error) {
      console.error('Failed to cleanup orphaned documents:', error);
    }
  }

  /**
   * Clean up payment history for non-existent users
   */
  private async cleanupOrphanedPaymentHistory(): Promise<void> {
    try {
      const paymentHistory = await firestoreService.getCollection<{ id: string; userId: string }>('payment_history');
      const users = await firestoreService.getCollection<{ id: string }>('users');
      const userIds = new Set(users.map((user) => user.id));

      let orphanedCount = 0;
      for (const payment of paymentHistory) {
        if (!userIds.has(payment.userId)) {
          await firestoreService.deleteDocument('payment_history', payment.id);
          orphanedCount++;
        }
      }

      if (orphanedCount > 0) {
        console.log(`Cleaned up ${orphanedCount} orphaned payment history records`);
      }
    } catch (error) {
      console.error('Failed to cleanup orphaned payment history:', error);
    }
  }

  /**
   * Clean up subscriptions for non-existent users
   */
  private async cleanupOrphanedSubscriptions(): Promise<void> {
    try {
      const subscriptions = await firestoreService.getCollection<{ id: string; userId: string }>('subscriptions');
      const users = await firestoreService.getCollection<{ id: string }>('users');
      const userIds = new Set(users.map((user) => user.id));

      let orphanedCount = 0;
      for (const subscription of subscriptions) {
        if (!userIds.has(subscription.userId)) {
          await firestoreService.deleteDocument('subscriptions', subscription.id);
          orphanedCount++;
        }
      }

      if (orphanedCount > 0) {
        console.log(`Cleaned up ${orphanedCount} orphaned subscription records`);
      }
    } catch (error) {
      console.error('Failed to cleanup orphaned subscriptions:', error);
    }
  }

  /**
   * Clean up user stats for non-existent users
   */
  private async cleanupOrphanedUserStats(): Promise<void> {
    try {
      const userStats = await firestoreService.getCollection<{ id: string; userId: string }>('user_stats');
      const users = await firestoreService.getCollection<{ id: string }>('users');
      const userIds = new Set(users.map((user) => user.id));

      let orphanedCount = 0;
      for (const stats of userStats) {
        if (!userIds.has(stats.userId)) {
          await firestoreService.deleteDocument('user_stats', stats.id);
          orphanedCount++;
        }
      }

      if (orphanedCount > 0) {
        console.log(`Cleaned up ${orphanedCount} orphaned user stats records`);
      }
    } catch (error) {
      console.error('Failed to cleanup orphaned user stats:', error);
    }
  }

  /**
   * Migrate old data to new V1.1 structure
   */
  async migrateToV1Structure(): Promise<void> {
    try {
      console.log('Starting V1.1 data migration...');

      // Migrate user subscription status to new structure
      await this.migrateUserSubscriptions();

      // Add V1.1 stats to existing users
      await this.addV1StatsToUsers();

      console.log('V1.1 data migration completed');
    } catch (error) {
      console.error('V1.1 data migration failed:', error);
      throw error;
    }
  }

  /**
   * Migrate user subscription status to new V1.1 structure
   */
  private async migrateUserSubscriptions(): Promise<void> {
    try {
      const users = await firestoreService.getCollection<{
        id: string;
        subscriptionStatus?: string;
        subscription?: string;
      }>('users');
      let migratedCount = 0;

      for (const user of users) {
        if (user.subscriptionStatus && !user.subscription) {
          // Migrate old subscription status to new structure
          const subscription = {
            id: `migrated_${user.id}_${Date.now()}`,
            userId: user.id,
            planId: this.mapOldSubscriptionStatus(user.subscriptionStatus),
            status: 'active',
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            autoRenew: true,
            trialUsed: false,
            createdAt: new Date(),
            updatedAt: new Date()
          };

          await firestoreService.addDocument('subscriptions', subscription);

          // Update user document
          await firestoreService.updateDocument('users', user.id, {
            subscription: subscription.id,
            ngondoCoins: 100, // Give new users some starting coins
            updatedAt: new Date()
          });

          migratedCount++;
        }
      }

      if (migratedCount > 0) {
        console.log(`Migrated ${migratedCount} user subscriptions to V1.1 structure`);
      }
    } catch (error) {
      console.error('Failed to migrate user subscriptions:', error);
    }
  }

  /**
   * Map old subscription status to new plan IDs
   */
  private mapOldSubscriptionStatus(oldStatus: string): string {
    const mapping: Record<string, string> = {
      'free': 'freemium',
      'premium': 'premium_monthly',
      'trial': 'premium_monthly' // Trial users get premium
    };

    return mapping[oldStatus] || 'freemium';
  }

  /**
   * Add V1.1 stats to existing users
   */
  private async addV1StatsToUsers(): Promise<void> {
    try {
      const users = await firestoreService.getCollection<{
        id: string;
        stats?: any;
      }>('users');
      let updatedCount = 0;

      for (const user of users) {
        if (user.stats && !user.stats.atlasExplorations) {
          // Add V1.1 stats to existing user stats
          const updatedStats = {
            ...user.stats,
            atlasExplorations: 0,
            encyclopediaEntries: 0,
            historicalSitesVisited: 0,
            arVrExperiences: 0,
            marketplacePurchases: 0,
            familyContributions: 0,
            ngondoCoinsEarned: 0,
            achievementsUnlocked: 0
          };

          await firestoreService.updateDocument('users', user.id, {
            stats: updatedStats,
            updatedAt: new Date()
          });

          updatedCount++;
        }
      }

      if (updatedCount > 0) {
        console.log(`Added V1.1 stats to ${updatedCount} users`);
      }
    } catch (error) {
      console.error('Failed to add V1.1 stats to users:', error);
    }
  }

  /**
   * Get cleanup statistics
   */
  async getCleanupStats(): Promise<{
    totalCollections: number;
    totalDocuments: number;
    orphanedDocuments: number;
    migrationNeeded: number;
  }> {
    try {
      const collections = [
        'users',
        'subscriptions',
        'payment_history',
        'receipts',
        'languages',
        'ethnicGroups',
        'historicalSites',
        'marketplaceItems',
        'arVrScenes',
        'rpgData',
        'aiSessions',
        'culturalRoutes'
      ];

      let totalDocuments = 0;
      let orphanedDocuments = 0;
      let migrationNeeded = 0;

      for (const collection of collections) {
        try {
          const documents = await firestoreService.getCollection<any>(collection);
          totalDocuments += documents.length;

          // Check for orphaned documents
          if (collection === 'payment_history' || collection === 'subscriptions') {
            const users = await firestoreService.getCollection<{ id: string }>('users');
            const userIds = new Set(users.map((user) => user.id));

            for (const doc of documents) {
              if (doc.userId && !userIds.has(doc.userId)) {
                orphanedDocuments++;
              }
            }
          }

          // Check for migration needed
          if (collection === 'users') {
            for (const user of documents) {
              if (user.subscriptionStatus && !user.subscription) {
                migrationNeeded++;
              }
            }
          }
        } catch (error) {
          // Collection doesn't exist
          console.log(`Collection ${collection} doesn't exist`);
        }
      }

      return {
        totalCollections: collections.length,
        totalDocuments,
        orphanedDocuments,
        migrationNeeded
      };
    } catch (error) {
      console.error('Failed to get cleanup stats:', error);
      return {
        totalCollections: 0,
        totalDocuments: 0,
        orphanedDocuments: 0,
        migrationNeeded: 0
      };
    }
  }
}

export const firebaseCleanupService = new FirebaseCleanupService();
