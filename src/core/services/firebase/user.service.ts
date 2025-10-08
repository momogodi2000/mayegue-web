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
      // Default role is 'learner'
      return (data.role || 'learner') as UserRole;
    }
    return 'learner';
  }

  async ensureUserProfile(userId: string, payload: Partial<UserProfileDoc>): Promise<void> {
    const ref = doc(db, 'users', userId);
    const snap = await getDoc(ref);
    const now = Date.now();
    
    if (!snap.exists()) {
      // Determine role: use payload.role if provided, or default based on email
      let defaultRole: UserRole = payload.role || 'learner';
      if (!payload.role) {
        // Only check for special emails if no role was explicitly provided
        if (payload.email === 'admin@mayegue.com') {
          defaultRole = 'admin';
        } else if (payload.email === 'teacher@mayegue.com') {
          defaultRole = 'teacher';
        }
      }
      
      // Create new user profile with the determined role
      await setDoc(ref, {
        role: defaultRole,
        createdAt: now,
        updatedAt: now,
        subscriptionStatus: defaultRole === 'admin' || defaultRole === 'teacher' ? 'premium' : 'free',
        emailVerified: false,
        twoFactorEnabled: false,
        preferences: {
          language: 'fr',
          targetLanguages: [],
          notificationsEnabled: true,
          theme: 'system',
          dailyGoalMinutes: defaultRole === 'admin' ? 60 : defaultRole === 'teacher' ? 45 : 10,
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
      
      console.log(`✅ Created user profile for ${payload.email} with role: ${defaultRole}`);
    } else {
      // Update existing profile if needed
      await setDoc(ref, {
        updatedAt: now,
        ...payload
      }, { merge: true });
    }
  }

  async updateUserRole(userId: string, role: UserRole): Promise<void> {
    const ref = doc(db, 'users', userId);
    await setDoc(ref, { role, updatedAt: Date.now() }, { merge: true });
  }

  async updateUserLevel(userId: string, level: 'beginner' | 'intermediate' | 'advanced'): Promise<void> {
    const ref = doc(db, 'users', userId);
    await setDoc(ref, { 
      level,
      updatedAt: Date.now()
    }, { merge: true });
  }

  async getUserProfile(userId: string): Promise<UserProfileDoc | null> {
    const ref = doc(db, 'users', userId);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() as UserProfileDoc : null;
  }

  async updateUserStats(userId: string, statsUpdate: Partial<UserStats>): Promise<void> {
    const ref = doc(db, 'users', userId);
    const userDoc = await getDoc(ref);
    
    if (userDoc.exists()) {
      const currentData = userDoc.data() as UserProfileDoc;
      const currentStats = currentData.stats || {};
      
      const updatedStats = {
        ...currentStats,
        ...statsUpdate
      };

      await setDoc(ref, {
        stats: updatedStats,
        updatedAt: Date.now()
      }, { merge: true });
    }
  }

  async incrementLessonCompleted(userId: string, xpGained: number = 50): Promise<void> {
    const profile = await this.getUserProfile(userId);
    if (profile?.stats) {
      const newXP = (profile.stats.xp || 0) + xpGained;
      const newLevel = Math.floor(newXP / 100) + 1; // Level up every 100 XP
      
      await this.updateUserStats(userId, {
        lessonsCompleted: (profile.stats.lessonsCompleted || 0) + 1,
        xp: newXP,
        level: newLevel,
        totalTimeMinutes: (profile.stats.totalTimeMinutes || 0) + 15 // Assume 15 min per lesson
      });
    }
  }

  async updateStreak(userId: string): Promise<void> {
    const profile = await this.getUserProfile(userId);
    if (profile?.stats) {
      const newStreak = (profile.stats.currentStreak || 0) + 1;
      const longestStreak = Math.max(profile.stats.longestStreak || 0, newStreak);
      
      await this.updateUserStats(userId, {
        currentStreak: newStreak,
        longestStreak: longestStreak
      });
    }
  }

  async addWordsLearned(userId: string, wordCount: number): Promise<void> {
    const profile = await this.getUserProfile(userId);
    if (profile?.stats) {
      await this.updateUserStats(userId, {
        wordsLearned: (profile.stats.wordsLearned || 0) + wordCount
      });
    }
  }

  async unlockAchievement(userId: string, achievementId: string): Promise<void> {
    const profile = await this.getUserProfile(userId);
    if (profile?.stats) {
      await this.updateUserStats(userId, {
        achievementsUnlocked: (profile.stats.achievementsUnlocked || 0) + 1,
        badgesEarned: (profile.stats.badgesEarned || 0) + 1
      });
    }
  }
}

export const userService = new UserService();


