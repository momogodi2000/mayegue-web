/**
 * Craft Card Component - Display card for crafts
 * 
 * @version 1.1.0
 * @author Ma'a yegue Team
 */

import React from 'react';
import { Craft } from '../types/encyclopedia.types';

interface CraftCardProps {
  craft: Craft;
  onSelect: (craft: Craft) => void;
}

const CraftCard: React.FC<CraftCardProps> = ({ craft, onSelect }) => {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'textile': 'bg-blue-100 text-blue-800',
      'pottery': 'bg-orange-100 text-orange-800',
      'woodwork': 'bg-yellow-100 text-yellow-800',
      'metalwork': 'bg-gray-100 text-gray-800',
      'basketwork': 'bg-green-100 text-green-800',
      'sculpture': 'bg-purple-100 text-purple-800',
      'jewelry': 'bg-pink-100 text-pink-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'textile': 'Textile',
      'pottery': 'Poterie',
      'woodwork': 'Bois',
      'metalwork': 'Métal',
      'basketwork': 'Vannerie',
      'sculpture': 'Sculpture',
      'jewelry': 'Bijoux'
    };
    return labels[category] || category;
  };

  return (
    <div
      onClick={() => onSelect(craft)}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer overflow-hidden"
    >
      {/* Image */}
      {craft.images && craft.images.length > 0 && (
        <div className="aspect-video bg-gray-200 dark:bg-gray-700">
          <img
            src={craft.images[0]}
            alt={craft.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {craft.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {craft.nativeName}
            </p>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(craft.category)}`}>
              {getCategoryLabel(craft.category)}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
          {craft.description}
        </p>

        {/* Materials and Tools */}
        <div className="space-y-2 mb-4">
          {craft.materials && craft.materials.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Matériaux
              </h4>
              <div className="flex flex-wrap gap-1">
                {craft.materials.slice(0, 3).map((material, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {material}
                  </span>
                ))}
                {craft.materials.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{craft.materials.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          {craft.tools && craft.tools.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Outils
              </h4>
              <div className="flex flex-wrap gap-1">
                {craft.tools.slice(0, 3).map((tool, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                  >
                    {tool}
                  </span>
                ))}
                {craft.tools.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{craft.tools.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Techniques */}
        {craft.techniques && craft.techniques.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Techniques
            </h4>
            <div className="flex flex-wrap gap-1">
              {craft.techniques.slice(0, 2).map((technique, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                >
                  {technique}
                </span>
              ))}
              {craft.techniques.length > 2 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{craft.techniques.length - 2}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Uses */}
        {craft.uses && craft.uses.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Utilisations
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {craft.uses.join(', ')}
            </p>
          </div>
        )}

        {/* Cultural significance */}
        {craft.culturalSignificance && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Signification culturelle
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {craft.culturalSignificance}
            </p>
          </div>
        )}

        {/* Tutorials count */}
        {craft.tutorials && craft.tutorials.length > 0 && (
          <div className="mb-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {craft.tutorials.length} tutoriel{craft.tutorials.length > 1 ? 's' : ''} disponible{craft.tutorials.length > 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* Action Button */}
        <button className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
          Découvrir l'artisanat
        </button>
      </div>
    </div>
  );
};

export default CraftCard;
