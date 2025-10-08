import { sqliteService } from '@/core/services/offline/sqlite.service';
import { hybridAuthService } from '@/core/services/auth/hybrid-auth.service';
import type { 
  Quiz, 
  QuizQuestion, 
  QuizAttempt, 
  QuizAnswer, 
  QuizResult, 
  QuizStats,
  QuizSession 
} from '../types/quiz.types';
import toast from 'react-hot-toast';

export class QuizService {
  /**
   * Get all available quizzes for the current user
   */
  async getAvailableQuizzes(language?: string, category?: string, difficulty?: string): Promise<Quiz[]> {
    try {
      const currentUser = hybridAuthService.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      // Get quizzes from SQLite
      const quizzes = await sqliteService.getQuizzes();

      return quizzes.map(this.mapQuizRecordToQuiz);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      throw error;
    }
  }

  /**
   * Get a specific quiz by ID
   */
  async getQuizById(quizId: string): Promise<Quiz | null> {
    try {
      const quizRecord = await sqliteService.getQuizById(parseInt(quizId));
      if (!quizRecord) return null;

      return this.mapQuizRecordToQuiz(quizRecord);
    } catch (error) {
      console.error('Error fetching quiz:', error);
      throw error;
    }
  }

  /**
   * Start a new quiz attempt
   */
  async startQuizAttempt(quizId: string): Promise<QuizSession> {
    try {
      const currentUser = hybridAuthService.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const quiz = await this.getQuizById(quizId);
      if (!quiz) {
        throw new Error('Quiz not found');
      }

      // Check if user has exceeded max attempts
      if (quiz.maxAttempts) {
        const previousAttempts = await this.getUserQuizAttempts(currentUser.id, quizId);
        if (previousAttempts.length >= quiz.maxAttempts) {
          throw new Error('Maximum attempts exceeded');
        }
      }

      // Create new quiz session
      const session: QuizSession = {
        id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        quizId,
        userId: currentUser.id,
        currentQuestionIndex: 0,
        answers: [],
        startedAt: new Date(),
        timeRemaining: quiz.timeLimit ? quiz.timeLimit * 60 : undefined,
        status: 'active'
      };

      // Store session in localStorage for persistence
      localStorage.setItem(`quiz_session_${session.id}`, JSON.stringify(session));

      return session;
    } catch (error) {
      console.error('Error starting quiz attempt:', error);
      throw error;
    }
  }

  /**
   * Submit an answer for a question
   */
  async submitAnswer(
    sessionId: string, 
    questionId: string, 
    userAnswer: string | string[], 
    timeSpent: number
  ): Promise<{ isCorrect: boolean; pointsEarned: number; explanation?: string }> {
    try {
      const session = this.getQuizSession(sessionId);
      if (!session) {
        throw new Error('Quiz session not found');
      }

      const quiz = await this.getQuizById(session.quizId);
      if (!quiz) {
        throw new Error('Quiz not found');
      }

      const question = quiz.questions.find(q => q.id === questionId);
      if (!question) {
        throw new Error('Question not found');
      }

      // Check if answer is correct
      const isCorrect = this.checkAnswer(question, userAnswer);
      const pointsEarned = isCorrect ? question.points : 0;

      // Create answer record
      const answer: QuizAnswer = {
        questionId,
        userAnswer,
        isCorrect,
        pointsEarned,
        timeSpent,
        attempts: 1
      };

      // Update session
      session.answers.push(answer);
      session.currentQuestionIndex++;
      
      // Save updated session
      localStorage.setItem(`quiz_session_${sessionId}`, JSON.stringify(session));

      return {
        isCorrect,
        pointsEarned,
        explanation: question.explanation
      };
    } catch (error) {
      console.error('Error submitting answer:', error);
      throw error;
    }
  }

  /**
   * Complete a quiz attempt and calculate results
   */
  async completeQuizAttempt(sessionId: string): Promise<QuizResult> {
    try {
      const session = this.getQuizSession(sessionId);
      if (!session) {
        throw new Error('Quiz session not found');
      }

      const quiz = await this.getQuizById(session.quizId);
      if (!quiz) {
        throw new Error('Quiz not found');
      }

      const currentUser = hybridAuthService.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      // Calculate results
      const totalScore = session.answers.reduce((sum, answer) => sum + answer.pointsEarned, 0);
      const maxScore = quiz.questions.reduce((sum, question) => sum + question.points, 0);
      const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
      const passed = percentage >= quiz.passingScore;
      const timeSpent = Math.floor((new Date().getTime() - session.startedAt.getTime()) / 1000);

      // Create attempt record
      const attempt: QuizAttempt = {
        id: `attempt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        quizId: session.quizId,
        userId: currentUser.id,
        startedAt: session.startedAt,
        completedAt: new Date(),
        answers: session.answers,
        score: totalScore,
        percentage,
        passed,
        timeSpent,
        status: 'completed'
      };

      // Save attempt to SQLite (simplified for now)
      console.log('Quiz attempt saved:', attempt);

      // Update user progress and XP
      await this.updateUserProgress(currentUser.id, attempt, quiz);

      // Clean up session
      localStorage.removeItem(`quiz_session_${sessionId}`);

      // Calculate category breakdown
      const breakdown = this.calculateCategoryBreakdown(quiz, session.answers);

      const result: QuizResult = {
        attempt,
        quiz,
        correctAnswers: session.answers.filter(a => a.isCorrect).length,
        totalQuestions: quiz.questions.length,
        score: totalScore,
        percentage,
        passed,
        timeSpent,
        breakdown
      };

      return result;
    } catch (error) {
      console.error('Error completing quiz attempt:', error);
      throw error;
    }
  }

  /**
   * Get user's quiz statistics
   */
  async getUserQuizStats(userId: string): Promise<QuizStats> {
    try {
      // For now, return empty array - will be implemented with proper SQLite methods
      const attempts: any[] = [];
      
      if (attempts.length === 0) {
        return {
          totalQuizzes: 0,
          completedQuizzes: 0,
          averageScore: 0,
          bestScore: 0,
          totalTimeSpent: 0,
          streakDays: 0,
          categoryStats: {}
        };
      }

      const completedAttempts = attempts.filter(a => a.status === 'completed');
      const scores = completedAttempts.map(a => a.percentage);
      const averageScore = scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0;
      const bestScore = scores.length > 0 ? Math.max(...scores) : 0;
      const totalTimeSpent = completedAttempts.reduce((sum, attempt) => sum + attempt.timeSpent, 0);

      // Calculate category stats
      const categoryStats: { [category: string]: any } = {};
      for (const attempt of completedAttempts) {
        const quiz = await this.getQuizById(attempt.quizId);
        if (quiz) {
          if (!categoryStats[quiz.category]) {
            categoryStats[quiz.category] = {
              attempted: 0,
              completed: 0,
              scores: []
            };
          }
          categoryStats[quiz.category].attempted++;
          if (attempt.status === 'completed') {
            categoryStats[quiz.category].completed++;
            categoryStats[quiz.category].scores.push(attempt.percentage);
          }
        }
      }

      // Process category stats
      Object.keys(categoryStats).forEach(category => {
        const stats = categoryStats[category];
        stats.averageScore = stats.scores.length > 0 ? 
          stats.scores.reduce((sum: number, score: number) => sum + score, 0) / stats.scores.length : 0;
        stats.bestScore = stats.scores.length > 0 ? Math.max(...stats.scores) : 0;
        delete stats.scores;
      });

      return {
        totalQuizzes: new Set(attempts.map(a => a.quizId)).size,
        completedQuizzes: completedAttempts.length,
        averageScore,
        bestScore,
        totalTimeSpent,
        streakDays: this.calculateStreakDays(completedAttempts),
        lastQuizDate: completedAttempts.length > 0 ? 
          new Date(Math.max(...completedAttempts.map(a => new Date(a.completedAt!).getTime()))) : undefined,
        categoryStats
      };
    } catch (error) {
      console.error('Error fetching user quiz stats:', error);
      throw error;
    }
  }

  /**
   * Get quiz session from localStorage
   */
  private getQuizSession(sessionId: string): QuizSession | null {
    try {
      const sessionData = localStorage.getItem(`quiz_session_${sessionId}`);
      if (!sessionData) return null;

      const session = JSON.parse(sessionData);
      // Convert date strings back to Date objects
      session.startedAt = new Date(session.startedAt);
      return session;
    } catch (error) {
      console.error('Error retrieving quiz session:', error);
      return null;
    }
  }

  /**
   * Check if user's answer is correct
   */
  private checkAnswer(question: QuizQuestion, userAnswer: string | string[]): boolean {
    const correctAnswer = question.correctAnswer;
    
    if (Array.isArray(correctAnswer) && Array.isArray(userAnswer)) {
      // Multiple correct answers
      return correctAnswer.length === userAnswer.length && 
             correctAnswer.every(answer => userAnswer.includes(answer));
    } else if (typeof correctAnswer === 'string' && typeof userAnswer === 'string') {
      // Single correct answer
      return correctAnswer.toLowerCase().trim() === userAnswer.toLowerCase().trim();
    }
    
    return false;
  }

  /**
   * Save quiz attempt to SQLite (simplified for now)
   */
  private async saveQuizAttempt(attempt: QuizAttempt): Promise<void> {
    console.log('Saving quiz attempt:', attempt);
    // Will be implemented with proper SQLite methods
  }

  /**
   * Update user progress and XP based on quiz performance
   */
  private async updateUserProgress(userId: string, attempt: QuizAttempt, quiz: Quiz): Promise<void> {
    try {
      const currentUser = hybridAuthService.getCurrentUser();
      if (!currentUser) return;

      // Calculate XP earned
      let xpEarned = attempt.score;
      
      // Bonus XP for perfect score
      if (attempt.percentage === 100) {
        xpEarned += Math.floor(attempt.score * 0.5);
      }
      
      // Bonus XP for first attempt pass
      const previousAttempts = await this.getUserQuizAttempts(userId, quiz.id);
      if (attempt.passed && previousAttempts.length === 0) {
        xpEarned += Math.floor(attempt.score * 0.3);
      }

      // Update user XP and level (simplified for now)
      console.log('Updating user progress:', { userId, xpEarned });

      // Show success message
      if (attempt.passed) {
        toast.success(`Quiz réussi ! +${xpEarned} XP`, { duration: 4000 });
      }
    } catch (error) {
      console.error('Error updating user progress:', error);
    }
  }

  /**
   * Calculate category breakdown for quiz results
   */
  private calculateCategoryBreakdown(quiz: Quiz, answers: QuizAnswer[]): QuizResult['breakdown'] {
    const categories: { [category: string]: { correct: number; total: number } } = {};
    
    quiz.questions.forEach((question, index) => {
      const category = question.category || 'General';
      if (!categories[category]) {
        categories[category] = { correct: 0, total: 0 };
      }
      
      categories[category].total++;
      if (answers[index]?.isCorrect) {
        categories[category].correct++;
      }
    });

    return Object.entries(categories).map(([category, stats]) => ({
      category,
      correct: stats.correct,
      total: stats.total,
      percentage: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0
    }));
  }

  /**
   * Calculate streak days from completed attempts
   */
  private calculateStreakDays(attempts: QuizAttempt[]): number {
    if (attempts.length === 0) return 0;

    const sortedDates = attempts
      .map(a => new Date(a.completedAt!).toDateString())
      .sort()
      .filter((date, index, arr) => arr.indexOf(date) === index); // Remove duplicates

    let streak = 1;
    const today = new Date().toDateString();
    
    // Check if streak is current (includes today or yesterday)
    const lastDate = sortedDates[sortedDates.length - 1];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastDate !== today && lastDate !== yesterday.toDateString()) {
      return 0; // Streak is broken
    }

    // Count consecutive days backwards
    for (let i = sortedDates.length - 2; i >= 0; i--) {
      const currentDate = new Date(sortedDates[i + 1]);
      const previousDate = new Date(sortedDates[i]);
      const dayDiff = Math.floor((currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  /**
   * Get user's previous attempts for a specific quiz
   */
  private async getUserQuizAttempts(userId: string, quizId: string): Promise<QuizAttempt[]> {
    // Simplified for now - will be implemented with proper SQLite methods
    return [];
  }

  /**
   * Map SQLite quiz record to Quiz interface
   */
  private mapQuizRecordToQuiz(record: any): Quiz {
    return {
      id: record.quiz_id.toString(),
      title: record.title,
      description: record.description || '',
      language: record.language,
      category: record.category,
      difficulty: record.difficulty as 'beginner' | 'intermediate' | 'advanced',
      questions: JSON.parse(record.questions || '[]'),
      timeLimit: record.time_limit,
      passingScore: record.passing_score || 70,
      maxAttempts: record.max_attempts,
      isPublished: Boolean(record.is_published),
      createdBy: record.created_by || 'system',
      createdAt: new Date(record.created_at),
      updatedAt: new Date(record.updated_at),
      tags: record.tags ? JSON.parse(record.tags) : []
    };
  }
}

export const quizService = new QuizService();
