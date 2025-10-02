import React from 'react';
import { Achievement } from '../store/gamificationStore';
import { Modal, Button } from '@/shared/components/ui';

interface AchievementPopupProps {
  achievement: Achievement | null;
  isOpen: boolean;
  onClose: () => void;
}

const AchievementPopup: React.FC<AchievementPopupProps> = ({
  achievement,
  isOpen,
  onClose
}) => {
  if (!achievement) return null;

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

  const getRarityColor = (type: string): string => {
    const colorMap: Record<string, string> = {
      lessonCompletion: 'from-blue-400 to-blue-600',
      courseCompletion: 'from-green-400 to-green-600',
      pointsMilestone: 'from-yellow-400 to-yellow-600',
      streak: 'from-orange-400 to-orange-600',
      social: 'from-purple-400 to-purple-600',
      special: 'from-pink-400 to-pink-600'
    };
    return colorMap[type] || 'from-gray-400 to-gray-600';
  };

  return (
    <Modal open={isOpen} onClose={onClose} title="">
      <div className="text-center space-y-6 p-6">
        {/* Celebration Animation */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-full animate-ping opacity-75"></div>
          </div>
          <div className={`relative w-32 h-32 mx-auto bg-gradient-to-br ${getRarityColor(achievement.type)} rounded-full flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform`}>
            <span className="text-5xl">
              {getIconEmoji(achievement.iconName)}
            </span>
          </div>
        </div>

        {/* Achievement Info */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              🎉 Succès Débloqué !
            </h2>
            <h3 className="text-xl font-semibold text-blue-600">
              {achievement.title}
            </h3>
          </div>

          <p className="text-gray-600 max-w-md mx-auto">
            {achievement.description}
          </p>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">⭐</span>
              <span className="text-lg font-bold text-orange-600">
                +{achievement.pointsReward} XP
              </span>
            </div>
            <p className="text-sm text-orange-600 mt-1">
              Points d'expérience gagnés
            </p>
          </div>

          <div className="text-xs text-gray-500">
            Débloqué le {achievement.unlockedAt?.toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center space-x-4">
          <Button
            onClick={onClose}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg transform hover:scale-105 transition-all"
          >
            🎊 Fantastique !
          </Button>
        </div>

        {/* Confetti Effect */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce text-yellow-400"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              ✨
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default AchievementPopup;