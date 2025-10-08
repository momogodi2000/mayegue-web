export interface UserProgress {
  userId: string;
  level: number;
  xp: number;
  totalXp: number;
  xpToNextLevel: number;
  streak: {
    current: number;
    longest: number;
    lastActivity: Date;
  };
  achievements: Achievement[];
  stats: LearningStats;
  goals: LearningGoal[];
  badges: Badge[];
  milestones: Milestone[];
}

export interface LearningStats {
  totalStudyTime: number; // in minutes
  lessonsCompleted: number;
  quizzesCompleted: number;
  wordsLearned: number;
  averageQuizScore: number;
  perfectScores: number;
  activeDays: number;
  weeklyGoalProgress: number;
  monthlyGoalProgress: number;
  favoriteCategory: string;
  strongestSkill: string;
  improvementAreas: string[];
  lastWeekProgress: WeeklyProgress;
  categoryBreakdown: CategoryStats[];
}

export interface WeeklyProgress {
  week: string; // ISO week string
  studyTime: number;
  lessonsCompleted: number;
  quizzesCompleted: number;
  xpEarned: number;
  averageScore: number;
  daysActive: number;
  goals: {
    studyTime: { target: number; achieved: number };
    lessons: { target: number; achieved: number };
    quizzes: { target: number; achieved: number };
  };
}

export interface CategoryStats {
  category: string;
  studyTime: number;
  lessonsCompleted: number;
  quizzesCompleted: number;
  averageScore: number;
  wordsLearned: number;
  lastActivity: Date;
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  progress: number; // 0-100%
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'learning' | 'streak' | 'quiz' | 'social' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: Date;
  progress?: {
    current: number;
    target: number;
    unit: string;
  };
  rewards: {
    xp: number;
    badge?: string;
    title?: string;
  };
}

export interface LearningGoal {
  id: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  title: string;
  description: string;
  target: number;
  current: number;
  unit: 'minutes' | 'lessons' | 'quizzes' | 'words' | 'points';
  deadline: Date;
  isActive: boolean;
  isCompleted: boolean;
  completedAt?: Date;
  reward: {
    xp: number;
    badge?: string;
  };
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: string;
  earnedAt: Date;
  requirements: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  type: 'xp' | 'streak' | 'lessons' | 'quizzes' | 'time' | 'level';
  threshold: number;
  isReached: boolean;
  reachedAt?: Date;
  reward: {
    xp: number;
    badge?: Badge;
    title?: string;
  };
}

export interface StudySession {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in minutes
  activities: SessionActivity[];
  xpEarned: number;
  focusScore: number; // 0-100 based on activity patterns
  category: string;
  notes?: string;
}

export interface SessionActivity {
  type: 'lesson' | 'quiz' | 'dictionary' | 'reading' | 'listening';
  id: string;
  title: string;
  duration: number;
  score?: number;
  completed: boolean;
  xpEarned: number;
}

export interface ProgressAnalytics {
  learningVelocity: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  retentionRate: number;
  engagementScore: number;
  difficultyProgression: {
    beginner: number;
    intermediate: number;
    advanced: number;
  };
  timeDistribution: {
    morning: number;
    afternoon: number;
    evening: number;
    night: number;
  };
  deviceUsage: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  predictions: {
    nextLevelDate: Date;
    weeklyGoalCompletion: number;
    recommendedStudyTime: number;
  };
}

export interface LearningInsight {
  id: string;
  type: 'achievement' | 'improvement' | 'recommendation' | 'milestone' | 'warning';
  title: string;
  message: string;
  actionable: boolean;
  action?: {
    label: string;
    route: string;
  };
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  isRead: boolean;
}

export interface ProgressEvent {
  id: string;
  userId: string;
  type: 'xp_gained' | 'level_up' | 'achievement_unlocked' | 'goal_completed' | 'streak_milestone' | 'badge_earned';
  data: any;
  timestamp: Date;
  processed: boolean;
}
