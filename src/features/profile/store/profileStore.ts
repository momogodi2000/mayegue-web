import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserPreferences } from '@/shared/types/user.types';
import { RPGStats, FamilyTree, VARKProfile, PerformanceAnalytics, CulturalProgress } from '../types/rpg.types';
import { userService } from '@/core/services/firebase/user.service';
import { useAuthStore } from '@/features/auth/store/authStore';

interface ProfileState {
  // Core data
  profile: User | null;
  preferences: UserPreferences | null;
  avatar: string | null;
  
  // V1.1 RPG Data
  rpgStats: RPGStats | null;
  familyTree: FamilyTree | null;
  varkProfile: VARKProfile | null;
  performanceAnalytics: PerformanceAnalytics | null;
  culturalProgress: CulturalProgress | null;
  
  // UI state
  isLoading: boolean;
  isUploading: boolean;
  error: string | null;
  
  // Actions
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  uploadAvatar: (avatarUrl: string) => Promise<void>;
  exportData: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  clearError: () => void;
  
  // V1.1 RPG Actions
  fetchRPGData: () => Promise<void>;
  updateRPGStats: (updates: Partial<RPGStats>) => Promise<void>;
  fetchFamilyTree: () => Promise<void>;
  updateVARKProfile: (profile: VARKProfile) => Promise<void>;
  fetchPerformanceAnalytics: () => Promise<void>;
  fetchCulturalProgress: () => Promise<void>;
  earnXP: (amount: number, source: string) => Promise<void>;
  spendCoins: (amount: number, item: string) => Promise<void>;
  unlockAchievement: (achievementId: string) => Promise<void>;
  completeQuest: (questId: string) => Promise<void>;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      // Initial state
      profile: null,
      preferences: null,
      avatar: null,
      rpgStats: null,
      familyTree: null,
      varkProfile: null,
      performanceAnalytics: null,
      culturalProgress: null,
      isLoading: false,
      isUploading: false,
      error: null,

      // Actions
      fetchProfile: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // Get current user from auth store
          const authUser = useAuthStore.getState().user;
          if (!authUser) {
            throw new Error('No authenticated user');
          }

          // Fetch real user profile from Firebase
          const userProfile = await userService.getUserProfile(authUser.id);
          if (!userProfile) {
            throw new Error('User profile not found');
          }

          // Convert to User type
          const profile: User = {
            id: authUser.id,
            email: authUser.email,
            displayName: authUser.displayName,
            photoURL: authUser.photoURL || '',
            role: userProfile.role || 'learner',
            emailVerified: userProfile.emailVerified || false,
            createdAt: new Date(userProfile.createdAt || Date.now()),
            lastLoginAt: new Date(),
            preferences: userProfile.preferences || {
              language: 'fr',
              targetLanguages: [],
              notificationsEnabled: true,
              theme: 'system',
              dailyGoalMinutes: 15
            },
            stats: userProfile.stats || {
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
              achievementsUnlocked: 0
            }
          };
          
          // Mock RPG data
          const mockProfile: User = {
            id: 'mock_user_1',
            email: 'jean.nguema@example.com',
            displayName: 'Jean Nguema',
            photoURL: '',
            role: 'learner',
            emailVerified: true,
            twoFactorEnabled: false,
            createdAt: new Date('2024-01-01'),
            lastLoginAt: new Date(),
            preferences: {
              language: 'fr',
              targetLanguages: ['ewondo', 'duala'],
              notificationsEnabled: true,
              theme: 'light',
              dailyGoalMinutes: 30
            },
            stats: {
              lessonsCompleted: 25,
              wordsLearned: 450,
              totalTimeMinutes: 1200,
              currentStreak: 12,
              longestStreak: 25,
              badgesEarned: 8,
              level: 15,
              xp: 8500,
              atlasExplorations: 12,
              encyclopediaEntries: 8,
              historicalSitesVisited: 5,
              arVrExperiences: 3,
              marketplacePurchases: 2,
              familyContributions: 15,
              ngondoCoinsEarned: 1250,
              achievementsUnlocked: 8
            },
            subscription: {
              id: 'sub_1',
              userId: 'mock_user_1',
              planId: 'premium_monthly',
              status: 'active',
              startDate: new Date('2024-01-01'),
              endDate: new Date('2024-12-31'),
              autoRenew: true,
              trialUsed: false,
              createdAt: new Date('2024-01-01'),
              updatedAt: new Date()
            },
            ngondoCoins: 1250
          };

          const mockRPGStats: RPGStats = {
            level: 15,
            xp: 8500,
            xpToNextLevel: 10000,
            totalXp: 25000,
            ngondoCoins: 1250,
            achievements: [
              {
                id: 'first_lesson',
                name: 'Première Leçon',
                description: 'Complétez votre première leçon',
                icon: '🎓',
                category: 'learning',
                rarity: 'common',
                unlockedAt: new Date('2024-01-01'),
                progress: 1,
                maxProgress: 1,
                reward: { xp: 50, coins: 10 }
              }
            ],
            skills: [
              {
                id: 'pronunciation',
                name: 'Prononciation',
                category: 'pronunciation',
                level: 8,
                xp: 750,
                xpToNext: 1000,
                description: 'Maîtrise de la prononciation',
                icon: '🗣️',
                unlockedAt: new Date('2024-01-01')
              }
            ],
            equipment: [],
            quests: [],
            dailyStreak: 12,
            weeklyGoal: 300,
            monthlyGoal: 1200,
            rank: 'Expert',
            title: 'Maître des Langues',
            avatar: {
              base: 'default',
              accessories: [],
              background: 'forest',
              title: 'Maître des Langues',
              badge: 'explorer',
              customizations: {
                skinColor: '#FDBCB4',
                hairColor: '#8B4513',
                eyeColor: '#000000',
                clothing: 'traditional'
              }
            }
          };

          const mockFamilyTree: FamilyTree = {
            id: 'family_1',
            name: 'Famille Nguema',
            members: [
              {
                id: 'user_1',
                userId: '1',
                displayName: 'Jean Nguema',
                avatar: '',
                role: 'parent',
                level: 15,
                xp: 25000,
                joinedAt: new Date('2024-01-01'),
                lastActiveAt: new Date(),
                contributions: 500,
                achievements: 25,
                isOnline: true
              }
            ],
            sharedGoals: [],
            totalXp: 25000,
            totalCoins: 1250,
            level: 8,
            createdAt: new Date('2024-01-01'),
            settings: {
              privacy: 'family_only',
              allowChildAccounts: true,
              sharedProgress: true,
              parentalControls: false
            }
          };

          const mockVARKProfile: VARKProfile = {
            visual: 75,
            auditory: 60,
            reading: 45,
            kinesthetic: 80,
            dominantStyle: 'kinesthetic',
            learningRecommendations: [
              'Essayez des exercices pratiques et interactifs',
              'Utilisez des simulations AR/VR pour l\'immersion',
              'Participez à des activités culturelles en groupe'
            ],
            lastUpdated: new Date()
          };

          const mockPerformanceAnalytics: PerformanceAnalytics = {
            accuracy: 85,
            speed: 45,
            consistency: 78,
            improvement: 12,
            weakAreas: ['Grammaire avancée', 'Prononciation des tons'],
            strongAreas: ['Vocabulaire de base', 'Compréhension orale'],
            recommendations: [
              'Pratiquez la grammaire 15 minutes par jour',
              'Écoutez des podcasts en langue cible',
              'Participez à des conversations avec des natifs'
            ],
            lastAnalyzed: new Date()
          };

          const mockCulturalProgress: CulturalProgress = {
            ethnicGroupsExplored: 12,
            traditionsLearned: 8,
            sitesVisited: 5,
            recipesTried: 3,
            craftsDiscovered: 2,
            storiesRead: 15,
            languagesStudied: 3,
            culturalPoints: 450,
            badges: ['Explorateur Culturel', 'Garde des Traditions'],
            lastActivity: new Date()
          };

          set({ 
            profile: mockProfile,
            preferences: mockProfile.preferences,
            avatar: mockProfile.photoURL,
            rpgStats: mockRPGStats,
            familyTree: mockFamilyTree,
            varkProfile: mockVARKProfile,
            performanceAnalytics: mockPerformanceAnalytics,
            culturalProgress: mockCulturalProgress,
            isLoading: false 
          });
          
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch profile',
            isLoading: false 
          });
        }
      },

      updateProfile: async (updates: Partial<User>) => {
        set({ isLoading: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const { profile } = get();
          if (profile) {
            const updatedProfile = { ...profile, ...updates };
            set({ 
              profile: updatedProfile,
              isLoading: false 
            });
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update profile',
            isLoading: false 
          });
        }
      },

      updatePreferences: async (preferences: Partial<UserPreferences>) => {
        const { profile } = get();
        if (profile?.preferences) {
          const updatedPreferences = { ...profile.preferences, ...preferences };
          await get().updateProfile({ preferences: updatedPreferences });
          set({ preferences: updatedPreferences });
        }
      },

      uploadAvatar: async (avatarUrl: string) => {
        set({ isUploading: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set({ 
            avatar: avatarUrl,
            isUploading: false 
          });
          
          await get().updateProfile({ photoURL: avatarUrl });
          
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to upload avatar',
            isUploading: false 
          });
        }
      },

      exportData: async () => {
        set({ isLoading: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const { profile, preferences } = get();
          const exportData = {
            profile,
            preferences,
            exportedAt: new Date().toISOString()
          };
          
          const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `Ma’a yegue-profile-export-${Date.now()}.json`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Export failed',
            isLoading: false 
          });
        }
      },

      deleteAccount: async () => {
        set({ isLoading: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          set({ 
            profile: null,
            preferences: null,
            avatar: null,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Delete failed',
            isLoading: false 
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },

      // V1.1 RPG Actions
      fetchRPGData: async () => {
        set({ isLoading: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          // RPG data is already loaded in fetchProfile
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch RPG data',
            isLoading: false 
          });
        }
      },

      updateRPGStats: async (updates: Partial<RPGStats>) => {
        set({ isLoading: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const { rpgStats } = get();
          if (rpgStats) {
            const updatedStats = { ...rpgStats, ...updates };
            set({ 
              rpgStats: updatedStats,
              isLoading: false 
            });
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update RPG stats',
            isLoading: false 
          });
        }
      },

      fetchFamilyTree: async () => {
        set({ isLoading: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          // Family tree data is already loaded in fetchProfile
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch family tree',
            isLoading: false 
          });
        }
      },

      updateVARKProfile: async (profile: VARKProfile) => {
        set({ isLoading: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set({ 
            varkProfile: profile,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update VARK profile',
            isLoading: false 
          });
        }
      },

      fetchPerformanceAnalytics: async () => {
        set({ isLoading: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          // Performance analytics data is already loaded in fetchProfile
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch performance analytics',
            isLoading: false 
          });
        }
      },

      fetchCulturalProgress: async () => {
        set({ isLoading: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          // Cultural progress data is already loaded in fetchProfile
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch cultural progress',
            isLoading: false 
          });
        }
      },

      earnXP: async (amount: number, source: string) => {
        const { rpgStats } = get();
        if (rpgStats) {
          const newXP = rpgStats.xp + amount;
          const newTotalXP = rpgStats.totalXp + amount;
          
          // Check for level up
          let newLevel = rpgStats.level;
          let newXPToNext = rpgStats.xpToNextLevel;
          
          if (newXP >= rpgStats.xpToNextLevel) {
            newLevel += 1;
            newXPToNext = newLevel * 1000; // Simple level progression
          }
          
          await get().updateRPGStats({
            xp: newXP,
            totalXp: newTotalXP,
            level: newLevel,
            xpToNextLevel: newXPToNext
          });
        }
      },

      spendCoins: async (amount: number, item: string) => {
        const { rpgStats } = get();
        if (rpgStats && rpgStats.ngondoCoins >= amount) {
          await get().updateRPGStats({
            ngondoCoins: rpgStats.ngondoCoins - amount
          });
        }
      },

      unlockAchievement: async (achievementId: string) => {
        const { rpgStats } = get();
        if (rpgStats) {
          const achievement = rpgStats.achievements.find(a => a.id === achievementId);
          if (achievement && !achievement.unlockedAt) {
            achievement.unlockedAt = new Date();
            achievement.progress = achievement.maxProgress;
            
            // Award rewards
            await get().earnXP(achievement.reward.xp, 'achievement');
            await get().updateRPGStats({
              ngondoCoins: rpgStats.ngondoCoins + achievement.reward.coins
            });
          }
        }
      },

      completeQuest: async (questId: string) => {
        const { rpgStats } = get();
        if (rpgStats) {
          const quest = rpgStats.quests.find(q => q.id === questId);
          if (quest && quest.status === 'in_progress') {
            quest.status = 'completed';
            quest.completedAt = new Date();
            quest.progress = quest.maxProgress;
            
            // Award rewards
            for (const reward of quest.rewards) {
              if (reward.type === 'xp') {
                await get().earnXP(reward.amount, 'quest');
              } else if (reward.type === 'coins') {
                await get().updateRPGStats({
                  ngondoCoins: rpgStats.ngondoCoins + reward.amount
                });
              }
            }
          }
        }
      }
    }),
    {
      name: 'profile-storage',
      partialize: (state) => ({
        profile: state.profile,
        preferences: state.preferences,
        avatar: state.avatar,
        rpgStats: state.rpgStats,
        familyTree: state.familyTree,
        varkProfile: state.varkProfile,
        performanceAnalytics: state.performanceAnalytics,
        culturalProgress: state.culturalProgress
      })
    }
  )
);