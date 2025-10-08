import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { progressService } from '../services/progress.service';
import type { 
  UserProgress, 
  StudySession, 
  LearningGoal, 
  Achievement, 
  LearningInsight,
  WeeklyProgress,
  ProgressAnalytics
} from '../types/progress.types';
import toast from 'react-hot-toast';

interface ProgressState {
  // Current user progress
  userProgress: UserProgress | null;
  weeklyProgress: WeeklyProgress | null;
  analytics: ProgressAnalytics | null;
  insights: LearningInsight[];
  
  // Active study session
  activeSession: StudySession | null;
  sessionStartTime: Date | null;
  
  // UI state
  loading: boolean;
  error: string | null;
  
  // Actions
  loadUserProgress: (userId: string) => Promise<void>;
  loadWeeklyProgress: (userId: string, weekOffset?: number) => Promise<void>;
  loadAnalytics: (userId: string, timeframe?: 'week' | 'month' | 'year') => Promise<void>;
  loadInsights: (userId: string) => Promise<void>;
  
  // Study session management
  startStudySession: (userId: string, category: string) => Promise<void>;
  endStudySession: () => Promise<StudySession | null>;
  recordActivity: (activity: any) => void;
  
  // XP and progress
  addXP: (userId: string, xp: number, source: string) => Promise<void>;
  updateProgress: (updates: Partial<UserProgress>) => void;
  
  // Goals management
  createGoal: (userId: string, goal: Omit<LearningGoal, 'id' | 'current' | 'isCompleted'>) => Promise<void>;
  updateGoal: (goalId: string, updates: Partial<LearningGoal>) => Promise<void>;
  completeGoal: (goalId: string) => Promise<void>;
  
  // Insights management
  markInsightAsRead: (insightId: string) => void;
  dismissInsight: (insightId: string) => void;
  
  // Utility
  reset: () => void;
  setError: (error: string | null) => void;
}

export const useProgressStore = create<ProgressState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        userProgress: null,
        weeklyProgress: null,
        analytics: null,
        insights: [],
        activeSession: null,
        sessionStartTime: null,
        loading: false,
        error: null,

        // Load user progress
        loadUserProgress: async (userId: string) => {
          try {
            set({ loading: true, error: null });
            const progress = await progressService.getUserProgress(userId);
            set({ userProgress: progress, loading: false });
          } catch (error) {
            console.error('Error loading user progress:', error);
            set({ 
              error: 'Erreur lors du chargement des données de progression',
              loading: false 
            });
            toast.error('Erreur lors du chargement des données de progression');
          }
        },

        // Load weekly progress
        loadWeeklyProgress: async (userId: string, weekOffset = 0) => {
          try {
            const weeklyProgress = await progressService.getWeeklyProgress(userId, weekOffset);
            set({ weeklyProgress });
          } catch (error) {
            console.error('Error loading weekly progress:', error);
            toast.error('Erreur lors du chargement des données hebdomadaires');
          }
        },

        // Load analytics
        loadAnalytics: async (userId: string, timeframe = 'month') => {
          try {
            const analytics = await progressService.getProgressAnalytics(userId, timeframe);
            set({ analytics });
          } catch (error) {
            console.error('Error loading analytics:', error);
            toast.error('Erreur lors du chargement des analyses');
          }
        },

        // Load insights
        loadInsights: async (userId: string) => {
          try {
            const insights = await progressService.getLearningInsights(userId);
            set({ insights });
          } catch (error) {
            console.error('Error loading insights:', error);
            toast.error('Erreur lors du chargement des recommandations');
          }
        },

        // Start study session
        startStudySession: async (userId: string, category: string) => {
          try {
            const sessionStartTime = new Date();
            const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            
            const newSession: StudySession = {
              id: sessionId,
              userId,
              startTime: sessionStartTime,
              duration: 0,
              activities: [],
              xpEarned: 0,
              focusScore: 100,
              category
            };

            set({ 
              activeSession: newSession, 
              sessionStartTime 
            });

            toast.success('Session d\'étude démarrée !');
          } catch (error) {
            console.error('Error starting study session:', error);
            toast.error('Erreur lors du démarrage de la session');
          }
        },

        // End study session
        endStudySession: async () => {
          try {
            const { activeSession, sessionStartTime } = get();
            
            if (!activeSession || !sessionStartTime) {
              return null;
            }

            const endTime = new Date();
            const duration = Math.floor((endTime.getTime() - sessionStartTime.getTime()) / (1000 * 60));

            const completedSession: StudySession = {
              ...activeSession,
              endTime,
              duration
            };

            // Record the session
            await progressService.recordStudySession(completedSession);

            // Update state
            set({ 
              activeSession: null, 
              sessionStartTime: null 
            });

            // Reload progress
            const { userProgress } = get();
            if (userProgress) {
              await get().loadUserProgress(userProgress.userId);
            }

            toast.success(`Session terminée ! ${duration} minutes d'étude`);
            return completedSession;
          } catch (error) {
            console.error('Error ending study session:', error);
            toast.error('Erreur lors de la fin de session');
            return null;
          }
        },

        // Record activity in current session
        recordActivity: (activity: any) => {
          const { activeSession } = get();
          if (!activeSession) return;

          const updatedSession = {
            ...activeSession,
            activities: [...activeSession.activities, activity],
            xpEarned: activeSession.xpEarned + (activity.xpEarned || 0)
          };

          set({ activeSession: updatedSession });
        },

        // Add XP
        addXP: async (userId: string, xp: number, source: string) => {
          try {
            const result = await progressService.addXP(userId, xp, source);
            
            if (result.leveledUp) {
              toast.success(`🎉 Niveau ${result.newLevel} atteint !`);
            }

            // Reload progress to reflect changes
            await get().loadUserProgress(userId);
          } catch (error) {
            console.error('Error adding XP:', error);
            toast.error('Erreur lors de l\'ajout d\'XP');
          }
        },

        // Update progress
        updateProgress: (updates: Partial<UserProgress>) => {
          const { userProgress } = get();
          if (!userProgress) return;

          set({
            userProgress: {
              ...userProgress,
              ...updates
            }
          });
        },

        // Create goal
        createGoal: async (userId: string, goalData: Omit<LearningGoal, 'id' | 'current' | 'isCompleted'>) => {
          try {
            const goal = await progressService.setLearningGoal(userId, goalData);
            
            const { userProgress } = get();
            if (userProgress) {
              set({
                userProgress: {
                  ...userProgress,
                  goals: [...userProgress.goals, goal]
                }
              });
            }

            toast.success('Objectif créé avec succès !');
          } catch (error) {
            console.error('Error creating goal:', error);
            toast.error('Erreur lors de la création de l\'objectif');
          }
        },

        // Update goal
        updateGoal: async (goalId: string, updates: Partial<LearningGoal>) => {
          try {
            const { userProgress } = get();
            if (!userProgress) return;

            const updatedGoals = userProgress.goals.map(goal =>
              goal.id === goalId ? { ...goal, ...updates } : goal
            );

            set({
              userProgress: {
                ...userProgress,
                goals: updatedGoals
              }
            });

            toast.success('Objectif mis à jour !');
          } catch (error) {
            console.error('Error updating goal:', error);
            toast.error('Erreur lors de la mise à jour de l\'objectif');
          }
        },

        // Complete goal
        completeGoal: async (goalId: string) => {
          try {
            const { userProgress } = get();
            if (!userProgress) return;

            const goal = userProgress.goals.find(g => g.id === goalId);
            if (!goal) return;

            // Mark goal as completed
            await get().updateGoal(goalId, {
              isCompleted: true,
              completedAt: new Date()
            });

            // Add XP reward
            if (goal.reward.xp > 0) {
              await get().addXP(userProgress.userId, goal.reward.xp, `goal_completed_${goalId}`);
            }

            toast.success(`🎯 Objectif "${goal.title}" terminé ! +${goal.reward.xp} XP`);
          } catch (error) {
            console.error('Error completing goal:', error);
            toast.error('Erreur lors de la validation de l\'objectif');
          }
        },

        // Mark insight as read
        markInsightAsRead: (insightId: string) => {
          const { insights } = get();
          const updatedInsights = insights.map(insight =>
            insight.id === insightId ? { ...insight, isRead: true } : insight
          );
          set({ insights: updatedInsights });
        },

        // Dismiss insight
        dismissInsight: (insightId: string) => {
          const { insights } = get();
          const updatedInsights = insights.filter(insight => insight.id !== insightId);
          set({ insights: updatedInsights });
        },

        // Reset store
        reset: () => {
          set({
            userProgress: null,
            weeklyProgress: null,
            analytics: null,
            insights: [],
            activeSession: null,
            sessionStartTime: null,
            loading: false,
            error: null
          });
        },

        // Set error
        setError: (error: string | null) => {
          set({ error });
        }
      }),
      {
        name: 'progress-store',
        partialize: (state) => ({
          // Only persist essential data
          insights: state.insights,
          activeSession: state.activeSession,
          sessionStartTime: state.sessionStartTime
        })
      }
    ),
    {
      name: 'progress-store'
    }
  )
);
