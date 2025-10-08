/**
 * Unit tests for Teacher Service
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { teacherService } from '@/features/users/teacher/services/teacher.service';
import { hybridAuthService } from '@/core/services/auth/hybrid-auth.service';
import { sqliteService } from '@/core/services/offline/sqlite.service';
import type { User } from '@/shared/types/user.types';

// Mock dependencies
vi.mock('@/core/services/auth/hybrid-auth.service');
vi.mock('@/core/services/offline/sqlite.service');

describe('TeacherService', () => {
  const mockTeacherUser: User = {
    id: 'teacher-123',
    email: 'teacher@test.com',
    displayName: 'Test Teacher',
    role: 'teacher',
    emailVerified: true,
    createdAt: new Date(),
    lastLoginAt: new Date(),
  };

  const mockLocalUser = {
    user_id: 1,
    firebase_uid: 'teacher-123',
    email: 'teacher@test.com',
    display_name: 'Test Teacher',
    role: 'teacher',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Authorization', () => {
    it('should allow teacher access to teacher methods', async () => {
      vi.mocked(hybridAuthService.getCurrentUser).mockReturnValue(mockTeacherUser);
      vi.mocked(sqliteService.getUserByFirebaseUid).mockResolvedValue(mockLocalUser);
      vi.mocked(sqliteService.query).mockResolvedValue([{ count: 5 }]);

      const stats = await teacherService.getTeacherStats();
      expect(stats).toBeDefined();
      expect(hybridAuthService.getCurrentUser).toHaveBeenCalled();
    });

    it('should deny access to non-teacher users', async () => {
      const mockStudentUser: User = {
        ...mockTeacherUser,
        role: 'student',
      };

      vi.mocked(hybridAuthService.getCurrentUser).mockReturnValue(mockStudentUser);

      await expect(teacherService.getTeacherStats()).rejects.toThrow(
        'Unauthorized: Teacher access required'
      );
    });

    it('should deny access to unauthenticated users', async () => {
      vi.mocked(hybridAuthService.getCurrentUser).mockReturnValue(null);

      await expect(teacherService.getTeacherStats()).rejects.toThrow(
        'Unauthorized: Teacher access required'
      );
    });
  });

  describe('Teacher Statistics', () => {
    beforeEach(() => {
      vi.mocked(hybridAuthService.getCurrentUser).mockReturnValue(mockTeacherUser);
      vi.mocked(sqliteService.getUserByFirebaseUid).mockResolvedValue(mockLocalUser);
    });

    it('should calculate teacher stats correctly', async () => {
      // Mock database queries
      vi.mocked(sqliteService.query)
        .mockResolvedValueOnce([{ count: 10 }]) // lessons
        .mockResolvedValueOnce([{ count: 5 }])  // quizzes
        .mockResolvedValueOnce([{ count: 25 }]) // translations
        .mockResolvedValueOnce([{ count: 2 }]); // pending content

      const stats = await teacherService.getTeacherStats();

      expect(stats).toEqual({
        studentsCount: 25,
        lessonsCreated: 10,
        quizzesCreated: 5,
        dictionaryEntriesCreated: 25,
        pendingApprovals: 2,
        totalViews: 0,
        averageRating: 4.5,
      });
    });

    it('should handle empty results gracefully', async () => {
      vi.mocked(sqliteService.query).mockResolvedValue([]);

      const stats = await teacherService.getTeacherStats();

      expect(stats.lessonsCreated).toBe(0);
      expect(stats.quizzesCreated).toBe(0);
      expect(stats.dictionaryEntriesCreated).toBe(0);
    });
  });

  describe('Content Creation', () => {
    beforeEach(() => {
      vi.mocked(hybridAuthService.getCurrentUser).mockReturnValue(mockTeacherUser);
      vi.mocked(sqliteService.getUserByFirebaseUid).mockResolvedValue(mockLocalUser);
    });

    it('should create lesson successfully', async () => {
      const lessonData = {
        languageId: 'EWO',
        title: 'Test Lesson',
        description: 'A test lesson',
        content: 'Lesson content here',
        level: 'beginner',
        orderIndex: 1,
        estimatedDuration: 15,
      };

      vi.mocked(sqliteService.insertLesson).mockResolvedValue(123);
      vi.mocked(sqliteService.createTeacherContent).mockResolvedValue(undefined);

      const lessonId = await teacherService.createLesson(lessonData);

      expect(lessonId).toBe(123);
      expect(sqliteService.insertLesson).toHaveBeenCalledWith({
        ...lessonData,
        createdBy: '1',
      });
      expect(sqliteService.createTeacherContent).toHaveBeenCalledWith(1, 'lesson', 123);
    });

    it('should create quiz successfully', async () => {
      const quizData = {
        title: 'Test Quiz',
        description: 'A test quiz',
        languageId: 'EWO',
        level: 'beginner',
        questions: [
          {
            id: '1',
            type: 'multiple-choice' as const,
            question: 'What is hello in Ewondo?',
            options: ['Mbolo', 'Bonjour', 'Hi', 'Salut'],
            correctAnswer: 'Mbolo',
            points: 1,
          },
        ],
        timeLimit: 30,
        passingScore: 70,
      };

      vi.mocked(sqliteService.insertQuiz).mockResolvedValue(456);
      vi.mocked(sqliteService.createTeacherContent).mockResolvedValue(undefined);

      const quizId = await teacherService.createQuiz(quizData);

      expect(quizId).toBe(456);
      expect(sqliteService.insertQuiz).toHaveBeenCalledWith({
        ...quizData,
        questions: JSON.stringify(quizData.questions),
        createdBy: '1',
      });
      expect(sqliteService.createTeacherContent).toHaveBeenCalledWith(1, 'quiz', 456);
    });

    it('should create dictionary entry successfully', async () => {
      const entryData = {
        frenchText: 'Bonjour',
        languageId: 'EWO',
        translation: 'Mbolo',
        categoryId: 'greetings',
        pronunciation: 'mm-BOH-loh',
        usageNotes: 'Common greeting',
        difficultyLevel: 'beginner',
      };

      vi.mocked(sqliteService.insertTranslation).mockResolvedValue(789);
      vi.mocked(sqliteService.createTeacherContent).mockResolvedValue(undefined);

      const translationId = await teacherService.createDictionaryEntry(entryData);

      expect(translationId).toBe(789);
      expect(sqliteService.insertTranslation).toHaveBeenCalledWith({
        ...entryData,
        createdBy: '1',
      });
      expect(sqliteService.createTeacherContent).toHaveBeenCalledWith(1, 'translation', 789);
    });
  });

  describe('Content Management', () => {
    beforeEach(() => {
      vi.mocked(hybridAuthService.getCurrentUser).mockReturnValue(mockTeacherUser);
      vi.mocked(sqliteService.getUserByFirebaseUid).mockResolvedValue(mockLocalUser);
    });

    it('should update lesson if teacher owns it', async () => {
      const mockLesson = {
        lesson_id: 123,
        title: 'Test Lesson',
        created_by: '1', // Same as teacher's user_id
      };

      vi.mocked(sqliteService.getLessonById).mockResolvedValue(mockLesson);
      vi.mocked(sqliteService.updateLesson).mockResolvedValue(undefined);

      const updates = { title: 'Updated Lesson Title' };
      await teacherService.updateLesson(123, updates);

      expect(sqliteService.updateLesson).toHaveBeenCalledWith(123, updates);
    });

    it('should prevent updating lesson not owned by teacher', async () => {
      const mockLesson = {
        lesson_id: 123,
        title: 'Test Lesson',
        created_by: '2', // Different teacher
      };

      vi.mocked(sqliteService.getLessonById).mockResolvedValue(mockLesson);

      const updates = { title: 'Updated Lesson Title' };
      
      await expect(teacherService.updateLesson(123, updates)).rejects.toThrow(
        'Unauthorized: You can only edit your own lessons'
      );
    });

    it('should delete lesson if teacher owns it', async () => {
      const mockLesson = {
        lesson_id: 123,
        title: 'Test Lesson',
        created_by: '1',
      };

      vi.mocked(sqliteService.getLessonById).mockResolvedValue(mockLesson);
      vi.mocked(sqliteService.deleteLesson).mockResolvedValue(undefined);

      await teacherService.deleteLesson(123);

      expect(sqliteService.deleteLesson).toHaveBeenCalledWith(123);
    });

    it('should prevent deleting lesson not owned by teacher', async () => {
      const mockLesson = {
        lesson_id: 123,
        title: 'Test Lesson',
        created_by: '2',
      };

      vi.mocked(sqliteService.getLessonById).mockResolvedValue(mockLesson);

      await expect(teacherService.deleteLesson(123)).rejects.toThrow(
        'Unauthorized: You can only delete your own lessons'
      );
    });
  });

  describe('Student Progress Tracking', () => {
    beforeEach(() => {
      vi.mocked(hybridAuthService.getCurrentUser).mockReturnValue(mockTeacherUser);
    });

    it('should return student progress data', async () => {
      const progress = await teacherService.getStudentsProgress();

      expect(progress).toHaveLength(3);
      expect(progress[0]).toMatchObject({
        userId: 1,
        displayName: 'Marie Dubois',
        email: 'marie.dubois@example.com',
        lessonsCompleted: 15,
        averageScore: 85,
      });
    });
  });

  describe('Content Retrieval', () => {
    beforeEach(() => {
      vi.mocked(hybridAuthService.getCurrentUser).mockReturnValue(mockTeacherUser);
      vi.mocked(sqliteService.getUserByFirebaseUid).mockResolvedValue(mockLocalUser);
    });

    it('should get teacher content', async () => {
      const mockContent = [
        {
          content_id: 1,
          content_type: 'lesson',
          reference_id: 123,
          status: 'approved',
          created_at: Date.now() / 1000,
        },
      ];

      vi.mocked(sqliteService.getTeacherContent).mockResolvedValue(mockContent);

      const content = await teacherService.getTeacherContent();

      expect(content).toHaveLength(1);
      expect(content[0]).toMatchObject({
        id: 1,
        type: 'lesson',
        status: 'approved',
      });
    });

    it('should filter content by status', async () => {
      vi.mocked(sqliteService.getTeacherContent).mockResolvedValue([]);

      await teacherService.getTeacherContent('pending_review');

      expect(sqliteService.getTeacherContent).toHaveBeenCalledWith(1, 'pending_review');
    });
  });

  describe('Data Retrieval', () => {
    beforeEach(() => {
      vi.mocked(hybridAuthService.getCurrentUser).mockReturnValue(mockTeacherUser);
    });

    it('should get available languages', async () => {
      const mockLanguages = [
        { language_id: 'EWO', language_name: 'Ewondo' },
        { language_id: 'DUA', language_name: 'Duala' },
      ];

      vi.mocked(sqliteService.getLanguages).mockResolvedValue(mockLanguages);

      const languages = await teacherService.getLanguages();

      expect(languages).toEqual(mockLanguages);
      expect(sqliteService.getLanguages).toHaveBeenCalled();
    });

    it('should get available categories', async () => {
      const mockCategories = [
        { category_id: 'greetings', category_name: 'Greetings' },
        { category_id: 'food', category_name: 'Food' },
      ];

      vi.mocked(sqliteService.query).mockResolvedValue(mockCategories);

      const categories = await teacherService.getCategories();

      expect(categories).toEqual(mockCategories);
      expect(sqliteService.query).toHaveBeenCalledWith(
        'SELECT * FROM categories ORDER BY category_name'
      );
    });
  });
});
