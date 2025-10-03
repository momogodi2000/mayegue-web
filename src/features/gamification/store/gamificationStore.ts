import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types based on the gamification seed data
export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  type: 'lessonCompletion' | 'courseCompletion' | 'pointsMilestone' | 'streak' | 'social' | 'special';
  pointsReward: number;
  criteria: Record<string, number | string | boolean>;
  isUnlocked: boolean;
  unlockedAt?: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  pointsRequired: number;
  category: 'learning' | 'achievement' | 'social' | 'special';
  isEarned: boolean;
  earnedAt?: Date;
}

export interface Level {
  level: number;
  name: string;
  minPoints: number;
  maxPoints: number;
  benefits: string[];
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  type: 'lesson' | 'quiz' | 'pronunciation' | 'community' | 'streak';
  targetValue: number;
  currentProgress: number;
  pointsReward: number;
  expiresAt: Date;
  isCompleted: boolean;
  completedAt?: Date;
}

export interface UserStats {
  totalXP: number;
  currentLevel: number;
  streakDays: number;
  lastActivityDate: Date;
  lessonsCompleted: number;
  quizzesPassed: number;
  perfectScores: number;
  languagesStudied: string[];
  communityContributions: number;
  totalTimeSpent: number; // in minutes
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar?: string;
  totalXP: number;
  currentLevel: number;
  streakDays: number;
  rank: number;
  isCurrentUser?: boolean;
}

export interface PointMultiplier {
  name: string;
  description: string;
  multiplier: number;
  conditions: string[];
  isActive: boolean;
}

interface GamificationState {
  // User data
  userStats: UserStats;
  unlockedAchievements: Achievement[];
  earnedBadges: Badge[];
  currentChallenges: DailyChallenge[];
  
  // Reference data
  allAchievements: Achievement[];
  allBadges: Badge[];
  levels: Level[];
  pointMultipliers: PointMultiplier[];
  
  // Leaderboard
  leaderboard: LeaderboardEntry[];
  friendsLeaderboard: LeaderboardEntry[];
  
  // UI state
  loading: boolean;
  error: string | null;
  showAchievementPopup: Achievement | null;
  showLevelUpPopup: Level | null;
  
  // Computed properties for compatibility
  achievements: Achievement[];
  badges: Badge[];
  unlockedBadges: Badge[];
  currentLevel: Level | null;
  dailyChallenges: DailyChallenge[];
  
  // Actions
  initializeGamification: (userId: string) => Promise<void>;
  addXP: (points: number, source: string) => Promise<void>;
  completeLesson: (lessonId: string, score: number, timeSpent: number) => Promise<void>;
  completeQuiz: (quizId: string, score: number, perfectScore: boolean) => Promise<void>;
  updateStreak: () => Promise<void>;
  completeChallenge: (challengeId: string) => Promise<void>;
  checkAchievements: () => Promise<Achievement[]>;
  checkLevelUp: () => Promise<Level | null>;
  fetchLeaderboard: (type?: 'global' | 'friends') => Promise<void>;
  generateDailyChallenges: () => Promise<void>;
  dismissAchievementPopup: () => void;
  dismissLevelUpPopup: () => void;
  clearError: () => void;
}

// Mock data generators
const generateMockUserStats = (): UserStats => ({
  totalXP: 1250,
  currentLevel: 3,
  streakDays: 7,
  lastActivityDate: new Date(),
  lessonsCompleted: 15,
  quizzesPassed: 12,
  perfectScores: 3,
  languagesStudied: ['ewondo', 'duala'],
  communityContributions: 5,
  totalTimeSpent: 180
});

const generateMockChallenges = (): DailyChallenge[] => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(23, 59, 59, 999);

  return [
    {
      id: 'daily_lesson',
      title: 'Leçon Quotidienne',
      description: 'Complétez une leçon aujourd\'hui',
      type: 'lesson',
      targetValue: 1,
      currentProgress: 0,
      pointsReward: 20,
      expiresAt: tomorrow,
      isCompleted: false
    },
    {
      id: 'streak_keeper',
      title: 'Gardien de Série',
      description: 'Maintenez votre série d\'apprentissage',
      type: 'streak',
      targetValue: 1,
      currentProgress: 1,
      pointsReward: 15,
      expiresAt: tomorrow,
      isCompleted: true,
      completedAt: new Date()
    },
    {
      id: 'quiz_master',
      title: 'Maître des Quiz',
      description: 'Réussissez 2 quiz avec plus de 80%',
      type: 'quiz',
      targetValue: 2,
      currentProgress: 1,
      pointsReward: 30,
      expiresAt: tomorrow,
      isCompleted: false
    }
  ];
};

const generateMockLeaderboard = (): LeaderboardEntry[] => [
  { userId: '1', username: 'Marie Kamga', totalXP: 2850, currentLevel: 5, streakDays: 15, rank: 1 },
  { userId: '2', username: 'Paul Biya', totalXP: 2650, currentLevel: 4, streakDays: 22, rank: 2 },
  { userId: '3', username: 'Akono Jean', totalXP: 1980, currentLevel: 4, streakDays: 8, rank: 3 },
  { userId: 'current', username: 'Vous', totalXP: 1250, currentLevel: 3, streakDays: 7, rank: 8, isCurrentUser: true },
  { userId: '4', username: 'Ebode Sarah', totalXP: 1850, currentLevel: 3, streakDays: 12, rank: 4 },
  { userId: '5', username: 'Mvondo Pierre', totalXP: 1750, currentLevel: 3, streakDays: 5, rank: 5 }
];

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      // Initial state
      userStats: generateMockUserStats(),
      unlockedAchievements: [],
      earnedBadges: [],
      currentChallenges: generateMockChallenges(),
      allAchievements: [],
      allBadges: [],
      levels: [],
      pointMultipliers: [],
      leaderboard: generateMockLeaderboard(),
      friendsLeaderboard: [],
      loading: false,
      error: null,
      showAchievementPopup: null,
      showLevelUpPopup: null,
      
      // Computed properties
      get achievements() {
        return get().allAchievements;
      },
      get badges() {
        return get().allBadges;
      },
      get unlockedBadges() {
        return get().earnedBadges;
      },
      get currentLevel() {
        const { userStats, levels } = get();
        return levels.find(l => l.level === userStats.currentLevel) || null;
      },
      get dailyChallenges() {
        return get().currentChallenges;
      },

      // Actions
      initializeGamification: async (_userId: string) => {
        set({ loading: true, error: null });
        
        try {
          // In a real app, this would fetch from Firebase
          // For now, load from the seed data
          const response = await fetch('/src/assets/firebase/gamification_seed_data.json');
          const seedData = await response.json();
          
          // Transform seed data to store format
          const achievements: Achievement[] = Object.values(seedData.achievements as Record<string, Omit<Achievement, 'isUnlocked'>>).map((a) => ({
            ...a,
            isUnlocked: false
          }));
          
          const badges: Badge[] = Object.values(seedData.badges as Record<string, Omit<Badge, 'isEarned'>>).map((b) => ({
            ...b,
            isEarned: false
          }));
          
          const levels: Level[] = Object.values(seedData.levels as Record<string, Level>);
          
          const pointMultipliers: PointMultiplier[] = Object.values(seedData.point_multipliers as Record<string, Omit<PointMultiplier, 'isActive'>>).map((pm) => ({
            ...pm,
            isActive: false
          }));
          
          set({
            allAchievements: achievements,
            allBadges: badges,
            levels,
            pointMultipliers,
            loading: false
          });
          
          // Check for initial achievements and badges
          await get().checkAchievements();
          
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Erreur lors de l\'initialisation',
            loading: false 
          });
        }
      },

      addXP: async (points: number, source: string) => {
        const { userStats, checkLevelUp } = get();
        
        // Apply multipliers
        let finalPoints = points;
        const now = new Date();
        const isWeekend = now.getDay() === 0 || now.getDay() === 6;
        
        if (isWeekend) finalPoints *= 2; // Weekend bonus
        if (userStats.streakDays > 3) finalPoints *= 1.5; // Streak bonus
        
        const newXP = userStats.totalXP + Math.round(finalPoints);
        
        set(state => ({
          userStats: {
            ...state.userStats,
            totalXP: newXP,
            lastActivityDate: new Date()
          }
        }));
        
        // Check for level up
        const levelUp = await checkLevelUp();
        if (levelUp) {
          set({ showLevelUpPopup: levelUp });
        }
        
        // Check for achievements
        await get().checkAchievements();
        
        console.log(`+${Math.round(finalPoints)} XP from ${source} (base: ${points})`);
      },

      completeLesson: async (_lessonId: string, score: number, timeSpent: number) => {
        const { addXP } = get();
        
        // Calculate base XP
        let baseXP = 50; // Base lesson XP
        if (score === 100) baseXP *= 1.25; // Perfect score bonus
        
        // Update stats
        set(state => ({
          userStats: {
            ...state.userStats,
            lessonsCompleted: state.userStats.lessonsCompleted + 1,
            perfectScores: score === 100 ? state.userStats.perfectScores + 1 : state.userStats.perfectScores,
            totalTimeSpent: state.userStats.totalTimeSpent + timeSpent
          }
        }));
        
        // Add XP
        await addXP(baseXP, `Leçon complétée (${score}%)`);
        
        // Update daily challenges
        const challenges = get().currentChallenges.map(challenge => {
          if (challenge.type === 'lesson' && !challenge.isCompleted) {
            const newProgress = challenge.currentProgress + 1;
            return {
              ...challenge,
              currentProgress: newProgress,
              isCompleted: newProgress >= challenge.targetValue,
              completedAt: newProgress >= challenge.targetValue ? new Date() : undefined
            };
          }
          return challenge;
        });
        
        set({ currentChallenges: challenges });
        
        // Check for newly completed challenges
        const completedChallenges = challenges.filter(c => c.isCompleted && !get().currentChallenges.find(oc => oc.id === c.id)?.isCompleted);
        for (const challenge of completedChallenges) {
          await addXP(challenge.pointsReward, `Défi complété: ${challenge.title}`);
        }
      },

      completeQuiz: async (_quizId: string, score: number, perfectScore: boolean) => {
        const { addXP } = get();
        
        let baseXP = score; // 1 XP per point scored
        if (perfectScore) baseXP *= 1.5; // Perfect quiz bonus
        
        set(state => ({
          userStats: {
            ...state.userStats,
            quizzesPassed: state.userStats.quizzesPassed + 1,
            perfectScores: perfectScore ? state.userStats.perfectScores + 1 : state.userStats.perfectScores
          }
        }));
        
        await addXP(baseXP, `Quiz complété (${score}%)`);
        
        // Update quiz challenges
        const challenges = get().currentChallenges.map(challenge => {
          if (challenge.type === 'quiz' && !challenge.isCompleted && score >= 80) {
            const newProgress = challenge.currentProgress + 1;
            return {
              ...challenge,
              currentProgress: newProgress,
              isCompleted: newProgress >= challenge.targetValue,
              completedAt: newProgress >= challenge.targetValue ? new Date() : undefined
            };
          }
          return challenge;
        });
        
        set({ currentChallenges: challenges });
      },

      updateStreak: async () => {
        const { userStats, addXP } = get();
        const now = new Date();
        const lastActivity = new Date(userStats.lastActivityDate);
        const daysDiff = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
        
        let newStreakDays = userStats.streakDays;
        
        if (daysDiff === 1) {
          // Continue streak
          newStreakDays += 1;
          await addXP(10, 'Série maintenue');
        } else if (daysDiff > 1) {
          // Streak broken
          newStreakDays = 1;
        }
        // If daysDiff === 0, same day, keep current streak
        
        set(state => ({
          userStats: {
            ...state.userStats,
            streakDays: newStreakDays,
            lastActivityDate: now
          }
        }));
      },

      completeChallenge: async (challengeId: string) => {
        const { currentChallenges, addXP } = get();
        const challenge = currentChallenges.find(c => c.id === challengeId);
        
        if (!challenge || challenge.isCompleted) return;
        
        const updatedChallenges = currentChallenges.map(c =>
          c.id === challengeId
            ? { ...c, isCompleted: true, currentProgress: c.targetValue, completedAt: new Date() }
            : c
        );
        
        set({ currentChallenges: updatedChallenges });
        await addXP(challenge.pointsReward, `Défi: ${challenge.title}`);
      },

      checkAchievements: async () => {
        const { userStats, allAchievements, unlockedAchievements } = get();
        const newAchievements: Achievement[] = [];
        
        for (const achievement of allAchievements) {
          if (unlockedAchievements.find(ua => ua.id === achievement.id)) continue;
          
          let unlocked = false;
          
          // Check criteria based on achievement type
          switch (achievement.type) {
            case 'lessonCompletion':
              unlocked = userStats.lessonsCompleted >= Number(achievement.criteria.lessonsCompleted || 0);
              break;
            case 'pointsMilestone':
              unlocked = userStats.totalXP >= Number(achievement.criteria.totalPoints || 0);
              break;
            case 'streak':
              unlocked = userStats.streakDays >= Number(achievement.criteria.streakDays || 0);
              break;
            case 'social':
              unlocked = userStats.communityContributions >= Number(achievement.criteria.helpfulAnswers || achievement.criteria.culturalShares || 0);
              break;
          }
          
          if (unlocked) {
            const unlockedAchievement = { ...achievement, isUnlocked: true, unlockedAt: new Date() };
            newAchievements.push(unlockedAchievement);
            
            // Show popup for first new achievement
            if (newAchievements.length === 1) {
              set({ showAchievementPopup: unlockedAchievement });
            }
            
            // Award XP
            await get().addXP(achievement.pointsReward, `Succès: ${achievement.title}`);
          }
        }
        
        if (newAchievements.length > 0) {
          set(state => ({
            unlockedAchievements: [...state.unlockedAchievements, ...newAchievements]
          }));
        }
        
        return newAchievements;
      },

      checkLevelUp: async () => {
        const { userStats, levels } = get();
        const nextLevel = levels.find(l => l.level === userStats.currentLevel + 1);
        
        if (nextLevel && userStats.totalXP >= nextLevel.minPoints) {
          set(state => ({
            userStats: {
              ...state.userStats,
              currentLevel: nextLevel.level
            }
          }));
          
          return nextLevel;
        }
        
        return null;
      },

      fetchLeaderboard: async (type = 'global') => {
        set({ loading: true });
        
        try {
          // Mock API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const mockLeaderboard = generateMockLeaderboard();
          
          if (type === 'global') {
            set({ leaderboard: mockLeaderboard });
          } else {
            // Friends leaderboard would be a subset
            set({ friendsLeaderboard: mockLeaderboard.slice(0, 5) });
          }
          
        } catch (error) {
          set({ error: 'Erreur lors du chargement du classement' });
        } finally {
          set({ loading: false });
        }
      },

      generateDailyChallenges: async () => {
        // This would typically be called once per day
        const newChallenges = generateMockChallenges();
        set({ currentChallenges: newChallenges });
      },

      dismissAchievementPopup: () => {
        set({ showAchievementPopup: null });
      },

      dismissLevelUpPopup: () => {
        set({ showLevelUpPopup: null });
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'gamification-store',
      partialize: (state) => ({
        userStats: state.userStats,
        unlockedAchievements: state.unlockedAchievements,
        earnedBadges: state.earnedBadges,
        currentChallenges: state.currentChallenges
      })
    }
  )
);