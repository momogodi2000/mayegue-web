/**
 * Integration tests for the hybrid authentication system
 * Tests Firebase + SQLite integration
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { hybridAuthService } from '@/core/services/auth/hybrid-auth.service';
import { sqliteService } from '@/core/services/offline/sqlite.service';
import type { User } from '@/shared/types/user.types';

// Mock Firebase auth service
vi.mock('@/core/services/firebase/auth.service', () => ({
  authService: {
    onAuthStateChange: vi.fn(),
    getCurrentMappedUser: vi.fn(),
    signInWithEmail: vi.fn(),
    signUpWithEmail: vi.fn(),
    signInWithGoogle: vi.fn(),
    signOut: vi.fn(),
    sendVerificationEmail: vi.fn(),
    requestPasswordReset: vi.fn(),
    confirmPasswordReset: vi.fn(),
  },
}));

describe('Hybrid Authentication System', () => {
  beforeEach(async () => {
    // Initialize SQLite for testing
    await sqliteService.initialize();
    
    // Clear any existing test data
    await sqliteService.run('DELETE FROM users WHERE email LIKE ?', ['%test%']);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('User Registration and Login', () => {
    it('should create local user record when Firebase user signs up', async () => {
      const mockFirebaseUser: User = {
        id: 'firebase-test-123',
        email: 'test@example.com',
        displayName: 'Test User',
        role: 'student',
        emailVerified: true,
        createdAt: new Date(),
        lastLoginAt: new Date(),
      };

      // Mock Firebase auth response
      const { authService } = await import('@/core/services/firebase/auth.service');
      vi.mocked(authService.signUpWithEmail).mockResolvedValue(mockFirebaseUser);

      // Test sign up
      const result = await hybridAuthService.signUpWithEmail('test@example.com', 'password123', 'Test User');

      expect(result).toBeDefined();
      expect(result.email).toBe('test@example.com');

      // Verify local user was created
      const localUser = await sqliteService.getUserByFirebaseUid('firebase-test-123');
      expect(localUser).toBeDefined();
      expect(localUser?.email).toBe('test@example.com');
      expect(localUser?.role).toBe('student');
    });

    it('should link existing Firebase user to local record on login', async () => {
      // Create existing local user
      const userId = await sqliteService.createUser({
        firebaseUid: 'firebase-existing-123',
        email: 'existing@example.com',
        displayName: 'Existing User',
        role: 'teacher',
      });

      const mockFirebaseUser: User = {
        id: 'firebase-existing-123',
        email: 'existing@example.com',
        displayName: 'Existing User Updated',
        role: 'teacher',
        emailVerified: true,
        createdAt: new Date(),
        lastLoginAt: new Date(),
      };

      const { authService } = await import('@/core/services/firebase/auth.service');
      vi.mocked(authService.signInWithEmail).mockResolvedValue(mockFirebaseUser);

      // Test sign in
      const result = await hybridAuthService.signInWithEmail('existing@example.com', 'password123');

      expect(result).toBeDefined();
      expect(result.displayName).toBe('Existing User Updated');

      // Verify local user was updated
      const localUser = await sqliteService.getUserById(userId);
      expect(localUser?.displayName).toBe('Existing User Updated');
    });

    it('should determine correct user role based on email', async () => {
      const testCases = [
        { email: 'admin@mayegue.com', expectedRole: 'admin' },
        { email: 'teacher@mayegue.com', expectedRole: 'teacher' },
        { email: 'john@teacher.example.com', expectedRole: 'teacher' },
        { email: 'student@example.com', expectedRole: 'student' },
      ];

      for (const testCase of testCases) {
        const mockFirebaseUser: User = {
          id: `firebase-${Date.now()}`,
          email: testCase.email,
          displayName: 'Test User',
          role: 'student', // This should be overridden
          emailVerified: true,
          createdAt: new Date(),
          lastLoginAt: new Date(),
        };

        const { authService } = await import('@/core/services/firebase/auth.service');
        vi.mocked(authService.signUpWithEmail).mockResolvedValue(mockFirebaseUser);

        await hybridAuthService.signUpWithEmail(testCase.email, 'password123', 'Test User');

        const localUser = await sqliteService.getUserByFirebaseUid(mockFirebaseUser.id);
        expect(localUser?.role).toBe(testCase.expectedRole);
      }
    });
  });

  describe('User Progress and Achievements', () => {
    let testUserId: number;

    beforeEach(async () => {
      testUserId = await sqliteService.createUser({
        firebaseUid: 'test-progress-user',
        email: 'progress@test.com',
        displayName: 'Progress Test User',
        role: 'student',
      });
    });

    it('should record user progress correctly', async () => {
      // Mock current user
      const mockUser: User = {
        id: 'test-progress-user',
        email: 'progress@test.com',
        displayName: 'Progress Test User',
        role: 'student',
        emailVerified: true,
        createdAt: new Date(),
        lastLoginAt: new Date(),
      };

      vi.spyOn(hybridAuthService, 'getCurrentUser').mockReturnValue(mockUser);

      // Record lesson progress
      await hybridAuthService.recordProgress('lesson', 1, {
        status: 'completed',
        score: 85,
        timeSpent: 300, // 5 minutes
        attempts: 1,
      });

      // Verify progress was recorded
      const progress = await sqliteService.getProgress(testUserId, 'lesson');
      expect(progress).toHaveLength(1);
      expect(progress[0]).toMatchObject({
        user_id: testUserId,
        content_type: 'lesson',
        content_id: 1,
        status: 'completed',
        score: 85,
      });
    });

    it('should award achievements correctly', async () => {
      // Create test achievement
      await sqliteService.run(
        `INSERT INTO achievements (code, name, description, required_count, active)
         VALUES (?, ?, ?, ?, ?)`,
        ['first_lesson', 'First Lesson', 'Complete your first lesson', 1, 1]
      );

      const mockUser: User = {
        id: 'test-progress-user',
        email: 'progress@test.com',
        displayName: 'Progress Test User',
        role: 'student',
        emailVerified: true,
        createdAt: new Date(),
        lastLoginAt: new Date(),
      };

      vi.spyOn(hybridAuthService, 'getCurrentUser').mockReturnValue(mockUser);

      // Earn achievement
      const earned = await hybridAuthService.earnAchievement('first_lesson');
      expect(earned).toBe(true);

      // Verify achievement was recorded
      const achievements = await hybridAuthService.getUserAchievements();
      expect(achievements).toHaveLength(1);
      expect(achievements[0]).toMatchObject({
        code: 'first_lesson',
        name: 'First Lesson',
      });
    });
  });

  describe('Guest User Limits', () => {
    it('should enforce daily limits for guest users', async () => {
      const today = new Date().toISOString().split('T')[0];

      // Test initial access (should be allowed)
      const canAccess1 = await hybridAuthService.canAccessContent('lessons', today);
      expect(canAccess1).toBe(true);

      // Record lesson access up to limit
      for (let i = 0; i < 5; i++) {
        await hybridAuthService.recordContentAccess('lessons', today);
      }

      // Test access after limit reached (should be denied)
      const canAccess2 = await hybridAuthService.canAccessContent('lessons', today);
      expect(canAccess2).toBe(false);

      // Test different content type (should still be allowed)
      const canAccessQuiz = await hybridAuthService.canAccessContent('quizzes', today);
      expect(canAccessQuiz).toBe(true);
    });

    it('should reset limits for new day', async () => {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      // Exhaust yesterday's limit
      for (let i = 0; i < 5; i++) {
        await hybridAuthService.recordContentAccess('lessons', yesterday);
      }

      // Today should still allow access
      const canAccessToday = await hybridAuthService.canAccessContent('lessons', today);
      expect(canAccessToday).toBe(true);
    });
  });

  describe('Role-based Access Control', () => {
    it('should allow admin to update user roles', async () => {
      // Create admin user
      const adminUserId = await sqliteService.createUser({
        firebaseUid: 'admin-test-user',
        email: 'admin@test.com',
        displayName: 'Admin User',
        role: 'admin',
      });

      // Create target user
      const targetUserId = await sqliteService.createUser({
        firebaseUid: 'target-test-user',
        email: 'target@test.com',
        displayName: 'Target User',
        role: 'student',
      });

      // Mock admin user as current user
      const mockAdminUser: User = {
        id: 'admin-test-user',
        email: 'admin@test.com',
        displayName: 'Admin User',
        role: 'admin',
        emailVerified: true,
        createdAt: new Date(),
        lastLoginAt: new Date(),
      };

      vi.spyOn(hybridAuthService, 'getCurrentUser').mockReturnValue(mockAdminUser);

      // Test role update
      await hybridAuthService.updateUserRole('target-test-user', 'teacher');

      // Verify role was updated
      const updatedUser = await sqliteService.getUserById(targetUserId);
      expect(updatedUser?.role).toBe('teacher');

      // Verify admin action was logged
      const logs = await sqliteService.getAdminLogs(adminUserId, 1);
      expect(logs).toHaveLength(1);
      expect(logs[0]).toMatchObject({
        admin_id: adminUserId,
        action: 'update_user_role',
        target_type: 'user',
        target_id: targetUserId,
      });
    });

    it('should deny role update for non-admin users', async () => {
      // Create regular user
      await sqliteService.createUser({
        firebaseUid: 'regular-test-user',
        email: 'regular@test.com',
        displayName: 'Regular User',
        role: 'student',
      });

      // Mock regular user as current user
      const mockRegularUser: User = {
        id: 'regular-test-user',
        email: 'regular@test.com',
        displayName: 'Regular User',
        role: 'student',
        emailVerified: true,
        createdAt: new Date(),
        lastLoginAt: new Date(),
      };

      vi.spyOn(hybridAuthService, 'getCurrentUser').mockReturnValue(mockRegularUser);

      // Test role update (should fail)
      await expect(
        hybridAuthService.updateUserRole('target-test-user', 'teacher')
      ).rejects.toThrow('Unauthorized: Admin access required');
    });
  });

  describe('Data Consistency', () => {
    it('should maintain data consistency between Firebase and SQLite', async () => {
      const mockFirebaseUser: User = {
        id: 'consistency-test-123',
        email: 'consistency@test.com',
        displayName: 'Consistency Test',
        role: 'student',
        emailVerified: true,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        stats: {
          lessonsCompleted: 10,
          wordsLearned: 50,
          totalTimeMinutes: 120,
          currentStreak: 3,
          longestStreak: 5,
          badgesEarned: 2,
          level: 2,
          xp: 150,
          atlasExplorations: 1,
          encyclopediaEntries: 5,
          historicalSitesVisited: 2,
          arVrExperiences: 0,
          marketplacePurchases: 0,
          familyContributions: 0,
          ngondoCoinsEarned: 25,
          achievementsUnlocked: 2,
        },
      };

      const { authService } = await import('@/core/services/firebase/auth.service');
      vi.mocked(authService.signUpWithEmail).mockResolvedValue(mockFirebaseUser);

      // Sign up user
      const hybridUser = await hybridAuthService.signUpWithEmail(
        'consistency@test.com',
        'password123',
        'Consistency Test'
      );

      // Verify hybrid user combines Firebase and local data correctly
      expect(hybridUser.stats?.lessonsCompleted).toBe(10);
      expect(hybridUser.stats?.level).toBe(2);
      expect(hybridUser.role).toBe('student');

      // Verify local user has correct data
      const localUser = await sqliteService.getUserByFirebaseUid('consistency-test-123');
      expect(localUser?.email).toBe('consistency@test.com');
      expect(localUser?.role).toBe('student');
    });
  });
});
