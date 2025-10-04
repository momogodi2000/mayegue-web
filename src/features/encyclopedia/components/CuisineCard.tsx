/**
 * Cuisine Card Component - Display card for cuisine items
 * 
 * @version 1.1.0
 * @author Ma'a yegue Team
 */

import React from 'react';
import { ClockIcon, UsersIcon, StarIcon } from '@heroicons/react/24/outline';
import { CuisineItem } from '../types/encyclopedia.types';

interface CuisineCardProps {
  item: CuisineItem;
  onSelect: (item: CuisineItem) => void;
}

const CuisineCard: React.FC<CuisineCardProps> = ({ item, onSelect }) => {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'main': 'bg-red-100 text-red-800',
      'side': 'bg-green-100 text-green-800',
      'beverage': 'bg-blue-100 text-blue-800',
      'dessert': 'bg-purple-100 text-purple-800',
      'snack': 'bg-yellow-100 text-yellow-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'main': 'Plat principal',
      'side': 'Accompagnement',
      'beverage': 'Boisson',
      'dessert': 'Dessert',
      'snack': 'Collation'
    };
    return labels[category] || category;
  };

  return (
    <div
      onClick={() => onSelect(item)}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer overflow-hidden"
    >
      {/* Image */}
      {item.images && item.images.length > 0 && (
        <div className="aspect-video bg-gray-200 dark:bg-gray-700">
          <img
            src={item.images[0]}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {item.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {item.nativeName}
            </p>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
              {getCategoryLabel(item.category)}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          {item.cookingTime && (
            <div className="flex items-center space-x-2">
              <ClockIcon className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {item.cookingTime}
              </span>
            </div>
          )}
          
          {item.servingSize && (
            <div className="flex items-center space-x-2">
              <UsersIcon className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {item.servingSize} personnes
              </span>
            </div>
          )}

          {item.difficulty && (
            <div className="flex items-center space-x-2">
              <StarIcon className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Difficulté: {item.difficulty}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
          {item.description}
        </p>

        {/* Ingredients count */}
        <div className="mb-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {item.ingredients.length} ingrédients
          </span>
        </div>

        {/* Cultural significance */}
        {item.culturalSignificance && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Signification culturelle
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {item.culturalSignificance}
            </p>
          </div>
        )}

        {/* Occasions */}
        {item.occasions && item.occasions.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Occasions
            </h4>
            <div className="flex flex-wrap gap-1">
              {item.occasions.slice(0, 3).map((occasion, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  {occasion}
                </span>
              ))}
              {item.occasions.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{item.occasions.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <button className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
          Voir la recette
        </button>
      </div>
    </div>
  );
};

export default CuisineCard;
