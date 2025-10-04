/**
 * Endangered Languages Component - Display and filter endangered languages
 * 
 * @version 1.1.0
 * @author Ma'a yegue Team
 */

import React, { useState, useMemo } from 'react';
import { Language } from '../types/atlas.types';
import { FloatingCard } from '@/shared/components/ui/AnimatedComponents';
import { 
  ExclamationTriangleIcon,
  HeartIcon,
  UsersIcon,
  ClockIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

interface EndangeredLanguagesProps {
  languages: Language[];
  onLanguageSelect: (language: Language) => void;
}

const EndangeredLanguages: React.FC<EndangeredLanguagesProps> = ({
  languages,
  onLanguageSelect
}) => {
  const [sortBy, setSortBy] = useState<'endangered' | 'speakers' | 'name'>('endangered');
  const [isExpanded, setIsExpanded] = useState(false);

  const endangeredLanguages = useMemo(() => {
    return languages.filter(lang => 
      lang.status === 'endangered' || 
      lang.status === 'critically_endangered' ||
      lang.endangeredLevel === 'definitely_endangered' ||
      lang.endangeredLevel === 'severely_endangered' ||
      lang.endangeredLevel === 'critically_endangered'
    );
  }, [languages]);

  const sortedLanguages = useMemo(() => {
    const sorted = [...endangeredLanguages];
    
    switch (sortBy) {
      case 'endangered':
        return sorted.sort((a, b) => {
          const aLevel = getEndangeredLevel(a);
          const bLevel = getEndangeredLevel(b);
          return bLevel - aLevel;
        });
      case 'speakers':
        return sorted.sort((a, b) => a.speakers - b.speakers);
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sorted;
    }
  }, [endangeredLanguages, sortBy]);

  const getEndangeredLevel = (language: Language): number => {
    if (language.endangeredLevel) {
      switch (language.endangeredLevel) {
        case 'critically_endangered': return 5;
        case 'severely_endangered': return 4;
        case 'definitely_endangered': return 3;
        case 'vulnerable': return 2;
        case 'safe': return 1;
        default: return 0;
      }
    }
    
    switch (language.status) {
      case 'critically_endangered': return 5;
      case 'endangered': return 4;
      case 'threatened': return 3;
      case 'vital': return 1;
      case 'extinct': return 6;
      default: return 0;
    }
  };

  const getEndangeredLabel = (language: Language): string => {
    if (language.endangeredLevel) {
      switch (language.endangeredLevel) {
        case 'critically_endangered': return 'Critiquement en danger';
        case 'severely_endangered': return 'Sévèrement en danger';
        case 'definitely_endangered': return 'Définitivement en danger';
        case 'vulnerable': return 'Vulnérable';
        case 'safe': return 'Sûr';
        default: return 'Inconnu';
      }
    }
    
    switch (language.status) {
      case 'critically_endangered': return 'Critiquement en danger';
      case 'endangered': return 'En danger';
      case 'threatened': return 'Menacé';
      case 'vital': return 'Vital';
      case 'extinct': return 'Éteint';
      default: return 'Inconnu';
    }
  };

  const getEndangeredColor = (language: Language): string => {
    const level = getEndangeredLevel(language);
    
    if (level >= 5) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    if (level >= 4) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    if (level >= 3) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    if (level >= 2) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const getEndangeredIcon = (language: Language) => {
    const level = getEndangeredLevel(language);
    
    if (level >= 5) return '🔴';
    if (level >= 4) return '🟠';
    if (level >= 3) return '🟡';
    if (level >= 2) return '🔵';
    return '⚪';
  };

  const formatSpeakers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const totalEndangeredSpeakers = endangeredLanguages.reduce((sum, lang) => sum + lang.speakers, 0);
  const criticallyEndangered = endangeredLanguages.filter(lang => getEndangeredLevel(lang) >= 5).length;

  if (endangeredLanguages.length === 0) {
    return (
      <FloatingCard className="card p-6">
        <div className="text-center py-8">
          <HeartIcon className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Excellente nouvelle !
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Aucune langue n'est actuellement classée comme en danger dans cette région.
          </p>
        </div>
      </FloatingCard>
    );
  }

  return (
    <FloatingCard className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <ExclamationTriangleIcon className="w-5 h-5 mr-2 text-red-500" />
          Langues en Danger
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
        >
          {isExpanded ? (
            <>
              <ChevronUpIcon className="w-4 h-4 mr-1" />
              Réduire
            </>
          ) : (
            <>
              <ChevronDownIcon className="w-4 h-4 mr-1" />
              Étendre
            </>
          )}
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {endangeredLanguages.length}
          </div>
          <div className="text-sm text-red-600 dark:text-red-400">En danger</div>
        </div>
        <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {criticallyEndangered}
          </div>
          <div className="text-sm text-orange-600 dark:text-orange-400">Critique</div>
        </div>
        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {formatSpeakers(totalEndangeredSpeakers)}
          </div>
          <div className="text-sm text-blue-600 dark:text-blue-400">Locuteurs</div>
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex items-center space-x-4 mb-4">
        <span className="text-sm text-gray-600 dark:text-gray-400">Trier par:</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="endangered">Niveau de danger</option>
          <option value="speakers">Nombre de locuteurs</option>
          <option value="name">Nom de la langue</option>
        </select>
      </div>

      {/* Languages List */}
      <div className="space-y-3">
        {sortedLanguages.slice(0, isExpanded ? sortedLanguages.length : 5).map(language => (
          <div
            key={language.id}
            onClick={() => onLanguageSelect(language)}
            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getEndangeredIcon(language)}</span>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {language.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {language.nativeName} • {language.region}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEndangeredColor(language)}`}>
                  {getEndangeredLabel(language)}
                </span>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <UsersIcon className="w-4 h-4 mr-1" />
                    {formatSpeakers(language.speakers)}
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="w-4 h-4 mr-1" />
                    {language.family.name}
                  </div>
                </div>
              </div>
            </div>
            
            {language.description && (
              <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                {language.description}
              </p>
            )}
          </div>
        ))}

        {!isExpanded && sortedLanguages.length > 5 && (
          <div className="text-center pt-4">
            <button
              onClick={() => setIsExpanded(true)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Voir {sortedLanguages.length - 5} langues supplémentaires
            </button>
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
        <div className="flex items-start space-x-3">
          <HeartIcon className="w-5 h-5 text-red-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-red-900 dark:text-red-200 mb-1">
              Aidez à préserver ces langues
            </h4>
            <p className="text-sm text-red-700 dark:text-red-300 mb-3">
              Chaque langue en danger représente une perte irréversible de connaissances culturelles. 
              Soutenez les efforts de documentation et de revitalisation.
            </p>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors">
                Contribuer
              </button>
              <button className="px-3 py-1 border border-red-600 text-red-600 text-sm rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                En savoir plus
              </button>
            </div>
          </div>
        </div>
      </div>
    </FloatingCard>
  );
};

export default EndangeredLanguages;