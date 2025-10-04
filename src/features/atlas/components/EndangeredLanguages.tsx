/**
 * Endangered Languages Component - Display of endangered languages
 * 
 * @version 1.1.0
 * @author Ma'a yegue Team
 */

import React from 'react';
import { ExclamationTriangleIcon, UsersIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { Language } from '../types/atlas.types';

interface EndangeredLanguagesProps {
  languages: Language[];
  onLanguageSelect: (language: Language) => void;
}

const EndangeredLanguages: React.FC<EndangeredLanguagesProps> = ({
  languages,
  onLanguageSelect
}) => {
  if (languages.length === 0) {
    return (
      <div className="text-center py-8">
        <ExclamationTriangleIcon className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
          Aucune langue en danger dans cette région
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {languages.map((language) => (
          <div
            key={language.id}
            onClick={() => onLanguageSelect(language)}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {language.name}
                  </h3>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    ({language.nativeName})
                  </span>
                </div>

                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPinIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {language.region}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <UsersIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {language.speakers.toLocaleString()} locuteurs
                    </span>
                  </div>

                  <div>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      language.status === 'endangered' ? 'bg-orange-100 text-orange-800' :
                      language.status === 'critically_endangered' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {language.status === 'endangered' ? 'En danger' :
                       language.status === 'critically_endangered' ? 'Critiquement en danger' :
                       'Menacé'}
                    </span>
                  </div>
                </div>

                {language.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                    {language.description}
                  </p>
                )}
              </div>

              <div className="ml-4">
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Voir détails →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
              Préservation des langues
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Les langues en danger représentent un patrimoine culturel précieux. 
              Ma'a yegue s'engage à documenter et préserver ces langues pour les générations futures.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EndangeredLanguages;
