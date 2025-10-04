/**
 * User-related TypeScript types
 */

export type UserRole = 'visitor' | 'apprenant' | 'teacher' | 'admin' | 'family_member';
export type SubscriptionPlan = 'freemium' | 'premium_monthly' | 'premium_yearly' | 'family_monthly' | 'family_yearly' | 'teacher_monthly' | 'teacher_yearly' | 'enterprise';
export type SubscriptionStatus = 'active' | 'inactive' | 'expired' | 'cancelled' | 'trial';

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
