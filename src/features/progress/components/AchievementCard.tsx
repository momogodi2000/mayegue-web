import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrophyIcon, 
  StarIcon, 
  FireIcon, 
  AcademicCapIcon,
  HeartIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { Badge } from '@/shared/components/ui';
import type { Achievement } from '../types/progress.types';

interface AchievementCardProps {
  achievement: Achievement;
  showProgress?: boolean;
  onClick?: () => void;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ 
  achievement, 
  showProgress = false,
  onClick 
}) => {
  const getAchievementIcon = (category: string) => {
    switch (category) {
      case 'learning':
        return AcademicCapIcon;
      case 'streak':
        return FireIcon;
      case 'quiz':
        return StarIcon;
      case 'social':
        return HeartIcon;
      case 'special':
        return SparklesIcon;
      default:
        return TrophyIcon;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case 'rare':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'epic':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'legendary':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getRarityGradient = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700';
      case 'rare':
        return 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20';
      case 'epic':
        return 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20';
      case 'legendary':
        return 'from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20';
      default:
        return 'from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700';
    }
  };

  const IconComponent = getAchievementIcon(achievement.category);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const getProgressPercentage = () => {
    if (!achievement.progress) return 100;
    return Math.min((achievement.progress.current / achievement.progress.target) * 100, 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`relative p-4 rounded-lg border cursor-pointer transition-all duration-200 bg-gradient-to-br ${getRarityGradient(achievement.rarity)} border-gray-200 dark:border-gray-700 hover:shadow-md`}
      onClick={onClick}
    >
      {/* Rarity Indicator */}
      <div className="absolute top-2 right-2">
        <Badge className={getRarityColor(achievement.rarity)}>
          {achievement.rarity}
        </Badge>
      </div>

      <div className="flex items-start space-x-3">
        {/* Achievement Icon */}
        <div className={`p-2 rounded-lg ${
          achievement.rarity === 'legendary' 
            ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' 
            : achievement.rarity === 'epic'
            ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
            : achievement.rarity === 'rare'
            ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white'
            : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
        }`}>
          <IconComponent className="w-6 h-6" />
        </div>

        {/* Achievement Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {achievement.title}
            </h3>
            {achievement.rewards.xp > 0 && (
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                +{achievement.rewards.xp} XP
              </span>
            )}
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {achievement.description}
          </p>

          {/* Progress Bar (if applicable) */}
          {showProgress && achievement.progress && (
            <div className="mb-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Progrès
                </span>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {achievement.progress.current} / {achievement.progress.target} {achievement.progress.unit}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
            </div>
          )}

          {/* Achievement Date */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Débloqué le {formatDate(achievement.unlockedAt)}
            </span>
            
            {/* Rewards */}
            <div className="flex items-center space-x-2">
              {achievement.rewards.badge && (
                <div className="flex items-center">
                  <TrophyIcon className="w-3 h-3 text-yellow-500 mr-1" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Badge</span>
                </div>
              )}
              {achievement.rewards.title && (
                <div className="flex items-center">
                  <StarIcon className="w-3 h-3 text-purple-500 mr-1" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Titre</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Legendary Glow Effect */}
      {achievement.rarity === 'legendary' && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-400/20 to-orange-500/20 animate-pulse pointer-events-none" />
      )}
    </motion.div>
  );
};
