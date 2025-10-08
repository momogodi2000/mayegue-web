import { sqliteService } from '@/core/services/offline/sqlite.service';
import { hybridAuthService } from '@/core/services/auth/hybrid-auth.service';
import { syncEngineService } from '@/features/sync/services/sync-engine.service';
import type { 
  LessonRecord, 
  QuizRecord, 
  DictionaryRecord, 
  UserRecord 
} from '@/core/services/offline/types';
import toast from 'react-hot-toast';

export interface TeacherContent {
  id: string;
  teacherId: string;
  type: 'lesson' | 'quiz' | 'translation';
  title: string;
  description?: string;
  content: any;
  status: 'draft' | 'pending_review' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  reviewNotes?: string;
  metadata?: {
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    estimatedDuration?: number; // in minutes
    tags?: string[];
    category?: string;
    language?: string;
    targetAudience?: string[];
  };
}

export interface LessonData {
  title: string;
  description: string;
  content: string;
  audioUrl?: string;
  videoUrl?: string;
  imageUrl?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number;
  tags: string[];
  category: string;
  language: string;
  targetAudience: string[];
  exercises?: {
    type: 'multiple_choice' | 'fill_blank' | 'audio_recognition' | 'pronunciation';
    question: string;
    options?: string[];
    correctAnswer: string | number;
    explanation?: string;
  }[];
}

export interface QuizData {
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeLimit?: number; // in minutes
  passingScore: number; // percentage
  category: string;
  language: string;
  questions: {
    id: string;
    type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'audio_recognition';
    question: string;
    options?: string[];
    correctAnswer: string | number | boolean;
    points: number;
    explanation?: string;
    audioUrl?: string;
    imageUrl?: string;
  }[];
  tags: string[];
  targetAudience: string[];
}

export interface TranslationData {
  sourceText: string;
  targetText: string;
  sourceLanguage: string;
  targetLanguage: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  context?: string;
  pronunciation?: string;
  audioUrl?: string;
  examples?: {
    source: string;
    target: string;
    context?: string;
  }[];
  tags: string[];
}

export interface TeacherStats {
  totalContent: number;
  approvedContent: number;
  pendingContent: number;
  rejectedContent: number;
  totalStudents: number;
  activeStudents: number;
  totalLessonsCompleted: number;
  averageRating: number;
  contentByCategory: { [category: string]: number };
  recentActivity: {
    type: 'content_created' | 'content_approved' | 'student_progress' | 'quiz_completed';
    title: string;
    timestamp: Date;
    details?: any;
  }[];
}

export interface StudentProgress {
  studentId: string;
  studentName: string;
  studentEmail: string;
  totalLessons: number;
  completedLessons: number;
  totalQuizzes: number;
  completedQuizzes: number;
  averageScore: number;
  totalXP: number;
  level: number;
  lastActivity: Date;
  strengths: string[];
  weaknesses: string[];
  recommendedContent: string[];
}

export class EnhancedTeacherService {
  /**
   * Create a new lesson
   */
  async createLesson(lessonData: LessonData): Promise<string> {
    try {
      const user = hybridAuthService.getCurrentUser();
      if (!user || user.role !== 'teacher') {
        throw new Error('Unauthorized: Teacher access required');
      }

      const lessonId = `lesson_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // For now, we'll use the existing lesson structure
      const lesson: LessonRecord = {
        id: lessonId,
        title: lessonData.title,
        description: lessonData.description,
        language: lessonData.language,
        difficulty: lessonData.difficulty,
        content: lessonData.content,
        exercises: lessonData.exercises?.map((ex, index) => ({
          id: `ex_${index}`,
          type: ex.type === 'multiple_choice' ? 'multiple-choice' : 
                ex.type === 'fill_blank' ? 'fill-blank' : 
                ex.type === 'audio_recognition' ? 'pronunciation' : 'pronunciation',
          question: ex.question,
          options: ex.options,
          correctAnswer: typeof ex.correctAnswer === 'string' ? ex.correctAnswer : ex.correctAnswer.toString(),
          explanation: ex.explanation,
          points: 10
        })) || [],
        audio_url: lessonData.audioUrl,
        video_url: lessonData.videoUrl,
        estimated_duration: lessonData.estimatedDuration,
        created_by: user.id,
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
        published: false,
        verified: false,
        xp_reward: 100,
        progress: 0,
        completed: false,
        lastAccessed: Date.now(),
        syncStatus: 'pending',
        version: 1
      };

      // Store in localStorage for now (since SQLiteService doesn't have createLesson)
      const teacherContent: TeacherContent = {
        id: lessonId,
        teacherId: user.id,
        type: 'lesson',
        title: lessonData.title,
        description: lessonData.description,
        content: lesson,
        status: 'pending_review',
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {
          difficulty: lessonData.difficulty,
          estimatedDuration: lessonData.estimatedDuration,
          tags: lessonData.tags,
          category: lessonData.category,
          language: lessonData.language,
          targetAudience: lessonData.targetAudience
        }
      };

      await this.saveTeacherContent(teacherContent);

      // Queue sync operation
      await syncEngineService.queueOperation({
        type: 'create',
        entity: 'user_content',
        entityId: lessonId,
        data: teacherContent,
        priority: 'normal'
      });

      toast.success('Leçon créée avec succès ! En attente de validation.');
      return lessonId;
    } catch (error) {
      console.error('Error creating lesson:', error);
      toast.error('Erreur lors de la création de la leçon');
      throw error;
    }
  }

  /**
   * Update an existing lesson
   */
  async updateLesson(lessonId: string, lessonData: Partial<LessonData>): Promise<void> {
    try {
      const user = hybridAuthService.getCurrentUser();
      if (!user || user.role !== 'teacher') {
        throw new Error('Unauthorized: Teacher access required');
      }

      const teacherContent = await this.getTeacherContentById(lessonId);
      if (!teacherContent || teacherContent.teacherId !== user.id) {
        throw new Error('Unauthorized: You can only edit your own content');
      }

      const updatedContent: TeacherContent = {
        ...teacherContent,
        title: lessonData.title || teacherContent.title,
        description: lessonData.description || teacherContent.description,
        status: 'pending_review', // Reset to pending after edit
        updatedAt: new Date(),
        metadata: {
          ...teacherContent.metadata,
          difficulty: lessonData.difficulty || teacherContent.metadata?.difficulty,
          estimatedDuration: lessonData.estimatedDuration || teacherContent.metadata?.estimatedDuration,
          tags: lessonData.tags || teacherContent.metadata?.tags,
          category: lessonData.category || teacherContent.metadata?.category,
          language: lessonData.language || teacherContent.metadata?.language,
          targetAudience: lessonData.targetAudience || teacherContent.metadata?.targetAudience
        }
      };

      await this.updateTeacherContent(lessonId, updatedContent);

      // Queue sync operation
      await syncEngineService.queueOperation({
        type: 'update',
        entity: 'user_content',
        entityId: lessonId,
        data: updatedContent,
        priority: 'normal'
      });

      toast.success('Leçon mise à jour avec succès !');
    } catch (error) {
      console.error('Error updating lesson:', error);
      toast.error('Erreur lors de la mise à jour de la leçon');
      throw error;
    }
  }

  /**
   * Delete a lesson
   */
  async deleteLesson(lessonId: string): Promise<void> {
    try {
      const user = hybridAuthService.getCurrentUser();
      if (!user || user.role !== 'teacher') {
        throw new Error('Unauthorized: Teacher access required');
      }

      const teacherContent = await this.getTeacherContentById(lessonId);
      if (!teacherContent || teacherContent.teacherId !== user.id) {
        throw new Error('Unauthorized: You can only delete your own content');
      }

      await this.deleteTeacherContent(lessonId);

      // Queue sync operation
      await syncEngineService.queueOperation({
        type: 'delete',
        entity: 'user_content',
        entityId: lessonId,
        data: { deleted: true },
        priority: 'normal'
      });

      toast.success('Leçon supprimée avec succès !');
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast.error('Erreur lors de la suppression de la leçon');
      throw error;
    }
  }

  /**
   * Create a new quiz
   */
  async createQuiz(quizData: QuizData): Promise<string> {
    try {
      const user = hybridAuthService.getCurrentUser();
      if (!user || user.role !== 'teacher') {
        throw new Error('Unauthorized: Teacher access required');
      }

      const quizId = `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const quiz: QuizRecord = {
        id: quizId,
        title: quizData.title,
        description: quizData.description,
        language: quizData.language,
        level: quizData.difficulty,
        questions: JSON.stringify(quizData.questions),
        timeLimit: quizData.timeLimit,
        passingScore: quizData.passingScore,
        createdBy: user.id,
        createdAt: Date.now(),
        syncStatus: 'pending'
      };

      const teacherContent: TeacherContent = {
        id: quizId,
        teacherId: user.id,
        type: 'quiz',
        title: quizData.title,
        description: quizData.description,
        content: quiz,
        status: 'pending_review',
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {
          difficulty: quizData.difficulty,
          tags: quizData.tags,
          category: quizData.category,
          language: quizData.language,
          targetAudience: quizData.targetAudience
        }
      };

      await this.saveTeacherContent(teacherContent);

      // Queue sync operation
      await syncEngineService.queueOperation({
        type: 'create',
        entity: 'user_content',
        entityId: quizId,
        data: teacherContent,
        priority: 'normal'
      });

      toast.success('Quiz créé avec succès ! En attente de validation.');
      return quizId;
    } catch (error) {
      console.error('Error creating quiz:', error);
      toast.error('Erreur lors de la création du quiz');
      throw error;
    }
  }

  /**
   * Update an existing quiz
   */
  async updateQuiz(quizId: string, quizData: Partial<QuizData>): Promise<void> {
    try {
      const user = hybridAuthService.getCurrentUser();
      if (!user || user.role !== 'teacher') {
        throw new Error('Unauthorized: Teacher access required');
      }

      const teacherContent = await this.getTeacherContentById(quizId);
      if (!teacherContent || teacherContent.teacherId !== user.id) {
        throw new Error('Unauthorized: You can only edit your own content');
      }

      const updatedContent: TeacherContent = {
        ...teacherContent,
        title: quizData.title || teacherContent.title,
        description: quizData.description || teacherContent.description,
        status: 'pending_review', // Reset to pending after edit
        updatedAt: new Date(),
        metadata: {
          ...teacherContent.metadata,
          difficulty: quizData.difficulty || teacherContent.metadata?.difficulty,
          tags: quizData.tags || teacherContent.metadata?.tags,
          category: quizData.category || teacherContent.metadata?.category,
          language: quizData.language || teacherContent.metadata?.language,
          targetAudience: quizData.targetAudience || teacherContent.metadata?.targetAudience
        }
      };

      await this.updateTeacherContent(quizId, updatedContent);

      // Queue sync operation
      await syncEngineService.queueOperation({
        type: 'update',
        entity: 'user_content',
        entityId: quizId,
        data: updatedContent,
        priority: 'normal'
      });

      toast.success('Quiz mis à jour avec succès !');
    } catch (error) {
      console.error('Error updating quiz:', error);
      toast.error('Erreur lors de la mise à jour du quiz');
      throw error;
    }
  }

  /**
   * Delete a quiz
   */
  async deleteQuiz(quizId: string): Promise<void> {
    try {
      const user = hybridAuthService.getCurrentUser();
      if (!user || user.role !== 'teacher') {
        throw new Error('Unauthorized: Teacher access required');
      }

      const teacherContent = await this.getTeacherContentById(quizId);
      if (!teacherContent || teacherContent.teacherId !== user.id) {
        throw new Error('Unauthorized: You can only delete your own content');
      }

      await this.deleteTeacherContent(quizId);

      // Queue sync operation
      await syncEngineService.queueOperation({
        type: 'delete',
        entity: 'user_content',
        entityId: quizId,
        data: { deleted: true },
        priority: 'normal'
      });

      toast.success('Quiz supprimé avec succès !');
    } catch (error) {
      console.error('Error deleting quiz:', error);
      toast.error('Erreur lors de la suppression du quiz');
      throw error;
    }
  }

  /**
   * Create a new translation
   */
  async createTranslation(translationData: TranslationData): Promise<string> {
    try {
      const user = hybridAuthService.getCurrentUser();
      if (!user || user.role !== 'teacher') {
        throw new Error('Unauthorized: Teacher access required');
      }

      const translationId = `translation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const translation: DictionaryRecord = {
        id: translationId,
        word: translationData.sourceText,
        translation: translationData.targetText,
        pronunciation: translationData.pronunciation || '',
        language: translationData.sourceLanguage,
        category: translationData.category,
        examples: translationData.examples?.map(ex => ex.source) || [],
        audioUrl: translationData.audioUrl,
        difficulty_level: translationData.difficulty,
        usage_notes: translationData.context,
        lastAccessed: Date.now(),
        syncStatus: 'pending'
      };

      const teacherContent: TeacherContent = {
        id: translationId,
        teacherId: user.id,
        type: 'translation',
        title: `${translationData.sourceText} → ${translationData.targetText}`,
        description: translationData.context,
        content: translation,
        status: 'pending_review',
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {
          difficulty: translationData.difficulty,
          tags: translationData.tags,
          category: translationData.category,
          language: translationData.sourceLanguage
        }
      };

      await this.saveTeacherContent(teacherContent);

      // Queue sync operation
      await syncEngineService.queueOperation({
        type: 'create',
        entity: 'user_content',
        entityId: translationId,
        data: teacherContent,
        priority: 'normal'
      });

      toast.success('Traduction créée avec succès ! En attente de validation.');
      return translationId;
    } catch (error) {
      console.error('Error creating translation:', error);
      toast.error('Erreur lors de la création de la traduction');
      throw error;
    }
  }

  /**
   * Get teacher's content
   */
  async getTeacherContent(): Promise<TeacherContent[]> {
    try {
      const user = hybridAuthService.getCurrentUser();
      if (!user || user.role !== 'teacher') {
        throw new Error('Unauthorized: Teacher access required');
      }

      // Get from localStorage for now
      const stored = localStorage.getItem(`teacher_content_${user.id}`);
      if (stored) {
        const content = JSON.parse(stored);
        return content.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt)
        }));
      }
      return [];
    } catch (error) {
      console.error('Error getting teacher content:', error);
      return [];
    }
  }

  /**
   * Get specific teacher content by ID
   */
  async getTeacherContentById(contentId: string): Promise<TeacherContent | null> {
    try {
      const content = await this.getTeacherContent();
      return content.find(item => item.id === contentId) || null;
    } catch (error) {
      console.error('Error getting teacher content by ID:', error);
      return null;
    }
  }

  /**
   * Get teacher statistics
   */
  async getTeacherStats(): Promise<TeacherStats> {
    try {
      const user = hybridAuthService.getCurrentUser();
      if (!user || user.role !== 'teacher') {
        throw new Error('Unauthorized: Teacher access required');
      }

      const content = await this.getTeacherContent();
      const totalContent = content.length;
      const approvedContent = content.filter(c => c.status === 'approved').length;
      const pendingContent = content.filter(c => c.status === 'pending_review').length;
      const rejectedContent = content.filter(c => c.status === 'rejected').length;

      // Get content by category
      const contentByCategory: { [category: string]: number } = {};
      content.forEach(c => {
        const category = c.metadata?.category || 'Other';
        contentByCategory[category] = (contentByCategory[category] || 0) + 1;
      });

      // Mock data for now - in production, this would come from actual analytics
      const stats: TeacherStats = {
        totalContent,
        approvedContent,
        pendingContent,
        rejectedContent,
        totalStudents: 25, // Mock data
        activeStudents: 18, // Mock data
        totalLessonsCompleted: 156, // Mock data
        averageRating: 4.3, // Mock data
        contentByCategory,
        recentActivity: [
          {
            type: 'content_approved',
            title: 'Votre leçon "Salutations en Bassa" a été approuvée',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
          },
          {
            type: 'student_progress',
            title: 'Marie a terminé votre quiz "Nombres en Ewondo"',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
          },
          {
            type: 'content_created',
            title: 'Nouvelle leçon créée: "Famille en Duala"',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
          }
        ]
      };

      return stats;
    } catch (error) {
      console.error('Error getting teacher stats:', error);
      throw error;
    }
  }

  /**
   * Get student progress for teacher's content
   */
  async getStudentProgress(): Promise<StudentProgress[]> {
    try {
      const user = hybridAuthService.getCurrentUser();
      if (!user || user.role !== 'teacher') {
        throw new Error('Unauthorized: Teacher access required');
      }

      // Mock data for now - in production, this would come from actual student progress
      const studentProgress: StudentProgress[] = [
        {
          studentId: 'student_1',
          studentName: 'Marie Nguema',
          studentEmail: 'marie@example.com',
          totalLessons: 12,
          completedLessons: 8,
          totalQuizzes: 6,
          completedQuizzes: 4,
          averageScore: 85,
          totalXP: 2400,
          level: 3,
          lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
          strengths: ['Vocabulaire', 'Prononciation'],
          weaknesses: ['Grammaire', 'Conjugaison'],
          recommendedContent: ['Leçon: Temps verbaux', 'Quiz: Grammaire avancée']
        },
        {
          studentId: 'student_2',
          studentName: 'Paul Mbarga',
          studentEmail: 'paul@example.com',
          totalLessons: 15,
          completedLessons: 12,
          totalQuizzes: 8,
          completedQuizzes: 7,
          averageScore: 92,
          totalXP: 3600,
          level: 4,
          lastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000),
          strengths: ['Grammaire', 'Compréhension'],
          weaknesses: ['Prononciation'],
          recommendedContent: ['Leçon: Phonétique avancée']
        }
      ];

      return studentProgress;
    } catch (error) {
      console.error('Error getting student progress:', error);
      throw error;
    }
  }

  // Private helper methods

  private async saveTeacherContent(content: TeacherContent): Promise<void> {
    try {
      const user = hybridAuthService.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const existing = await this.getTeacherContent();
      const updated = [...existing, content];
      localStorage.setItem(`teacher_content_${user.id}`, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving teacher content:', error);
      throw error;
    }
  }

  private async updateTeacherContent(contentId: string, updates: TeacherContent): Promise<void> {
    try {
      const user = hybridAuthService.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const existing = await this.getTeacherContent();
      const updated = existing.map(item => item.id === contentId ? updates : item);
      localStorage.setItem(`teacher_content_${user.id}`, JSON.stringify(updated));
    } catch (error) {
      console.error('Error updating teacher content:', error);
      throw error;
    }
  }

  private async deleteTeacherContent(contentId: string): Promise<void> {
    try {
      const user = hybridAuthService.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const existing = await this.getTeacherContent();
      const updated = existing.filter(item => item.id !== contentId);
      localStorage.setItem(`teacher_content_${user.id}`, JSON.stringify(updated));
    } catch (error) {
      console.error('Error deleting teacher content:', error);
      throw error;
    }
  }
}

export const enhancedTeacherService = new EnhancedTeacherService();