import React, { useState } from 'react';
import { Badge as BadgeType } from '../store/gamificationStore';
import { Card, CardContent, Badge, Button } from '@/shared/components/ui';

interface BadgeSystemProps {
  badges: BadgeType[];
  unlockedBadges: BadgeType[];
  className?: string;
}

const BadgeSystem: React.FC<BadgeSystemProps> = ({
  badges,
  unlockedBadges,
  className = ''
}) => {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [rarityFilter, setRarityFilter] = useState<string>('all');

  const getIconEmoji = (iconName: string): string => {
    const iconMap: Record<string, string> = {
      auto_stories: '📚',
      local_fire_department: '🔥',
      group: '👥',
      emoji_events: '🏆',
      workspace_premium: '⭐',
      quiz: '📝',
      translate: '🌍',
      public: '🌐',
      help_outline: '❓',
      shopping_cart: '🛒',
      account_balance: '🏛️',
      explore: '🔍',
      flash_on: '⚡',
      handshake: '🤝',
      record_voice_over: '🎤'
    };
    return iconMap[iconName] || '🎖️';
  };

  const getRarityConfig = (rarity: string) => {
    const configs = {
      common: {
        label: 'Commun',
        bgGradient: 'from-gray-300 to-gray-400',
        borderColor: 'border-gray-300',
        glowColor: 'shadow-gray-200'
      },
      uncommon: {
        label: 'Peu commun',
        bgGradient: 'from-green-400 to-green-500',
        borderColor: 'border-green-300',
        glowColor: 'shadow-green-200'
      },
      rare: {
        label: 'Rare',
        bgGradient: 'from-blue-400 to-blue-500',
        borderColor: 'border-blue-300',
        glowColor: 'shadow-blue-200'
      },
      epic: {
        label: 'Épique',
        bgGradient: 'from-purple-400 to-purple-500',
        borderColor: 'border-purple-300',
        glowColor: 'shadow-purple-200'
      },
      legendary: {
        label: 'Légendaire',
        bgGradient: 'from-yellow-400 to-orange-500',
        borderColor: 'border-yellow-300',
        glowColor: 'shadow-yellow-200'
      }
    };
    return configs[rarity as keyof typeof configs] || configs.common;
  };

  // Create a map for quick lookup of unlocked badges
  const unlockedMap = new Map(unlockedBadges.map(b => [b.id, b]));

  // Filter badges
  const filteredBadges = badges.filter(badge => {
    const isUnlocked = unlockedMap.has(badge.id);
    
    // Status filter
    if (filter === 'unlocked' && !isUnlocked) return false;
    if (filter === 'locked' && isUnlocked) return false;
    
    // Rarity filter
    if (rarityFilter !== 'all' && badge.rarity !== rarityFilter) return false;
    
    return true;
  });

  // Get unique rarities for filter
  const uniqueRarities = Array.from(new Set(badges.map(b => b.rarity)));

  const stats = {
    total: badges.length,
    unlocked: unlockedBadges.length,
    locked: badges.length - unlockedBadges.length,
    byRarity: uniqueRarities.reduce((acc, rarity) => {
      acc[rarity] = {
        total: badges.filter(b => b.rarity === rarity).length,
        unlocked: unlockedBadges.filter(b => b.rarity === rarity).length
      };
      return acc;
    }, {} as Record<string, { total: number; unlocked: number }>)
  };

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Collection de Badges</h2>
          <p className="text-gray-600">
            {stats.unlocked} sur {stats.total} badges collectés
          </p>
        </div>
        
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-600">{stats.unlocked}</div>
          <div className="text-sm text-gray-500">badges débloqués</div>
        </div>
      </div>

      {/* Stats by Rarity */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {uniqueRarities.map(rarity => {
          const config = getRarityConfig(rarity);
          const rarityStats = stats.byRarity[rarity];
          
          return (
            <Card key={rarity} className="p-3">
              <div className="text-center">
                <div className={`w-8 h-8 mx-auto mb-2 rounded-full bg-gradient-to-r ${config.bgGradient}`}></div>
                <div className="font-semibold text-sm text-gray-900">{config.label}</div>
                <div className="text-xs text-gray-600">
                  {rarityStats.unlocked}/{rarityStats.total}
                </div>
              </div>
            </Card>
          );
        })}
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
          value={rarityFilter}
          onChange={(e) => setRarityFilter(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Toutes les raretés</option>
          {uniqueRarities.map(rarity => (
            <option key={rarity} value={rarity}>
              {getRarityConfig(rarity).label}
            </option>
          ))}
        </select>
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredBadges.map(badge => {
          const unlockedBadge = unlockedMap.get(badge.id);
          const isUnlocked = !!unlockedBadge;
          const config = getRarityConfig(badge.rarity);

          return (
            <Card
              key={badge.id}
              className={`group relative overflow-hidden transition-all duration-300 hover:scale-105 ${
                isUnlocked
                  ? `${config.borderColor} hover:${config.glowColor} hover:shadow-lg`
                  : 'border-gray-200 opacity-60'
              }`}
            >
              <CardContent className="p-4 text-center">
                {/* Badge Icon */}
                <div className="relative mb-3">
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl ${
                    isUnlocked
                      ? `bg-gradient-to-br ${config.bgGradient} shadow-lg`
                      : 'bg-gray-200 grayscale'
                  }`}>
                    {isUnlocked ? getIconEmoji(badge.iconName) : '🔒'}
                  </div>
                  
                  {isUnlocked && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>

                {/* Badge Info */}
                <h3 className={`font-semibold text-sm mb-1 ${
                  isUnlocked ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {badge.name}
                </h3>

                <p className={`text-xs mb-2 line-clamp-2 ${
                  isUnlocked ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {badge.description}
                </p>

                {/* Rarity Badge */}
                <Badge 
                  size="sm" 
                  className={`${
                    isUnlocked ? config.bgGradient : 'bg-gray-300'
                  } text-white border-0`}
                >
                  {config.label}
                </Badge>

                {/* Unlock Date */}
                {isUnlocked && unlockedBadge.earnedAt && (
                  <div className="mt-2 text-xs text-green-600">
                    {unlockedBadge.earnedAt.toLocaleDateString('fr-FR')}
                  </div>
                )}

                {/* Hover Effect */}
                {isUnlocked && (
                  <div className={`absolute inset-0 bg-gradient-to-t ${config.bgGradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredBadges.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎖️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Aucun badge trouvé
          </h3>
          <p className="text-gray-600">
            Essayez de modifier vos filtres pour voir plus de badges.
          </p>
        </div>
      )}

      {/* Collection Progress */}
      <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Progression de la Collection</h3>
        <div className="w-full bg-white rounded-full h-4 mb-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-500 flex items-center justify-center"
            style={{ width: `${(stats.unlocked / stats.total) * 100}%` }}
          >
            {stats.unlocked > 0 && (
              <span className="text-white text-xs font-semibold">
                {Math.round((stats.unlocked / stats.total) * 100)}%
              </span>
            )}
          </div>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>{stats.unlocked} badges collectés</span>
          <span>{stats.locked} badges restants</span>
        </div>
      </div>
    </div>
  );
};

export default BadgeSystem;