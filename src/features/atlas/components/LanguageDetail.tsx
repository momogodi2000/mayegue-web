/**
 * Language Detail Component - Detailed view of a selected language
 * 
 * @version 1.1.0
 * @author Ma'a yegue Team
 */

import React, { useState, useEffect } from 'react';
import { Language, CulturalContext, MigrationEvent } from '../types/atlas.types';
import { FloatingCard } from '@/shared/components/ui/AnimatedComponents';
import { 
  XMarkIcon,
  MapPinIcon,
  UsersIcon,
  BookOpenIcon,
  GlobeAltIcon,
  MusicalNoteIcon,
  SparklesIcon,
  ArrowRightIcon,
  PlayIcon,
  PauseIcon,
  VolumeUpIcon
} from '@heroicons/react/24/outline';

interface LanguageDetailProps {
  language: Language;
  culturalContext?: CulturalContext;
  migrationHistory?: MigrationEvent[];
  onClose: () => void;
}

const LanguageDetail: React.FC<LanguageDetailProps> = ({
  language,
  culturalContext,
  migrationHistory = [],
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'cultural' | 'migration' | 'dialects'>('overview');
  const [isPlaying, setIsPlaying] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'vital': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'threatened': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'endangered': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'critically_endangered': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'extinct': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getEndangeredColor = (level?: string) => {
    switch (level) {
      case 'safe': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'vulnerable': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'definitely_endangered': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'severely_endangered': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'critically_endangered': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'extinct': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatSpeakers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const tabs = [
    { id: 'overview', label: 'Aperçu', icon: BookOpenIcon },
    { id: 'cultural', label: 'Culture', icon: SparklesIcon },
    { id: 'migration', label: 'Migration', icon: ArrowRightIcon },
    { id: 'dialects', label: 'Dialectes', icon: UsersIcon }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <FloatingCard className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
              {language.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {language.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {language.nativeName} • {language.family.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <MapPinIcon className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">
                      <strong>Région:</strong> {language.region}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <UsersIcon className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">
                      <strong>Locuteurs:</strong> {language.speakers.toLocaleString()} ({formatSpeakers(language.speakers)})
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <GlobeAltIcon className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">
                      <strong>Statut:</strong>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(language.status)}`}>
                        {language.status === 'vital' ? 'Vital' :
                         language.status === 'threatened' ? 'Menacé' :
                         language.status === 'endangered' ? 'En danger' :
                         language.status === 'critically_endangered' ? 'Critiquement en danger' :
                         'Éteint'}
                      </span>
                    </span>
                  </div>
                  {language.endangeredLevel && (
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-700 dark:text-gray-300">
                        <strong>Niveau UNESCO:</strong>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getEndangeredColor(language.endangeredLevel)}`}>
                          {language.endangeredLevel === 'safe' ? 'Sûr' :
                           language.endangeredLevel === 'vulnerable' ? 'Vulnérable' :
                           language.endangeredLevel === 'definitely_endangered' ? 'Définitivement en danger' :
                           language.endangeredLevel === 'severely_endangered' ? 'Sévèrement en danger' :
                           language.endangeredLevel === 'critically_endangered' ? 'Critiquement en danger' :
                           'Éteint'}
                        </span>
                      </span>
                    </div>
                  )}
                  {language.isoCode && (
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-700 dark:text-gray-300">
                        <strong>Code ISO:</strong> {language.isoCode}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Description</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {language.description}
                  </p>
                  {language.culturalNotes && (
                    <>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Notes Culturelles</h3>
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                        {language.culturalNotes}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Writing Systems */}
              {language.writingSystems && language.writingSystems.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Systèmes d'Écriture</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {language.writingSystems.map(system => (
                      <div key={system.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <h4 className="font-medium text-gray-900 dark:text-white">{system.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Type: {system.type} • Script: {system.script}
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {system.description}
                        </p>
                        {system.example && (
                          <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded border">
                            <p className="text-sm font-mono text-gray-900 dark:text-white">
                              {system.example}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Languages */}
              {language.relatedLanguages && language.relatedLanguages.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Langues Apparentées</h3>
                  <div className="flex flex-wrap gap-2">
                    {language.relatedLanguages.map(relatedId => (
                      <span key={relatedId} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                        {relatedId}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'cultural' && culturalContext && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Traditions */}
                {culturalContext.traditions.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <SparklesIcon className="w-5 h-5 mr-2" />
                      Traditions
                    </h3>
                    <div className="space-y-2">
                      {culturalContext.traditions.map((tradition, index) => (
                        <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <p className="text-sm text-gray-700 dark:text-gray-300">{tradition}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cérémonies */}
                {culturalContext.ceremonies.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Cérémonies</h3>
                    <div className="space-y-2">
                      {culturalContext.ceremonies.map((ceremony, index) => (
                        <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <p className="text-sm text-gray-700 dark:text-gray-300">{ceremony}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Musique */}
                {culturalContext.music.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <MusicalNoteIcon className="w-5 h-5 mr-2" />
                      Musique
                    </h3>
                    <div className="space-y-2">
                      {culturalContext.music.map((music, index) => (
                        <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <p className="text-sm text-gray-700 dark:text-gray-300">{music}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cuisine */}
                {culturalContext.cuisine.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Cuisine</h3>
                    <div className="space-y-2">
                      {culturalContext.cuisine.map((dish, index) => (
                        <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <p className="text-sm text-gray-700 dark:text-gray-300">{dish}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Artisanat */}
              {culturalContext.crafts.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Artisanat</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {culturalContext.crafts.map((craft, index) => (
                      <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-700 dark:text-gray-300">{craft}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contes et Proverbes */}
              {(culturalContext.stories.length > 0 || culturalContext.proverbs.length > 0) && (
                <div className="grid md:grid-cols-2 gap-6">
                  {culturalContext.stories.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Contes</h3>
                      <div className="space-y-2">
                        {culturalContext.stories.map((story, index) => (
                          <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <p className="text-sm text-gray-700 dark:text-gray-300">{story}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {culturalContext.proverbs.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Proverbes</h3>
                      <div className="space-y-2">
                        {culturalContext.proverbs.map((proverb, index) => (
                          <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{proverb}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'migration' && migrationHistory.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Histoire des Migrations</h3>
              <div className="space-y-4">
                {migrationHistory.map(event => (
                  <div key={event.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <ArrowRightIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">{event.period}</h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                          {event.description}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          <strong>Impact:</strong> {event.impact}
                        </p>
                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          De: {event.from.lat.toFixed(2)}, {event.from.lng.toFixed(2)} → 
                          À: {event.to.lat.toFixed(2)}, {event.to.lng.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'dialects' && language.dialects && language.dialects.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Dialectes</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {language.dialects.map(dialect => (
                  <div key={dialect.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white">{dialect.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Région: {dialect.region}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Locuteurs: {dialect.speakers.toLocaleString()}
                    </p>
                    {dialect.characteristics.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Caractéristiques:
                        </p>
                        <ul className="mt-1 space-y-1">
                          {dialect.characteristics.map((char, index) => (
                            <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                              • {char}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'migration' && migrationHistory.length === 0 && (
            <div className="text-center py-8">
              <ArrowRightIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Aucune donnée de migration disponible pour cette langue.
              </p>
            </div>
          )}

          {activeTab === 'dialects' && (!language.dialects || language.dialects.length === 0) && (
            <div className="text-center py-8">
              <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Aucun dialecte documenté pour cette langue.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Données linguistiques • Ma'a yegue Atlas V1.1
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </FloatingCard>
    </div>
  );
};

export default LanguageDetail;