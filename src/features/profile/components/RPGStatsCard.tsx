import React from 'react';
import { RPGStats } from '../types/rpg.types';
import { FloatingCard } from '@/shared/components/ui/AnimatedComponents';
import { 
  StarIcon, 
  TrophyIcon, 
  CurrencyDollarIcon,
  FireIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface RPGStatsCardProps {
  stats: RPGStats;
  onNavigate: (section: string) => void;
}

export const RPGStatsCard: React.FC<RPGStatsCardProps> = ({ stats, onNavigate }) => {
  const getLevelProgress = () => {
    return (stats.xp / stats.xpToNextLevel) * 100;
  };

  const getRankColor = (rank: string) => {
    switch (rank.toLowerCase()) {
      case 'legendary': return 'text-purple-600';
      case 'master': return 'text-red-600';
      case 'expert': return 'text-orange-600';
      case 'advanced': return 'text-blue-600';
      case 'intermediate': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <FloatingCard className="card p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">🎮 Profil RPG</h3>
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-semibold ${getRankColor(stats.rank)}`}>
            {stats.rank}
          </span>
          <span className="text-sm text-gray-500">•</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {stats.title}
          </span>
        </div>
      </div>

      {/* Level Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <StarIcon className="w-5 h-5 text-yellow-500" />
            <span className="font-semibold text-gray-900 dark:text-white">
              Niveau {stats.level}
            </span>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {stats.xp.toLocaleString()} / {stats.xpToNextLevel.toLocaleString()} XP
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${getLevelProgress()}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <CurrencyDollarIcon className="w-6 h-6 text-green-500 mx-auto mb-1" />
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {stats.ngondoCoins.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">Ngondo Coins</div>
        </div>

        <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <TrophyIcon className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {stats.achievements.length}
          </div>
          <div className="text-xs text-gray-500">Succès</div>
        </div>

        <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <FireIcon className="w-6 h-6 text-red-500 mx-auto mb-1" />
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {stats.dailyStreak}
          </div>
          <div className="text-xs text-gray-500">Série</div>
        </div>

        <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <ChartBarIcon className="w-6 h-6 text-blue-500 mx-auto mb-1" />
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {stats.skills.length}
          </div>
          <div className="text-xs text-gray-500">Compétences</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onNavigate('achievements')}
          className="btn-outline text-sm py-2"
        >
          🏆 Succès
        </button>
        <button
          onClick={() => onNavigate('skills')}
          className="btn-outline text-sm py-2"
        >
          ⚡ Compétences
        </button>
        <button
          onClick={() => onNavigate('quests')}
          className="btn-outline text-sm py-2"
        >
          📋 Quêtes
        </button>
        <button
          onClick={() => onNavigate('shop')}
          className="btn-outline text-sm py-2"
        >
          🛒 Boutique
        </button>
      </div>
    </FloatingCard>
  );
};
