import React, { useState } from 'react';
import { Achievement } from '../store/gamificationStore';
import { Card, CardContent, Badge, Button } from '@/shared/components/ui';

interface AchievementGridProps {
  achievements: Achievement[];
  unlockedAchievements: Achievement[];
  className?: string;
}

const AchievementGrid: React.FC<AchievementGridProps> = ({
  achievements,
  unlockedAchievements,
  className = ''
}) => {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const getIconEmoji = (iconName: string): string => {
    const iconMap: Record<string, string> = {
      handshake: '🤝',
      explore: '🔍',
      shopping_cart: '🛒',
      auto_stories: '📚',
      translate: '🌍',
      record_voice_over: '🎤',
      local_fire_department: '🔥',
      help_outline: '❓',
      public: '🌐',
      quiz: '📝',
      workspace_premium: '⭐',
      emoji_events: '🏆',
      group: '👥',
      account_balance: '🏛️',
      flash_on: '⚡'
    };
    return iconMap[iconName] || '🎯';
  };

  const getTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      lessonCompletion: 'Leçons',
      courseCompletion: 'Cours',
      pointsMilestone: 'Points',
      streak: 'Série',
      social: 'Social',
      special: 'Spécial'
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
      lessonCompletion: 'bg-blue-100 text-blue-800',
      courseCompletion: 'bg-green-100 text-green-800',
      pointsMilestone: 'bg-yellow-100 text-yellow-800',
      streak: 'bg-orange-100 text-orange-800',
      social: 'bg-purple-100 text-purple-800',
      special: 'bg-pink-100 text-pink-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  // Create a map for quick lookup of unlocked achievements
  const unlockedMap = new Map(unlockedAchievements.map(a => [a.id, a]));

  // Filter achievements
  const filteredAchievements = achievements.filter(achievement => {
    const isUnlocked = unlockedMap.has(achievement.id);
    
    // Status filter
    if (filter === 'unlocked' && !isUnlocked) return false;
    if (filter === 'locked' && isUnlocked) return false;
    
    // Type filter
    if (typeFilter !== 'all' && achievement.type !== typeFilter) return false;
    
    return true;
  });

  // Get unique types for filter
  const uniqueTypes = Array.from(new Set(achievements.map(a => a.type)));

  const stats = {
    total: achievements.length,
    unlocked: unlockedAchievements.length,
    locked: achievements.length - unlockedAchievements.length
  };

  return (
    <div className={className}>
      {/* Header Stats */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Succès</h2>
          <p className="text-gray-600">
            {stats.unlocked} sur {stats.total} succès débloqués ({Math.round((stats.unlocked / stats.total) * 100)}%)
          </p>
        </div>
        
        <div className="flex space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.unlocked}</div>
            <div className="text-xs text-gray-500">Débloqués</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-400">{stats.locked}</div>
            <div className="text-xs text-gray-500">Verrouillés</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant={filter === 'all' ? undefined : 'outline'}
            onClick={() => setFilter('all')}
          >
            Tous ({stats.total})
          </Button>
          <Button
            size="sm"
            variant={filter === 'unlocked' ? undefined : 'outline'}
            onClick={() => setFilter('unlocked')}
          >
            Débloqués ({stats.unlocked})
          </Button>
          <Button
            size="sm"
            variant={filter === 'locked' ? undefined : 'outline'}
            onClick={() => setFilter('locked')}
          >
            Verrouillés ({stats.locked})
          </Button>
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tous les types</option>
          {uniqueTypes.map(type => (
            <option key={type} value={type}>
              {getTypeLabel(type)}
            </option>
          ))}
        </select>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progression des succès</span>
          <span>{stats.unlocked}/{stats.total}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(stats.unlocked / stats.total) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map(achievement => {
          const unlockedAchievement = unlockedMap.get(achievement.id);
          const isUnlocked = !!unlockedAchievement;

          return (
            <Card
              key={achievement.id}
              className={`transition-all duration-300 hover:shadow-lg ${
                isUnlocked
                  ? 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50'
                  : 'border-gray-200 bg-gray-50 opacity-75'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-lg'
                      : 'bg-gray-200 grayscale'
                  }`}>
                    {isUnlocked ? getIconEmoji(achievement.iconName) : '🔒'}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`font-semibold text-sm ${
                        isUnlocked ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {achievement.title}
                      </h3>
                      {isUnlocked && (
                        <div className="flex items-center text-xs text-green-600 ml-2">
                          <span className="mr-1">✓</span>
                        </div>
                      )}
                    </div>

                    <p className={`text-xs mb-3 line-clamp-2 ${
                      isUnlocked ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {achievement.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <Badge size="sm" className={getTypeColor(achievement.type)}>
                        {getTypeLabel(achievement.type)}
                      </Badge>

                      <div className="flex items-center space-x-2">
                        <span className={`text-xs font-medium ${
                          isUnlocked ? 'text-yellow-600' : 'text-gray-400'
                        }`}>
                          +{achievement.pointsReward} XP
                        </span>
                      </div>
                    </div>

                    {isUnlocked && unlockedAchievement.unlockedAt && (
                      <div className="mt-2 text-xs text-green-600">
                        Débloqué le {unlockedAchievement.unlockedAt.toLocaleDateString('fr-FR')}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Aucun succès trouvé
          </h3>
          <p className="text-gray-600">
            Essayez de modifier vos filtres pour voir plus de succès.
          </p>
        </div>
      )}
    </div>
  );
};

export default AchievementGrid;