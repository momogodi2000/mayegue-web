import { describe, it, expect, vi, beforeEach } from 'vitest';
import { indexedDBService } from './indexedDb.service';

// Mock IndexedDB
const mockDB = {
  transaction: vi.fn(),
  objectStoreNames: {
    contains: vi.fn(),
  },
  createObjectStore: vi.fn(),
};

const mockTransaction = {
  objectStore: vi.fn(),
};

const mockObjectStore = {
  add: vi.fn(),
  put: vi.fn(),
  get: vi.fn(),
  delete: vi.fn(),
  getAll: vi.fn(),
  openCursor: vi.fn(),
  createIndex: vi.fn(),
  index: vi.fn(),
};

const mockRequest = {
  result: null,
  error: null,
  onsuccess: null,
  onerror: null,
  addEventListener: vi.fn(),
};

// Mock openDB from idb
vi.mock('idb', () => ({
  openDB: vi.fn(() => Promise.resolve(mockDB)),
}));

describe('IndexedDBService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDB.transaction.mockReturnValue(mockTransaction);
    mockTransaction.objectStore.mockReturnValue(mockObjectStore);
  });

  describe('initialize', () => {
    it('should initialize the database', async () => {
      await indexedDBService.initialize();
      
      expect(mockDB.createObjectStore).toHaveBeenCalled();
    });
  });

  describe('put', () => {
    it('should store data in IndexedDB', async () => {
      const testData = { id: '1', name: 'Test' };
      mockRequest.result = undefined;
      mockObjectStore.put.mockReturnValue(mockRequest);

      // Mock successful request
      setTimeout(() => {
        if (mockRequest.onsuccess) {
          mockRequest.onsuccess({} as any);
        }
      }, 0);

      await indexedDBService.put('testStore', testData);

      expect(mockObjectStore.put).toHaveBeenCalledWith(testData);
    });

    it('should handle put errors', async () => {
      const testData = { id: '1', name: 'Test' };
      const error = new Error('Put failed');
      mockRequest.error = error;
      mockObjectStore.put.mockReturnValue(mockRequest);

      // Mock failed request
      setTimeout(() => {
        if (mockRequest.onerror) {
          mockRequest.onerror({} as any);
        }
      }, 0);

      await expect(indexedDBService.put('testStore', testData)).rejects.toThrow('Put failed');
    });
  });

  describe('get', () => {
    it('should retrieve data from IndexedDB', async () => {
      const testData = { id: '1', name: 'Test' };
      mockRequest.result = testData;
      mockObjectStore.get.mockReturnValue(mockRequest);

      // Mock successful request
      setTimeout(() => {
        if (mockRequest.onsuccess) {
          mockRequest.onsuccess({} as any);
        }
      }, 0);

      const result = await indexedDBService.get('testStore', '1');

      expect(mockObjectStore.get).toHaveBeenCalledWith('1');
      expect(result).toEqual(testData);
    });

    it('should return undefined for non-existent data', async () => {
      mockRequest.result = undefined;
      mockObjectStore.get.mockReturnValue(mockRequest);

      // Mock successful request
      setTimeout(() => {
        if (mockRequest.onsuccess) {
          mockRequest.onsuccess({} as any);
        }
      }, 0);

      const result = await indexedDBService.get('testStore', 'non-existent');

      expect(result).toBeUndefined();
    });
  });

  describe('delete', () => {
    it('should delete data from IndexedDB', async () => {
      mockRequest.result = undefined;
      mockObjectStore.delete.mockReturnValue(mockRequest);

      // Mock successful request
      setTimeout(() => {
        if (mockRequest.onsuccess) {
          mockRequest.onsuccess({} as any);
        }
      }, 0);

      await indexedDBService.delete('testStore', '1');

      expect(mockObjectStore.delete).toHaveBeenCalledWith('1');
    });
  });

  describe('getAll', () => {
    it('should retrieve all data from IndexedDB', async () => {
      const testData = [
        { id: '1', name: 'Test 1' },
        { id: '2', name: 'Test 2' },
      ];
      mockRequest.result = testData;
      mockObjectStore.getAll.mockReturnValue(mockRequest);

      // Mock successful request
      setTimeout(() => {
        if (mockRequest.onsuccess) {
          mockRequest.onsuccess({} as any);
        }
      }, 0);

      const result = await indexedDBService.getAll('testStore');

      expect(mockObjectStore.getAll).toHaveBeenCalled();
      expect(result).toEqual(testData);
    });
  });

  describe('batchPut', () => {
    it('should store multiple items in batch', async () => {
      const testData = [
        { id: '1', name: 'Test 1' },
        { id: '2', name: 'Test 2' },
      ];

      mockRequest.result = undefined;
      mockObjectStore.put.mockReturnValue(mockRequest);

      // Mock successful requests
      setTimeout(() => {
        if (mockRequest.onsuccess) {
          mockRequest.onsuccess({} as any);
        }
      }, 0);

      await indexedDBService.batchPut('testStore', testData);

      expect(mockObjectStore.put).toHaveBeenCalledTimes(2);
      expect(mockObjectStore.put).toHaveBeenCalledWith(testData[0]);
      expect(mockObjectStore.put).toHaveBeenCalledWith(testData[1]);
    });
  });

  describe('query', () => {
    it('should query data by index', async () => {
      const testData = [
        { id: '1', name: 'Test 1', category: 'A' },
        { id: '2', name: 'Test 2', category: 'B' },
      ];

      const mockCursor = {
        value: testData[0],
        continue: vi.fn(),
      };

      mockRequest.result = mockCursor;
      mockObjectStore.index.mockReturnValue(mockObjectStore);
      mockObjectStore.openCursor.mockReturnValue(mockRequest);

      // Mock successful request
      setTimeout(() => {
        if (mockRequest.onsuccess) {
          mockRequest.onsuccess({} as any);
        }
      }, 0);

      const result = await indexedDBService.query('testStore', 'category', 'A');

      expect(mockObjectStore.index).toHaveBeenCalledWith('category');
      expect(result).toEqual([testData[0]]);
    });
  });

  describe('getStorageSize', () => {
    it('should calculate storage size for all stores', async () => {
      const mockEstimate = {
        usage: 1024,
        quota: 10240,
      };

      // Mock navigator.storage.estimate
      Object.defineProperty(navigator, 'storage', {
        value: {
          estimate: vi.fn().mockResolvedValue(mockEstimate),
        },
        writable: true,
      });

      const result = await indexedDBService.getStorageSize();

      expect(result).toEqual({
        usage: 1024,
        quota: 10240,
        usagePercentage: 10,
      });
    });
  });

  describe('setCache and getCache', () => {
    it('should set and get cached data', async () => {
      const cacheData = { key: 'test', data: 'cached data', expires: Date.now() + 60000 };
      
      mockRequest.result = undefined;
      mockObjectStore.put.mockReturnValue(mockRequest);

      // Mock successful put request
      setTimeout(() => {
        if (mockRequest.onsuccess) {
          mockRequest.onsuccess({} as any);
        }
      }, 0);

      await indexedDBService.setCache('test', 'cached data', 60000);

      expect(mockObjectStore.put).toHaveBeenCalledWith(expect.objectContaining({
        key: 'test',
        data: 'cached data',
        expires: expect.any(Number),
      }));
    });

    it('should return cached data if not expired', async () => {
      const cacheData = { 
        key: 'test', 
        data: 'cached data', 
        expires: Date.now() + 60000 
      };
      
      mockRequest.result = cacheData;
      mockObjectStore.get.mockReturnValue(mockRequest);

      // Mock successful get request
      setTimeout(() => {
        if (mockRequest.onsuccess) {
          mockRequest.onsuccess({} as any);
        }
      }, 0);

      const result = await indexedDBService.getCache('test');

      expect(result).toBe('cached data');
    });

    it('should return null for expired cache', async () => {
      const cacheData = { 
        key: 'test', 
        data: 'cached data', 
        expires: Date.now() - 60000 // Expired
      };
      
      mockRequest.result = cacheData;
      mockObjectStore.get.mockReturnValue(mockRequest);

      // Mock successful get request
      setTimeout(() => {
        if (mockRequest.onsuccess) {
          mockRequest.onsuccess({} as any);
        }
      }, 0);

      const result = await indexedDBService.getCache('test');

      expect(result).toBeNull();
    });
  });

  describe('clearExpiredCache', () => {
    it('should clear expired cache entries', async () => {
      const mockCursor = {
        value: { key: 'expired', expires: Date.now() - 60000 },
        delete: vi.fn(),
        continue: vi.fn(),
      };

      mockRequest.result = mockCursor;
      mockObjectStore.index.mockReturnValue(mockObjectStore);
      mockObjectStore.openCursor.mockReturnValue(mockRequest);

      // Mock successful request
      setTimeout(() => {
        if (mockRequest.onsuccess) {
          mockRequest.onsuccess({} as any);
        }
      }, 0);

      await indexedDBService.clearExpiredCache();

      expect(mockObjectStore.index).toHaveBeenCalledWith('expires');
      expect(mockCursor.delete).toHaveBeenCalled();
    });
  });
});
