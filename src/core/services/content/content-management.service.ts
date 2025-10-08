/**
 * Content Management Service
 * Handles CRUD operations for teachers and admins
 */

import { sqliteService } from '../offline/sqlite.service';
import { hybridAuthService } from '../auth/hybrid-auth.service';
import type { LessonRecord, QuizRecord, DictionaryRecord } from '../offline/types';

export class ContentManagementService {
  /**
   * Check if current user has permission for content management
   */
  private checkPermissions(requiredRole: 'teacher' | 'admin'): void {
    const user = hybridAuthService.getCurrentUser();
    if (!user) {
      throw new Error('Authentication required');
    }
    
    if (requiredRole === 'admin' && user.role !== 'admin') {
      throw new Error('Admin access required');
    }
    
    if (requiredRole === 'teacher' && !['teacher', 'admin'].includes(user.role)) {
      throw new Error('Teacher or admin access required');
    }
  }

  // ===== DICTIONARY MANAGEMENT =====

  /**
   * Create new dictionary entry (Teacher/Admin)
   */
  async createTranslation(data: {
    frenchText: string;
    languageId: string;
    translation: string;
    categoryId?: string;
    pronunciation?: string;
    usageNotes?: string;
    difficultyLevel?: string;
  }): Promise<number> {
    this.checkPermissions('teacher');
    
    const user = hybridAuthService.getCurrentUser()!;
    const translationId = await sqliteService.insertTranslation({
      ...data,
      createdBy: user.id
    });

    // Track teacher content for review if not admin
    if (user.role === 'teacher') {
      await sqliteService.createTeacherContent(
        (await this.getUserLocalId(user.id))!,
        'translation',
        translationId
      );
    }

    return translationId;
  }

  /**
   * Update dictionary entry (Teacher/Admin)
   */
  async updateTranslation(
    translationId: number, 
    updates: Partial<DictionaryRecord>
  ): Promise<void> {
    this.checkPermissions('teacher');
    
    // Check if user owns this content or is admin
    await this.checkContentOwnership('translation', translationId);
    
    await sqliteService.updateTranslation(translationId, updates);
  }

  /**
   * Delete dictionary entry (Admin only)
   */
  async deleteTranslation(translationId: number): Promise<void> {
    this.checkPermissions('admin');
    await sqliteService.deleteTranslation(translationId);
  }

  // ===== LESSON MANAGEMENT =====

  /**
   * Create new lesson (Teacher/Admin)
   */
  async createLesson(data: {
    languageId: string;
    title: string;
    description?: string;
    content: string;
    level: string;
    orderIndex: number;
    audioUrl?: string;
    videoUrl?: string;
    estimatedDuration?: number;
    xpReward?: number;
  }): Promise<number> {
    this.checkPermissions('teacher');
    
    const user = hybridAuthService.getCurrentUser()!;
    const lessonId = await sqliteService.insertLesson({
      ...data,
      createdBy: user.id
    });

    // Track teacher content for review if not admin
    if (user.role === 'teacher') {
      await sqliteService.createTeacherContent(
        (await this.getUserLocalId(user.id))!,
        'lesson',
        lessonId
      );
    }

    return lessonId;
  }

  /**
   * Update lesson (Teacher/Admin)
   */
  async updateLesson(
    lessonId: number, 
    updates: Partial<LessonRecord>
  ): Promise<void> {
    this.checkPermissions('teacher');
    
    // Check if user owns this content or is admin
    await this.checkContentOwnership('lesson', lessonId);
    
    await sqliteService.updateLesson(lessonId, updates);
  }

  /**
   * Delete lesson (Admin only)
   */
  async deleteLesson(lessonId: number): Promise<void> {
    this.checkPermissions('admin');
    await sqliteService.deleteLesson(lessonId);
  }

  // ===== QUIZ MANAGEMENT =====

  /**
   * Create new quiz (Teacher/Admin)
   */
  async createQuiz(data: {
    title: string;
    description?: string;
    languageId?: string;
    level?: string;
    questions: any[]; // Will be JSON stringified
    timeLimit?: number;
    passingScore?: number;
    xpReward?: number;
  }): Promise<number> {
    this.checkPermissions('teacher');
    
    const user = hybridAuthService.getCurrentUser()!;
    const quizId = await sqliteService.insertQuiz({
      ...data,
      questions: JSON.stringify(data.questions),
      createdBy: user.id
    });

    // Track teacher content for review if not admin
    if (user.role === 'teacher') {
      await sqliteService.createTeacherContent(
        (await this.getUserLocalId(user.id))!,
        'quiz',
        quizId
      );
    }

    return quizId;
  }

  /**
   * Update quiz (Teacher/Admin)
   */
  async updateQuiz(
    quizId: number, 
    updates: Partial<QuizRecord>
  ): Promise<void> {
    this.checkPermissions('teacher');
    
    // Check if user owns this content or is admin
    await this.checkContentOwnership('quiz', quizId);
    
    // Stringify questions if provided
    if (updates.questions && Array.isArray(updates.questions)) {
      updates.questions = JSON.stringify(updates.questions) as any;
    }
    
    await sqliteService.updateQuiz(quizId, updates);
  }

  /**
   * Delete quiz (Admin only)
   */
  async deleteQuiz(quizId: number): Promise<void> {
    this.checkPermissions('admin');
    await sqliteService.deleteQuiz(quizId);
  }

  // ===== CONTENT REVIEW (Admin) =====

  /**
   * Get pending content for review (Admin only)
   */
  async getPendingContent(): Promise<any[]> {
    this.checkPermissions('admin');
    return await sqliteService.getPendingContent();
  }

  /**
   * Approve teacher content (Admin only)
   */
  async approveContent(
    contentId: number, 
    reviewNotes?: string
  ): Promise<void> {
    this.checkPermissions('admin');
    
    const user = hybridAuthService.getCurrentUser()!;
    const localUserId = await this.getUserLocalId(user.id);
    
    await sqliteService.updateTeacherContentStatus(
      contentId,
      'approved',
      localUserId || undefined,
      reviewNotes
    );
  }

  /**
   * Reject teacher content (Admin only)
   */
  async rejectContent(
    contentId: number, 
    reviewNotes: string
  ): Promise<void> {
    this.checkPermissions('admin');
    
    const user = hybridAuthService.getCurrentUser()!;
    const localUserId = await this.getUserLocalId(user.id);
    
    await sqliteService.updateTeacherContentStatus(
      contentId,
      'rejected',
      localUserId || undefined,
      reviewNotes
    );
  }

  // ===== TEACHER CONTENT TRACKING =====

  /**
   * Get teacher's content (Teacher/Admin)
   */
  async getTeacherContent(status?: string): Promise<any[]> {
    this.checkPermissions('teacher');
    
    const user = hybridAuthService.getCurrentUser()!;
    const localUserId = await this.getUserLocalId(user.id);
    
    if (!localUserId) return [];
    
    return await sqliteService.getTeacherContent(localUserId, status);
  }

  // ===== STATISTICS =====

  /**
   * Get content statistics (Teacher/Admin)
   */
  async getContentStats(): Promise<any> {
    this.checkPermissions('teacher');
    
    const user = hybridAuthService.getCurrentUser()!;
    
    if (user.role === 'admin') {
      // Admin sees all stats
      return {
        totalTranslations: (await sqliteService.query<{count: number}>('SELECT COUNT(*) as count FROM translations'))[0]?.count || 0,
        totalLessons: (await sqliteService.query<{count: number}>('SELECT COUNT(*) as count FROM lessons'))[0]?.count || 0,
        totalQuizzes: (await sqliteService.query<{count: number}>('SELECT COUNT(*) as count FROM quizzes'))[0]?.count || 0,
        pendingReviews: (await sqliteService.query<{count: number}>('SELECT COUNT(*) as count FROM teacher_content WHERE status = ?', ['pending_review']))[0]?.count || 0,
        totalUsers: (await sqliteService.query<{count: number}>('SELECT COUNT(*) as count FROM users'))[0]?.count || 0,
      };
    } else {
      // Teacher sees only their stats
      const localUserId = await this.getUserLocalId(user.id);
      if (!localUserId) return {};
      
      return {
        myTranslations: (await sqliteService.query<{count: number}>('SELECT COUNT(*) as count FROM translations WHERE created_by = ?', [user.id]))[0]?.count || 0,
        myLessons: (await sqliteService.query<{count: number}>('SELECT COUNT(*) as count FROM lessons WHERE created_by = ?', [user.id]))[0]?.count || 0,
        myQuizzes: (await sqliteService.query<{count: number}>('SELECT COUNT(*) as count FROM quizzes WHERE created_by = ?', [user.id]))[0]?.count || 0,
        pendingReviews: (await sqliteService.query<{count: number}>('SELECT COUNT(*) as count FROM teacher_content WHERE teacher_id = ? AND status = ?', [localUserId, 'pending_review']))[0]?.count || 0,
        approvedContent: (await sqliteService.query<{count: number}>('SELECT COUNT(*) as count FROM teacher_content WHERE teacher_id = ? AND status = ?', [localUserId, 'approved']))[0]?.count || 0,
      };
    }
  }

  // ===== HELPER METHODS =====

  /**
   * Get local user ID from Firebase UID
   */
  private async getUserLocalId(firebaseUid: string): Promise<number | null> {
    const localUser = await sqliteService.getUserByFirebaseUid(firebaseUid);
    return localUser?.user_id || null;
  }

  /**
   * Check if user owns content or is admin
   */
  private async checkContentOwnership(
    contentType: 'translation' | 'lesson' | 'quiz',
    contentId: number
  ): Promise<void> {
    const user = hybridAuthService.getCurrentUser()!;
    
    // Admins can edit anything
    if (user.role === 'admin') return;
    
    // Check if teacher owns the content
    let content: any;
    switch (contentType) {
      case 'translation':
        content = await sqliteService.query('SELECT created_by FROM translations WHERE translation_id = ?', [contentId]);
        break;
      case 'lesson':
        content = await sqliteService.query('SELECT created_by FROM lessons WHERE lesson_id = ?', [contentId]);
        break;
      case 'quiz':
        content = await sqliteService.query('SELECT created_by FROM quizzes WHERE quiz_id = ?', [contentId]);
        break;
    }
    
    if (!content[0] || content[0].created_by !== user.id) {
      throw new Error('You can only edit your own content');
    }
  }

  // ===== SEARCH AND FILTERING =====

  /**
   * Search content with filters
   */
  async searchContent(params: {
    type: 'translations' | 'lessons' | 'quizzes';
    query?: string;
    languageId?: string;
    level?: string;
    categoryId?: string;
    createdBy?: string;
    limit?: number;
    offset?: number;
  }): Promise<any[]> {
    const { type, query, languageId, level, categoryId, createdBy, limit = 50, offset = 0 } = params;
    
    let sql = `SELECT * FROM ${type} WHERE 1=1`;
    const sqlParams: any[] = [];
    
    if (query) {
      if (type === 'translations') {
        sql += ' AND (french_text LIKE ? OR translation LIKE ?)';
        sqlParams.push(`%${query}%`, `%${query}%`);
      } else {
        sql += ' AND (title LIKE ? OR description LIKE ?)';
        sqlParams.push(`%${query}%`, `%${query}%`);
      }
    }
    
    if (languageId) {
      sql += ' AND language_id = ?';
      sqlParams.push(languageId);
    }
    
    if (level) {
      if (type === 'translations') {
        sql += ' AND difficulty_level = ?';
      } else {
        sql += ' AND level = ?';
      }
      sqlParams.push(level);
    }
    
    if (categoryId && type === 'translations') {
      sql += ' AND category_id = ?';
      sqlParams.push(categoryId);
    }
    
    if (createdBy) {
      sql += ' AND created_by = ?';
      sqlParams.push(createdBy);
    }
    
    sql += ' ORDER BY created_date DESC LIMIT ? OFFSET ?';
    sqlParams.push(limit, offset);
    
    return await sqliteService.query(sql, sqlParams);
  }
}

export const contentManagementService = new ContentManagementService();
