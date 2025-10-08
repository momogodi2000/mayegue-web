/**
 * Unit tests for Admin Service
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { adminService } from '@/features/users/admin/services/admin.service';
import { hybridAuthService } from '@/core/services/auth/hybrid-auth.service';
import { sqliteService } from '@/core/services/offline/sqlite.service';
import type { User } from '@/shared/types/user.types';

// Mock dependencies
vi.mock('@/core/services/auth/hybrid-auth.service');
vi.mock('@/core/services/offline/sqlite.service');

describe('AdminService', () => {
  const mockAdminUser: User = {
    id: 'admin-123',
    email: 'admin@test.com',
    displayName: 'Test Admin',
    role: 'admin',
    emailVerified: true,
    createdAt: new Date(),
    lastLoginAt: new Date(),
  };

  const mockLocalAdminUser = {
    user_id: 1,
    firebase_uid: 'admin-123',
    email: 'admin@test.com',
    display_name: 'Test Admin',
    role: 'admin',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Authorization', () => {
    it('should allow admin access to admin methods', async () => {
      vi.mocked(hybridAuthService.getCurrentUser).mockReturnValue(mockAdminUser);
      vi.mocked(sqliteService.query).mockResolvedValue([{ count: 100 }]);

      const stats = await adminService.getAdminStats();
      expect(stats).toBeDefined();
      expect(hybridAuthService.getCurrentUser).toHaveBeenCalled();
    });

    it('should deny access to non-admin users', async () => {
      const mockTeacherUser: User = {
        ...mockAdminUser,
        role: 'teacher',
      };

      vi.mocked(hybridAuthService.getCurrentUser).mockReturnValue(mockTeacherUser);

      await expect(adminService.getAdminStats()).rejects.toThrow(
        'Unauthorized: Admin access required'
      );
    });

    it('should deny access to unauthenticated users', async () => {
      vi.mocked(hybridAuthService.getCurrentUser).mockReturnValue(null);

      await expect(adminService.getAdminStats()).rejects.toThrow(
        'Unauthorized: Admin access required'
      );
    });
  });

  describe('Admin Statistics', () => {
    beforeEach(() => {
      vi.mocked(hybridAuthService.getCurrentUser).mockReturnValue(mockAdminUser);
    });

    it('should calculate admin stats correctly', async () => {
      // Mock database queries in order
      vi.mocked(sqliteService.query)
        .mockResolvedValueOnce([{ count: 1000 }]) // total users
        .mockResolvedValueOnce([{ count: 850 }])  // active users
        .mockResolvedValueOnce([{ count: 150 }])  // total lessons
        .mockResolvedValueOnce([{ count: 75 }])   // total quizzes
        .mockResolvedValueOnce([{ count: 500 }])  // total translations
        .mockResolvedValueOnce([{ count: 12 }]);  // pending content

      const stats = await adminService.getAdminStats();

      expect(stats).toEqual({
        totalUsers: 1000,
        activeUsers: 850,
        totalLessons: 150,
        totalQuizzes: 75,
        totalDictionaryEntries: 500,
        pendingContent: 12,
        systemHealth: 'healthy',
        storageUsed: 45,
        storageLimit: 100,
      });
    });

    it('should determine system health correctly', async () => {
      vi.mocked(sqliteService.query).mockResolvedValue([{ count: 0 }]);

      const stats = await adminService.getAdminStats();

      expect(stats.systemHealth).toBe('healthy');
    });
  });

  describe('User Management', () => {
    beforeEach(() => {
      vi.mocked(hybridAuthService.getCurrentUser).mockReturnValue(mockAdminUser);
    });

    it('should get users with pagination', async () => {
      const mockUsers = [
        {
          user_id: 1,
          email: 'user1@test.com',
          display_name: 'User 1',
          role: 'student',
          created_at: Date.now(),
          is_active: true,
        },
        {
          user_id: 2,
          email: 'user2@test.com',
          display_name: 'User 2',
          role: 'teacher',
          created_at: Date.now(),
          is_active: true,
        },
      ];

      vi.mocked(sqliteService.query)
        .mockResolvedValueOnce(mockUsers) // users query
        .mockResolvedValueOnce([{ count: 100 }]) // total count
        .mockResolvedValueOnce([{ count: 85 }])  // active count
        .mockResolvedValueOnce([{ count: 5 }]);  // new today

      const result = await adminService.getUsers(1, 20);

      expect(result).toEqual({
        users: mockUsers,
        totalCount: 100,
        activeCount: 85,
        newUsersToday: 5,
      });
    });

    it('should filter users by search term', async () => {
      vi.mocked(sqliteService.query).mockResolvedValue([]);

      await adminService.getUsers(1, 20, 'john');

      expect(sqliteService.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE (display_name LIKE ? OR email LIKE ?)'),
        expect.arrayContaining(['%john%', '%john%', 20, 0])
      );
    });

    it('should filter users by role', async () => {
      vi.mocked(sqliteService.query).mockResolvedValue([]);

      await adminService.getUsers(1, 20, undefined, 'teacher');

      expect(sqliteService.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE role = ?'),
        expect.arrayContaining(['teacher', 20, 0])
      );
    });

    it('should update user role and log action', async () => {
      vi.mocked(sqliteService.getUserByFirebaseUid).mockResolvedValue(mockLocalAdminUser);
      vi.mocked(sqliteService.updateUser).mockResolvedValue(undefined);
      vi.mocked(sqliteService.logAdminAction).mockResolvedValue(undefined);

      await adminService.updateUserRole(2, 'teacher');

      expect(sqliteService.updateUser).toHaveBeenCalledWith(2, {
        role: 'teacher',
        updatedAt: expect.any(Number),
      });

      expect(sqliteService.logAdminAction).toHaveBeenCalledWith(
        1,
        'update_user_role',
        'user',
        2,
        JSON.stringify({ newRole: 'teacher' }),
        'localhost'
      );
    });

    it('should toggle user status and log action', async () => {
      vi.mocked(sqliteService.getUserByFirebaseUid).mockResolvedValue(mockLocalAdminUser);
      vi.mocked(sqliteService.updateUser).mockResolvedValue(undefined);
      vi.mocked(sqliteService.logAdminAction).mockResolvedValue(undefined);

      await adminService.toggleUserStatus(2, false);

      expect(sqliteService.updateUser).toHaveBeenCalledWith(2, {
        isActive: false,
        updatedAt: expect.any(Number),
      });

      expect(sqliteService.logAdminAction).toHaveBeenCalledWith(
        1,
        'deactivate_user',
        'user',
        2,
        JSON.stringify({ isActive: false }),
        'localhost'
      );
    });

    it('should delete user and log action', async () => {
      const mockUser = {
        user_id: 2,
        email: 'user@test.com',
        display_name: 'User',
      };

      vi.mocked(sqliteService.getUserByFirebaseUid).mockResolvedValue(mockLocalAdminUser);
      vi.mocked(sqliteService.getUserById).mockResolvedValue(mockUser);
      vi.mocked(sqliteService.run).mockResolvedValue(undefined);
      vi.mocked(sqliteService.logAdminAction).mockResolvedValue(undefined);

      await adminService.deleteUser(2);

      expect(sqliteService.run).toHaveBeenCalledWith(
        'DELETE FROM users WHERE user_id = ?',
        [2]
      );

      expect(sqliteService.logAdminAction).toHaveBeenCalledWith(
        1,
        'delete_user',
        'user',
        2,
        JSON.stringify({ email: 'user@test.com' }),
        'localhost'
      );
    });
  });

  describe('Content Moderation', () => {
    beforeEach(() => {
      vi.mocked(hybridAuthService.getCurrentUser).mockReturnValue(mockAdminUser);
    });

    it('should get pending content for moderation', async () => {
      const mockPendingContent = [
        { content_type: 'lesson', content_id: 1, status: 'pending_review' },
        { content_type: 'quiz', content_id: 2, status: 'pending_review' },
        { content_type: 'translation', content_id: 3, status: 'pending_review' },
      ];

      vi.mocked(sqliteService.getPendingContent).mockResolvedValue(mockPendingContent);

      const result = await adminService.getPendingContent();

      expect(result).toEqual({
        pendingLessons: [mockPendingContent[0]],
        pendingQuizzes: [mockPendingContent[1]],
        pendingTranslations: [mockPendingContent[2]],
        totalPending: 3,
      });
    });

    it('should approve content and log action', async () => {
      vi.mocked(sqliteService.getUserByFirebaseUid).mockResolvedValue(mockLocalAdminUser);
      vi.mocked(sqliteService.updateTeacherContentStatus).mockResolvedValue(undefined);
      vi.mocked(sqliteService.logAdminAction).mockResolvedValue(undefined);

      await adminService.approveContent(1, 'Looks good!');

      expect(sqliteService.updateTeacherContentStatus).toHaveBeenCalledWith(
        1,
        'approved',
        1,
        'Looks good!'
      );

      expect(sqliteService.logAdminAction).toHaveBeenCalledWith(
        1,
        'approve_content',
        'teacher_content',
        1,
        JSON.stringify({ reviewNotes: 'Looks good!' }),
        'localhost'
      );
    });

    it('should reject content and log action', async () => {
      vi.mocked(sqliteService.getUserByFirebaseUid).mockResolvedValue(mockLocalAdminUser);
      vi.mocked(sqliteService.updateTeacherContentStatus).mockResolvedValue(undefined);
      vi.mocked(sqliteService.logAdminAction).mockResolvedValue(undefined);

      await adminService.rejectContent(1, 'Needs improvement');

      expect(sqliteService.updateTeacherContentStatus).toHaveBeenCalledWith(
        1,
        'rejected',
        1,
        'Needs improvement'
      );

      expect(sqliteService.logAdminAction).toHaveBeenCalledWith(
        1,
        'reject_content',
        'teacher_content',
        1,
        JSON.stringify({ reviewNotes: 'Needs improvement' }),
        'localhost'
      );
    });
  });

  describe('System Analytics', () => {
    beforeEach(() => {
      vi.mocked(hybridAuthService.getCurrentUser).mockReturnValue(mockAdminUser);
    });

    it('should return system analytics data', async () => {
      const analytics = await adminService.getSystemAnalytics();

      expect(analytics).toHaveProperty('userGrowth');
      expect(analytics).toHaveProperty('contentUsage');
      expect(analytics).toHaveProperty('languagePopularity');
      expect(analytics).toHaveProperty('performanceMetrics');

      expect(analytics.userGrowth).toBeInstanceOf(Array);
      expect(analytics.contentUsage).toBeInstanceOf(Array);
      expect(analytics.languagePopularity).toBeInstanceOf(Array);
      expect(analytics.performanceMetrics).toHaveProperty('avgLoadTime');
      expect(analytics.performanceMetrics).toHaveProperty('errorRate');
      expect(analytics.performanceMetrics).toHaveProperty('uptime');
    });
  });

  describe('Data Export', () => {
    beforeEach(() => {
      vi.mocked(hybridAuthService.getCurrentUser).mockReturnValue(mockAdminUser);
    });

    it('should export user data', async () => {
      const mockUsers = [{ user_id: 1, email: 'user@test.com' }];
      vi.mocked(sqliteService.query).mockResolvedValue(mockUsers);

      const blob = await adminService.exportData('users');

      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('application/json');
      expect(sqliteService.query).toHaveBeenCalledWith('SELECT * FROM users');
    });

    it('should export content data', async () => {
      const mockLessons = [{ lesson_id: 1, title: 'Test Lesson' }];
      const mockQuizzes = [{ quiz_id: 1, title: 'Test Quiz' }];
      const mockTranslations = [{ translation_id: 1, french_text: 'Hello' }];

      vi.mocked(sqliteService.query)
        .mockResolvedValueOnce(mockLessons)
        .mockResolvedValueOnce(mockQuizzes)
        .mockResolvedValueOnce(mockTranslations);

      const blob = await adminService.exportData('content');

      expect(blob).toBeInstanceOf(Blob);
      expect(sqliteService.query).toHaveBeenCalledWith('SELECT * FROM lessons');
      expect(sqliteService.query).toHaveBeenCalledWith('SELECT * FROM quizzes');
      expect(sqliteService.query).toHaveBeenCalledWith('SELECT * FROM translations');
    });

    it('should export all data', async () => {
      vi.mocked(sqliteService.query).mockResolvedValue([]);

      const blob = await adminService.exportData('all');

      expect(blob).toBeInstanceOf(Blob);
      // Should call queries for both users and content
      expect(sqliteService.query).toHaveBeenCalledTimes(4); // users, lessons, quizzes, translations
    });
  });

  describe('App Settings', () => {
    beforeEach(() => {
      vi.mocked(hybridAuthService.getCurrentUser).mockReturnValue(mockAdminUser);
      vi.mocked(sqliteService.getUserByFirebaseUid).mockResolvedValue(mockLocalAdminUser);
    });

    it('should update app setting and log action', async () => {
      vi.mocked(sqliteService.setSetting).mockResolvedValue(undefined);
      vi.mocked(sqliteService.logAdminAction).mockResolvedValue(undefined);

      await adminService.updateAppSetting('maintenance_mode', 'false');

      expect(sqliteService.setSetting).toHaveBeenCalledWith('maintenance_mode', 'false', 1);
      expect(sqliteService.logAdminAction).toHaveBeenCalledWith(
        1,
        'update_setting',
        'app_settings',
        undefined,
        JSON.stringify({ key: 'maintenance_mode', value: 'false' }),
        'localhost'
      );
    });

    it('should get app settings', async () => {
      const mockSettings = {
        maintenance_mode: 'false',
        max_upload_size: '10MB',
      };

      vi.mocked(sqliteService.getAllSettings).mockResolvedValue(mockSettings);

      const settings = await adminService.getAppSettings();

      expect(settings).toEqual(mockSettings);
      expect(sqliteService.getAllSettings).toHaveBeenCalled();
    });
  });

  describe('Database Backup', () => {
    beforeEach(() => {
      vi.mocked(hybridAuthService.getCurrentUser).mockReturnValue(mockAdminUser);
      vi.mocked(sqliteService.getUserByFirebaseUid).mockResolvedValue(mockLocalAdminUser);
    });

    it('should backup database and log action', async () => {
      const mockDbData = new Uint8Array([1, 2, 3, 4, 5]);
      vi.mocked(sqliteService.exportDatabase).mockReturnValue(mockDbData);
      vi.mocked(sqliteService.logAdminAction).mockResolvedValue(undefined);

      const blob = await adminService.backupDatabase();

      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('application/octet-stream');
      expect(sqliteService.exportDatabase).toHaveBeenCalled();
      expect(sqliteService.logAdminAction).toHaveBeenCalledWith(
        1,
        'backup_database',
        'system',
        undefined,
        JSON.stringify({ size: mockDbData.length }),
        'localhost'
      );
    });
  });

  describe('Admin Logs', () => {
    beforeEach(() => {
      vi.mocked(hybridAuthService.getCurrentUser).mockReturnValue(mockAdminUser);
    });

    it('should get admin logs', async () => {
      const mockLogs = [
        {
          log_id: 1,
          admin_id: 1,
          action: 'update_user_role',
          timestamp: Date.now(),
        },
      ];

      vi.mocked(sqliteService.getAdminLogs).mockResolvedValue(mockLogs);

      const logs = await adminService.getAdminLogs(50);

      expect(logs).toEqual(mockLogs);
      expect(sqliteService.getAdminLogs).toHaveBeenCalledWith(undefined, 50);
    });
  });
});
