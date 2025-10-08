import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Lesson, LessonProgress, ExerciseResult } from '@/shared/types/lesson.types';
import { firestoreService } from '@/core/services/firebase/firestore.service';
import { userService } from '@/core/services/firebase/user.service';
import { sqliteService } from '@/core/services/offline/sqlite.service';

interface LessonsState {
  // Data
  lessons: Lesson[];
  currentLesson: Lesson | null;
  currentLessonProgress: LessonProgress | null;
  userProgress: Record<string, LessonProgress>;
  
  // UI State
  loading: boolean;
  error: string | null;
  isPlaying: boolean;
  currentContentIndex: number;
  
  // Actions
  setLessons: (lessons: Lesson[]) => void;
  setCurrentLesson: (lesson: Lesson | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Lesson Management
  fetchLessons: (languageId?: string, level?: string) => Promise<void>;
  fetchLessonById: (id: string) => Promise<Lesson | null>;
  searchLessons: (query: string) => Promise<Lesson[]>;
  
  // Progress Management
  startLesson: (lessonId: string, userId: string) => Promise<void>;
  updateProgress: (progressUpdate: Partial<LessonProgress>) => Promise<void>;
  completeLesson: (lessonId: string, userId: string, score: number) => Promise<void>;
  
  // Exercise Management
  submitExerciseResult: (result: ExerciseResult) => Promise<void>;
  retryExercise: (exerciseId: string) => void;
  
  // Content Navigation
  nextContent: () => void;
  previousContent: () => void;
  setContentIndex: (index: number) => void;
  
  // Audio/Media
  setPlaying: (isPlaying: boolean) => void;
  
  // Offline Support
  downloadLesson: (lessonId: string) => Promise<void>;
  removeDownloadedLesson: (lessonId: string) => Promise<void>;
  getDownloadedLessons: () => Lesson[];
  
  // Utilities
  calculateLessonScore: (exerciseResults: ExerciseResult[]) => number;
  isLessonUnlocked: (lesson: Lesson, userProgress: Record<string, LessonProgress>) => boolean;
  getNextLesson: (currentLessonId: string) => Lesson | null;
  getPreviousLesson: (currentLessonId: string) => Lesson | null;
}

export const useLessonsStore = create<LessonsState>()(
  persist(
    (set, get) => ({
      // Initial State
      lessons: [],
      currentLesson: null,
      currentLessonProgress: null,
      userProgress: {},
      loading: false,
      error: null,
      isPlaying: false,
      currentContentIndex: 0,

      // Basic Setters
      setLessons: (lessons) => set({ lessons }),
      setCurrentLesson: (lesson) => set({ 
        currentLesson: lesson,
        currentContentIndex: 0,
        isPlaying: false
      }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      // Lesson Management
      fetchLessons: async (languageId?: string, level?: string) => {
        try {
          set({ loading: true, error: null });

          // Fetch from SQLite (offline-first, always available)
          const sqliteLessons = await sqliteService.getLessons(languageId);

          // Filter by level if specified
          let filteredLessons = sqliteLessons;
          if (level) {
            filteredLessons = sqliteLessons.filter(l => l.level === level);
          }

          // Map SQLite lesson records to Lesson type
          const lessons: Lesson[] = filteredLessons.map(l => ({
            id: l.lesson_id?.toString() || '',
            languageId: l.language_id || '',
            title: l.title || '',
            description: l.content || '',
            content: [{ type: 'text', value: l.content || '' }],
            exercises: [],
            level: (l.level as 'beginner' | 'intermediate' | 'advanced') || 'beginner',
            order: l.order_index || 0,
            duration: l.estimated_duration || 15,
            xpReward: l.xp_reward || 10,
            audioUrl: l.audio_url,
            videoUrl: l.video_url,
            tags: [],
            isDownloaded: false,
            isPublished: l.published === 1,
            createdAt: new Date(l.created_date || Date.now()),
            updatedAt: new Date(l.updated_date || Date.now())
          }));

          const sortedLessons = [...lessons].sort((a, b) => a.order - b.order);
          set({ lessons: sortedLessons, loading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch lessons';
          set({ error: errorMessage, loading: false });
        }
      },

      fetchLessonById: async (id: string) => {
        try {
          set({ loading: true, error: null });

          // Check if lesson is already in store
          const { lessons } = get();
          let lesson = lessons.find(l => l.id === id);

          if (!lesson) {
            // Fetch from SQLite
            const lessonId = parseInt(id);
            if (!isNaN(lessonId)) {
              const sqliteLesson = await sqliteService.getLesson(lessonId);
              if (sqliteLesson) {
                lesson = {
                  id: sqliteLesson.lesson_id?.toString() || '',
                  languageId: sqliteLesson.language_id || '',
                  title: sqliteLesson.title || '',
                  description: sqliteLesson.content || '',
                  content: [{ type: 'text', value: sqliteLesson.content || '' }],
                  exercises: [],
                  level: (sqliteLesson.level as 'beginner' | 'intermediate' | 'advanced') || 'beginner',
                  order: sqliteLesson.order_index || 0,
                  duration: sqliteLesson.estimated_duration || 15,
                  xpReward: sqliteLesson.xp_reward || 10,
                  audioUrl: sqliteLesson.audio_url,
                  videoUrl: sqliteLesson.video_url,
                  tags: [],
                  isDownloaded: false,
                  isPublished: sqliteLesson.published === 1,
                  createdAt: new Date(sqliteLesson.created_date || Date.now()),
                  updatedAt: new Date(sqliteLesson.updated_date || Date.now())
                };
              }
            }
          }

          if (lesson) {
            set({ currentLesson: lesson, loading: false });
            return lesson;
          } else {
            throw new Error('Lesson not found');
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch lesson';
          set({ error: errorMessage, loading: false });
          return null;
        }
      },

      searchLessons: async (query: string) => {
        try {
          const { lessons } = get();
          
          // Filter local lessons
          const localResults = lessons.filter(lesson =>
            lesson.title.toLowerCase().includes(query.toLowerCase()) ||
            lesson.description.toLowerCase().includes(query.toLowerCase()) ||
            lesson.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
          );

          return localResults;
        } catch (error) {
          console.error('Search failed:', error);
          return [];
        }
      },

      // Progress Management
      startLesson: async (lessonId: string, userId: string) => {
        try {
          const progress: LessonProgress = {
            id: `${userId}_${lessonId}`,
            userId,
            lessonId,
            completed: false,
            timeSpent: 0,
            lastAccessedAt: new Date(),
            exerciseResults: []
          };

          await firestoreService.setDocument('lessonProgress', progress.id, progress);
          // TODO: Add offline support when offline service is enhanced

          set(state => ({
            currentLessonProgress: progress,
            userProgress: {
              ...state.userProgress,
              [lessonId]: progress
            }
          }));
        } catch (error) {
          console.error('Failed to start lesson:', error);
        }
      },

      updateProgress: async (progressUpdate: Partial<LessonProgress>) => {
        try {
          const { currentLessonProgress } = get();
          if (!currentLessonProgress) return;

          const updatedProgress = {
            ...currentLessonProgress,
            ...progressUpdate,
            lastAccessedAt: new Date()
          };

          await firestoreService.updateDocument(
            'lessonProgress', 
            currentLessonProgress.id, 
            progressUpdate
          );
          // TODO: Add offline support when offline service is enhanced

          set(state => ({
            currentLessonProgress: updatedProgress,
            userProgress: {
              ...state.userProgress,
              [updatedProgress.lessonId]: updatedProgress
            }
          }));
        } catch (error) {
          console.error('Failed to update progress:', error);
        }
      },

      completeLesson: async (lessonId: string, userId: string, score: number) => {
        try {
          const { updateProgress } = get();
          await updateProgress({
            completed: true,
            score,
            completedAt: new Date()
          });

          // Update user progress and stats
          const xpGained = Math.floor(score * 0.5); // XP based on score
          await userService.incrementLessonCompleted(userId, xpGained);
          
          // Add words learned (estimate based on lesson content)
          const wordsLearned = Math.floor(score / 10); // Rough estimate
          await userService.addWordsLearned(userId, wordsLearned);
          
          // Update streak
          await userService.updateStreak(userId);
          
          // Check for achievements
          const profile = await userService.getUserProfile(userId);
          if (profile?.stats) {
            // First lesson achievement
            if (profile.stats.lessonsCompleted === 0) {
              await userService.unlockAchievement(userId, 'first_lesson');
            }
            
            // Milestone achievements
            if (profile.stats.lessonsCompleted === 9) { // Will be 10 after increment
              await userService.unlockAchievement(userId, 'ten_lessons');
            }
            
            if (profile.stats.wordsLearned >= 49) { // Will be 50+ after increment
              await userService.unlockAchievement(userId, 'fifty_words');
            }
          }
        } catch (error) {
          console.error('Failed to complete lesson:', error);
        }
      },

      // Exercise Management
      submitExerciseResult: async (result: ExerciseResult) => {
        try {
          const { currentLessonProgress, updateProgress } = get();
          if (!currentLessonProgress) return;

          const updatedResults = [
            ...currentLessonProgress.exerciseResults.filter(r => r.exerciseId !== result.exerciseId),
            result
          ];

          await updateProgress({
            exerciseResults: updatedResults
          });
        } catch (error) {
          console.error('Failed to submit exercise result:', error);
        }
      },

      retryExercise: (exerciseId: string) => {
        const { currentLessonProgress } = get();
        if (!currentLessonProgress) return;

        const updatedResults = currentLessonProgress.exerciseResults.filter(
          r => r.exerciseId !== exerciseId
        );

        set(_state => ({
          currentLessonProgress: {
            ...currentLessonProgress,
            exerciseResults: updatedResults
          }
        }));
      },

      // Content Navigation
      nextContent: () => {
        const { currentLesson, currentContentIndex } = get();
        if (!currentLesson) return;

        const maxIndex = currentLesson.content.length + currentLesson.exercises.length - 1;
        if (currentContentIndex < maxIndex) {
          set({ currentContentIndex: currentContentIndex + 1 });
        }
      },

      previousContent: () => {
        const { currentContentIndex } = get();
        if (currentContentIndex > 0) {
          set({ currentContentIndex: currentContentIndex - 1 });
        }
      },

      setContentIndex: (index: number) => {
        set({ currentContentIndex: index });
      },

      // Audio/Media
      setPlaying: (isPlaying: boolean) => {
        set({ isPlaying });
      },

      // Offline Support
      downloadLesson: async (lessonId: string) => {
        try {
          const { lessons } = get();
          const lesson = lessons.find(l => l.id === lessonId);
          if (!lesson) return;

          // TODO: Implement actual download logic with offline service
          console.log('Download lesson:', lesson.title);
          
          set(state => ({
            lessons: state.lessons.map(l =>
              l.id === lessonId ? { ...l, isDownloaded: true } : l
            )
          }));
        } catch (error) {
          console.error('Failed to download lesson:', error);
        }
      },

      removeDownloadedLesson: async (lessonId: string) => {
        try {
          // TODO: Implement actual removal logic with offline service
          console.log('Remove downloaded lesson:', lessonId);
          
          set(state => ({
            lessons: state.lessons.map(l =>
              l.id === lessonId ? { ...l, isDownloaded: false } : l
            )
          }));
        } catch (error) {
          console.error('Failed to remove downloaded lesson:', error);
        }
      },

      getDownloadedLessons: () => {
        const { lessons } = get();
        return lessons.filter(lesson => lesson.isDownloaded);
      },

      // Utilities
      calculateLessonScore: (exerciseResults: ExerciseResult[]) => {
        if (exerciseResults.length === 0) return 0;
        
        const totalPoints = exerciseResults.reduce((sum, result) => sum + result.points, 0);
        const maxPoints = exerciseResults.length * 100; // Assuming max 100 points per exercise
        
        return Math.round((totalPoints / maxPoints) * 100);
      },

      isLessonUnlocked: (lesson: Lesson, userProgress: Record<string, LessonProgress>) => {
        if (!lesson.prerequisites || lesson.prerequisites.length === 0) {
          return true;
        }

        return lesson.prerequisites.every(prereqId => {
          const prereqProgress = userProgress[prereqId];
          return prereqProgress?.completed === true;
        });
      },

      getNextLesson: (currentLessonId: string) => {
        const { lessons } = get();
        const currentLesson = lessons.find(l => l.id === currentLessonId);
        if (!currentLesson) return null;

        return lessons.find(l => 
          l.languageId === currentLesson.languageId &&
          l.level === currentLesson.level &&
          l.order === currentLesson.order + 1
        ) || null;
      },

      getPreviousLesson: (currentLessonId: string) => {
        const { lessons } = get();
        const currentLesson = lessons.find(l => l.id === currentLessonId);
        if (!currentLesson) return null;

        return lessons.find(l => 
          l.languageId === currentLesson.languageId &&
          l.level === currentLesson.level &&
          l.order === currentLesson.order - 1
        ) || null;
      }
    }),
    {
      name: 'lessons-store',
      partialize: (state) => ({
        userProgress: state.userProgress,
        lessons: state.lessons.filter(l => l.isDownloaded)
      })
    }
  )
);


