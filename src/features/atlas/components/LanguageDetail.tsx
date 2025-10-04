/**
 * Language Detail Component - Detailed view for individual languages
 * 
 * @version 1.1.0
 * @author Ma'a yegue Team
 */

import React from 'react';
import { XMarkIcon, MapPinIcon, UsersIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import { Language, CulturalContext } from '../types/atlas.types';

interface LanguageDetailProps {
  language: Language;
  culturalContext?: CulturalContext;
  onClose: () => void;
}

const LanguageDetail: React.FC<LanguageDetailProps> = ({
  language,
  culturalContext,
  onClose
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {language.name}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {language.nativeName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPinIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Région</p>
                  <p className="font-medium">{language.region}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <UsersIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Locuteurs</p>
                  <p className="font-medium">{language.speakers.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <BookOpenIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Famille linguistique</p>
                  <p className="font-medium">{language.family.name}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Statut</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  language.status === 'vital' ? 'bg-green-100 text-green-800' :
                  language.status === 'threatened' ? 'bg-yellow-100 text-yellow-800' :
                  language.status === 'endangered' ? 'bg-orange-100 text-orange-800' :
                  language.status === 'critically_endangered' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {language.status === 'vital' ? 'Vital' :
                   language.status === 'threatened' ? 'Menacé' :
                   language.status === 'endangered' ? 'En danger' :
                   language.status === 'critically_endangered' ? 'Critiquement en danger' :
                   'Éteint'}
                </span>
              </div>

              {language.endangeredLevel && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Niveau de danger (UNESCO)</p>
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    {language.endangeredLevel.replace('_', ' ')}
                  </span>
                </div>
              )}

              {language.isoCode && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Code ISO</p>
                  <p className="font-medium">{language.isoCode}</p>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {language.description && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Description
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {language.description}
              </p>
            </div>
          )}

          {/* Cultural Notes */}
          {language.culturalNotes && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Notes culturelles
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {language.culturalNotes}
              </p>
            </div>
          )}

          {/* Dialects */}
          {language.dialects && language.dialects.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Dialectes
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {language.dialects.map((dialect) => (
                  <div key={dialect.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      {dialect.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Région: {dialect.region}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Locuteurs: {dialect.speakers.toLocaleString()}
                    </p>
                    {dialect.characteristics.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Caractéristiques:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
                          {dialect.characteristics.map((char, index) => (
                            <li key={index}>{char}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Writing Systems */}
          {language.writingSystems && language.writingSystems.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Systèmes d'écriture
              </h3>
              <div className="space-y-4">
                {language.writingSystems.map((system) => (
                  <div key={system.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      {system.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Type: {system.type}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {system.description}
                    </p>
                    {system.example && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 mb-1">Exemple:</p>
                        <p className="text-lg font-medium text-gray-900 dark:text-white">
                          {system.example}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cultural Context */}
          {culturalContext && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Contexte culturel
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {culturalContext.traditions.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Traditions
                    </h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {culturalContext.traditions.map((tradition, index) => (
                        <li key={index}>• {tradition}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {culturalContext.ceremonies.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Cérémonies
                    </h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {culturalContext.ceremonies.map((ceremony, index) => (
                        <li key={index}>• {ceremony}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {culturalContext.music.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Musique
                    </h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {culturalContext.music.map((music, index) => (
                        <li key={index}>• {music}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {culturalContext.cuisine.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Cuisine
                    </h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {culturalContext.cuisine.map((dish, index) => (
                        <li key={index}>• {dish}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Related Languages */}
          {language.relatedLanguages && language.relatedLanguages.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Langues apparentées
              </h3>
              <div className="flex flex-wrap gap-2">
                {language.relatedLanguages.map((relatedId) => (
                  <span key={relatedId} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {relatedId}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LanguageDetail;
