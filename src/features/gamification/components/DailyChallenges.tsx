import React, { useState } from 'react';
import { DailyChallenge } from '../store/gamificationStore';
import { Card, CardContent, Badge, Button } from '@/shared/components/ui';

interface DailyChallengesProps {
  challenges: DailyChallenge[];
  onCompleteChallenge: (challengeId: string) => void;
  className?: string;
}

const DailyChallenges: React.FC<DailyChallengesProps> = ({
  challenges,
  onCompleteChallenge,
  className = ''
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const getIconEmoji = (type: string): string => {
    const iconMap: Record<string, string> = {
      lesson: '📚',
      vocabulary: '📝',
      pronunciation: '🎤',
      quiz: '❓',
      streak: '🔥',
      social: '👥',
      special: '⭐'
    };
    return iconMap[type] || '🎯';
  };

  const getDifficultyConfig = (difficulty: string) => {
    const configs = {
      easy: {
        label: 'Facile',
        color: 'bg-green-100 text-green-800',
        borderColor: 'border-green-200',
        bgGradient: 'from-green-50 to-emerald-50'
      },
      medium: {
        label: 'Moyen',
        color: 'bg-yellow-100 text-yellow-800',
        borderColor: 'border-yellow-200',
        bgGradient: 'from-yellow-50 to-amber-50'
      },
      hard: {
        label: 'Difficile',
        color: 'bg-red-100 text-red-800',
        borderColor: 'border-red-200',
        bgGradient: 'from-red-50 to-rose-50'
      }
    };
    return configs[difficulty as keyof typeof configs] || configs.easy;
  };

  const getTimeRemaining = (): string => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight.getTime() - now.getTime();
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  // Filter challenges
  const filteredChallenges = challenges.filter(challenge => 
    selectedCategory === 'all' || challenge.type === selectedCategory
  );

  // Get unique categories
  const categories = Array.from(new Set(challenges.map(c => c.type)));

  const stats = {
    total: challenges.length,
    completed: challenges.filter(c => c.isCompleted).length,
    pending: challenges.filter(c => !c.isCompleted).length,
    totalRewards: challenges.reduce((sum, c) => sum + (c.isCompleted ? c.pointsReward : 0), 0)
  };

  const completionRate = (stats.completed / stats.total) * 100;

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Défis Quotidiens</h2>
          <p className="text-gray-600">
            {stats.completed} sur {stats.total} défis complétés • {stats.totalRewards} XP gagnés
          </p>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-gray-500 mb-1">Temps restant</div>
          <div className="text-lg font-bold text-orange-600">⏰ {getTimeRemaining()}</div>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-900">Progression Quotidienne</h3>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(completionRate)}% complété
            </span>
          </div>
          
          <div className="w-full bg-white rounded-full h-3 mb-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-green-600">{stats.completed}</div>
              <div className="text-xs text-gray-600">Complétés</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">{stats.pending}</div>
              <div className="text-xs text-gray-600">En cours</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-600">{stats.totalRewards}</div>
              <div className="text-xs text-gray-600">XP gagnés</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          size="sm"
          variant={selectedCategory === 'all' ? undefined : 'outline'}
          onClick={() => setSelectedCategory('all')}
        >
          Tous ({challenges.length})
        </Button>
        {categories.map(category => (
          <Button
            key={category}
            size="sm"
            variant={selectedCategory === category ? undefined : 'outline'}
            onClick={() => setSelectedCategory(category)}
          >
            {getIconEmoji(category)} {category.charAt(0).toUpperCase() + category.slice(1)} 
            ({challenges.filter(c => c.type === category).length})
          </Button>
        ))}
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredChallenges.map(challenge => {
          // Default difficulty based on points reward
          const difficulty = challenge.pointsReward >= 100 ? 'hard' : challenge.pointsReward >= 50 ? 'medium' : 'easy';
          const difficultyConfig = getDifficultyConfig(difficulty);
          const progressPercentage = (challenge.currentProgress / challenge.targetValue) * 100;

          return (
            <Card
              key={challenge.id}
              className={`transition-all duration-300 hover:shadow-lg ${
                challenge.isCompleted
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
                  : `bg-gradient-to-br ${difficultyConfig.bgGradient} ${difficultyConfig.borderColor}`
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  {/* Challenge Icon & Title */}
                  <div className="flex items-start space-x-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                      challenge.isCompleted
                        ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-lg'
                        : 'bg-white shadow-md'
                    }`}>
                      {challenge.isCompleted ? '✅' : getIconEmoji(challenge.type)}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={`font-semibold text-sm mb-1 ${
                        challenge.isCompleted ? 'text-green-900' : 'text-gray-900'
                      }`}>
                        {challenge.title}
                      </h3>
                      <p className={`text-xs ${
                        challenge.isCompleted ? 'text-green-700' : 'text-gray-600'
                      }`}>
                        {challenge.description}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  {challenge.isCompleted ? (
                    <Badge className="bg-green-100 text-green-800">
                      ✓ Complété
                    </Badge>
                  ) : (
                    <Badge className={difficultyConfig.color}>
                      {difficultyConfig.label}
                    </Badge>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progression</span>
                    <span>{challenge.currentProgress}/{challenge.targetValue}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        challenge.isCompleted
                          ? 'bg-gradient-to-r from-green-400 to-green-600'
                          : 'bg-gradient-to-r from-blue-400 to-purple-500'
                      }`}
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Rewards & Action */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center text-yellow-600">
                      <span className="text-sm font-medium">+{challenge.pointsReward} XP</span>
                    </div>
                    {challenge.pointsReward >= 100 && (
                      <div className="flex items-center text-purple-600">
                        <span className="text-xs">💎 Bonus</span>
                      </div>
                    )}
                  </div>

                  {!challenge.isCompleted && (
                    <Button
                      size="sm"
                      onClick={() => onCompleteChallenge(challenge.id)}
                      disabled={challenge.currentProgress < challenge.targetValue}
                      className={`${
                        challenge.currentProgress >= challenge.targetValue
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {challenge.currentProgress >= challenge.targetValue ? 'Réclamer' : 'En cours'}
                    </Button>
                  )}
                </div>

                {/* Completion Time */}
                {challenge.isCompleted && challenge.completedAt && (
                  <div className="mt-2 text-xs text-green-600">
                    Complété à {challenge.completedAt.toLocaleTimeString('fr-FR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredChallenges.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Aucun défi trouvé
          </h3>
          <p className="text-gray-600">
            Essayez de modifier votre filtre pour voir plus de défis.
          </p>
        </div>
      )}

      {/* Tomorrow's Preview */}
      <Card className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
            <span className="mr-2">🔮</span>
            Aperçu de demain
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            De nouveaux défis vous attendent ! Revenez demain pour débloquer :
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-2 bg-white rounded-lg">
              <div className="text-lg">📚</div>
              <div className="text-xs text-gray-600">Défi de lecture</div>
            </div>
            <div className="p-2 bg-white rounded-lg">
              <div className="text-lg">🎤</div>
              <div className="text-xs text-gray-600">Prononciation</div>
            </div>
            <div className="p-2 bg-white rounded-lg">
              <div className="text-lg">👥</div>
              <div className="text-xs text-gray-600">Défi social</div>
            </div>
            <div className="p-2 bg-white rounded-lg">
              <div className="text-lg">⭐</div>
              <div className="text-xs text-gray-600">Défi spécial</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyChallenges;