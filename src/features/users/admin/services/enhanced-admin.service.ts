import { sqliteService } from '@/core/services/offline/sqlite.service';
import { hybridAuthService } from '@/core/services/auth/hybrid-auth.service';
import { syncEngineService } from '@/features/sync/services/sync-engine.service';
import { enhancedTeacherService, type TeacherContent } from '@/features/users/teacher/services/enhanced-teacher.service';
import type { 
  UserRecord, 
  LessonRecord, 
  QuizRecord, 
  DictionaryRecord 
} from '@/core/services/offline/types';
import type { UserRole } from '@/shared/types/user.types';
import toast from 'react-hot-toast';

export interface AdminUser extends UserRecord {
  lastLoginFormatted: string;
  createdAtFormatted: string;
  isOnline: boolean;
  totalSessions: number;
  totalXPEarned: number;
  contentCreated: number;
  reportsCount: number;
}

export interface ContentModerationItem {
  id: string;
  type: 'lesson' | 'quiz' | 'translation';
  title: string;
  description: string;
  createdBy: string;
  createdByName: string;
  createdAt: Date;
  status: 'pending_review' | 'approved' | 'rejected';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  category: string;
  language: string;
  reportCount: number;
  lastReported?: Date;
  reviewNotes?: string;
  content: any;
  metadata?: {
    difficulty?: string;
    estimatedDuration?: number;
    tags?: string[];
    flaggedReasons?: string[];
  };
}

export interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  totalContent: number;
  pendingContent: number;
  totalSessions: number;
  averageSessionDuration: number;
  systemHealth: {
    database: 'healthy' | 'warning' | 'error';
    sync: 'healthy' | 'warning' | 'error';
    storage: 'healthy' | 'warning' | 'error';
    performance: 'healthy' | 'warning' | 'error';
  };
  resourceUsage: {
    databaseSize: number; // MB
    storageUsed: number; // MB
    storageLimit: number; // MB
    syncQueueSize: number;
    errorCount: number;
  };
  recentActivity: {
    type: 'user_registered' | 'content_created' | 'content_approved' | 'content_rejected' | 'system_error';
    title: string;
    timestamp: Date;
    userId?: string;
    details?: any;
  }[];
}

export interface UserActivity {
  userId: string;
  userName: string;
  userEmail: string;
  activities: {
    type: 'login' | 'logout' | 'content_created' | 'lesson_completed' | 'quiz_taken' | 'achievement_earned';
    timestamp: Date;
    details: any;
    ipAddress?: string;
    userAgent?: string;
  }[];
  summary: {
    totalSessions: number;
    totalTime: number; // minutes
    lastActivity: Date;
    contentInteractions: number;
    achievementsEarned: number;
  };
}

export interface BackupInfo {
  id: string;
  type: 'full' | 'incremental' | 'users' | 'content';
  size: number; // bytes
  createdAt: Date;
  status: 'creating' | 'completed' | 'failed';
  downloadUrl?: string;
  expiresAt?: Date;
  metadata: {
    userCount: number;
    contentCount: number;
    version: string;
    checksum: string;
  };
}

export interface AdminReport {
  id: string;
  type: 'user_activity' | 'content_analytics' | 'system_performance' | 'security_audit';
  title: string;
  description: string;
  generatedAt: Date;
  generatedBy: string;
  status: 'generating' | 'completed' | 'failed';
  data: any;
  downloadUrl?: string;
  scheduledFor?: Date;
  recurring?: 'daily' | 'weekly' | 'monthly';
}

export interface SecurityAlert {
  id: string;
  type: 'suspicious_login' | 'multiple_failed_attempts' | 'unusual_activity' | 'data_breach_attempt';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: Date;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: Date;
  actions: string[];
}

export class EnhancedAdminService {
  /**
   * Get all users with enhanced information
   */
  async getAllUsers(): Promise<AdminUser[]> {
    try {
      const user = hybridAuthService.getCurrentUser();
      if (!user || user.role !== 'admin') {
        throw new Error('Unauthorized: Admin access required');
      }

      // Get users from localStorage for now
      const stored = localStorage.getItem('admin_users');
      if (stored) {
        const users = JSON.parse(stored);
        return users.map((u: any) => ({
          ...u,
          lastLoginFormatted: new Date(u.lastLogin).toLocaleDateString('fr-FR'),
          createdAtFormatted: new Date(u.createdAt).toLocaleDateString('fr-FR'),
          isOnline: Date.now() - u.lastLogin < 5 * 60 * 1000, // 5 minutes
        }));
      }

      // Mock data for demonstration
      const mockUsers: AdminUser[] = [
        {
          id: 'user_1',
          firebaseUid: 'firebase_1',
          email: 'marie.nguema@example.com',
          displayName: 'Marie Nguema',
          role: 'learner',
          level: 3,
          xp: 2400,
          coins: 150,
          subscription: 'free',
          createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
          updatedAt: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
          lastLogin: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
          preferences: {},
          syncStatus: 'synced',
          lastLoginFormatted: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
          createdAtFormatted: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
          isOnline: true,
          totalSessions: 45,
          totalXPEarned: 2400,
          contentCreated: 0,
          reportsCount: 0
        },
        {
          id: 'user_2',
          firebaseUid: 'firebase_2',
          email: 'paul.mbarga@example.com',
          displayName: 'Paul Mbarga',
          role: 'learner',
          level: 4,
          xp: 3600,
          coins: 220,
          subscription: 'premium',
          createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000, // 60 days ago
          updatedAt: Date.now() - 1 * 60 * 60 * 1000, // 1 hour ago
          lastLogin: Date.now() - 1 * 60 * 60 * 1000, // 1 hour ago
          preferences: {},
          syncStatus: 'synced',
          lastLoginFormatted: new Date(Date.now() - 1 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
          createdAtFormatted: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
          isOnline: true,
          totalSessions: 78,
          totalXPEarned: 3600,
          contentCreated: 0,
          reportsCount: 0
        },
        {
          id: 'user_3',
          firebaseUid: 'firebase_3',
          email: 'teacher@mayegue.com',
          displayName: 'Professeur Ewondo',
          role: 'teacher',
          level: 8,
          xp: 8500,
          coins: 450,
          subscription: 'teacher',
          createdAt: Date.now() - 120 * 24 * 60 * 60 * 1000, // 120 days ago
          updatedAt: Date.now() - 30 * 60 * 1000, // 30 minutes ago
          lastLogin: Date.now() - 30 * 60 * 1000, // 30 minutes ago
          preferences: {},
          syncStatus: 'synced',
          lastLoginFormatted: new Date(Date.now() - 30 * 60 * 1000).toLocaleDateString('fr-FR'),
          createdAtFormatted: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
          isOnline: true,
          totalSessions: 156,
          totalXPEarned: 8500,
          contentCreated: 24,
          reportsCount: 0
        }
      ];

      // Store mock data
      localStorage.setItem('admin_users', JSON.stringify(mockUsers));
      return mockUsers;
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }

  /**
   * Update user role
   */
  async updateUserRole(userId: string, newRole: UserRole): Promise<void> {
    try {
      const user = hybridAuthService.getCurrentUser();
      if (!user || user.role !== 'admin') {
        throw new Error('Unauthorized: Admin access required');
      }

      const users = await this.getAllUsers();
      const updatedUsers = users.map(u => 
        u.id === userId ? { ...u, role: newRole, updatedAt: Date.now() } : u
      );
      
      localStorage.setItem('admin_users', JSON.stringify(updatedUsers));

      // Queue sync operation
      await syncEngineService.queueOperation({
        type: 'update',
        entity: 'user_content',
        entityId: userId,
        data: { role: newRole },
        priority: 'high'
      });

      // Log admin action
      await this.logAdminAction({
        type: 'user_role_updated',
        targetUserId: userId,
        details: { oldRole: users.find(u => u.id === userId)?.role, newRole },
        timestamp: new Date()
      });

      toast.success('Rôle utilisateur mis à jour avec succès');
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Erreur lors de la mise à jour du rôle');
      throw error;
    }
  }

  /**
   * Delete user
   */
  async deleteUser(userId: string): Promise<void> {
    try {
      const user = hybridAuthService.getCurrentUser();
      if (!user || user.role !== 'admin') {
        throw new Error('Unauthorized: Admin access required');
      }

      if (userId === user.id) {
        throw new Error('Cannot delete your own account');
      }

      const users = await this.getAllUsers();
      const targetUser = users.find(u => u.id === userId);
      if (!targetUser) {
        throw new Error('User not found');
      }

      const updatedUsers = users.filter(u => u.id !== userId);
      localStorage.setItem('admin_users', JSON.stringify(updatedUsers));

      // Queue sync operation
      await syncEngineService.queueOperation({
        type: 'delete',
        entity: 'user_content',
        entityId: userId,
        data: { deleted: true },
        priority: 'high'
      });

      // Log admin action
      await this.logAdminAction({
        type: 'user_deleted',
        targetUserId: userId,
        details: { deletedUser: targetUser.email },
        timestamp: new Date()
      });

      toast.success('Utilisateur supprimé avec succès');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Erreur lors de la suppression de l\'utilisateur');
      throw error;
    }
  }

  /**
   * Get content for moderation
   */
  async getContentForModeration(): Promise<ContentModerationItem[]> {
    try {
      const user = hybridAuthService.getCurrentUser();
      if (!user || user.role !== 'admin') {
        throw new Error('Unauthorized: Admin access required');
      }

      // Get teacher content that needs moderation
      const teacherContent = await enhancedTeacherService.getTeacherContent() as TeacherContent[];
      
      const moderationItems: ContentModerationItem[] = teacherContent
        .filter(content => content.status === 'pending_review' || content.status === 'draft')
        .map(content => ({
          id: content.id,
          type: content.type,
          title: content.title,
          description: content.description || '',
          createdBy: content.teacherId,
          createdByName: 'Enseignant', // Would be fetched from user data
          createdAt: content.createdAt,
          status: content.status === 'draft' ? 'pending_review' as const : content.status,
          priority: 'normal',
          category: content.metadata?.category || 'Autre',
          language: content.metadata?.language || 'Français',
          reportCount: 0,
          content: content.content,
          metadata: {
            difficulty: content.metadata?.difficulty,
            estimatedDuration: content.metadata?.estimatedDuration,
            tags: content.metadata?.tags,
            flaggedReasons: []
          }
        }));

      return moderationItems;
    } catch (error) {
      console.error('Error getting content for moderation:', error);
      return [];
    }
  }

  /**
   * Approve content
   */
  async approveContent(contentId: string, reviewNotes?: string): Promise<void> {
    try {
      const user = hybridAuthService.getCurrentUser();
      if (!user || user.role !== 'admin') {
        throw new Error('Unauthorized: Admin access required');
      }

      // Update content status in teacher service
      const teacherContent = await enhancedTeacherService.getTeacherContentById(contentId);
      if (teacherContent) {
        const updatedContent = {
          ...teacherContent,
          status: 'approved' as const,
          reviewedBy: user.id,
          reviewedAt: new Date(),
          reviewNotes
        };

        // This would normally update through the teacher service
        // For now, we'll update localStorage directly
        const allContent = await enhancedTeacherService.getTeacherContent() as TeacherContent[];
        const updatedAllContent = allContent.map(c => 
          c.id === contentId ? updatedContent : c
        );
        
        localStorage.setItem(`teacher_content_${teacherContent.teacherId}`, JSON.stringify(updatedAllContent));
      }

      // Log admin action
      await this.logAdminAction({
        type: 'content_approved',
        targetContentId: contentId,
        details: { reviewNotes },
        timestamp: new Date()
      });

      toast.success('Contenu approuvé avec succès');
    } catch (error) {
      console.error('Error approving content:', error);
      toast.error('Erreur lors de l\'approbation du contenu');
      throw error;
    }
  }

  /**
   * Reject content
   */
  async rejectContent(contentId: string, reviewNotes: string): Promise<void> {
    try {
      const user = hybridAuthService.getCurrentUser();
      if (!user || user.role !== 'admin') {
        throw new Error('Unauthorized: Admin access required');
      }

      // Update content status in teacher service
      const teacherContent = await enhancedTeacherService.getTeacherContentById(contentId);
      if (teacherContent) {
        const updatedContent = {
          ...teacherContent,
          status: 'rejected' as const,
          reviewedBy: user.id,
          reviewedAt: new Date(),
          reviewNotes
        };

        // This would normally update through the teacher service
        // For now, we'll update localStorage directly
        const allContent = await enhancedTeacherService.getTeacherContent() as TeacherContent[];
        const updatedAllContent = allContent.map(c => 
          c.id === contentId ? updatedContent : c
        );
        
        localStorage.setItem(`teacher_content_${teacherContent.teacherId}`, JSON.stringify(updatedAllContent));
      }

      // Log admin action
      await this.logAdminAction({
        type: 'content_rejected',
        targetContentId: contentId,
        details: { reviewNotes },
        timestamp: new Date()
      });

      toast.success('Contenu rejeté avec succès');
    } catch (error) {
      console.error('Error rejecting content:', error);
      toast.error('Erreur lors du rejet du contenu');
      throw error;
    }
  }

  /**
   * Get system statistics
   */
  async getSystemStats(): Promise<SystemStats> {
    try {
      const user = hybridAuthService.getCurrentUser();
      if (!user || user.role !== 'admin') {
        throw new Error('Unauthorized: Admin access required');
      }

      const users = await this.getAllUsers();
      const contentForModeration = await this.getContentForModeration();

      const stats: SystemStats = {
        totalUsers: users.length,
        activeUsers: users.filter(u => u.isOnline).length,
        newUsersToday: users.filter(u => 
          Date.now() - u.createdAt < 24 * 60 * 60 * 1000
        ).length,
        totalContent: users.reduce((sum, u) => sum + u.contentCreated, 0),
        pendingContent: contentForModeration.length,
        totalSessions: users.reduce((sum, u) => sum + u.totalSessions, 0),
        averageSessionDuration: 25, // Mock data
        systemHealth: {
          database: 'healthy',
          sync: 'healthy',
          storage: 'healthy',
          performance: 'healthy'
        },
        resourceUsage: {
          databaseSize: 15.7, // MB
          storageUsed: 45.2, // MB
          storageLimit: 1000, // MB
          syncQueueSize: 12,
          errorCount: 0
        },
        recentActivity: [
          {
            type: 'user_registered',
            title: 'Nouvel utilisateur inscrit: marie.nguema@example.com',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            userId: 'user_1'
          },
          {
            type: 'content_created',
            title: 'Nouvelle leçon créée: "Salutations en Bassa"',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
            userId: 'user_3'
          },
          {
            type: 'content_approved',
            title: 'Contenu approuvé: Quiz "Nombres en Ewondo"',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
            userId: user.id
          }
        ]
      };

      return stats;
    } catch (error) {
      console.error('Error getting system stats:', error);
      throw error;
    }
  }

  /**
   * Create database backup
   */
  async createBackup(type: 'full' | 'incremental' | 'users' | 'content' = 'full'): Promise<BackupInfo> {
    try {
      const user = hybridAuthService.getCurrentUser();
      if (!user || user.role !== 'admin') {
        throw new Error('Unauthorized: Admin access required');
      }

      const backupId = `backup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Get data to backup
      const users = await this.getAllUsers();
      const teacherContent = await enhancedTeacherService.getTeacherContent() as TeacherContent[];
      
      const backupData = {
        id: backupId,
        type,
        createdAt: new Date(),
        createdBy: user.id,
        version: '1.1.0',
        data: {
          users: type === 'full' || type === 'users' ? users : [],
          content: type === 'full' || type === 'content' ? teacherContent : []
        }
      };

      // Create backup blob
      const backupBlob = new Blob([JSON.stringify(backupData, null, 2)], {
        type: 'application/json'
      });

      const backup: BackupInfo = {
        id: backupId,
        type,
        size: backupBlob.size,
        createdAt: new Date(),
        status: 'completed',
        downloadUrl: URL.createObjectURL(backupBlob),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        metadata: {
          userCount: users.length,
          contentCount: teacherContent.length,
          version: '1.1.0',
          checksum: await this.generateChecksum(JSON.stringify(backupData))
        }
      };

      // Store backup info
      const existingBackups = this.getStoredBackups();
      existingBackups.push(backup);
      localStorage.setItem('admin_backups', JSON.stringify(existingBackups));

      // Log admin action
      await this.logAdminAction({
        type: 'backup_created',
        details: { backupId, type, size: backup.size },
        timestamp: new Date()
      });

      toast.success('Sauvegarde créée avec succès');
      return backup;
    } catch (error) {
      console.error('Error creating backup:', error);
      toast.error('Erreur lors de la création de la sauvegarde');
      throw error;
    }
  }

  /**
   * Get all backups
   */
  getBackups(): BackupInfo[] {
    return this.getStoredBackups();
  }

  /**
   * Delete backup
   */
  async deleteBackup(backupId: string): Promise<void> {
    try {
      const user = hybridAuthService.getCurrentUser();
      if (!user || user.role !== 'admin') {
        throw new Error('Unauthorized: Admin access required');
      }

      const backups = this.getStoredBackups();
      const backup = backups.find(b => b.id === backupId);
      
      if (backup?.downloadUrl) {
        URL.revokeObjectURL(backup.downloadUrl);
      }

      const updatedBackups = backups.filter(b => b.id !== backupId);
      localStorage.setItem('admin_backups', JSON.stringify(updatedBackups));

      // Log admin action
      await this.logAdminAction({
        type: 'backup_deleted',
        details: { backupId },
        timestamp: new Date()
      });

      toast.success('Sauvegarde supprimée avec succès');
    } catch (error) {
      console.error('Error deleting backup:', error);
      toast.error('Erreur lors de la suppression de la sauvegarde');
      throw error;
    }
  }

  /**
   * Get user activity
   */
  async getUserActivity(userId: string): Promise<UserActivity | null> {
    try {
      const user = hybridAuthService.getCurrentUser();
      if (!user || user.role !== 'admin') {
        throw new Error('Unauthorized: Admin access required');
      }

      const users = await this.getAllUsers();
      const targetUser = users.find(u => u.id === userId);
      
      if (!targetUser) {
        return null;
      }

      // Mock activity data
      const activity: UserActivity = {
        userId: targetUser.id,
        userName: targetUser.displayName,
        userEmail: targetUser.email,
        activities: [
          {
            type: 'login',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            details: { method: 'email' },
            ipAddress: '192.168.1.100',
            userAgent: 'Mozilla/5.0...'
          },
          {
            type: 'lesson_completed',
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
            details: { lessonId: 'lesson_1', score: 85 }
          },
          {
            type: 'achievement_earned',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
            details: { achievementId: 'first_lesson', xpEarned: 100 }
          }
        ],
        summary: {
          totalSessions: targetUser.totalSessions,
          totalTime: targetUser.totalSessions * 25, // Mock average session time
          lastActivity: new Date(targetUser.lastLogin),
          contentInteractions: 45,
          achievementsEarned: 8
        }
      };

      return activity;
    } catch (error) {
      console.error('Error getting user activity:', error);
      return null;
    }
  }

  /**
   * Generate system report
   */
  async generateReport(type: AdminReport['type']): Promise<AdminReport> {
    try {
      const user = hybridAuthService.getCurrentUser();
      if (!user || user.role !== 'admin') {
        throw new Error('Unauthorized: Admin access required');
      }

      const reportId = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      let reportData: any = {};
      let title = '';
      let description = '';

      switch (type) {
        case 'user_activity':
          title = 'Rapport d\'activité utilisateur';
          description = 'Analyse détaillée de l\'activité des utilisateurs';
          reportData = await this.generateUserActivityReport();
          break;
        case 'content_analytics':
          title = 'Analyse du contenu';
          description = 'Statistiques sur le contenu créé et consommé';
          reportData = await this.generateContentAnalyticsReport();
          break;
        case 'system_performance':
          title = 'Performance système';
          description = 'Métriques de performance et utilisation des ressources';
          reportData = await this.generateSystemPerformanceReport();
          break;
        case 'security_audit':
          title = 'Audit de sécurité';
          description = 'Analyse des événements de sécurité et des vulnérabilités';
          reportData = await this.generateSecurityAuditReport();
          break;
      }

      const report: AdminReport = {
        id: reportId,
        type,
        title,
        description,
        generatedAt: new Date(),
        generatedBy: user.id,
        status: 'completed',
        data: reportData
      };

      // Store report
      const existingReports = this.getStoredReports();
      existingReports.push(report);
      localStorage.setItem('admin_reports', JSON.stringify(existingReports));

      // Log admin action
      await this.logAdminAction({
        type: 'report_generated',
        details: { reportId, reportType: type },
        timestamp: new Date()
      });

      toast.success('Rapport généré avec succès');
      return report;
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Erreur lors de la génération du rapport');
      throw error;
    }
  }

  /**
   * Get security alerts
   */
  async getSecurityAlerts(): Promise<SecurityAlert[]> {
    try {
      const user = hybridAuthService.getCurrentUser();
      if (!user || user.role !== 'admin') {
        throw new Error('Unauthorized: Admin access required');
      }

      // Mock security alerts
      const alerts: SecurityAlert[] = [
        {
          id: 'alert_1',
          type: 'multiple_failed_attempts',
          severity: 'medium',
          title: 'Tentatives de connexion multiples échouées',
          description: '5 tentatives de connexion échouées pour l\'utilisateur marie@example.com',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          userId: 'user_1',
          ipAddress: '192.168.1.100',
          resolved: false,
          actions: ['Bloquer IP temporairement', 'Notifier l\'utilisateur', 'Forcer la réinitialisation du mot de passe']
        },
        {
          id: 'alert_2',
          type: 'unusual_activity',
          severity: 'low',
          title: 'Activité inhabituelle détectée',
          description: 'Connexion depuis un nouvel appareil pour paul@example.com',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          userId: 'user_2',
          ipAddress: '10.0.0.50',
          resolved: true,
          resolvedBy: user.id,
          resolvedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
          actions: ['Vérification d\'identité effectuée']
        }
      ];

      return alerts;
    } catch (error) {
      console.error('Error getting security alerts:', error);
      return [];
    }
  }

  // Private helper methods

  private getStoredBackups(): BackupInfo[] {
    try {
      const stored = localStorage.getItem('admin_backups');
      if (stored) {
        return JSON.parse(stored).map((backup: any) => ({
          ...backup,
          createdAt: new Date(backup.createdAt),
          expiresAt: backup.expiresAt ? new Date(backup.expiresAt) : undefined
        }));
      }
      return [];
    } catch (error) {
      console.error('Error getting stored backups:', error);
      return [];
    }
  }

  private getStoredReports(): AdminReport[] {
    try {
      const stored = localStorage.getItem('admin_reports');
      if (stored) {
        return JSON.parse(stored).map((report: any) => ({
          ...report,
          generatedAt: new Date(report.generatedAt),
          scheduledFor: report.scheduledFor ? new Date(report.scheduledFor) : undefined
        }));
      }
      return [];
    } catch (error) {
      console.error('Error getting stored reports:', error);
      return [];
    }
  }

  private async generateChecksum(data: string): Promise<string> {
    // Simple checksum for demo purposes
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  }

  private async generateUserActivityReport(): Promise<any> {
    const users = await this.getAllUsers();
    return {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.isOnline).length,
      usersByRole: {
        admin: users.filter(u => u.role === 'admin').length,
        teacher: users.filter(u => u.role === 'teacher').length,
        learner: users.filter(u => u.role === 'learner').length,
        guest: users.filter(u => u.role === 'guest').length
      },
      averageXP: users.reduce((sum, u) => sum + u.xp, 0) / users.length,
      topUsers: users.sort((a, b) => b.xp - a.xp).slice(0, 10)
    };
  }

  private async generateContentAnalyticsReport(): Promise<any> {
    const teacherContent = await enhancedTeacherService.getTeacherContent() as TeacherContent[];
    return {
      totalContent: teacherContent.length,
      contentByType: {
        lesson: teacherContent.filter(c => c.type === 'lesson').length,
        quiz: teacherContent.filter(c => c.type === 'quiz').length,
        translation: teacherContent.filter(c => c.type === 'translation').length
      },
      contentByStatus: {
        approved: teacherContent.filter(c => c.status === 'approved').length,
        pending: teacherContent.filter(c => c.status === 'pending_review').length,
        rejected: teacherContent.filter(c => c.status === 'rejected').length
      },
      averageCreationTime: '2.5 days' // Mock data
    };
  }

  private async generateSystemPerformanceReport(): Promise<any> {
    const stats = await this.getSystemStats();
    return {
      systemHealth: stats.systemHealth,
      resourceUsage: stats.resourceUsage,
      performance: {
        averageResponseTime: '150ms',
        uptime: '99.9%',
        errorRate: '0.1%'
      }
    };
  }

  private async generateSecurityAuditReport(): Promise<any> {
    const alerts = await this.getSecurityAlerts();
    return {
      totalAlerts: alerts.length,
      alertsBySeverity: {
        critical: alerts.filter(a => a.severity === 'critical').length,
        high: alerts.filter(a => a.severity === 'high').length,
        medium: alerts.filter(a => a.severity === 'medium').length,
        low: alerts.filter(a => a.severity === 'low').length
      },
      resolvedAlerts: alerts.filter(a => a.resolved).length,
      securityScore: 85 // Mock score
    };
  }

  private async logAdminAction(action: {
    type: string;
    targetUserId?: string;
    targetContentId?: string;
    details?: any;
    timestamp: Date;
  }): Promise<void> {
    try {
      const user = hybridAuthService.getCurrentUser();
      if (!user) return;

      const log = {
        id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        adminId: user.id,
        adminEmail: user.email,
        ...action
      };

      const existingLogs = JSON.parse(localStorage.getItem('admin_logs') || '[]');
      existingLogs.push(log);
      
      // Keep only last 1000 logs
      if (existingLogs.length > 1000) {
        existingLogs.splice(0, existingLogs.length - 1000);
      }
      
      localStorage.setItem('admin_logs', JSON.stringify(existingLogs));
    } catch (error) {
      console.error('Error logging admin action:', error);
    }
  }
}

export const enhancedAdminService = new EnhancedAdminService();
