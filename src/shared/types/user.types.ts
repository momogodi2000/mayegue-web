/**
 * User-related TypeScript types
 */

export type UserRole = 'visitor' | 'learner' | 'teacher' | 'admin';

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  createdAt: Date;
  lastLoginAt: Date;
  preferences?: UserPreferences;
  stats?: UserStats;
}

export interface UserPreferences {
  language: 'fr' | 'en';
  targetLanguages: string[];
  notificationsEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
  dailyGoalMinutes: number;
}

export interface UserStats {
  lessonsCompleted: number;
  wordsLearned: number;
  totalTimeMinutes: number;
  currentStreak: number;
  longestStreak: number;
  badgesEarned: number;
  level: number;
  xp: number;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}
