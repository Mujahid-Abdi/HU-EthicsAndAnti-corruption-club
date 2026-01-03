import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  setDoc,
  DocumentData,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './firebase';

// Generic Firestore operations
export class FirestoreService {
  // Create a document
  static async create(collectionName: string, data: any) {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  }

  // Get all documents from a collection
  static async getAll(collectionName: string, constraints: QueryConstraint[] = []) {
    try {
      const q = query(collection(db, collectionName), ...constraints);
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error getting documents:', error);
      throw error;
    }
  }

  // Get a single document
  static async get(collectionName: string, id: string) {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting document:', error);
      throw error;
    }
  }

  // Get a single document (alias for backward compatibility)
  static async getById(collectionName: string, id: string) {
    return this.get(collectionName, id);
  }

  // Set a document with a specific ID (create or overwrite)
  static async set(collectionName: string, id: string, data: any) {
    try {
      const docRef = doc(db, collectionName, id);
      await setDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
      });
      return { id, ...data };
    } catch (error) {
      console.error('Error setting document:', error);
      throw error;
    }
  }

  // Create or update a document with a specific ID
  static async createOrUpdate(collectionName: string, id: string, data: any) {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        // Update existing document
        await updateDoc(docRef, {
          ...data,
          updatedAt: Timestamp.now(),
        });
      } else {
        // Create new document with specific ID
        await setDoc(docRef, {
          ...data,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
      }
      
      return { id, ...data };
    } catch (error) {
      console.error('Error creating/updating document:', error);
      throw error;
    }
  }

  // Update a document
  static async update(collectionName: string, id: string, data: any) {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
      });
      return { id, ...data };
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }

  // Delete a document
  static async delete(collectionName: string, id: string) {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  // Real-time listener
  static subscribe(
    collectionName: string,
    callback: (data: any[]) => void,
    constraints: QueryConstraint[] = []
  ) {
    const q = query(collection(db, collectionName), ...constraints);
    return onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(data);
    });
  }
}

// Specific collection services
export const Collections = {
  USERS: 'users',
  REPORTS: 'reports',
  EVENTS: 'events',
  NEWS: 'news',
  GALLERY: 'gallery',
  RESOURCES: 'resources',
  ACHIEVEMENTS: 'achievements',
  ELECTIONS: 'elections',
  CANDIDATES: 'candidates',
  VOTES: 'votes',
  EXECUTIVES: 'executives',
  CONTENT: 'content',
} as const;