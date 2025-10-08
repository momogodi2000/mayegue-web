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
export interface UserRecord {
  id: string;
  user_id?: number;  // SQLite auto-increment ID
  firebaseUid: string;
  email: string;
  displayName: string;
  role: 'guest' | 'learner' | 'teacher' | 'admin';
  level: number;
  xp: number;
  coins: number;
  ngondoCoins?: number;  // v2.0 - virtual currency
  subscription: 'free' | 'premium' | 'family' | 'teacher' | 'enterprise';
  subscriptionExpires?: number;  // v2.0 - Unix timestamp
  isActive?: boolean;  // v2.0
  emailVerified?: boolean;  // v2.0
  twoFactorEnabled?: boolean;  // v2.0
  createdAt: number;
  updatedAt: number;
  lastLogin: number;
  preferences: Record<string, unknown>;
  stats?: Record<string, unknown>;  // v2.0 - user statistics
  syncStatus: SyncStatus;
}

export interface QuizRecord {
  id: string;
  quiz_id?: number;  // SQLite auto-increment ID
  title: string;
  description: string;
  language: string;
  language_id?: string;  // v2.0 - Language code
  level: 'beginner' | 'intermediate' | 'advanced';
  questions: QuizQuestion[] | string;  // v2.0 - can be JSON string
  timeLimit?: number;
  time_limit?: number;  // v2.0
  passingScore: number;
  passing_score?: number;  // v2.0
  xp_reward?: number;  // v2.0 - XP earned
  published?: boolean;  // v2.0 - Published flag
  verified?: boolean;  // v2.0 - Admin verified
  createdBy: string;
  created_by?: string;  // v2.0
  createdAt: number;
  created_at?: string;  // v2.0
  updated_at?: string;  // v2.0
  syncStatus: SyncStatus;
}

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'matching';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
}

export interface MigrationRecord {
  id: string;
  version: string;
  description: string;
  appliedAt: number;
  checksum: string;
}

export interface DailyLimitRecord {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  lessonsUsed: number;
  readingsUsed: number;
  quizzesUsed: number;
  maxLessons: number;
  maxReadings: number;
  maxQuizzes: number;
}

export interface LessonRecord {
  id: string;
  lesson_id?: number;  // SQLite auto-increment ID
  title: string;
  description: string;
  language: string;
  language_id?: string;  // v2.0 - Language code
  difficulty: string;
  level?: string;  // v2.0 - beginner/intermediate/advanced
  content: LessonContent[] | string;  // v2.0 - can be JSON or text
  exercises: Exercise[];
  order_index?: number;  // v2.0 - Display order
  audio_url?: string;  // v2.0
  video_url?: string;  // v2.0
  estimated_duration?: number;  // v2.0 - Minutes
  xp_reward?: number;  // v2.0 - XP earned
  published?: boolean;  // v2.0 - Published flag
  verified?: boolean;  // v2.0 - Admin verified
  created_by?: string;  // v2.0 - Creator ID
  created_date?: string;  // v2.0
  updated_date?: string;  // v2.0
  progress: number;
  completed: boolean;
  lastAccessed: number;
  syncStatus: SyncStatus;
  version: number;
}

export interface DictionaryRecord {
  id: string;
  translation_id?: number;  // SQLite auto-increment ID
  word: string;
  french_text?: string;  // v2.0 - French source text
  translation: string;
  pronunciation: string;
  language: string;
  language_id?: string;  // v2.0 - Language code
  category: string;
  category_id?: string;  // v2.0 - Category code
  examples: string[];
  usage_notes?: string;  // v2.0
  difficulty_level?: string;  // v2.0
  audioUrl?: string;
  audio_url?: string;  // v2.0
  verified?: boolean;  // v2.0 - Admin verified flag
  created_by?: string;  // v2.0 - Creator ID
  created_date?: string;  // v2.0
  updated_date?: string;  // v2.0
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
  users: UserRecord[];
  lessons: LessonRecord[];
  dictionary: DictionaryRecord[];
  quizzes: QuizRecord[];
  dailyLimits: DailyLimitRecord[];
  userProgress: UserProgressRecord[];
  gamification: GamificationRecord[];
  settings: SettingRecord[];
  migrations: MigrationRecord[];
  exportDate: string;
}