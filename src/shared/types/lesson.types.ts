/**
 * Lesson-related TypeScript types
 */

import { LanguageId, DifficultyLevel } from './dictionary.types';

export type ContentType = 'text' | 'audio' | 'video' | 'image' | 'quiz' | 'exercise';

export type ExerciseType = 'multiple_choice' | 'fill_blank' | 'pronunciation' | 'translation' | 'matching';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  languageId: LanguageId;
  level: DifficultyLevel;
  order: number;
  content: ContentBlock[];
  exercises: Exercise[];
  estimatedDuration: number; // minutes
  thumbnailUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
  prerequisites?: string[];
  tags?: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt?: Date;
  isDownloaded?: boolean;
  isFavorite?: boolean;
}

export interface ContentBlock {
  id: string;
  type: ContentType;
  content: string;
  mediaUrl?: string;
  metadata?: Record<string, any>;
  order: number;
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
  audioUrl?: string;
}

export interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  completed: boolean;
  score?: number;
  timeSpent: number; // minutes
  completedAt?: Date;
  lastAccessedAt: Date;
  exerciseResults: ExerciseResult[];
}

export interface ExerciseResult {
  exerciseId: string;
  userAnswer: string | string[];
  isCorrect: boolean;
  points: number;
  attemptedAt: Date;
}

export interface LessonState {
  lessons: Lesson[];
  currentLesson: Lesson | null;
  progress: Record<string, LessonProgress>;
  loading: boolean;
  error: string | null;
}
