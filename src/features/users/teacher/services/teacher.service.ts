import { sqliteService } from '@/core/services/offline/sqlite.service';
import { hybridAuthService } from '@/core/services/auth/hybrid-auth.service';
import type { LessonRecord, QuizRecord, DictionaryRecord } from '@/core/services/offline/types';

export interface TeacherStats {
  studentsCount: number;
  lessonsCreated: number;
  quizzesCreated: number;
  dictionaryEntriesCreated: number;
  pendingApprovals: number;
  totalViews: number;
  averageRating: number;
}

export interface StudentProgress {
  userId: number;
  displayName: string;
  email: string;
  lessonsCompleted: number;
  averageScore: number;
  timeSpent: number;
  lastActivity: Date;
  currentStreak: number;
}

export interface ContentItem {
  id: number;
  type: 'lesson' | 'quiz' | 'translation';
  title: string;
  status: 'draft' | 'pending_review' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  views?: number;
  rating?: number;
}

export class TeacherService {
  /**
   * Get teacher dashboard statistics
   */
  async getTeacherStats(teacherId?: number): Promise<TeacherStats> {
    const currentUser = hybridAuthService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'teacher') {
      throw new Error('Unauthorized: Teacher access required');
    }

    const localUser = await sqliteService.getUserByFirebaseUid(currentUser.id);
    if (!localUser) {
      throw new Error('Teacher not found in local database');
    }

    const userId = teacherId || localUser.user_id!;

    // Get lessons created by teacher
    const lessons = await sqliteService.query<{ count: number }>(
      'SELECT COUNT(*) as count FROM lessons WHERE created_by = ?',
      [userId.toString()]
    );

    // Get quizzes created by teacher
    const quizzes = await sqliteService.query<{ count: number }>(
      'SELECT COUNT(*) as count FROM quizzes WHERE created_by = ?',
      [userId.toString()]
    );

    // Get dictionary entries created by teacher
    const translations = await sqliteService.query<{ count: number }>(
      'SELECT COUNT(*) as count FROM translations WHERE created_by = ?',
      [userId.toString()]
    );

    // Get pending content for approval
    const pendingContent = await sqliteService.query<{ count: number }>(
      'SELECT COUNT(*) as count FROM teacher_content WHERE teacher_id = ? AND status = ?',
      [userId, 'pending_review']
    );

    // Mock student count - in a real app, this would be based on class assignments
    const studentsCount = 25; // This would come from a classes/students table

    return {
      studentsCount,
      lessonsCreated: lessons[0]?.count || 0,
      quizzesCreated: quizzes[0]?.count || 0,
      dictionaryEntriesCreated: translations[0]?.count || 0,
      pendingApprovals: pendingContent[0]?.count || 0,
      totalViews: 0, // Would be calculated from usage analytics
      averageRating: 4.5, // Would be calculated from user ratings
    };
  }

  /**
   * Get students progress for teacher's classes
   */
  async getStudentsProgress(): Promise<StudentProgress[]> {
    const currentUser = hybridAuthService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'teacher') {
      throw new Error('Unauthorized: Teacher access required');
    }

    // Mock data - in a real app, this would query actual student-teacher relationships
    return [
      {
        userId: 1,
        displayName: 'Marie Dubois',
        email: 'marie.dubois@example.com',
        lessonsCompleted: 15,
        averageScore: 85,
        timeSpent: 120, // minutes
        lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        currentStreak: 5,
      },
      {
        userId: 2,
        displayName: 'Jean Kamga',
        email: 'jean.kamga@example.com',
        lessonsCompleted: 22,
        averageScore: 92,
        timeSpent: 180,
        lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        currentStreak: 12,
      },
      {
        userId: 3,
        displayName: 'Fatima Nkomo',
        email: 'fatima.nkomo@example.com',
        lessonsCompleted: 8,
        averageScore: 78,
        timeSpent: 90,
        lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        currentStreak: 0,
      },
    ];
  }

  /**
   * Get teacher's content items
   */
  async getTeacherContent(status?: string): Promise<ContentItem[]> {
    const currentUser = hybridAuthService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'teacher') {
      throw new Error('Unauthorized: Teacher access required');
    }

    const localUser = await sqliteService.getUserByFirebaseUid(currentUser.id);
    if (!localUser) {
      throw new Error('Teacher not found in local database');
    }

    const userId = localUser.user_id!;
    const content = await sqliteService.getTeacherContent(userId, status);

    return content.map((item: any) => ({
      id: item.content_id,
      type: item.content_type,
      title: `${item.content_type} #${item.reference_id}`,
      status: item.status,
      createdAt: new Date(item.created_at * 1000),
      updatedAt: new Date(item.created_at * 1000),
    }));
  }

  /**
   * Create a new lesson
   */
  async createLesson(lessonData: {
    languageId: string;
    title: string;
    description?: string;
    content: string;
    level: string;
    orderIndex: number;
    audioUrl?: string;
    videoUrl?: string;
    estimatedDuration?: number;
  }): Promise<number> {
    const currentUser = hybridAuthService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'teacher') {
      throw new Error('Unauthorized: Teacher access required');
    }

    const localUser = await sqliteService.getUserByFirebaseUid(currentUser.id);
    if (!localUser) {
      throw new Error('Teacher not found in local database');
    }

    // Create the lesson
    const lessonId = await sqliteService.insertLesson({
      ...lessonData,
      createdBy: localUser.user_id!.toString(),
    });

    // Create teacher content record for approval workflow
    await sqliteService.createTeacherContent(
      localUser.user_id!,
      'lesson',
      lessonId
    );

    return lessonId;
  }

  /**
   * Create a new quiz
   */
  async createQuiz(quizData: {
    title: string;
    description?: string;
    languageId?: string;
    level?: string;
    questions: any[];
    timeLimit?: number;
    passingScore?: number;
  }): Promise<number> {
    const currentUser = hybridAuthService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'teacher') {
      throw new Error('Unauthorized: Teacher access required');
    }

    const localUser = await sqliteService.getUserByFirebaseUid(currentUser.id);
    if (!localUser) {
      throw new Error('Teacher not found in local database');
    }

    // Create the quiz
    const quizId = await sqliteService.insertQuiz({
      ...quizData,
      questions: JSON.stringify(quizData.questions),
      createdBy: localUser.user_id!.toString(),
    });

    // Create teacher content record for approval workflow
    await sqliteService.createTeacherContent(
      localUser.user_id!,
      'quiz',
      quizId
    );

    return quizId;
  }

  /**
   * Create a new dictionary entry
   */
  async createDictionaryEntry(entryData: {
    frenchText: string;
    languageId: string;
    translation: string;
    categoryId?: string;
    pronunciation?: string;
    usageNotes?: string;
    difficultyLevel?: string;
  }): Promise<number> {
    const currentUser = hybridAuthService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'teacher') {
      throw new Error('Unauthorized: Teacher access required');
    }

    const localUser = await sqliteService.getUserByFirebaseUid(currentUser.id);
    if (!localUser) {
      throw new Error('Teacher not found in local database');
    }

    // Create the dictionary entry
    const translationId = await sqliteService.insertTranslation({
      ...entryData,
      createdBy: localUser.user_id!.toString(),
    });

    // Create teacher content record for approval workflow
    await sqliteService.createTeacherContent(
      localUser.user_id!,
      'translation',
      translationId
    );

    return translationId;
  }

  /**
   * Update lesson
   */
  async updateLesson(lessonId: number, updates: Partial<LessonRecord>): Promise<void> {
    const currentUser = hybridAuthService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'teacher') {
      throw new Error('Unauthorized: Teacher access required');
    }

    // Verify teacher owns this lesson
    const lesson = await sqliteService.getLessonById(lessonId);
    if (!lesson) {
      throw new Error('Lesson not found');
    }

    const localUser = await sqliteService.getUserByFirebaseUid(currentUser.id);
    if (lesson.created_by !== localUser?.user_id?.toString()) {
      throw new Error('Unauthorized: You can only edit your own lessons');
    }

    await sqliteService.updateLesson(lessonId, updates);
  }

  /**
   * Delete lesson
   */
  async deleteLesson(lessonId: number): Promise<void> {
    const currentUser = hybridAuthService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'teacher') {
      throw new Error('Unauthorized: Teacher access required');
    }

    // Verify teacher owns this lesson
    const lesson = await sqliteService.getLessonById(lessonId);
    if (!lesson) {
      throw new Error('Lesson not found');
    }

    const localUser = await sqliteService.getUserByFirebaseUid(currentUser.id);
    if (lesson.created_by !== localUser?.user_id?.toString()) {
      throw new Error('Unauthorized: You can only delete your own lessons');
    }

    await sqliteService.deleteLesson(lessonId);
  }

  /**
   * Get available languages for content creation
   */
  async getLanguages(): Promise<any[]> {
    return await sqliteService.getLanguages();
  }

  /**
   * Get lesson categories
   */
  async getCategories(): Promise<any[]> {
    return await sqliteService.query('SELECT * FROM categories ORDER BY category_name');
  }
}

export const teacherService = new TeacherService();
