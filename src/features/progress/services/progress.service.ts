import { sqliteService } from '@/core/services/offline/sqlite.service';
import { hybridAuthService } from '@/core/services/auth/hybrid-auth.service';
import { syncEngineService } from '@/features/sync/services/sync-engine.service';
import type { 
  UserProgress, 
  LearningStats, 
  Achievement, 
  LearningGoal, 
  StudySession,
  ProgressAnalytics,
  LearningInsight,
  ProgressEvent,
  WeeklyProgress,
  CategoryStats,
  Badge,
  Milestone
} from '../types/progress.types';
import toast from 'react-hot-toast';

export class ProgressService {
  private readonly XP_PER_LEVEL = 1000;
  private readonly LEVEL_MULTIPLIER = 1.2;

  /**
   * Get comprehensive user progress data
   */
  async getUserProgress(userId: string): Promise<UserProgress> {
    try {
      const user = await sqliteService.getUserByFirebaseUid(userId);
      if (!user) throw new Error('User not found');

      const [stats, achievements, goals, badges, milestones] = await Promise.all([
        this.getLearningStats(userId),
        this.getUserAchievements(userId),
        this.getUserGoals(userId),
        this.getUserBadges(userId),
        this.getUserMilestones(userId)
      ]);

      const level = this.calculateLevel(user.xp);
      const xpToNextLevel = this.calculateXpToNextLevel(user.xp);

      return {
        userId,
        level,
        xp: user.xp,
        totalXp: user.xp,
        xpToNextLevel,
        streak: await this.calculateStreak(userId),
        achievements,
        stats,
        goals,
        badges,
        milestones
      };
    } catch (error) {
      console.error('Error fetching user progress:', error);
      throw error;
    }
  }

  /**
   * Record a study session
   */
  async recordStudySession(session: Omit<StudySession, 'id'>): Promise<StudySession> {
    try {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const fullSession: StudySession = {
        id: sessionId,
        ...session
      };

      // Save session to SQLite
      await this.saveStudySession(fullSession);

      // Update user progress - this would be implemented to update user stats
      // For now, we'll just log it
      console.log('Updating user progress:', {
        userId: session.userId,
        xp: session.xpEarned,
        studyTime: session.duration,
        lastActivity: new Date().toISOString()
      });

      // Queue sync operation for study session
      try {
        await syncEngineService.queueOperation({
          type: 'create',
          entity: 'study_sessions',
          entityId: fullSession.id,
          data: fullSession,
          priority: 'high'
        });
      } catch (error) {
        console.error('Error queueing study session sync:', error);
      }

      // Check for achievements and goals
      await this.checkAchievements(fullSession.userId);
      await this.updateGoalProgress(fullSession.userId, fullSession);

      return fullSession;
    } catch (error) {
      console.error('Error recording study session:', error);
      throw error;
    }
  }

  /**
   * Add XP and handle level ups
   */
  async addXP(userId: string, xp: number, source: string): Promise<{ leveledUp: boolean; newLevel?: number }> {
    try {
      const user = await sqliteService.getUserByFirebaseUid(userId);
      if (!user) throw new Error('User not found');

      const oldLevel = this.calculateLevel(user.xp);
      const newXp = user.xp + xp;
      const newLevel = this.calculateLevel(newXp);

      // Update user XP - find user by firebase UID first
      const localUser = await sqliteService.getUserByFirebaseUid(userId);
      if (localUser && localUser.user_id) {
        await sqliteService.updateUser(localUser.user_id, {
          xp: newXp,
          lastLogin: Date.now()
        });
      }

      // Record progress event
      await this.recordProgressEvent({
        userId,
        type: 'xp_gained',
        data: { amount: xp, source, newTotal: newXp },
        timestamp: new Date(),
        processed: false
      });

      // Queue sync operation for user progress
      try {
        await syncEngineService.queueOperation({
          type: 'update',
          entity: 'user_progress',
          entityId: userId,
          data: { xp: newXp, level: newLevel },
          priority: 'high'
        });
      } catch (error) {
        console.error('Error queueing user progress sync:', error);
      }

      // Check for level up
      if (newLevel > oldLevel) {
        await this.handleLevelUp(userId, oldLevel, newLevel);
        toast.success(`🎉 Niveau ${newLevel} atteint ! +${this.getLevelUpBonus(newLevel)} XP bonus !`);
        
        return { leveledUp: true, newLevel };
      }

      return { leveledUp: false };
    } catch (error) {
      console.error('Error adding XP:', error);
      throw error;
    }
  }

  /**
   * Get learning analytics
   */
  async getProgressAnalytics(userId: string, timeframe: 'week' | 'month' | 'year' = 'month'): Promise<ProgressAnalytics> {
    try {
      const sessions = await this.getStudySessions(userId, timeframe);
      const stats = await this.getLearningStats(userId);

      return {
        learningVelocity: this.calculateLearningVelocity(sessions),
        retentionRate: this.calculateRetentionRate(sessions),
        engagementScore: this.calculateEngagementScore(sessions, stats),
        difficultyProgression: this.analyzeDifficultyProgression(sessions),
        timeDistribution: this.analyzeTimeDistribution(sessions),
        deviceUsage: this.analyzeDeviceUsage(sessions),
        predictions: await this.generatePredictions(userId, sessions, stats)
      };
    } catch (error) {
      console.error('Error generating analytics:', error);
      throw error;
    }
  }

  /**
   * Get personalized learning insights
   */
  async getLearningInsights(userId: string): Promise<LearningInsight[]> {
    try {
      const progress = await this.getUserProgress(userId);
      const analytics = await this.getProgressAnalytics(userId);
      const insights: LearningInsight[] = [];

      // Generate insights based on progress data
      insights.push(...this.generateStreakInsights(progress.streak));
      insights.push(...this.generatePerformanceInsights(progress.stats));
      insights.push(...this.generateGoalInsights(progress.goals));
      insights.push(...this.generateEngagementInsights(analytics));

      return insights.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
    } catch (error) {
      console.error('Error generating insights:', error);
      return [];
    }
  }

  /**
   * Create or update a learning goal
   */
  async setLearningGoal(userId: string, goal: Omit<LearningGoal, 'id' | 'current' | 'isCompleted'>): Promise<LearningGoal> {
    try {
      const goalId = `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const fullGoal: LearningGoal = {
        id: goalId,
        current: 0,
        isCompleted: false,
        ...goal
      };

      await this.saveLearningGoal(userId, fullGoal);
      return fullGoal;
    } catch (error) {
      console.error('Error setting learning goal:', error);
      throw error;
    }
  }

  /**
   * Get weekly progress summary
   */
  async getWeeklyProgress(userId: string, weekOffset: number = 0): Promise<WeeklyProgress> {
    try {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() - (weekOffset * 7));
      weekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const sessions = await this.getStudySessionsInRange(userId, weekStart, weekEnd);
      const goals = await this.getUserGoals(userId);

      const weeklyGoals = goals.filter(g => g.type === 'weekly' && g.isActive);

      return {
        week: this.getISOWeek(weekStart),
        studyTime: sessions.reduce((sum, s) => sum + s.duration, 0),
        lessonsCompleted: sessions.reduce((sum, s) => sum + s.activities.filter(a => a.type === 'lesson' && a.completed).length, 0),
        quizzesCompleted: sessions.reduce((sum, s) => sum + s.activities.filter(a => a.type === 'quiz' && a.completed).length, 0),
        xpEarned: sessions.reduce((sum, s) => sum + s.xpEarned, 0),
        averageScore: this.calculateAverageScore(sessions),
        daysActive: new Set(sessions.map(s => s.startTime.toDateString())).size,
        goals: {
          studyTime: this.getGoalProgress(weeklyGoals, 'minutes'),
          lessons: this.getGoalProgress(weeklyGoals, 'lessons'),
          quizzes: this.getGoalProgress(weeklyGoals, 'quizzes')
        }
      };
    } catch (error) {
      console.error('Error getting weekly progress:', error);
      throw error;
    }
  }

  // Private helper methods

  private calculateLevel(xp: number): number {
    let level = 1;
    let requiredXp = this.XP_PER_LEVEL;

    while (xp >= requiredXp) {
      xp -= requiredXp;
      level++;
      requiredXp = Math.floor(this.XP_PER_LEVEL * Math.pow(this.LEVEL_MULTIPLIER, level - 1));
    }

    return level;
  }

  private calculateXpToNextLevel(currentXp: number): number {
    const currentLevel = this.calculateLevel(currentXp);
    const nextLevelXp = Math.floor(this.XP_PER_LEVEL * Math.pow(this.LEVEL_MULTIPLIER, currentLevel));
    
    let totalXpForCurrentLevel = 0;
    for (let i = 1; i < currentLevel; i++) {
      totalXpForCurrentLevel += Math.floor(this.XP_PER_LEVEL * Math.pow(this.LEVEL_MULTIPLIER, i - 1));
    }

    return nextLevelXp - (currentXp - totalXpForCurrentLevel);
  }

  private async calculateStreak(userId: string): Promise<{ current: number; longest: number; lastActivity: Date }> {
    try {
      const sessions = await this.getRecentStudySessions(userId, 365); // Last year
      if (sessions.length === 0) {
        return { current: 0, longest: 0, lastActivity: new Date() };
      }

      const dailyActivity = new Map<string, boolean>();
      sessions.forEach(session => {
        const dateKey = session.startTime.toDateString();
        dailyActivity.set(dateKey, true);
      });

      const sortedDates = Array.from(dailyActivity.keys()).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
      
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;

      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

      // Calculate current streak
      if (sortedDates.includes(today) || sortedDates.includes(yesterday)) {
        let checkDate = new Date();
        if (!sortedDates.includes(today)) {
          checkDate.setDate(checkDate.getDate() - 1);
        }

        while (sortedDates.includes(checkDate.toDateString())) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        }
      }

      // Calculate longest streak
      for (let i = 0; i < sortedDates.length; i++) {
        tempStreak = 1;
        let currentDate = new Date(sortedDates[i]);
        
        for (let j = i + 1; j < sortedDates.length; j++) {
          const nextDate = new Date(sortedDates[j]);
          const dayDiff = Math.floor((currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (dayDiff === 1) {
            tempStreak++;
            currentDate = nextDate;
          } else {
            break;
          }
        }
        
        longestStreak = Math.max(longestStreak, tempStreak);
      }

      return {
        current: currentStreak,
        longest: longestStreak,
        lastActivity: sessions[0]?.startTime || new Date()
      };
    } catch (error) {
      console.error('Error calculating streak:', error);
      return { current: 0, longest: 0, lastActivity: new Date() };
    }
  }

  private async getLearningStats(userId: string): Promise<LearningStats> {
    try {
      // This would normally query SQLite for comprehensive stats
      // For now, return mock data structure
      return {
        totalStudyTime: 0,
        lessonsCompleted: 0,
        quizzesCompleted: 0,
        wordsLearned: 0,
        averageQuizScore: 0,
        perfectScores: 0,
        activeDays: 0,
        weeklyGoalProgress: 0,
        monthlyGoalProgress: 0,
        favoriteCategory: 'General',
        strongestSkill: 'Vocabulary',
        improvementAreas: [],
        lastWeekProgress: {
          week: this.getISOWeek(new Date()),
          studyTime: 0,
          lessonsCompleted: 0,
          quizzesCompleted: 0,
          xpEarned: 0,
          averageScore: 0,
          daysActive: 0,
          goals: {
            studyTime: { target: 300, achieved: 0 },
            lessons: { target: 5, achieved: 0 },
            quizzes: { target: 10, achieved: 0 }
          }
        },
        categoryBreakdown: []
      };
    } catch (error) {
      console.error('Error getting learning stats:', error);
      throw error;
    }
  }

  private async getUserAchievements(userId: string): Promise<Achievement[]> {
    // Simplified for now - would query SQLite
    return [];
  }

  private async getUserGoals(userId: string): Promise<LearningGoal[]> {
    // Simplified for now - would query SQLite
    return [];
  }

  private async getUserBadges(userId: string): Promise<Badge[]> {
    // Simplified for now - would query SQLite
    return [];
  }

  private async getUserMilestones(userId: string): Promise<Milestone[]> {
    // Simplified for now - would query SQLite
    return [];
  }

  private async saveStudySession(session: StudySession): Promise<void> {
    console.log('Saving study session:', session);
    // Would save to SQLite
  }

  private async updateUserProgress(userId: string, updates: any): Promise<void> {
    console.log('Updating user progress:', { userId, updates });
    // Would update SQLite
  }

  private async checkAchievements(userId: string): Promise<void> {
    console.log('Checking achievements for user:', userId);
    // Would check and unlock achievements
  }

  private async updateGoalProgress(userId: string, session: StudySession): Promise<void> {
    console.log('Updating goal progress:', { userId, session });
    // Would update goal progress
  }

  private async recordProgressEvent(event: Omit<ProgressEvent, 'id'>): Promise<void> {
    console.log('Recording progress event:', event);
    // Would save to SQLite
  }

  private async handleLevelUp(userId: string, oldLevel: number, newLevel: number): Promise<void> {
    const bonus = this.getLevelUpBonus(newLevel);
    await this.recordProgressEvent({
      userId,
      type: 'level_up',
      data: { oldLevel, newLevel, bonus },
      timestamp: new Date(),
      processed: false
    });
  }

  private getLevelUpBonus(level: number): number {
    return level * 100;
  }

  private async getStudySessions(userId: string, timeframe: string): Promise<StudySession[]> {
    // Simplified for now
    return [];
  }

  private async getRecentStudySessions(userId: string, days: number): Promise<StudySession[]> {
    // Simplified for now
    return [];
  }

  private async getStudySessionsInRange(userId: string, start: Date, end: Date): Promise<StudySession[]> {
    // Simplified for now
    return [];
  }

  private calculateLearningVelocity(sessions: StudySession[]): { daily: number; weekly: number; monthly: number } {
    return { daily: 0, weekly: 0, monthly: 0 };
  }

  private calculateRetentionRate(sessions: StudySession[]): number {
    return 0;
  }

  private calculateEngagementScore(sessions: StudySession[], stats: LearningStats): number {
    return 0;
  }

  private analyzeDifficultyProgression(sessions: StudySession[]): { beginner: number; intermediate: number; advanced: number } {
    return { beginner: 0, intermediate: 0, advanced: 0 };
  }

  private analyzeTimeDistribution(sessions: StudySession[]): { morning: number; afternoon: number; evening: number; night: number } {
    return { morning: 0, afternoon: 0, evening: 0, night: 0 };
  }

  private analyzeDeviceUsage(sessions: StudySession[]): { mobile: number; desktop: number; tablet: number } {
    return { mobile: 0, desktop: 0, tablet: 0 };
  }

  private async generatePredictions(userId: string, sessions: StudySession[], stats: LearningStats): Promise<any> {
    return {
      nextLevelDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      weeklyGoalCompletion: 75,
      recommendedStudyTime: 30
    };
  }

  private generateStreakInsights(streak: any): LearningInsight[] {
    return [];
  }

  private generatePerformanceInsights(stats: LearningStats): LearningInsight[] {
    return [];
  }

  private generateGoalInsights(goals: LearningGoal[]): LearningInsight[] {
    return [];
  }

  private generateEngagementInsights(analytics: ProgressAnalytics): LearningInsight[] {
    return [];
  }

  private async saveLearningGoal(userId: string, goal: LearningGoal): Promise<void> {
    console.log('Saving learning goal:', { userId, goal });
  }

  private getISOWeek(date: Date): string {
    const year = date.getFullYear();
    const week = Math.ceil(((date.getTime() - new Date(year, 0, 1).getTime()) / 86400000 + new Date(year, 0, 1).getDay() + 1) / 7);
    return `${year}-W${week.toString().padStart(2, '0')}`;
  }

  private calculateAverageScore(sessions: StudySession[]): number {
    const scores = sessions.flatMap(s => s.activities.filter(a => a.score !== undefined).map(a => a.score!));
    return scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0;
  }

  private getGoalProgress(goals: LearningGoal[], unit: string): { target: number; achieved: number } {
    const relevantGoals = goals.filter(g => g.unit === unit);
    const target = relevantGoals.reduce((sum, g) => sum + g.target, 0);
    const achieved = relevantGoals.reduce((sum, g) => sum + g.current, 0);
    return { target, achieved };
  }
}

export const progressService = new ProgressService();
