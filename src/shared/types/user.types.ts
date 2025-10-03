/**
 * User-related TypeScript types
 */

export type UserRole = 'visitor' | 'apprenant' | 'teacher' | 'admin';

// Legacy support - mapping old roles to new
export const ROLE_MAPPING = {
  learner: 'apprenant',
  apprenant: 'apprenant',
  student: 'apprenant',
} as const;

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  phoneNumber?: string;
  emailVerified: boolean;
  twoFactorEnabled?: boolean;
  createdAt: Date;
  lastLoginAt: Date;
  preferences?: UserPreferences;
  stats?: UserStats;
  subscriptionStatus?: 'free' | 'premium' | 'trial';
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
