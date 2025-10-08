/**
 * User-related TypeScript types
 */

export type UserRole = 'guest' | 'learner' | 'teacher' | 'admin';
export type SubscriptionPlan = 'free' | 'premium_monthly' | 'premium_yearly' | 'family_monthly' | 'family_yearly' | 'teacher_monthly' | 'teacher_yearly' | 'enterprise';
export type SubscriptionStatus = 'active' | 'inactive' | 'expired' | 'cancelled' | 'trial';

// Legacy support - mapping old roles to new standardized roles
export const ROLE_MAPPING = {
  visitor: 'guest',
  apprenant: 'learner', 
  learner: 'learner',
  student: 'learner',
  family_member: 'learner',
  guest: 'guest',
  teacher: 'teacher',
  admin: 'admin',
} as const;

// Role permissions for authorization
export const ROLE_PERMISSIONS = {
  guest: [
    'dictionary:read',
    'lessons:limited',
    'quizzes:limited',
    'readings:limited'
  ],
  learner: [
    'dictionary:read',
    'lessons:unlimited',
    'quizzes:unlimited',
    'readings:unlimited',
    'progress:read',
    'achievements:read',
    'profile:update'
  ],
  teacher: [
    'content:create',
    'content:update',
    'content:delete',
    'students:read',
    'analytics:read',
    'classes:manage'
  ],
  admin: [
    'users:manage',
    'content:moderate',
    'system:manage',
    'analytics:full',
    'roles:update',
    'data:export'
  ]
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
  subscription?: UserSubscription;
  familyId?: string; // For family members
  ngondoCoins?: number; // Virtual currency
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
  // V1.1 New Stats
  atlasExplorations: number;
  encyclopediaEntries: number;
  historicalSitesVisited: number;
  arVrExperiences: number;
  marketplacePurchases: number;
  familyContributions: number;
  ngondoCoinsEarned: number;
  achievementsUnlocked: number;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  lastPaymentId?: string;
  trialUsed: boolean;
  createdAt: Date;
  updatedAt: Date;
  cancellationReason?: string;
}

export interface FamilyAccount {
  id: string;
  ownerId: string;
  members: string[]; // User IDs
  maxMembers: number;
  sharedCoins: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}
