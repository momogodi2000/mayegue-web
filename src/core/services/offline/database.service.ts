/* eslint-disable @typescript-eslint/no-explicit-any */
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import {
  SyncStatus,
  LessonRecord,
  DictionaryRecord,
  UserProgressRecord,
  GamificationRecord,
  SettingRecord,
  SyncQueueRecord
} from './types';

// Database Schema
interface MayegueDB extends DBSchema {
  lessons: {
    key: string;
    value: LessonRecord;
    indexes: { 
      'by-language': string;
      'by-difficulty': string;
      'by-sync-status': SyncStatus;
    };
  };
  
  dictionary: {
    key: string;
    value: DictionaryRecord;
    indexes: { 
      'by-language': string;
      'by-category': string;
      'by-word': string;
      'by-sync-status': SyncStatus;
    };
  };
  
  userProgress: {
    key: string;
    value: UserProgressRecord;
    indexes: { 
      'by-user': string;
      'by-lesson': string;
      'by-sync-status': SyncStatus;
    };
  };
  
  gamification: {
    key: string;
    value: GamificationRecord;
    indexes: { 
      'by-user': string;
      'by-level': number;
      'by-sync-status': SyncStatus;
    };
  };
  
  settings: {
    key: string;
    value: SettingRecord;
  };
  
  syncQueue: {
    key: string;
    value: SyncQueueRecord;
    indexes: { 
      'by-timestamp': number;
      'by-collection': string;
    };
  };
}

export class DatabaseService {
  private db: IDBPDatabase<MayegueDB> | null = null;
  private readonly dbName = 'mayegue-db';
  private readonly dbVersion = 1;

  async initialize(): Promise<void> {
    try {
      this.db = await openDB<MayegueDB>(this.dbName, this.dbVersion, {
        upgrade(db) {
          // Lessons store
          const lessonsStore = db.createObjectStore('lessons', { keyPath: 'id' });
          lessonsStore.createIndex('by-language', 'language');
          lessonsStore.createIndex('by-difficulty', 'difficulty');
          lessonsStore.createIndex('by-sync-status', 'syncStatus');

          // Dictionary store
          const dictionaryStore = db.createObjectStore('dictionary', { keyPath: 'id' });
          dictionaryStore.createIndex('by-language', 'language');
          dictionaryStore.createIndex('by-category', 'category');
          dictionaryStore.createIndex('by-word', 'word');
          dictionaryStore.createIndex('by-sync-status', 'syncStatus');

          // User Progress store
          const progressStore = db.createObjectStore('userProgress', { keyPath: 'id' });
          progressStore.createIndex('by-user', 'userId');
          progressStore.createIndex('by-lesson', 'lessonId');
          progressStore.createIndex('by-sync-status', 'syncStatus');

          // Gamification store
          const gamificationStore = db.createObjectStore('gamification', { keyPath: 'id' });
          gamificationStore.createIndex('by-user', 'userId');
          gamificationStore.createIndex('by-level', 'level');
          gamificationStore.createIndex('by-sync-status', 'syncStatus');

          // Settings store
          db.createObjectStore('settings', { keyPath: 'key' });

          // Sync Queue store
          const syncQueueStore = db.createObjectStore('syncQueue', { keyPath: 'id' });
          syncQueueStore.createIndex('by-timestamp', 'timestamp');
          syncQueueStore.createIndex('by-collection', 'collection');
        },
      });

      console.log('IndexedDB initialized successfully');
    } catch (error) {
      console.error('Failed to initialize IndexedDB:', error);
      throw error;
    }
  }

  private ensureDB(): IDBPDatabase<MayegueDB> {
    if (!this.db) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this.db;
  }

  // Generic CRUD operations
  async put<T extends keyof MayegueDB>(
    storeName: T,
    data: MayegueDB[T]['value']
  ): Promise<void> {
    const db = this.ensureDB();
    await db.put(storeName as any, data);
  }

  async get<T extends keyof MayegueDB>(
    storeName: T,
    key: MayegueDB[T]['key']
  ): Promise<MayegueDB[T]['value'] | undefined> {
    const db = this.ensureDB();
    return db.get(storeName as any, key);
  }

  async getAll<T extends keyof MayegueDB>(
    storeName: T
  ): Promise<MayegueDB[T]['value'][]> {
    const db = this.ensureDB();
    return db.getAll(storeName as any);
  }

  async delete<T extends keyof MayegueDB>(
    storeName: T,
    key: MayegueDB[T]['key']
  ): Promise<void> {
    const db = this.ensureDB();
    await db.delete(storeName as any, key);
  }

  async clear<T extends keyof MayegueDB>(storeName: T): Promise<void> {
    const db = this.ensureDB();
    await db.clear(storeName as any);
  }

  // Lessons operations
  async saveLessons(lessons: MayegueDB['lessons']['value'][]): Promise<void> {
    const db = this.ensureDB();
    const tx = db.transaction('lessons', 'readwrite');
    
    await Promise.all([
      ...lessons.map(lesson => tx.store.put(lesson)),
      tx.done
    ]);
  }

  async getLessonsByLanguage(language: string): Promise<MayegueDB['lessons']['value'][]> {
    const db = this.ensureDB();
    return db.getAllFromIndex('lessons', 'by-language', language);
  }

  async getLessonsByDifficulty(difficulty: string): Promise<MayegueDB['lessons']['value'][]> {
    const db = this.ensureDB();
    return db.getAllFromIndex('lessons', 'by-difficulty', difficulty);
  }

  async updateLessonProgress(lessonId: string, progress: number): Promise<void> {
    const lesson = await this.get('lessons', lessonId);
    if (lesson) {
      lesson.progress = progress;
      lesson.lastAccessed = Date.now();
      lesson.syncStatus = 'pending';
      await this.put('lessons', lesson);
    }
  }

  // Dictionary operations
  async saveDictionaryEntries(entries: MayegueDB['dictionary']['value'][]): Promise<void> {
    const db = this.ensureDB();
    const tx = db.transaction('dictionary', 'readwrite');
    
    await Promise.all([
      ...entries.map(entry => tx.store.put(entry)),
      tx.done
    ]);
  }

  async searchDictionary(query: string, language?: string): Promise<MayegueDB['dictionary']['value'][]> {
    const db = this.ensureDB();
    const allEntries = language 
      ? await db.getAllFromIndex('dictionary', 'by-language', language)
      : await db.getAll('dictionary');
    
    const normalizedQuery = query.toLowerCase();
    return allEntries.filter(entry => 
      entry.word.toLowerCase().includes(normalizedQuery) ||
      entry.translation.toLowerCase().includes(normalizedQuery)
    );
  }

  async getDictionaryByCategory(category: string): Promise<MayegueDB['dictionary']['value'][]> {
    const db = this.ensureDB();
    return db.getAllFromIndex('dictionary', 'by-category', category);
  }

  // User Progress operations
  async saveUserProgress(progress: MayegueDB['userProgress']['value']): Promise<void> {
    progress.syncStatus = 'pending';
    await this.put('userProgress', progress);
  }

  async getUserProgressByLesson(userId: string, lessonId: string): Promise<MayegueDB['userProgress']['value'] | undefined> {
    const db = this.ensureDB();
    const allProgress = await db.getAllFromIndex('userProgress', 'by-user', userId);
    return allProgress.find(p => p.lessonId === lessonId);
  }

  async getAllUserProgress(userId: string): Promise<MayegueDB['userProgress']['value'][]> {
    const db = this.ensureDB();
    return db.getAllFromIndex('userProgress', 'by-user', userId);
  }

  // Gamification operations
  async saveGamificationData(data: MayegueDB['gamification']['value']): Promise<void> {
    data.syncStatus = 'pending';
    await this.put('gamification', data);
  }

  async getUserGamificationData(userId: string): Promise<MayegueDB['gamification']['value'] | undefined> {
    const db = this.ensureDB();
    const allData = await db.getAllFromIndex('gamification', 'by-user', userId);
    return allData[0];
  }

  // Settings operations
  async saveSetting(key: string, value: unknown): Promise<void> {
    await this.put('settings', {
      key,
      value,
      lastModified: Date.now()
    });
  }

  async getSetting(key: string): Promise<unknown> {
    const setting = await this.get('settings', key);
    return setting?.value;
  }

  async getAllSettings(): Promise<Record<string, unknown>> {
    const settings = await this.getAll('settings');
    return settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, unknown>);
  }

  // Sync Queue operations
  async addToSyncQueue(
    operation: 'create' | 'update' | 'delete',
    collection: string,
    documentId: string,
    data: Record<string, unknown>
  ): Promise<void> {
    const queueItem: SyncQueueRecord = {
      id: `${collection}_${documentId}_${Date.now()}`,
      operation,
      collection,
      documentId,
      data,
      timestamp: Date.now(),
      retryCount: 0
    };

    await this.put('syncQueue', queueItem);
  }

  async getSyncQueue(): Promise<MayegueDB['syncQueue']['value'][]> {
    const db = this.ensureDB();
    return db.getAllFromIndex('syncQueue', 'by-timestamp');
  }

  async removeSyncQueueItem(id: string): Promise<void> {
    await this.delete('syncQueue', id);
  }

  async updateSyncQueueItem(id: string, updates: Partial<MayegueDB['syncQueue']['value']>): Promise<void> {
    const item = await this.get('syncQueue', id);
    if (item) {
      Object.assign(item, updates);
      await this.put('syncQueue', item);
    }
  }

  // Utility operations
  async getStorageSize(): Promise<Record<string, number>> {
    const stores = ['lessons', 'dictionary', 'userProgress', 'gamification', 'settings', 'syncQueue'] as const;
    const sizes: Record<string, number> = {};

    for (const store of stores) {
      const data = await this.getAll(store);
      sizes[store] = new Blob([JSON.stringify(data)]).size;
    }

    return sizes;
  }

  async clearAllData(): Promise<void> {
    const stores = ['lessons', 'dictionary', 'userProgress', 'gamification', 'settings', 'syncQueue'] as const;
    
    await Promise.all(stores.map(store => this.clear(store)));
  }

  async exportData(): Promise<string> {
    const data = {
      lessons: await this.getAll('lessons'),
      dictionary: await this.getAll('dictionary'),
      userProgress: await this.getAll('userProgress'),
      gamification: await this.getAll('gamification'),
      settings: await this.getAll('settings'),
      exportDate: new Date().toISOString()
    };

    return JSON.stringify(data, null, 2);
  }

  async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.lessons) await this.saveLessons(data.lessons);
      if (data.dictionary) await this.saveDictionaryEntries(data.dictionary);
      if (data.userProgress) {
        for (const progress of data.userProgress) {
          await this.saveUserProgress(progress);
        }
      }
      if (data.gamification) {
        for (const gamData of data.gamification) {
          await this.saveGamificationData(gamData);
        }
      }
      if (data.settings) {
        for (const setting of data.settings) {
          await this.saveSetting(setting.key, setting.value);
        }
      }

      console.log('Data imported successfully');
    } catch (error) {
      console.error('Failed to import data:', error);
      throw error;
    }
  }

  // Check data freshness
  async isDataStale(collection: string, maxAge: number = 24 * 60 * 60 * 1000): Promise<boolean> {
    const lastSync = await this.getSetting(`${collection}_last_sync`) as number;
    if (!lastSync) return true;
    
    return Date.now() - lastSync > maxAge;
  }

  async markDataSynced(collection: string): Promise<void> {
    await this.saveSetting(`${collection}_last_sync`, Date.now());
  }

  // Get pending sync items
  async getPendingSyncItems(): Promise<MayegueDB['syncQueue']['value'][]> {
    return this.getSyncQueue();
  }

  async getUnsyncedItems(collection: 'lessons' | 'dictionary' | 'userProgress' | 'gamification'): Promise<(LessonRecord | DictionaryRecord | UserProgressRecord | GamificationRecord)[]> {
    const db = this.ensureDB();
    
    try {
      switch (collection) {
        case 'lessons':
          return await db.getAllFromIndex('lessons', 'by-sync-status', 'pending');
        case 'dictionary':
          return await db.getAllFromIndex('dictionary', 'by-sync-status', 'pending');
        case 'userProgress':
          return await db.getAllFromIndex('userProgress', 'by-sync-status', 'pending');
        case 'gamification':
          return await db.getAllFromIndex('gamification', 'by-sync-status', 'pending');
        default:
          return [];
      }
    } catch {
      // If index doesn't exist, return empty array
      return [];
    }
  }
}

// Export singleton instance
export const databaseService = new DatabaseService();