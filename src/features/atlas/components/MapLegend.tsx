/**
 * Map Legend Component - Legend for the interactive map
 * 
 * @version 1.1.0
 * @author Ma'a yegue Team
 */

import React from 'react';
import { AtlasSettings } from '../types/atlas.types';

interface MapLegendProps {
  settings: AtlasSettings;
  className?: string;
}

const MapLegend: React.FC<MapLegendProps> = ({ settings, className = '' }) => {
  const renderFamilyLegend = () => (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
        <span className="text-sm">Bantou</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="text-sm">Soudanique</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <span className="text-sm">Tchadique</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <span className="text-sm">Afro-asiatique</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
        <span className="text-sm">Niger-Congo</span>
      </div>
    </div>
  );

  const renderStatusLegend = () => (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="text-sm">Vital</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <span className="text-sm">Menacé</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
        <span className="text-sm">En danger</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <span className="text-sm">Critiquement en danger</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-gray-500"></div>
        <span className="text-sm">Éteint</span>
      </div>
    </div>
  );

  const renderSpeakerLegend = () => (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="text-sm">Plus de 1M locuteurs</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
        <span className="text-sm">100K - 1M locuteurs</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <span className="text-sm">10K - 100K locuteurs</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
        <span className="text-sm">1K - 10K locuteurs</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <span className="text-sm">Moins de 1K locuteurs</span>
      </div>
    </div>
  );

  const renderEndangeredLegend = () => (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="text-sm">Sûr</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <span className="text-sm">Vulnérable</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
        <span className="text-sm">Définitivement en danger</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <span className="text-sm">Sévèrement en danger</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-red-800"></div>
        <span className="text-sm">Critiquement en danger</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-gray-500"></div>
        <span className="text-sm">Éteint</span>
      </div>
    </div>
  );

  const getLegendContent = () => {
    switch (settings.colorScheme) {
      case 'family':
        return renderFamilyLegend();
      case 'status':
        return renderStatusLegend();
      case 'speakers':
        return renderSpeakerLegend();
      case 'endangered':
        return renderEndangeredLegend();
      default:
        return renderFamilyLegend();
    }
  };

  const getLegendTitle = () => {
    switch (settings.colorScheme) {
      case 'family':
        return 'Familles linguistiques';
      case 'status':
        return 'Statut des langues';
      case 'speakers':
        return 'Nombre de locuteurs';
      case 'endangered':
        return 'Niveau de danger (UNESCO)';
      default:
        return 'Légende';
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-xs ${className}`}>
      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
        {getLegendTitle()}
      </h4>
      {getLegendContent()}
      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Taille = Nombre de locuteurs
        </p>
      </div>
    </div>
  );
};

export default MapLegend;
