import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/core/config/firebase.config';
import type { UserRole } from '@/shared/types/user.types';

interface UserProfileDoc {
  role?: UserRole;
  displayName?: string;
  email?: string;
  subscriptionStatus?: 'free' | 'premium' | 'trial';
  emailVerified?: boolean;
  twoFactorEnabled?: boolean;
  createdAt?: number;
  updatedAt?: number;
}

export class UserService {
  async getUserRole(userId: string): Promise<UserRole> {
    const ref = doc(db, 'users', userId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data() as UserProfileDoc;
      // Default role is 'apprenant' (student)
      return (data.role || 'apprenant') as UserRole;
    }
    return 'apprenant';
  }

  async ensureUserProfile(userId: string, payload: Partial<UserProfileDoc>): Promise<void> {
    const ref = doc(db, 'users', userId);
    const snap = await getDoc(ref);
    const now = Date.now();
    if (!snap.exists()) {
      // Default role for new users is 'apprenant' (student)
      await setDoc(ref, {
        role: 'apprenant',
        createdAt: now,
        updatedAt: now,
        subscriptionStatus: 'free',
        emailVerified: false,
        twoFactorEnabled: false,
        ...payload
      });
    }
  }

  async updateUserRole(userId: string, role: UserRole): Promise<void> {
    const ref = doc(db, 'users', userId);
    await setDoc(ref, { role, updatedAt: Date.now() }, { merge: true });
  }

  async getUserProfile(userId: string): Promise<UserProfileDoc | null> {
    const ref = doc(db, 'users', userId);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() as UserProfileDoc : null;
  }
}

export const userService = new UserService();


