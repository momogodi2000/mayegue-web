import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  endBefore,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  runTransaction,
  QueryConstraint,
  DocumentSnapshot
} from 'firebase/firestore';
import { db } from '@/core/config/firebase.config';

export interface QueryOptions {
  orderByField?: string;
  orderDirection?: 'asc' | 'desc';
  limitCount?: number;
  startAfterDoc?: any;
  endBeforeDoc?: any;
  filters?: Array<{
    field: string;
    operator: '==' | '!=' | '<' | '<=' | '>' | '>=' | 'array-contains' | 'in' | 'not-in' | 'array-contains-any';
    value: any;
  }>;
}

export interface PaginationOptions {
  pageSize: number;
  lastDoc?: any;
  firstDoc?: any;
  direction?: 'next' | 'prev';
}

export interface CollectionResult<T> {
  documents: T[];
  hasMore: boolean;
  total?: number;
  lastDoc?: any;
  firstDoc?: any;
}

class FirestoreService {
  /**
   * Create a new document
   */
  async create<T extends Record<string, any>>(
    collectionPath: string,
    data: T,
    docId?: string
  ): Promise<{ id: string; error: string | null }> {
    try {
      const timestamp = serverTimestamp();
      const docData = {
        ...data,
        createdAt: timestamp,
        updatedAt: timestamp
      };

      if (docId) {
        await setDoc(doc(db, collectionPath, docId), docData);
        return { id: docId, error: null };
      } else {
        const docRef = await addDoc(collection(db, collectionPath), docData);
        return { id: docRef.id, error: null };
      }
    } catch (error) {
      console.error('Error creating document:', error);
      return { id: '', error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Get a single document by ID
   */
  async getById<T>(
    collectionPath: string,
    docId: string
  ): Promise<{ document: T | null; error: string | null }> {
    try {
      const docRef = doc(db, collectionPath, docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          document: {
            id: docSnap.id,
            ...data,
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate()
          } as T,
          error: null
        };
      } else {
        return { document: null, error: 'Document not found' };
      }
    } catch (error) {
      console.error('Error getting document:', error);
      return { document: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Get multiple documents with query options
   */
  async getMany<T>(
    collectionPath: string,
    options: QueryOptions = {}
  ): Promise<{ documents: T[]; error: string | null }> {
    try {
      const collectionRef = collection(db, collectionPath);
      const constraints: QueryConstraint[] = [];

      // Add filters
      if (options.filters) {
        options.filters.forEach(filter => {
          constraints.push(where(filter.field, filter.operator, filter.value));
        });
      }

      // Add ordering
      if (options.orderByField) {
        constraints.push(orderBy(options.orderByField, options.orderDirection || 'asc'));
      }

      // Add pagination
      if (options.startAfterDoc) {
        constraints.push(startAfter(options.startAfterDoc));
      }
      if (options.endBeforeDoc) {
        constraints.push(endBefore(options.endBeforeDoc));
      }

      // Add limit
      if (options.limitCount) {
        constraints.push(limit(options.limitCount));
      }

      const q = query(collectionRef, ...constraints);
      const querySnapshot = await getDocs(q);

      const documents = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        } as T;
      });

      return { documents, error: null };
    } catch (error) {
      console.error('Error getting documents:', error);
      return { documents: [], error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Get paginated documents
   */
  async getPaginated<T>(
    collectionPath: string,
    pagination: PaginationOptions,
    queryOptions: QueryOptions = {}
  ): Promise<CollectionResult<T> & { error: string | null }> {
    try {
      const collectionRef = collection(db, collectionPath);
      const constraints: QueryConstraint[] = [];

      // Add filters
      if (queryOptions.filters) {
        queryOptions.filters.forEach(filter => {
          constraints.push(where(filter.field, filter.operator, filter.value));
        });
      }

      // Add ordering
      if (queryOptions.orderByField) {
        constraints.push(orderBy(queryOptions.orderByField, queryOptions.orderDirection || 'asc'));
      }

      // Add pagination
      if (pagination.direction === 'next' && pagination.lastDoc) {
        constraints.push(startAfter(pagination.lastDoc));
      } else if (pagination.direction === 'prev' && pagination.firstDoc) {
        constraints.push(endBefore(pagination.firstDoc));
      }

      // Add limit (get one extra to check if there are more)
      constraints.push(limit(pagination.pageSize + 1));

      const q = query(collectionRef, ...constraints);
      const querySnapshot = await getDocs(q);

      const documents = querySnapshot.docs.slice(0, pagination.pageSize).map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        } as T;
      });

      const hasMore = querySnapshot.docs.length > pagination.pageSize;
      const lastDoc = documents.length > 0 ? querySnapshot.docs[documents.length - 1] : null;
      const firstDoc = documents.length > 0 ? querySnapshot.docs[0] : null;

      return {
        documents,
        hasMore,
        lastDoc,
        firstDoc,
        error: null
      };
    } catch (error) {
      console.error('Error getting paginated documents:', error);
      return {
        documents: [],
        hasMore: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Update a document
   */
  async update(
    collectionPath: string,
    docId: string,
    data: Partial<Record<string, any>>
  ): Promise<{ error: string | null }> {
    try {
      const docRef = doc(db, collectionPath, docId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      return { error: null };
    } catch (error) {
      console.error('Error updating document:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Delete a document
   */
  async delete(
    collectionPath: string,
    docId: string
  ): Promise<{ error: string | null }> {
    try {
      const docRef = doc(db, collectionPath, docId);
      await deleteDoc(docRef);
      return { error: null };
    } catch (error) {
      console.error('Error deleting document:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Batch operations
   */
  async batchWrite(
    operations: Array<{
      type: 'create' | 'update' | 'delete';
      collectionPath: string;
      docId?: string;
      data?: any;
    }>
  ): Promise<{ error: string | null }> {
    try {
      const batch = writeBatch(db);

      operations.forEach(operation => {
        const docRef = operation.docId
          ? doc(db, operation.collectionPath, operation.docId)
          : doc(collection(db, operation.collectionPath));

        switch (operation.type) {
          case 'create':
            batch.set(docRef, {
              ...operation.data,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });
            break;
          case 'update':
            batch.update(docRef, {
              ...operation.data,
              updatedAt: serverTimestamp()
            });
            break;
          case 'delete':
            batch.delete(docRef);
            break;
        }
      });

      await batch.commit();
      return { error: null };
    } catch (error) {
      console.error('Error in batch operation:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Transaction
   */
  async runTransaction<T>(
    transactionFn: (transaction: any) => Promise<T>
  ): Promise<{ result: T | null; error: string | null }> {
    try {
      const result = await runTransaction(db, transactionFn);
      return { result, error: null };
    } catch (error) {
      console.error('Error in transaction:', error);
      return { result: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Real-time listener
   */
  onSnapshot<T>(
    collectionPath: string,
    callback: (documents: T[]) => void,
    onError?: (error: Error) => void,
    queryOptions: QueryOptions = {}
  ): () => void {
    const collectionRef = collection(db, collectionPath);
    const constraints: QueryConstraint[] = [];

    // Add filters
    if (queryOptions.filters) {
      queryOptions.filters.forEach(filter => {
        constraints.push(where(filter.field, filter.operator, filter.value));
      });
    }

    // Add ordering
    if (queryOptions.orderByField) {
      constraints.push(orderBy(queryOptions.orderByField, queryOptions.orderDirection || 'asc'));
    }

    // Add limit
    if (queryOptions.limitCount) {
      constraints.push(limit(queryOptions.limitCount));
    }

    const q = query(collectionRef, ...constraints);

    return onSnapshot(
      q,
      (querySnapshot) => {
        const documents = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate()
          } as T;
        });
        callback(documents);
      },
      onError
    );
  }

  /**
   * Search documents (client-side filtering for simple searches)
   */
  async search<T>(
    collectionPath: string,
    searchField: string,
    searchTerm: string,
    options: QueryOptions = {}
  ): Promise<{ documents: T[]; error: string | null }> {
    try {
      // For more complex search, you might want to use Algolia or implement full-text search
      const { documents, error } = await this.getMany<T>(collectionPath, options);
      
      if (error) {
        return { documents: [], error };
      }

      const searchedDocuments = documents.filter((doc: any) => {
        const fieldValue = doc[searchField];
        if (typeof fieldValue === 'string') {
          return fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return false;
      });

      return { documents: searchedDocuments, error: null };
    } catch (error) {
      console.error('Error searching documents:', error);
      return { documents: [], error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Get collection statistics
   */
  async getStats(
    collectionPath: string,
    filters?: QueryOptions['filters']
  ): Promise<{ count: number; error: string | null }> {
    try {
      const constraints: QueryConstraint[] = [];

      // Add filters
      if (filters) {
        filters.forEach(filter => {
          constraints.push(where(filter.field, filter.operator, filter.value));
        });
      }

      const collectionRef = collection(db, collectionPath);
      const q = query(collectionRef, ...constraints);
      const querySnapshot = await getDocs(q);

      return { count: querySnapshot.size, error: null };
    } catch (error) {
      console.error('Error getting collection stats:', error);
      return { count: 0, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

export const firestoreService = new FirestoreService();