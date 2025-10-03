import { describe, it, expect, vi, beforeEach } from 'vitest';
import { firestoreService } from './firestore.service';
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';

// Mock Firebase Firestore
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  doc: vi.fn(),
  getDocs: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  getFirestore: vi.fn(),
}));

// Mock Firebase config
vi.mock('@/core/config/firebase.config', () => ({
  db: {},
}));

describe('FirestoreService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getDocuments', () => {
    it('should fetch documents without filters', async () => {
      const mockDocs = [
        { id: '1', data: () => ({ name: 'Test 1' }) },
        { id: '2', data: () => ({ name: 'Test 2' }) },
      ];

      vi.mocked(getDocs).mockResolvedValue({
        docs: mockDocs,
        empty: false,
        size: 2,
        metadata: {} as any,
        query: {} as any,
        forEach: vi.fn(),
      });

      const result = await firestoreService.getDocuments('testCollection');

      expect(collection).toHaveBeenCalledWith({}, 'testCollection');
      expect(result).toEqual([
        { id: '1', name: 'Test 1' },
        { id: '2', name: 'Test 2' },
      ]);
    });

    it('should fetch documents with where filters', async () => {
      const mockDocs = [
        { id: '1', data: () => ({ name: 'Test 1', category: 'A' }) },
      ];

      vi.mocked(getDocs).mockResolvedValue({
        docs: mockDocs,
        empty: false,
        size: 1,
        metadata: {} as any,
        query: {} as any,
        forEach: vi.fn(),
      });

      const result = await firestoreService.getDocuments('testCollection', {
        where: [['category', '==', 'A']]
      });

      expect(where).toHaveBeenCalledWith('category', '==', 'A');
      expect(query).toHaveBeenCalled();
      expect(result).toEqual([
        { id: '1', name: 'Test 1', category: 'A' },
      ]);
    });

    it('should fetch documents with orderBy', async () => {
      const mockDocs = [
        { id: '1', data: () => ({ name: 'Test 1', createdAt: new Date('2023-01-01') }) },
        { id: '2', data: () => ({ name: 'Test 2', createdAt: new Date('2023-01-02') }) },
      ];

      vi.mocked(getDocs).mockResolvedValue({
        docs: mockDocs,
        empty: false,
        size: 2,
        metadata: {} as any,
        query: {} as any,
        forEach: vi.fn(),
      });

      const result = await firestoreService.getDocuments('testCollection', {
        orderBy: [['createdAt', 'desc']]
      });

      expect(orderBy).toHaveBeenCalledWith('createdAt', 'desc');
      expect(result).toHaveLength(2);
    });

    it('should fetch documents with limit', async () => {
      const mockDocs = [
        { id: '1', data: () => ({ name: 'Test 1' }) },
      ];

      vi.mocked(getDocs).mockResolvedValue({
        docs: mockDocs,
        empty: false,
        size: 1,
        metadata: {} as any,
        query: {} as any,
        forEach: vi.fn(),
      });

      const result = await firestoreService.getDocuments('testCollection', {
        limit: 10
      });

      expect(limit).toHaveBeenCalledWith(10);
      expect(result).toHaveLength(1);
    });

    it('should handle empty results', async () => {
      vi.mocked(getDocs).mockResolvedValue({
        docs: [],
        empty: true,
        size: 0,
        metadata: {} as any,
        query: {} as any,
        forEach: vi.fn(),
      });

      const result = await firestoreService.getDocuments('testCollection');

      expect(result).toEqual([]);
    });

    it('should handle errors', async () => {
      const error = new Error('Firestore error');
      vi.mocked(getDocs).mockRejectedValue(error);

      await expect(firestoreService.getDocuments('testCollection')).rejects.toThrow('Firestore error');
    });
  });

  describe('getDocument', () => {
    it('should fetch a single document', async () => {
      const mockDoc = {
        id: '1',
        data: () => ({ name: 'Test Document' }),
        exists: () => true,
      };

      vi.mocked(getDocs).mockResolvedValue({
        docs: [mockDoc],
        empty: false,
        size: 1,
        metadata: {} as any,
        query: {} as any,
        forEach: vi.fn(),
      });

      const result = await firestoreService.getDocument('testCollection', '1');

      expect(doc).toHaveBeenCalledWith({}, 'testCollection', '1');
      expect(result).toEqual({ id: '1', name: 'Test Document' });
    });

    it('should return null for non-existent document', async () => {
      vi.mocked(getDocs).mockResolvedValue({
        docs: [],
        empty: true,
        size: 0,
        metadata: {} as any,
        query: {} as any,
        forEach: vi.fn(),
      });

      const result = await firestoreService.getDocument('testCollection', 'non-existent');

      expect(result).toBeNull();
    });
  });

  describe('addDocument', () => {
    it('should add a new document', async () => {
      const documentData = { name: 'New Document', category: 'A' };
      vi.mocked(addDoc).mockResolvedValue({ id: 'new-id' } as any);

      const result = await firestoreService.addDocument('testCollection', documentData);

      expect(collection).toHaveBeenCalledWith({}, 'testCollection');
      expect(addDoc).toHaveBeenCalledWith(expect.anything(), documentData);
      expect(result).toBe('new-id');
    });

    it('should handle add document errors', async () => {
      const error = new Error('Add document error');
      vi.mocked(addDoc).mockRejectedValue(error);

      await expect(firestoreService.addDocument('testCollection', {})).rejects.toThrow('Add document error');
    });
  });

  describe('updateDocument', () => {
    it('should update an existing document', async () => {
      const updateData = { name: 'Updated Document' };
      vi.mocked(updateDoc).mockResolvedValue(undefined);

      await firestoreService.updateDocument('testCollection', '1', updateData);

      expect(doc).toHaveBeenCalledWith({}, 'testCollection', '1');
      expect(updateDoc).toHaveBeenCalledWith(expect.anything(), updateData);
    });

    it('should handle update document errors', async () => {
      const error = new Error('Update document error');
      vi.mocked(updateDoc).mockRejectedValue(error);

      await expect(firestoreService.updateDocument('testCollection', '1', {})).rejects.toThrow('Update document error');
    });
  });

  describe('deleteDocument', () => {
    it('should delete a document', async () => {
      vi.mocked(deleteDoc).mockResolvedValue(undefined);

      await firestoreService.deleteDocument('testCollection', '1');

      expect(doc).toHaveBeenCalledWith({}, 'testCollection', '1');
      expect(deleteDoc).toHaveBeenCalledWith(expect.anything());
    });

    it('should handle delete document errors', async () => {
      const error = new Error('Delete document error');
      vi.mocked(deleteDoc).mockRejectedValue(error);

      await expect(firestoreService.deleteDocument('testCollection', '1')).rejects.toThrow('Delete document error');
    });
  });

  describe('getDocs (alias)', () => {
    it('should call getDocuments with same parameters', async () => {
      const mockDocs = [
        { id: '1', data: () => ({ name: 'Test 1' }) },
      ];

      vi.mocked(getDocs).mockResolvedValue({
        docs: mockDocs,
        empty: false,
        size: 1,
        metadata: {} as any,
        query: {} as any,
        forEach: vi.fn(),
      });

      const result = await firestoreService.getDocs('testCollection', {
        where: [['category', '==', 'A']]
      });

      expect(result).toEqual([
        { id: '1', name: 'Test 1' },
      ]);
    });
  });

  describe('collection query builder', () => {
    it('should create a query builder', () => {
      const queryBuilder = firestoreService.collection('testCollection');
      const whereClause = queryBuilder.where('field', '==', 'value');

      expect(whereClause).toEqual({
        collectionName: 'testCollection',
        filters: [{ field: 'field', operator: '==', value: 'value' }]
      });
    });
  });
});
