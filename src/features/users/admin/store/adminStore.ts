import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  role: 'admin' | 'moderator' | 'user';
  status: 'active' | 'suspended' | 'banned';
  createdAt: Date;
  lastActive: Date;
  subscription?: {
    plan: string;
    status: string;
    expiresAt: Date;
  };
  learningProgress: {
    lessonsCompleted: number;
    totalTimeSpent: number;
    languagesStudied: string[];
    level: string;
  };
  communityActivity: {
    discussionsCreated: number;
    repliesPosted: number;
    likesReceived: number;
    reputation: number;
  };
}

export interface ContentItem {
  id: string;
  type: 'discussion' | 'reply' | 'challenge' | 'resource';
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  status: 'approved' | 'pending' | 'flagged' | 'removed';
  reports: ContentReport[];
  language: string;
  category: string;
}

export interface ContentReport {
  id: string;
  reporterId: string;
  reporterName: string;
  reason: string;
  description: string;
  createdAt: Date;
  status: 'pending' | 'reviewed' | 'resolved';
}

export interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  totalLessons: number;
  completedLessons: number;
  totalDiscussions: number;
  totalChallenges: number;
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
  };
  performance: {
    averageLoadTime: number;
    errorRate: number;
    uptime: number;
  };
}

export interface AdminAction {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetType: 'user' | 'content' | 'system';
  targetId: string;
  details: string;
  timestamp: Date;
}

export interface ReportData {
  type: string;
  dateRange: { start: Date; end: Date };
  generatedAt: Date;
  data: Record<string, unknown>;
}

export interface SystemSettings {
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  maxFileSize: number;
  supportedLanguages: string[];
  [key: string]: unknown;
}

interface AdminState {
  // State
  users: AdminUser[];
  content: ContentItem[];
  reports: ContentReport[];
  metrics: SystemMetrics | null;
  actions: AdminAction[];
  loading: boolean;
  error: string | null;

  // User Management
  fetchUsers: () => Promise<void>;
  updateUserRole: (userId: string, role: AdminUser['role']) => Promise<void>;
  updateUserStatus: (userId: string, status: AdminUser['status']) => Promise<void>;
  deleteUser: (userId: string, reason: string) => Promise<void>;

  // Content Moderation
  fetchContent: (filters?: { status?: string; type?: string; language?: string }) => Promise<void>;
  approveContent: (contentId: string) => Promise<void>;
  rejectContent: (contentId: string, reason: string) => Promise<void>;

  // Reports Management
  fetchReports: () => Promise<void>;
  reviewReport: (reportId: string, action: 'approve' | 'reject', notes?: string) => Promise<void>;

  // Analytics & Metrics
  fetchMetrics: () => Promise<void>;
  generateReport: (type: string, dateRange: { start: Date; end: Date }) => Promise<ReportData>;

  // System Management
  fetchAdminActions: () => Promise<void>;
  logAdminAction: (action: string, targetType: string, targetId: string, details: string) => Promise<void>;
  updateSystemSettings: (settings: Partial<SystemSettings>) => Promise<void>;

  // Utility
  clearError: () => void;
  resetState: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      // Initial state
      users: [],
      content: [],
      reports: [],
      metrics: null,
      actions: [],
      loading: false,
      error: null,

      // User Management
      fetchUsers: async () => {
        set({ loading: true, error: null });
        try {
          // Mock implementation for now
          const mockUsers: AdminUser[] = [
            {
              id: '1',
              email: 'user1@example.com',
              displayName: 'Marie Kamto',
              role: 'user',
              status: 'active',
              createdAt: new Date(),
              lastActive: new Date(),
              learningProgress: {
                lessonsCompleted: 15,
                totalTimeSpent: 1200,
                languagesStudied: ['Ewondo', 'Duala'],
                level: 'intermediate'
              },
              communityActivity: {
                discussionsCreated: 5,
                repliesPosted: 23,
                likesReceived: 45,
                reputation: 120
              }
            }
          ];

          set({ users: mockUsers, loading: false });
        } catch (error) {
          set({ error: 'Erreur lors du chargement des utilisateurs', loading: false });
          console.error('Error fetching users:', error);
        }
      },

      updateUserRole: async (userId: string, role: AdminUser['role']) => {
        try {
          // Mock implementation
          const users = get().users.map(user =>
            user.id === userId ? { ...user, role } : user
          );
          set({ users });

          await get().logAdminAction('update_role', 'user', userId, `Role updated to ${role}`);
        } catch (error) {
          set({ error: 'Erreur lors de la mise à jour du rôle' });
          console.error('Error updating user role:', error);
        }
      },

      updateUserStatus: async (userId: string, status: AdminUser['status']) => {
        try {
          const users = get().users.map(user =>
            user.id === userId ? { ...user, status } : user
          );
          set({ users });

          await get().logAdminAction('update_status', 'user', userId, `Status updated to ${status}`);
        } catch (error) {
          set({ error: 'Erreur lors de la mise à jour du statut' });
          console.error('Error updating user status:', error);
        }
      },

      deleteUser: async (userId: string, reason: string) => {
        try {
          const users = get().users.filter(user => user.id !== userId);
          set({ users });

          await get().logAdminAction('delete_user', 'user', userId, `User deleted: ${reason}`);
        } catch (error) {
          set({ error: 'Erreur lors de la suppression de l\'utilisateur' });
          console.error('Error deleting user:', error);
        }
      },

      // Content Moderation
      fetchContent: async (_filters = {}) => {
        set({ loading: true, error: null });
        try {
          // Mock implementation
          const mockContent: ContentItem[] = [
            {
              id: '1',
              type: 'discussion',
              title: 'Comment prononcer les tons en Ewondo?',
              content: 'Je cherche des conseils pour bien prononcer les tons...',
              authorId: '1',
              authorName: 'Marie Kamto',
              createdAt: new Date(),
              status: 'pending',
              reports: [],
              language: 'Ewondo',
              category: 'pronunciation'
            }
          ];

          set({ content: mockContent, loading: false });
        } catch (error) {
          set({ error: 'Erreur lors du chargement du contenu', loading: false });
          console.error('Error fetching content:', error);
        }
      },

      approveContent: async (contentId: string) => {
        try {
          const content = get().content.map(item =>
            item.id === contentId ? { ...item, status: 'approved' as const } : item
          );
          set({ content });

          await get().logAdminAction('approve_content', 'content', contentId, 'Content approved');
        } catch (error) {
          set({ error: 'Erreur lors de l\'approbation du contenu' });
          console.error('Error approving content:', error);
        }
      },

      rejectContent: async (contentId: string, reason: string) => {
        try {
          const content = get().content.map(item =>
            item.id === contentId ? { ...item, status: 'removed' as const } : item
          );
          set({ content });

          await get().logAdminAction('reject_content', 'content', contentId, `Content rejected: ${reason}`);
        } catch (error) {
          set({ error: 'Erreur lors du rejet du contenu' });
          console.error('Error rejecting content:', error);
        }
      },

      // Reports Management
      fetchReports: async () => {
        set({ loading: true, error: null });
        try {
          // Mock implementation
          const mockReports: ContentReport[] = [
            {
              id: '1',
              reporterId: '2',
              reporterName: 'Jean Dupont',
              reason: 'Contenu inapproprié',
              description: 'Ce contenu ne respecte pas les règles communautaires',
              createdAt: new Date(),
              status: 'pending'
            }
          ];

          set({ reports: mockReports, loading: false });
        } catch (error) {
          set({ error: 'Erreur lors du chargement des signalements', loading: false });
          console.error('Error fetching reports:', error);
        }
      },

      reviewReport: async (reportId: string, action: 'approve' | 'reject', notes?: string) => {
        try {
          const reports = get().reports.map(report =>
            report.id === reportId ? { ...report, status: 'reviewed' as const } : report
          );
          set({ reports });

          await get().logAdminAction('review_report', 'content', reportId, `Report ${action}ed${notes ? `: ${notes}` : ''}`);
        } catch (error) {
          set({ error: 'Erreur lors de la révision du signalement' });
          console.error('Error reviewing report:', error);
        }
      },

      // Analytics & Metrics
      fetchMetrics: async () => {
        set({ loading: true, error: null });
        try {
          const metrics: SystemMetrics = {
            totalUsers: 2847,
            activeUsers: 1245,
            newUsersToday: 23,
            totalLessons: 120,
            completedLessons: 1560,
            totalDiscussions: 456,
            totalChallenges: 89,
            revenue: {
              total: 15000,
              thisMonth: 2500,
              lastMonth: 2200
            },
            performance: {
              averageLoadTime: 1.2,
              errorRate: 0.02,
              uptime: 99.9
            }
          };

          set({ metrics, loading: false });
        } catch (error) {
          set({ error: 'Erreur lors du chargement des métriques', loading: false });
          console.error('Error fetching metrics:', error);
        }
      },

      generateReport: async (type: string, dateRange: { start: Date; end: Date }): Promise<ReportData> => {
        try {
          const reportData: ReportData = {
            type,
            dateRange,
            generatedAt: new Date(),
            data: {
              totalUsers: 2847,
              activeUsers: 1245,
              revenue: 15000
            }
          };

          await get().logAdminAction('generate_report', 'system', 'reports', `Generated ${type} report`);
          return reportData;
        } catch (error) {
          set({ error: 'Erreur lors de la génération du rapport' });
          console.error('Error generating report:', error);
          throw error;
        }
      },

      // System Management
      fetchAdminActions: async () => {
        set({ loading: true, error: null });
        try {
          // Mock implementation
          const mockActions: AdminAction[] = [
            {
              id: '1',
              adminId: 'admin1',
              adminName: 'Admin User',
              action: 'approve_content',
              targetType: 'content',
              targetId: '1',
              details: 'Content approved',
              timestamp: new Date()
            }
          ];

          set({ actions: mockActions, loading: false });
        } catch (error) {
          set({ error: 'Erreur lors du chargement des actions', loading: false });
          console.error('Error fetching admin actions:', error);
        }
      },

      logAdminAction: async (action: string, targetType: string, targetId: string, details: string) => {
        try {
          const currentAdmin = { id: 'admin', name: 'Admin User' };
          
          const actionData: AdminAction = {
            id: Date.now().toString(),
            adminId: currentAdmin.id,
            adminName: currentAdmin.name,
            action,
            targetType: targetType as 'user' | 'content' | 'system',
            targetId,
            details,
            timestamp: new Date()
          };

          const actions = [actionData, ...get().actions.slice(0, 99)];
          set({ actions });
        } catch (error) {
          console.error('Error logging admin action:', error);
        }
      },

      updateSystemSettings: async (settings: Partial<SystemSettings>) => {
        try {
          // Mock implementation
          await get().logAdminAction('update_settings', 'system', 'settings', `Updated: ${Object.keys(settings).join(', ')}`);
        } catch (error) {
          set({ error: 'Erreur lors de la mise à jour des paramètres' });
          console.error('Error updating system settings:', error);
        }
      },

      // Utility
      clearError: () => set({ error: null }),
      
      resetState: () => set({
        users: [],
        content: [],
        reports: [],
        metrics: null,
        actions: [],
        loading: false,
        error: null
      })
    }),
    {
      name: 'admin-store',
      partialize: (state) => ({
        metrics: state.metrics
      })
    }
  )
);