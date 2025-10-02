import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserPreferences } from '@/shared/types/user.types';

interface ProfileState {
  // Core data
  profile: User | null;
  preferences: UserPreferences | null;
  avatar: string | null;
  
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
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      // Initial state
      profile: null,
      preferences: null,
      avatar: null,
      isLoading: false,
      isUploading: false,
      error: null,

      // Actions
      fetchProfile: async () => {
        set({ isLoading: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const mockProfile: User = {
            id: '1',
            email: 'user@example.com',
            displayName: 'John Doe',
            photoURL: '',
            role: 'learner',
            createdAt: new Date(),
            lastLoginAt: new Date(),
            preferences: {
              language: 'en',
              targetLanguages: ['Ewondo', 'Duala'],
              notificationsEnabled: true,
              theme: 'light',
              dailyGoalMinutes: 15
            },
            stats: {
              lessonsCompleted: 10,
              wordsLearned: 150,
              totalTimeMinutes: 300,
              currentStreak: 5,
              longestStreak: 12,
              badgesEarned: 3,
              level: 2,
              xp: 450
            }
          };
          
          set({ 
            profile: mockProfile,
            preferences: mockProfile.preferences,
            avatar: mockProfile.photoURL,
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
          a.download = `mayegue-profile-export-${Date.now()}.json`;
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
      }
    }),
    {
      name: 'profile-storage',
      partialize: (state) => ({
        profile: state.profile,
        preferences: state.preferences,
        avatar: state.avatar
      })
    }
  )
);