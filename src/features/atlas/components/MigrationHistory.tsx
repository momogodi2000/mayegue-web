/**
 * Migration History Component - Display of language migration patterns
 * 
 * @version 1.1.0
 * @author Ma'a yegue Team
 */

import React from 'react';
import { ArrowRightIcon, CalendarIcon, MapIcon } from '@heroicons/react/24/outline';
import { MigrationEvent } from '../types/atlas.types';

interface MigrationHistoryProps {
  language: any;
  events: MigrationEvent[];
}

const MigrationHistory: React.FC<MigrationHistoryProps> = ({
  language,
  events
}) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <MapIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
          Aucune donnée de migration disponible pour {language.name}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Histoire migratoire de {language.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Évolution géographique et démographique de la langue
        </p>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

        <div className="space-y-8">
          {events.map((event, index) => (
            <div key={event.id} className="relative flex items-start space-x-4">
              {/* Timeline dot */}
              <div className="relative z-10 flex-shrink-0 w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-primary-600 rounded-full"></div>
              </div>

              {/* Event content */}
              <div className="flex-1 min-w-0">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CalendarIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {event.period}
                    </span>
                  </div>

                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Migration géographique
                  </h4>

                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Origine: {event.from.lat.toFixed(2)}, {event.from.lng.toFixed(2)}
                      </span>
                    </div>
                    
                    <ArrowRightIcon className="w-4 h-4 text-gray-400" />
                    
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Destination: {event.to.lat.toFixed(2)}, {event.to.lng.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                    {event.description}
                  </p>

                  {event.impact && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        Impact
                      </h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {event.impact}
                      </p>
                    </div>
                  )}

                  {event.sources && event.sources.length > 0 && (
                    <div className="mt-3">
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        Sources
                      </h5>
                      <div className="space-y-1">
                        {event.sources.map((source, sourceIndex) => (
                          <p key={sourceIndex} className="text-xs text-gray-500 dark:text-gray-400">
                            • {source}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <MapIcon className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-1">
              Données historiques
            </h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Les données de migration sont basées sur des recherches linguistiques, 
              archéologiques et historiques. Elles peuvent être incomplètes ou sujettes à révision.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MigrationHistory;
