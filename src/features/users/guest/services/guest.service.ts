import { hybridAuthService } from '@/core/services/auth/hybrid-auth.service';

export class GuestService {
  async getDailyUsage(date?: string) {
    return await hybridAuthService.getDailyUsage(date);
  }

  async canAccessLesson(date?: string): Promise<boolean> {
    return await hybridAuthService.canAccessContent('lessons', date);
  }

  async canAccessReading(date?: string): Promise<boolean> {
    return await hybridAuthService.canAccessContent('readings', date);
  }

  async canAccessQuiz(date?: string): Promise<boolean> {
    return await hybridAuthService.canAccessContent('quizzes', date);
  }

  async recordLessonAccess(date?: string): Promise<void> {
    await hybridAuthService.recordContentAccess('lessons', date);
  }

  async recordReadingAccess(date?: string): Promise<void> {
    await hybridAuthService.recordContentAccess('readings', date);
  }

  async recordQuizAccess(date?: string): Promise<void> {
    await hybridAuthService.recordContentAccess('quizzes', date);
  }

  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }
}

export const guestService = new GuestService();