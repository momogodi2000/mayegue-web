import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query as fsQuery,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  runTransaction,
  Transaction,
  QueryConstraint,
  WhereFilterOp,
  DocumentData,
} from 'firebase/firestore';
import { db } from '@/core/config/firebase.config';

export interface FirestoreDocument {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface QueryFilter {
  field: string;
  operator: WhereFilterOp;
  value: unknown;
}

export interface QueryOptions {
  orderByField?: string;
  orderDirection?: 'asc' | 'desc';
  limitCount?: number;
  filters?: QueryFilter[];
}

export interface BatchOperation {
  type: 'add' | 'update' | 'delete';
  collection: string;
  id?: string;
  data?: DocumentData;
}

export class FirestoreService {
  async getCollection<T>(collectionName: string): Promise<T[]> {
    const snap = await getDocs(collection(db, collectionName));
    return snap.docs.map(d => ({ ...(d.data() as Record<string, unknown>), id: d.id }) as T);
  }

  async getDocument<T>(collectionName: string, docId: string): Promise<T | null> {
    const ref = doc(db, collectionName, docId);
    const snap = await getDoc(ref);
    return snap.exists() ? ({ ...(snap.data() as Record<string, unknown>), id: snap.id } as T) : null;
  }

  async addDocument<T extends DocumentData>(collectionName: string, data: T): Promise<string> {
    const timestamp = serverTimestamp();
    const docData = {
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    const ref = await addDoc(collection(db, collectionName), docData);
    return ref.id;
  }

  async updateDocument<T extends DocumentData>(collectionName: string, docId: string, data: Partial<T>): Promise<void> {
    const ref = doc(db, collectionName, docId);
    const updateData = {
      ...data,
      updatedAt: serverTimestamp(),
    };
    await updateDoc(ref, updateData);
  }

  async deleteDocument(collectionName: string, docId: string): Promise<void> {
    const ref = doc(db, collectionName, docId);
    await deleteDoc(ref);
  }

  async queryCollection<T>(
    collectionName: string,
    filters: QueryFilter[] = [],
    orderByField?: string,
    limitCount?: number
  ): Promise<T[]> {
    const collectionRef = collection(db, collectionName);
    const constraints: QueryConstraint[] = [];
    
    for (const f of filters) {
      constraints.push(where(f.field, f.operator, f.value));
    }
    if (orderByField) constraints.push(orderBy(orderByField));
    if (typeof limitCount === 'number') constraints.push(limit(limitCount));
    
    const q = constraints.length ? fsQuery(collectionRef, ...constraints) : collectionRef;
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ ...(d.data() as Record<string, unknown>), id: d.id }) as T);
  }

  /**
   * Enhanced query method with more options
   */
  async queryDocuments<T extends FirestoreDocument>(
    collectionName: string,
    options?: QueryOptions
  ): Promise<T[]> {
    try {
      const collectionRef = collection(db, collectionName);
      const constraints: QueryConstraint[] = [];

      // Add filters
      if (options?.filters) {
        options.filters.forEach(filter => {
          constraints.push(where(filter.field, filter.operator, filter.value));
        });
      }

      // Add ordering
      if (options?.orderByField) {
        constraints.push(orderBy(options.orderByField, options.orderDirection || 'asc'));
      }

      // Add limit
      if (options?.limitCount) {
        constraints.push(limit(options.limitCount));
      }

      const q = fsQuery(collectionRef, ...constraints);
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.(),
        updatedAt: doc.data().updatedAt?.toDate?.(),
      })) as T[];
    } catch (error) {
      console.error(`Error querying collection ${collectionName}:`, error);
      throw new Error(`Failed to query collection: ${error}`);
    }
  }

  /**
   * Listen to real-time updates for a collection
   */
  subscribeToCollection<T extends FirestoreDocument>(
    collectionName: string,
    callback: (documents: T[]) => void,
    options?: QueryOptions
  ): () => void {
    try {
      const collectionRef = collection(db, collectionName);
      const constraints: QueryConstraint[] = [];

      // Add filters
      if (options?.filters) {
        options.filters.forEach(filter => {
          constraints.push(where(filter.field, filter.operator, filter.value));
        });
      }

      // Add ordering
      if (options?.orderByField) {
        constraints.push(orderBy(options.orderByField, options.orderDirection || 'asc'));
      }

      // Add limit
      if (options?.limitCount) {
        constraints.push(limit(options.limitCount));
      }

      const q = fsQuery(collectionRef, ...constraints);

      return onSnapshot(q, (snapshot) => {
        const documents = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.(),
          updatedAt: doc.data().updatedAt?.toDate?.(),
        })) as T[];

        callback(documents);
      }, (error) => {
        console.error(`Error in subscription to ${collectionName}:`, error);
      });
    } catch (error) {
      console.error(`Error setting up subscription to ${collectionName}:`, error);
      return () => {};
    }
  }

  /**
   * Listen to real-time updates for a single document
   */
  subscribeToDocument<T extends FirestoreDocument>(
    collectionName: string,
    documentId: string,
    callback: (document: T | null) => void
  ): () => void {
    try {
      const docRef = doc(db, collectionName, documentId);

      return onSnapshot(docRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          const document = {
            id: snapshot.id,
            ...data,
            createdAt: data.createdAt?.toDate?.(),
            updatedAt: data.updatedAt?.toDate?.(),
          } as T;
          callback(document);
        } else {
          callback(null);
        }
      }, (error) => {
        console.error(`Error in subscription to document ${documentId}:`, error);
      });
    } catch (error) {
      console.error(`Error setting up subscription to document ${documentId}:`, error);
      return () => {};
    }
  }

  /**
   * Batch write operations
   */
  async batchWrite(operations: BatchOperation[]): Promise<void> {
    try {
      const batch = writeBatch(db);

      operations.forEach(operation => {
        if (operation.type === 'add') {
          const docRef = doc(collection(db, operation.collection));
          batch.set(docRef, {
            ...operation.data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        } else if (operation.type === 'update' && operation.id) {
          const docRef = doc(db, operation.collection, operation.id);
          batch.update(docRef, {
            ...operation.data,
            updatedAt: serverTimestamp(),
          });
        } else if (operation.type === 'delete' && operation.id) {
          const docRef = doc(db, operation.collection, operation.id);
          batch.delete(docRef);
        }
      });

      await batch.commit();
    } catch (error) {
      console.error('Error in batch write:', error);
      throw new Error(`Failed to execute batch write: ${error}`);
    }
  }

  /**
   * Execute a transaction
   */
  async runTransaction<T>(
    updateFunction: (transaction: Transaction) => Promise<T>
  ): Promise<T> {
    try {
      return await runTransaction(db, updateFunction);
    } catch (error) {
      console.error('Error in transaction:', error);
      throw new Error(`Failed to execute transaction: ${error}`);
    }
  }

  /**
   * Count documents in a collection (with filters)
   */
  async countDocuments(
    collectionName: string,
    filters?: QueryFilter[]
  ): Promise<number> {
    try {
      const collectionRef = collection(db, collectionName);
      const constraints: QueryConstraint[] = [];

      // Add filters
      if (filters) {
        filters.forEach(filter => {
          constraints.push(where(filter.field, filter.operator, filter.value));
        });
      }

      const q = fsQuery(collectionRef, ...constraints);
      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error(`Error counting documents in ${collectionName}:`, error);
      throw new Error(`Failed to count documents: ${error}`);
    }
  }

  /**
   * Check if document exists
   */
  async documentExists(collectionName: string, documentId: string): Promise<boolean> {
    try {
      const docRef = doc(db, collectionName, documentId);
      const docSnapshot = await getDoc(docRef);
      return docSnapshot.exists();
    } catch (error) {
      console.error(`Error checking if document exists:`, error);
      return false;
    }
  }
}

export const firestoreService = new FirestoreService();


