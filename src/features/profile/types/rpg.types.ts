/**
 * RPG Gamification Types for V1.1
 */

export interface RPGStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalXp: number;
  ngondoCoins: number;
  achievements: Achievement[];
  skills: Skill[];
  equipment: Equipment[];
  quests: Quest[];
  dailyStreak: number;
  weeklyGoal: number;
  monthlyGoal: number;
  rank: string;
  title: string;
  avatar: Avatar;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'learning' | 'social' | 'exploration' | 'cultural' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
  reward: {
    xp: number;
    coins: number;
    item?: string;
  };
}

export interface Skill {
  id: string;
  name: string;
  category: 'pronunciation' | 'vocabulary' | 'grammar' | 'conversation' | 'cultural';
  level: number;
  xp: number;
  xpToNext: number;
  description: string;
  icon: string;
  unlockedAt: Date;
}

export interface Equipment {
  id: string;
  name: string;
  type: 'avatar' | 'background' | 'accessory' | 'title' | 'badge';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  description: string;
  icon: string;
  equipped: boolean;
  unlockedAt?: Date;
  source: 'achievement' | 'purchase' | 'quest' | 'event';
  stats?: {
    xpBonus?: number;
    coinBonus?: number;
    specialEffect?: string;
  };
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special' | 'story';
  category: 'learning' | 'exploration' | 'social' | 'cultural';
  status: 'available' | 'in_progress' | 'completed' | 'expired';
  progress: number;
  maxProgress: number;
  requirements: QuestRequirement[];
  rewards: QuestReward[];
  expiresAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  estimatedTime: number; // in minutes
}

export interface QuestRequirement {
  type: 'complete_lessons' | 'learn_words' | 'explore_atlas' | 'visit_sites' | 'social_interaction' | 'cultural_activity';
  target: number;
  current: number;
  description: string;
}

export interface QuestReward {
  type: 'xp' | 'coins' | 'item' | 'achievement' | 'skill_point';
  amount: number;
  itemId?: string;
  achievementId?: string;
}

export interface Avatar {
  base: string;
  accessories: string[];
  background: string;
  title: string;
  badge: string;
  customizations: {
    skinColor: string;
    hairColor: string;
    eyeColor: string;
    clothing: string;
  };
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  avatar: string;
  level: number;
  xp: number;
  rank: number;
  category: 'global' | 'regional' | 'family' | 'friends';
  period: 'daily' | 'weekly' | 'monthly' | 'all_time';
}

export interface FamilyMember {
  id: string;
  userId: string;
  displayName: string;
  avatar: string;
  role: 'parent' | 'child' | 'grandparent' | 'sibling';
  level: number;
  xp: number;
  joinedAt: Date;
  lastActiveAt: Date;
  contributions: number; // ngondo coins contributed to family
  achievements: number;
  isOnline: boolean;
}

export interface FamilyTree {
  id: string;
  name: string;
  members: FamilyMember[];
  sharedGoals: FamilyGoal[];
  totalXp: number;
  totalCoins: number;
  level: number;
  createdAt: Date;
  settings: {
    privacy: 'private' | 'family_only' | 'public';
    allowChildAccounts: boolean;
    sharedProgress: boolean;
    parentalControls: boolean;
  };
}

export interface FamilyGoal {
  id: string;
  title: string;
  description: string;
  type: 'learning' | 'exploration' | 'cultural' | 'social';
  target: number;
  current: number;
  reward: {
    xp: number;
    coins: number;
    item?: string;
  };
  expiresAt: Date;
  participants: string[]; // User IDs
  status: 'active' | 'completed' | 'expired';
}

export interface VARKProfile {
  visual: number; // 0-100
  auditory: number;
  reading: number;
  kinesthetic: number;
  dominantStyle: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
  learningRecommendations: string[];
  lastUpdated: Date;
}

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimatedDuration: number; // in hours
  progress: number; // 0-100
  modules: LearningModule[];
  prerequisites: string[];
  rewards: QuestReward[];
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export interface LearningModule {
  id: string;
  name: string;
  type: 'lesson' | 'quiz' | 'practice' | 'exploration' | 'cultural';
  duration: number; // in minutes
  progress: number; // 0-100
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  prerequisites: string[];
  rewards: QuestReward[];
}

export interface PerformanceAnalytics {
  accuracy: number; // 0-100
  speed: number; // words per minute
  consistency: number; // 0-100
  improvement: number; // percentage change
  weakAreas: string[];
  strongAreas: string[];
  recommendations: string[];
  lastAnalyzed: Date;
}

export interface CulturalProgress {
  ethnicGroupsExplored: number;
  traditionsLearned: number;
  sitesVisited: number;
  recipesTried: number;
  craftsDiscovered: number;
  storiesRead: number;
  languagesStudied: number;
  culturalPoints: number;
  badges: string[];
  lastActivity: Date;
}
