import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/core/config/firebase.config';
import type { UserRole } from '@/types/user.types';

interface UserProfileDoc {
  role?: UserRole;
  displayName?: string;
  email?: string;
  createdAt?: number;
  updatedAt?: number;
}

export class UserService {
  async getUserRole(userId: string): Promise<UserRole> {
    const ref = doc(db, 'users', userId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data() as UserProfileDoc;
      return (data.role || 'learner') as UserRole;
    }
    return 'learner';
  }

  async ensureUserProfile(userId: string, payload: Partial<UserProfileDoc>): Promise<void> {
    const ref = doc(db, 'users', userId);
    const snap = await getDoc(ref);
    const now = Date.now();
    if (!snap.exists()) {
      await setDoc(ref, { role: 'learner', createdAt: now, updatedAt: now, ...payload });
    }
  }
}

export const userService = new UserService();


