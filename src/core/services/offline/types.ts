// Sync status types
export type SyncStatus = 'synced' | 'pending' | 'error';
export type OperationType = 'create' | 'update' | 'delete';

// Learning content types
export interface LessonContent {
  type: 'text' | 'audio' | 'video' | 'interactive';
  content: string;
  audioUrl?: string;
  videoUrl?: string;
  duration?: number;
}

export interface Exercise {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'pronunciation' | 'translation' | 'matching';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
  timeLimit?: number;
}

export interface UserMistake {
  exerciseId: string;
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  timestamp: number;
  difficulty: string;
}

export interface Achievement {
  id: string;
  type: 'streak' | 'points' | 'completion' | 'mastery' | 'social';
  name: string;
  description: string;
  icon: string;
  unlockedAt: number;
  progress?: number;
  maxProgress?: number;
}

// Database record types
export interface LessonRecord {
  id: string;
  title: string;
  description: string;
  language: string;
  difficulty: string;
  content: LessonContent[];
  exercises: Exercise[];
  progress: number;
  completed: boolean;
  lastAccessed: number;
  syncStatus: SyncStatus;
  version: number;
}

export interface DictionaryRecord {
  id: string;
  word: string;
  translation: string;
  pronunciation: string;
  language: string;
  category: string;
  examples: string[];
  audioUrl?: string;
  lastAccessed: number;
  syncStatus: SyncStatus;
}

export interface UserProgressRecord {
  id: string;
  userId: string;
  lessonId: string;
  progress: number;
  score: number;
  timeSpent: number;
  lastAccessed: number;
  completedExercises: string[];
  mistakes: UserMistake[];
  syncStatus: SyncStatus;
}

export interface GamificationRecord {
  id: string;
  userId: string;
  points: number;
  level: number;
  badges: string[];
  streakDays: number;
  lastActivity: number;
  achievements: Achievement[];
  syncStatus: SyncStatus;
}

export interface SettingRecord {
  key: string;
  value: unknown;
  lastModified: number;
}

export interface SyncQueueRecord {
  id: string;
  operation: OperationType;
  collection: string;
  documentId: string;
  data: Record<string, unknown>;
  timestamp: number;
  retryCount: number;
  error?: string;
}

// Database storage size info
export interface StorageInfo {
  [storeName: string]: number;
}

// Export data structure
export interface ExportData {
  lessons: LessonRecord[];
  dictionary: DictionaryRecord[];
  userProgress: UserProgressRecord[];
  gamification: GamificationRecord[];
  settings: SettingRecord[];
  exportDate: string;
}