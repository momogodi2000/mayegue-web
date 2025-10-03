import { indexedDBService } from './indexedDb.service';

export class DatabaseService {
  async initialize(): Promise<void> {
    await indexedDBService.initialize();
  }

  async getSetting(key: string): Promise<unknown> {
    return await indexedDBService.get('settings', key);
  }

  async saveSetting(key: string, value: unknown): Promise<void> {
    await indexedDBService.put('settings', { key, value });
  }

  // Generic store helpers
  async getAll(store: string): Promise<any[]> {
    return await indexedDBService.getAll(store);
  }

  async get(store: string, id: string): Promise<any | undefined> {
    return await indexedDBService.get(store, id);
  }

  async delete(store: string, id: string): Promise<void> {
    await indexedDBService.delete(store, id);
  }

  // Domain helpers
  async saveLessons(lessons: any[]): Promise<void> {
    await indexedDBService.batchPut('lessons', lessons);
  }

  async markDataSynced(collection: string): Promise<void> {
    // Mark all items in sync queue for this collection as synced
    const syncItems = await indexedDBService.query('syncQueue', 'collection', collection);
    for (const item of syncItems) {
      await indexedDBService.delete('syncQueue', (item as any).id);
    }
  }

  async saveDictionaryEntries(entries: any[]): Promise<void> {
    await indexedDBService.batchPut('dictionary', entries);
  }

  async searchDictionary(query: string, language?: string): Promise<any[]> {
    if (language) {
      const languageEntries = await indexedDBService.query('dictionary', 'language', language);
      return languageEntries.filter((entry: any) => 
        entry.word.toLowerCase().includes(query.toLowerCase()) ||
        entry.translation.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    const allEntries = await indexedDBService.getAll('dictionary');
    return allEntries.filter((entry: any) => 
      entry.word.toLowerCase().includes(query.toLowerCase()) ||
      entry.translation.toLowerCase().includes(query.toLowerCase())
    );
  }

  async getLessonsByLanguage(language: string): Promise<any[]> {
    return await indexedDBService.query('lessons', 'language', language);
  }

  async saveUserProgress(progress: any): Promise<void> {
    await indexedDBService.put('userProgress', progress);
  }

  // Sync queue helpers
  async getSyncQueue(): Promise<any[]> {
    return await indexedDBService.getAll('syncQueue');
  }

  async removeSyncQueueItem(id: string): Promise<void> {
    await indexedDBService.delete('syncQueue', id);
  }

  async updateSyncQueueItem(id: string, updates: Record<string, unknown>): Promise<void> {
    const item = await indexedDBService.get('syncQueue', id);
    if (item) {
      await indexedDBService.put('syncQueue', { ...item, ...updates });
    }
  }

  async getUnsyncedItems(store: string): Promise<any[]> {
    return await indexedDBService.query('syncQueue', 'collection', store);
  }

  async saveGamificationData(record: any): Promise<void> {
    await indexedDBService.put('gamification', record);
  }

  // Storage helpers
  async getStorageSize(): Promise<Record<string, number>> {
    return await indexedDBService.getStorageSize();
  }

  async exportData(): Promise<string> {
    return await indexedDBService.exportData();
  }

  async importData(json: string): Promise<void> {
    await indexedDBService.importData(json);
  }

  async clearAllData(): Promise<void> {
    await indexedDBService.clearAllData();
  }

  // Cache helpers
  async setCache(key: string, data: any, ttl?: number): Promise<void> {
    await indexedDBService.setCache(key, data, ttl);
  }

  async getCache<T>(key: string): Promise<T | null> {
    return await indexedDBService.getCache<T>(key);
  }

  async clearExpiredCache(): Promise<void> {
    await indexedDBService.clearExpiredCache();
  }
}

export const databaseService = new DatabaseService();
