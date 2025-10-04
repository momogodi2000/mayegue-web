import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/core/config/firebase.config';
import type { UserRole, UserPreferences, UserStats } from '@/shared/types/user.types';

interface UserProfileDoc {
  role?: UserRole;
  displayName?: string;
  email?: string;
  subscriptionStatus?: 'free' | 'premium' | 'trial';
  subscription?: string; // V1.1: Subscription ID
  emailVerified?: boolean;
  twoFactorEnabled?: boolean;
  createdAt?: number;
  updatedAt?: number;
  preferences?: UserPreferences;
  stats?: UserStats;
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
        preferences: {
          language: 'fr',
          targetLanguages: [],
          notificationsEnabled: true,
          theme: 'system',
          dailyGoalMinutes: 10,
        },
        stats: {
          lessonsCompleted: 0,
          wordsLearned: 0,
          totalTimeMinutes: 0,
          currentStreak: 0,
          longestStreak: 0,
          badgesEarned: 0,
          level: 1,
          xp: 0,
          atlasExplorations: 0,
          encyclopediaEntries: 0,
          historicalSitesVisited: 0,
          arVrExperiences: 0,
          marketplacePurchases: 0,
          familyContributions: 0,
          ngondoCoinsEarned: 0,
          achievementsUnlocked: 0,
        },
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


