/**
 * Ethnic Group Card Component - Display card for ethnic groups
 * 
 * @version 1.1.0
 * @author Ma'a yegue Team
 */

import React from 'react';
import { MapPinIcon, UsersIcon, LanguageIcon } from '@heroicons/react/24/outline';
import { EthnicGroup } from '../types/encyclopedia.types';

interface EthnicGroupCardProps {
  group: EthnicGroup;
  onSelect: (group: EthnicGroup) => void;
}

const EthnicGroupCard: React.FC<EthnicGroupCardProps> = ({ group, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(group)}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer overflow-hidden"
    >
      {/* Image */}
      {group.images && group.images.length > 0 && (
        <div className="aspect-video bg-gray-200 dark:bg-gray-700">
          <img
            src={group.images[0]}
            alt={group.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {group.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {group.nativeName}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <MapPinIcon className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {group.region}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <UsersIcon className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {group.population.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Languages */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <LanguageIcon className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Langues
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {group.languages.slice(0, 3).map((language, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {language}
              </span>
            ))}
            {group.languages.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{group.languages.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
          {group.description}
        </p>

        {/* Cultural Highlights */}
        <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <div className="font-medium text-gray-700 dark:text-gray-300">
              {group.traditions.length}
            </div>
            <div>Traditions</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-700 dark:text-gray-300">
              {group.cuisine.length}
            </div>
            <div>Plats</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-700 dark:text-gray-300">
              {group.crafts.length}
            </div>
            <div>Artisanats</div>
          </div>
        </div>

        {/* Action Button */}
        <button className="w-full mt-4 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
          Découvrir la culture
        </button>
      </div>
    </div>
  );
};

export default EthnicGroupCard;
