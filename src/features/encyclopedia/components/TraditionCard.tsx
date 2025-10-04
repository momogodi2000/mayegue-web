/**
 * Tradition Card Component - Display card for traditions
 * 
 * @version 1.1.0
 * @author Ma'a yegue Team
 */

import React from 'react';
import { CalendarIcon, UsersIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { Tradition } from '../types/encyclopedia.types';

interface TraditionCardProps {
  tradition: Tradition;
  onSelect: (tradition: Tradition) => void;
}

const TraditionCard: React.FC<TraditionCardProps> = ({ tradition, onSelect }) => {
  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'ceremonial': 'bg-purple-100 text-purple-800',
      'social': 'bg-blue-100 text-blue-800',
      'religious': 'bg-green-100 text-green-800',
      'seasonal': 'bg-orange-100 text-orange-800',
      'life-cycle': 'bg-pink-100 text-pink-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'ceremonial': 'Cérémoniel',
      'social': 'Social',
      'religious': 'Religieux',
      'seasonal': 'Saisonnier',
      'life-cycle': 'Cycle de vie'
    };
    return labels[type] || type;
  };

  return (
    <div
      onClick={() => onSelect(tradition)}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer overflow-hidden"
    >
      {/* Image */}
      {tradition.images && tradition.images.length > 0 && (
        <div className="aspect-video bg-gray-200 dark:bg-gray-700">
          <img
            src={tradition.images[0]}
            alt={tradition.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {tradition.name}
            </h3>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(tradition.type)}`}>
              {getTypeLabel(tradition.type)}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          {tradition.timing && (
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {tradition.timing}
              </span>
            </div>
          )}
          
          {tradition.location && (
            <div className="flex items-center space-x-2">
              <MapPinIcon className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {tradition.location}
              </span>
            </div>
          )}

          {tradition.participants && (
            <div className="flex items-center space-x-2">
              <UsersIcon className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {tradition.participants}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
          {tradition.description}
        </p>

        {/* Significance */}
        {tradition.significance && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Signification
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {tradition.significance}
            </p>
          </div>
        )}

        {/* Steps count */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {tradition.steps.length} étapes
          </span>
          {tradition.variations.length > 0 && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {tradition.variations.length} variations
            </span>
          )}
        </div>

        {/* Action Button */}
        <button className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
          Découvrir la tradition
        </button>
      </div>
    </div>
  );
};

export default TraditionCard;
