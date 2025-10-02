// Gamification Components
export { default as AchievementPopup } from './components/AchievementPopup';
export { default as AchievementGrid } from './components/AchievementGrid';
export { default as BadgeSystem } from './components/BadgeSystem';
export { default as Leaderboard } from './components/Leaderboard';
export { default as DailyChallenges } from './components/DailyChallenges';

// Gamification Store
export { useGamificationStore } from './store/gamificationStore';
export type {
  Achievement,
  Badge,
  Level,
  DailyChallenge,
  UserStats,
  LeaderboardEntry,
  PointMultiplier
} from './store/gamificationStore';

// Gamification Pages
export { default as GamificationPage } from './pages/GamificationPage';