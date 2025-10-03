/**
 * IndexedDB Service for Offline Data Storage
 */

interface DatabaseConfig {
  name: string;
  version: number;
  stores: {
    [key: string]: {
      keyPath: string;
      autoIncrement?: boolean;
      indexes?: { name: string; keyPath: string | string[] }[];
    };
  };
}

const DB_CONFIG: DatabaseConfig = {
  name: 'MaYegueOfflineDB',
  version: 1,
  stores: {
    lessons: {
      keyPath: 'id',
      indexes: [
        { name: 'language', keyPath: 'language' },
        { name: 'level', keyPath: 'level' },
        { name: 'category', keyPath: 'category' }
      ]
    },
    dictionary: {
      keyPath: 'id',
      indexes: [
        { name: 'language', keyPath: 'language' },
        { name: 'word', keyPath: 'word' },
        { name: 'translation', keyPath: 'translation' }
      ]
    },
    userProgress: {
      keyPath: 'id',
      indexes: [
        { name: 'userId', keyPath: 'userId' },
        { name: 'lessonId', keyPath: 'lessonId' },
        { name: 'completed', keyPath: 'completed' }
      ]
    },
    gamification: {
      keyPath: 'id',
      indexes: [
        { name: 'userId', keyPath: 'userId' },
        { name: 'type', keyPath: 'type' }
      ]
    },
    syncQueue: {
      keyPath: 'id',
      autoIncrement: true,
      indexes: [
        { name: 'collection', keyPath: 'collection' },
        { name: 'operation', keyPath: 'operation' },
        { name: 'timestamp', keyPath: 'timestamp' }
      ]
    },
    settings: {
      keyPath: 'key'
    },
    cache: {
      keyPath: 'key',
      indexes: [
        { name: 'expires', keyPath: 'expires' }
      ]
    }
  }
};

export class IndexedDBService {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;

  async initialize(): Promise<void> {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version);

      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('✅ IndexedDB initialized successfully');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores
        Object.entries(DB_CONFIG.stores).forEach(([storeName, config]) => {
          if (!db.objectStoreNames.contains(storeName)) {
            const store = db.createObjectStore(storeName, {
              keyPath: config.keyPath,
              autoIncrement: config.autoIncrement
            });

            // Create indexes
            if (config.indexes) {
              config.indexes.forEach(index => {
                if (Array.isArray(index.keyPath)) {
                  store.createIndex(index.name, index.keyPath);
                } else {
                  store.createIndex(index.name, index.keyPath);
                }
              });
            }
          }
        });
      };
    });

    return this.initPromise;
  }

  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.initialize();
    }
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    return this.db;
  }

  // Generic CRUD operations
  async get<T>(storeName: string, key: string): Promise<T | undefined> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async put<T>(storeName: string, data: T): Promise<void> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName: string, key: string): Promise<void> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear(storeName: string): Promise<void> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Query operations
  async query<T>(
    storeName: string, 
    indexName: string, 
    value: any
  ): Promise<T[]> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(value);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async queryRange<T>(
    storeName: string,
    indexName: string,
    range: IDBKeyRange
  ): Promise<T[]> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(range);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Batch operations
  async batchPut<T>(storeName: string, items: T[]): Promise<void> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      let completed = 0;
      const total = items.length;

      if (total === 0) {
        resolve();
        return;
      }

      items.forEach(item => {
        const request = store.put(item);
        request.onsuccess = () => {
          completed++;
          if (completed === total) {
            resolve();
          }
        };
        request.onerror = () => reject(request.error);
      });
    });
  }

  // Cache operations
  async setCache(key: string, data: any, ttl: number = 3600000): Promise<void> {
    const expires = Date.now() + ttl;
    await this.put('cache', { key, data, expires });
  }

  async getCache<T>(key: string): Promise<T | null> {
    const cached = await this.get<{ data: T; expires: number }>('cache', key);
    if (!cached) return null;
    
    if (Date.now() > cached.expires) {
      await this.delete('cache', key);
      return null;
    }
    
    return cached.data;
  }

  async clearExpiredCache(): Promise<void> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      const index = store.index('expires');
      const range = IDBKeyRange.upperBound(Date.now());
      const request = index.openCursor(range);

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Storage management
  async getStorageSize(): Promise<Record<string, number>> {
    const db = await this.ensureDB();
    const sizes: Record<string, number> = {};

    for (const storeName of Array.from(db.objectStoreNames)) {
      const count = await this.getCount(storeName);
      sizes[storeName] = count;
    }

    return sizes;
  }

  private async getCount(storeName: string): Promise<number> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.count();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async exportData(): Promise<string> {
    const data: Record<string, any[]> = {};
    
    for (const storeName of Object.keys(DB_CONFIG.stores)) {
      data[storeName] = await this.getAll(storeName);
    }

    return JSON.stringify(data, null, 2);
  }

  async importData(json: string): Promise<void> {
    const data = JSON.parse(json);
    
    for (const [storeName, items] of Object.entries(data)) {
      if (Array.isArray(items)) {
        await this.batchPut(storeName, items);
      }
    }
  }

  async clearAllData(): Promise<void> {
    for (const storeName of Object.keys(DB_CONFIG.stores)) {
      await this.clear(storeName);
    }
  }
}

export const indexedDBService = new IndexedDBService();