/**
 * Hybrid Authentication Service
 * Integrates Firebase Auth with local SQLite user management
 */

import { authService } from '../firebase/auth.service';
import { sqliteService } from '../offline/sqlite.service';
import type { User, UserRole } from '@/shared/types/user.types';
import type { UserRecord } from '../offline/types';

export class HybridAuthService {
  private currentUser: User | null = null;
  private authStateListeners: ((user: User | null) => void)[] = [];

  /**
   * Initialize the hybrid auth service
   */
  async initialize(): Promise<void> {
    // Set up Firebase auth state listener
    authService.onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        // Link Firebase user to local SQLite record
        await this.linkFirebaseUserToLocal(firebaseUser);
      } else {
        this.currentUser = null;
      }
      
      // Notify all listeners
      this.authStateListeners.forEach(listener => listener(this.currentUser));
    });

    // Check for existing auth state
    const firebaseUser = await authService.getCurrentMappedUser();
    if (firebaseUser) {
      await this.linkFirebaseUserToLocal(firebaseUser);
    }
  }

  /**
   * Link Firebase user to local SQLite user record
   */
  private async linkFirebaseUserToLocal(firebaseUser: User): Promise<void> {
    try {
      // Check if user exists in local SQLite
      let localUser = await sqliteService.getUserByFirebaseUid(firebaseUser.id);
      
      if (!localUser) {
        // Create new local user record
        const userId = await sqliteService.createUser({
          firebaseUid: firebaseUser.id,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          role: this.determineUserRole(firebaseUser.email)
        });
        
        // Fetch the created user
        localUser = await sqliteService.getUserById(userId);
      } else {
        // Update existing user with latest Firebase data
        await sqliteService.updateUser(localUser.user_id!, {
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          emailVerified: firebaseUser.emailVerified,
          lastLogin: Date.now(),
          updatedAt: Date.now()
        });
        
        // Refresh user data
        localUser = await sqliteService.getUserById(localUser.user_id!);
      }

      if (localUser) {
        // Create hybrid user object
        this.currentUser = this.createHybridUser(firebaseUser, localUser);
      }
    } catch (error) {
      console.error('Error linking Firebase user to local:', error);
      // Fallback to Firebase-only user
      this.currentUser = firebaseUser;
    }
  }

  /**
   * Determine user role based on email or other criteria
   */
  private determineUserRole(email: string): UserRole {
    if (email === 'admin@mayegue.com') return 'admin';
    if (email === 'teacher@mayegue.com') return 'teacher';
    if (email?.includes('@teacher.')) return 'teacher';
    if (email?.includes('@admin.')) return 'admin';
    return 'learner';
  }

  /**
   * Create hybrid user object combining Firebase and local data
   */
  private createHybridUser(firebaseUser: User, localUser: UserRecord): User {
    return {
      ...firebaseUser,
      role: (localUser.role as UserRole) || 'student',
      subscription: localUser.subscription as any || 'free',
      stats: {
        lessonsCompleted: 0,
        wordsLearned: 0,
        totalTimeMinutes: 0,
        currentStreak: 0,
        longestStreak: 0,
        badgesEarned: 0,
        level: localUser.level || 1,
        xp: localUser.xp || 0,
        atlasExplorations: 0,
        encyclopediaEntries: 0,
        historicalSitesVisited: 0,
        arVrExperiences: 0,
        marketplacePurchases: 0,
        familyContributions: 0,
        ngondoCoinsEarned: 0,
        achievementsUnlocked: 0,
        ...firebaseUser.stats
      },
      preferences: {
        language: 'fr' as const,
        targetLanguages: [],
        notificationsEnabled: true,
        theme: 'system' as const,
        dailyGoalMinutes: 10,
        ...firebaseUser.preferences
      }
    };
  }

  /**
   * Sign in with email and password
   */
  async signInWithEmail(email: string, password: string): Promise<User> {
    const firebaseUser = await authService.signInWithEmail(email, password);
    await this.linkFirebaseUserToLocal(firebaseUser);
    return this.currentUser!;
  }

  /**
   * Sign up with email and password
   */
  async signUpWithEmail(email: string, password: string, displayName?: string): Promise<User> {
    const firebaseUser = await authService.signUpWithEmail(email, password, displayName);
    await this.linkFirebaseUserToLocal(firebaseUser);
    return this.currentUser!;
  }

  /**
   * Sign in with Google
   */
  async signInWithGoogle(): Promise<User> {
    const firebaseUser = await authService.signInWithGoogle();
    await this.linkFirebaseUserToLocal(firebaseUser);
    return this.currentUser!;
  }

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    await authService.signOut();
    this.currentUser = null;
    this.authStateListeners.forEach(listener => listener(null));
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (user: User | null) => void): () => void {
    this.authStateListeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.authStateListeners.indexOf(callback);
      if (index > -1) {
        this.authStateListeners.splice(index, 1);
      }
    };
  }

  /**
   * Update user role (admin only)
   */
  async updateUserRole(userId: string, newRole: UserRole): Promise<void> {
    if (!this.currentUser || this.currentUser.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required');
    }

    // Update in local SQLite
    const localUser = await sqliteService.getUserByFirebaseUid(userId);
    if (localUser) {
      await sqliteService.updateUser(localUser.user_id!, {
        role: newRole as any,
        updatedAt: Date.now()
      });

      // Log admin action
      await sqliteService.logAdminAction(
        localUser.user_id!,
        'update_user_role',
        'user',
        localUser.user_id!,
        JSON.stringify({ oldRole: localUser.role, newRole }),
        this.getClientIP()
      );
    }
  }

  /**
   * Get user progress and stats from local database
   */
  async getUserProgress(userId?: string): Promise<any> {
    const targetUserId = userId || this.currentUser?.id;
    if (!targetUserId) return null;

    const localUser = await sqliteService.getUserByFirebaseUid(targetUserId);
    if (!localUser) return null;

    return await sqliteService.getProgress(localUser.user_id!);
  }

  /**
   * Record user progress locally
   */
  async recordProgress(
    contentType: 'lesson' | 'quiz',
    contentId: number,
    data: {
      status?: string;
      score?: number;
      timeSpent?: number;
      attempts?: number;
    }
  ): Promise<void> {
    if (!this.currentUser) throw new Error('User not authenticated');

    const localUser = await sqliteService.getUserByFirebaseUid(this.currentUser.id);
    if (!localUser) throw new Error('Local user record not found');

    await sqliteService.recordProgress(localUser.user_id!, contentType, contentId, data);
  }

  /**
   * Get user achievements
   */
  async getUserAchievements(): Promise<any[]> {
    if (!this.currentUser) return [];

    const localUser = await sqliteService.getUserByFirebaseUid(this.currentUser.id);
    if (!localUser) return [];

    return await sqliteService.getUserAchievements(localUser.user_id!);
  }

  /**
   * Award achievement to user
   */
  async earnAchievement(achievementCode: string): Promise<boolean> {
    if (!this.currentUser) return false;

    const localUser = await sqliteService.getUserByFirebaseUid(this.currentUser.id);
    if (!localUser) return false;

    return await sqliteService.earnAchievement(localUser.user_id!, achievementCode);
  }

  /**
   * Check if user can access content (for guest limits)
   */
  async canAccessContent(
    contentType: 'lessons' | 'readings' | 'quizzes',
    date?: string
  ): Promise<boolean> {
    // Authenticated users have unlimited access (based on subscription)
    if (this.currentUser) {
      return true; // TODO: Check subscription limits
    }

    // Guest users have daily limits
    const today = date || new Date().toISOString().split('T')[0];
    return await sqliteService.canAccess(0, today, contentType);
  }

  /**
   * Record content access for guest users
   */
  async recordContentAccess(
    contentType: 'lessons' | 'readings' | 'quizzes',
    date?: string
  ): Promise<void> {
    // Only record for guest users
    if (this.currentUser) return;

    const today = date || new Date().toISOString().split('T')[0];
    await sqliteService.updateDailyLimit(0, today, contentType);
  }

  /**
   * Get daily usage for guest users
   */
  async getDailyUsage(date?: string): Promise<any> {
    const today = date || new Date().toISOString().split('T')[0];
    return await sqliteService.getDailyLimit(0, today);
  }

  /**
   * Email verification disabled
   */
  async sendVerificationEmail(): Promise<void> {
    // Email verification is disabled
    console.log('Email verification is disabled');
  }

  async requestPasswordReset(email: string): Promise<void> {
    return authService.requestPasswordReset(email);
  }

  async confirmPasswordReset(oobCode: string, newPassword: string): Promise<void> {
    return authService.confirmPasswordReset(oobCode, newPassword);
  }

  /**
   * Helper method to get client IP (for admin logging)
   */
  private getClientIP(): string {
    // In a real app, this would get the actual client IP
    return 'localhost';
  }
}

export const hybridAuthService = new HybridAuthService();
