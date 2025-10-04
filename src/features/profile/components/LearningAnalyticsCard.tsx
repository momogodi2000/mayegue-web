import React from 'react';
import { VARKProfile, PerformanceAnalytics, CulturalProgress } from '../types/rpg.types';
import { FloatingCard } from '@/shared/components/ui/AnimatedComponents';
import { 
  ChartBarIcon,
  EyeIcon,
  EarIcon,
  BookOpenIcon,
  HandRaisedIcon,
  GlobeAltIcon,
  TrophyIcon,
  StarIcon
} from '@heroicons/react/24/outline';

interface LearningAnalyticsCardProps {
  varkProfile: VARKProfile;
  performance: PerformanceAnalytics;
  culturalProgress: CulturalProgress;
  onNavigate: (section: string) => void;
}

export const LearningAnalyticsCard: React.FC<LearningAnalyticsCardProps> = ({ 
  varkProfile, 
  performance, 
  culturalProgress,
  onNavigate 
}) => {
  const getVARKColor = (style: string) => {
    switch (style) {
      case 'visual': return 'from-blue-400 to-blue-600';
      case 'auditory': return 'from-green-400 to-green-600';
      case 'reading': return 'from-purple-400 to-purple-600';
      case 'kinesthetic': return 'from-orange-400 to-orange-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getVARKIcon = (style: string) => {
    switch (style) {
      case 'visual': return EyeIcon;
      case 'auditory': return EarIcon;
      case 'reading': return BookOpenIcon;
      case 'kinesthetic': return HandRaisedIcon;
      default: return ChartBarIcon;
    }
  };

  const getPerformanceColor = (value: number) => {
    if (value >= 80) return 'text-green-600';
    if (value >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <FloatingCard className="card p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          📊 Analytics d'Apprentissage
        </h3>
        <button
          onClick={() => onNavigate('analytics')}
          className="btn-outline text-sm py-1 px-3"
        >
          Voir Détails
        </button>
      </div>

      {/* VARK Learning Style */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
          <ChartBarIcon className="w-4 h-4 mr-2" />
          Style d'Apprentissage Dominant
        </h4>
        
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: 'visual', label: 'Visuel', value: varkProfile.visual },
            { key: 'auditory', label: 'Auditif', value: varkProfile.auditory },
            { key: 'reading', label: 'Lecture', value: varkProfile.reading },
            { key: 'kinesthetic', label: 'Kinesthésique', value: varkProfile.kinesthetic }
          ].map(({ key, label, value }) => {
            const Icon = getVARKIcon(key);
            const isDominant = key === varkProfile.dominantStyle;
            
            return (
              <div
                key={key}
                className={`p-3 rounded-lg ${
                  isDominant 
                    ? 'bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border-2 border-blue-300 dark:border-blue-600' 
                    : 'bg-white dark:bg-gray-800 shadow-sm'
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Icon className={`w-4 h-4 ${isDominant ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span className={`text-sm font-medium ${isDominant ? 'text-blue-900 dark:text-blue-100' : 'text-gray-700 dark:text-gray-300'}`}>
                    {label}
                  </span>
                  {isDominant && <span className="text-xs text-blue-600 font-semibold">(Dominant)</span>}
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full bg-gradient-to-r ${getVARKColor(key)} transition-all duration-500`}
                    style={{ width: `${value}%` }}
                  />
                </div>
                
                <div className="text-right text-xs text-gray-500 mt-1">
                  {value}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
          <TrophyIcon className="w-4 h-4 mr-2" />
          Performance
        </h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className={`text-2xl font-bold ${getPerformanceColor(performance.accuracy)}`}>
              {performance.accuracy}%
            </div>
            <div className="text-xs text-gray-500">Précision</div>
          </div>

          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className={`text-2xl font-bold ${getPerformanceColor(performance.speed)}`}>
              {performance.speed}
            </div>
            <div className="text-xs text-gray-500">Mots/min</div>
          </div>

          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className={`text-2xl font-bold ${getPerformanceColor(performance.consistency)}`}>
              {performance.consistency}%
            </div>
            <div className="text-xs text-gray-500">Cohérence</div>
          </div>

          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className={`text-2xl font-bold ${performance.improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {performance.improvement >= 0 ? '+' : ''}{performance.improvement}%
            </div>
            <div className="text-xs text-gray-500">Amélioration</div>
          </div>
        </div>
      </div>

      {/* Cultural Progress */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
          <GlobeAltIcon className="w-4 h-4 mr-2" />
          Progrès Culturel
        </h4>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {culturalProgress.ethnicGroupsExplored}
            </div>
            <div className="text-xs text-gray-500">Groupes Ethniques</div>
          </div>

          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {culturalProgress.traditionsLearned}
            </div>
            <div className="text-xs text-gray-500">Traditions</div>
          </div>

          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {culturalProgress.sitesVisited}
            </div>
            <div className="text-xs text-gray-500">Sites Visités</div>
          </div>

          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {culturalProgress.culturalPoints}
            </div>
            <div className="text-xs text-gray-500">Points Culturels</div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
          <StarIcon className="w-4 h-4 mr-2" />
          Recommandations IA
        </h4>
        
        <div className="space-y-2">
          {varkProfile.learningRecommendations.slice(0, 3).map((recommendation, index) => (
            <div
              key={index}
              className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm text-sm text-gray-700 dark:text-gray-300"
            >
              {recommendation}
            </div>
          ))}
        </div>

        {varkProfile.learningRecommendations.length > 3 && (
          <div className="text-center">
            <button
              onClick={() => onNavigate('recommendations')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Voir toutes les recommandations ({varkProfile.learningRecommendations.length})
            </button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        <button
          onClick={() => onNavigate('learning-path')}
          className="btn-outline text-sm py-2"
        >
          🛤️ Parcours d'Apprentissage
        </button>
        <button
          onClick={() => onNavigate('cultural-journey')}
          className="btn-outline text-sm py-2"
        >
          🌍 Voyage Culturel
        </button>
      </div>
    </FloatingCard>
  );
};
