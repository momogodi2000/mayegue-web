import { sqliteService } from '@/core/services/offline/sqlite.service';
import { hybridAuthService } from '@/core/services/auth/hybrid-auth.service';
import type { UserRecord } from '@/core/services/offline/types';
import type { UserRole } from '@/shared/types/user.types';

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalLessons: number;
  totalQuizzes: number;
  totalDictionaryEntries: number;
  pendingContent: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
  storageUsed: number;
  storageLimit: number;
}

export interface UserManagement {
  users: UserRecord[];
  totalCount: number;
  activeCount: number;
  newUsersToday: number;
}

export interface ContentModeration {
  pendingLessons: any[];
  pendingQuizzes: any[];
  pendingTranslations: any[];
  totalPending: number;
}

export interface SystemAnalytics {
  userGrowth: { date: string; count: number }[];
  contentUsage: { type: string; views: number }[];
  languagePopularity: { language: string; users: number }[];
  performanceMetrics: {
    avgLoadTime: number;
    errorRate: number;
    uptime: number;
  };
}

export class AdminService {
  /**
   * Verify admin access
   */
  private verifyAdminAccess(): void {
    const currentUser = hybridAuthService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required');
    }
  }

  /**
   * Get admin dashboard statistics
   */
  async getAdminStats(): Promise<AdminStats> {
    this.verifyAdminAccess();

    try {
      // Get user statistics
      const totalUsersResult = await sqliteService.query<{ count: number }>(
        'SELECT COUNT(*) as count FROM users'
      );
      const activeUsersResult = await sqliteService.query<{ count: number }>(
        'SELECT COUNT(*) as count FROM users WHERE is_active = 1'
      );

      // Get content statistics
      const totalLessonsResult = await sqliteService.query<{ count: number }>(
        'SELECT COUNT(*) as count FROM lessons'
      );
      const totalQuizzesResult = await sqliteService.query<{ count: number }>(
        'SELECT COUNT(*) as count FROM quizzes'
      );
      const totalTranslationsResult = await sqliteService.query<{ count: number }>(
        'SELECT COUNT(*) as count FROM translations'
      );

      // Get pending content for moderation
      const pendingContentResult = await sqliteService.query<{ count: number }>(
        'SELECT COUNT(*) as count FROM teacher_content WHERE status = ?',
        ['pending_review']
      );

      // Calculate storage usage (mock data - in production, this would be actual DB size)
      const storageUsed = 45; // MB
      const storageLimit = 100; // MB

      // Determine system health
      const errorRate = 0.02; // 2%
      const storagePercentage = (storageUsed / storageLimit) * 100;
      let systemHealth: 'healthy' | 'warning' | 'critical' = 'healthy';

      if (errorRate > 0.05 || storagePercentage > 90) {
        systemHealth = 'critical';
      } else if (errorRate > 0.02 || storagePercentage > 75) {
        systemHealth = 'warning';
      }

      return {
        totalUsers: totalUsersResult[0]?.count || 0,
        activeUsers: activeUsersResult[0]?.count || 0,
        totalLessons: totalLessonsResult[0]?.count || 0,
        totalQuizzes: totalQuizzesResult[0]?.count || 0,
        totalDictionaryEntries: totalTranslationsResult[0]?.count || 0,
        pendingContent: pendingContentResult[0]?.count || 0,
        systemHealth,
        storageUsed,
        storageLimit,
      };
    } catch (error) {
      console.error('Error getting admin stats:', error);
      throw error;
    }
  }

  /**
   * Get all users for management
   */
  async getUsers(page = 1, limit = 20, search?: string, role?: UserRole): Promise<UserManagement> {
    this.verifyAdminAccess();

    try {
      let query = 'SELECT * FROM users';
      let countQuery = 'SELECT COUNT(*) as count FROM users';
      const params: any[] = [];
      const conditions: string[] = [];

      // Add search filter
      if (search) {
        conditions.push('(display_name LIKE ? OR email LIKE ?)');
        params.push(`%${search}%`, `%${search}%`);
      }

      // Add role filter
      if (role) {
        conditions.push('role = ?');
        params.push(role);
      }

      // Build WHERE clause
      if (conditions.length > 0) {
        const whereClause = ` WHERE ${conditions.join(' AND ')}`;
        query += whereClause;
        countQuery += whereClause;
      }

      // Add pagination
      query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      params.push(limit, (page - 1) * limit);

      // Execute queries
      const users = await sqliteService.query<UserRecord>(query, params);
      const totalResult = await sqliteService.query<{ count: number }>(countQuery, params.slice(0, -2));
      
      // Get active users count
      const activeResult = await sqliteService.query<{ count: number }>(
        'SELECT COUNT(*) as count FROM users WHERE is_active = 1'
      );

      // Get new users today
      const today = new Date().toISOString().split('T')[0];
      const newTodayResult = await sqliteService.query<{ count: number }>(
        'SELECT COUNT(*) as count FROM users WHERE DATE(created_at/1000, "unixepoch") = ?',
        [today]
      );

      return {
        users,
        totalCount: totalResult[0]?.count || 0,
        activeCount: activeResult[0]?.count || 0,
        newUsersToday: newTodayResult[0]?.count || 0,
      };
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  }

  /**
   * Update user role
   */
  async updateUserRole(userId: number, newRole: UserRole): Promise<void> {
    this.verifyAdminAccess();

    try {
      const currentUser = hybridAuthService.getCurrentUser();
      const adminUser = await sqliteService.getUserByFirebaseUid(currentUser!.id);

      await sqliteService.updateUser(userId, {
        role: newRole as any,
        updatedAt: Date.now(),
      });

      // Log admin action
      await sqliteService.logAdminAction(
        adminUser!.user_id!,
        'update_user_role',
        'user',
        userId,
        JSON.stringify({ newRole }),
        'localhost' // In production, get actual IP
      );
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }

  /**
   * Activate/deactivate user
   */
  async toggleUserStatus(userId: number, isActive: boolean): Promise<void> {
    this.verifyAdminAccess();

    try {
      const currentUser = hybridAuthService.getCurrentUser();
      const adminUser = await sqliteService.getUserByFirebaseUid(currentUser!.id);

      await sqliteService.updateUser(userId, {
        isActive,
        updatedAt: Date.now(),
      });

      // Log admin action
      await sqliteService.logAdminAction(
        adminUser!.user_id!,
        isActive ? 'activate_user' : 'deactivate_user',
        'user',
        userId,
        JSON.stringify({ isActive }),
        'localhost'
      );
    } catch (error) {
      console.error('Error toggling user status:', error);
      throw error;
    }
  }

  /**
   * Delete user
   */
  async deleteUser(userId: number): Promise<void> {
    this.verifyAdminAccess();

    try {
      const currentUser = hybridAuthService.getCurrentUser();
      const adminUser = await sqliteService.getUserByFirebaseUid(currentUser!.id);

      // Get user info before deletion for logging
      const user = await sqliteService.getUserById(userId);
      
      // Delete user (CASCADE will handle related records)
      await sqliteService.run('DELETE FROM users WHERE user_id = ?', [userId]);

      // Log admin action
      await sqliteService.logAdminAction(
        adminUser!.user_id!,
        'delete_user',
        'user',
        userId,
        JSON.stringify({ email: user?.email }),
        'localhost'
      );
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  /**
   * Get content pending moderation
   */
  async getPendingContent(): Promise<ContentModeration> {
    this.verifyAdminAccess();

    try {
      const pendingContent = await sqliteService.getPendingContent();
      
      const pendingLessons = pendingContent.filter((c: any) => c.content_type === 'lesson');
      const pendingQuizzes = pendingContent.filter((c: any) => c.content_type === 'quiz');
      const pendingTranslations = pendingContent.filter((c: any) => c.content_type === 'translation');

      return {
        pendingLessons,
        pendingQuizzes,
        pendingTranslations,
        totalPending: pendingContent.length,
      };
    } catch (error) {
      console.error('Error getting pending content:', error);
      throw error;
    }
  }

  /**
   * Approve content
   */
  async approveContent(contentId: number, reviewNotes?: string): Promise<void> {
    this.verifyAdminAccess();

    try {
      const currentUser = hybridAuthService.getCurrentUser();
      const adminUser = await sqliteService.getUserByFirebaseUid(currentUser!.id);

      await sqliteService.updateTeacherContentStatus(
        contentId,
        'approved',
        adminUser!.user_id!,
        reviewNotes
      );

      // Log admin action
      await sqliteService.logAdminAction(
        adminUser!.user_id!,
        'approve_content',
        'teacher_content',
        contentId,
        JSON.stringify({ reviewNotes }),
        'localhost'
      );
    } catch (error) {
      console.error('Error approving content:', error);
      throw error;
    }
  }

  /**
   * Reject content
   */
  async rejectContent(contentId: number, reviewNotes: string): Promise<void> {
    this.verifyAdminAccess();

    try {
      const currentUser = hybridAuthService.getCurrentUser();
      const adminUser = await sqliteService.getUserByFirebaseUid(currentUser!.id);

      await sqliteService.updateTeacherContentStatus(
        contentId,
        'rejected',
        adminUser!.user_id!,
        reviewNotes
      );

      // Log admin action
      await sqliteService.logAdminAction(
        adminUser!.user_id!,
        'reject_content',
        'teacher_content',
        contentId,
        JSON.stringify({ reviewNotes }),
        'localhost'
      );
    } catch (error) {
      console.error('Error rejecting content:', error);
      throw error;
    }
  }

  /**
   * Get system analytics
   */
  async getSystemAnalytics(): Promise<SystemAnalytics> {
    this.verifyAdminAccess();

    try {
      // Mock analytics data - in production, this would come from actual usage tracking
      const userGrowth = [
        { date: '2024-01-01', count: 100 },
        { date: '2024-01-02', count: 120 },
        { date: '2024-01-03', count: 145 },
        { date: '2024-01-04', count: 160 },
        { date: '2024-01-05', count: 180 },
        { date: '2024-01-06', count: 200 },
        { date: '2024-01-07', count: 225 },
      ];

      const contentUsage = [
        { type: 'Lessons', views: 1250 },
        { type: 'Dictionary', views: 890 },
        { type: 'Quizzes', views: 670 },
        { type: 'AI Assistant', views: 450 },
      ];

      const languagePopularity = [
        { language: 'Ewondo', users: 450 },
        { language: 'Duala', users: 320 },
        { language: 'Fulfulde', users: 280 },
        { language: 'Bassa', users: 180 },
        { language: 'Feefee', users: 120 },
      ];

      const performanceMetrics = {
        avgLoadTime: 1.2, // seconds
        errorRate: 0.02, // 2%
        uptime: 99.8, // percentage
      };

      return {
        userGrowth,
        contentUsage,
        languagePopularity,
        performanceMetrics,
      };
    } catch (error) {
      console.error('Error getting system analytics:', error);
      throw error;
    }
  }

  /**
   * Get admin logs
   */
  async getAdminLogs(limit = 50): Promise<any[]> {
    this.verifyAdminAccess();

    try {
      return await sqliteService.getAdminLogs(undefined, limit);
    } catch (error) {
      console.error('Error getting admin logs:', error);
      throw error;
    }
  }

  /**
   * Export data
   */
  async exportData(type: 'users' | 'content' | 'all'): Promise<Blob> {
    this.verifyAdminAccess();

    try {
      let data: any = {};

      if (type === 'users' || type === 'all') {
        data.users = await sqliteService.query('SELECT * FROM users');
      }

      if (type === 'content' || type === 'all') {
        data.lessons = await sqliteService.query('SELECT * FROM lessons');
        data.quizzes = await sqliteService.query('SELECT * FROM quizzes');
        data.translations = await sqliteService.query('SELECT * FROM translations');
      }

      // Add metadata
      data.exportDate = new Date().toISOString();
      data.exportType = type;
      data.version = '2.0.0';

      const jsonString = JSON.stringify(data, null, 2);
      return new Blob([jsonString], { type: 'application/json' });
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }

  /**
   * Update app settings
   */
  async updateAppSetting(key: string, value: string): Promise<void> {
    this.verifyAdminAccess();

    try {
      const currentUser = hybridAuthService.getCurrentUser();
      const adminUser = await sqliteService.getUserByFirebaseUid(currentUser!.id);

      await sqliteService.setSetting(key, value, adminUser!.user_id!);

      // Log admin action
      await sqliteService.logAdminAction(
        adminUser!.user_id!,
        'update_setting',
        'app_settings',
        undefined,
        JSON.stringify({ key, value }),
        'localhost'
      );
    } catch (error) {
      console.error('Error updating app setting:', error);
      throw error;
    }
  }

  /**
   * Get app settings
   */
  async getAppSettings(): Promise<Record<string, string>> {
    this.verifyAdminAccess();

    try {
      return await sqliteService.getAllSettings();
    } catch (error) {
      console.error('Error getting app settings:', error);
      throw error;
    }
  }

  /**
   * Backup database
   */
  async backupDatabase(): Promise<Blob> {
    this.verifyAdminAccess();

    try {
      const currentUser = hybridAuthService.getCurrentUser();
      const adminUser = await sqliteService.getUserByFirebaseUid(currentUser!.id);

      // Export database
      const dbData = sqliteService.exportDatabase();
      const arrayBuffer = new ArrayBuffer(dbData.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      uint8Array.set(dbData);
      
      // Log admin action
      await sqliteService.logAdminAction(
        adminUser!.user_id!,
        'backup_database',
        'system',
        undefined,
        JSON.stringify({ size: dbData.length }),
        'localhost'
      );

      return new Blob([arrayBuffer], { type: 'application/octet-stream' });
    } catch (error) {
      console.error('Error backing up database:', error);
      throw error;
    }
  }
}

export const adminService = new AdminService();
