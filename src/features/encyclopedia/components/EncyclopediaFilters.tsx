/**
 * Encyclopedia Filters Component - Filtering interface for the Encyclopedia
 * 
 * @version 1.1.0
 * @author Ma'a yegue Team
 */

import React, { useState, useCallback } from 'react';
import { EncyclopediaFilters, EncyclopediaStats, CAMEROON_REGIONS } from '../types/encyclopedia.types';
import { 
  MagnifyingGlassIcon, 
  XMarkIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

interface EncyclopediaFiltersProps {
  filters: EncyclopediaFilters;
  onFiltersChange: (filters: EncyclopediaFilters) => void;
  stats: EncyclopediaStats;
}

const EncyclopediaFiltersComponent: React.FC<EncyclopediaFiltersProps> = ({
  filters,
  onFiltersChange,
  stats
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState<EncyclopediaFilters>(filters);

  const handleFilterChange = useCallback((key: keyof EncyclopediaFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  }, [localFilters, onFiltersChange]);

  const handleSearchChange = useCallback((value: string) => {
    handleFilterChange('searchQuery', value || undefined);
  }, [handleFilterChange]);

  const handleRegionToggle = useCallback((region: string) => {
    const currentRegions = localFilters.regions || [];
    const newRegions = currentRegions.includes(region)
      ? currentRegions.filter(r => r !== region)
      : [...currentRegions, region];
    handleFilterChange('regions', newRegions.length > 0 ? newRegions : undefined);
  }, [localFilters.regions, handleFilterChange]);

  const handleCategoryToggle = useCallback((category: string) => {
    const currentCategories = localFilters.categories || [];
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category];
    handleFilterChange('categories', newCategories.length > 0 ? newCategories : undefined);
  }, [localFilters.categories, handleFilterChange]);

  const handleTypeToggle = useCallback((type: string) => {
    const currentTypes = localFilters.types || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    handleFilterChange('types', newTypes.length > 0 ? newTypes : undefined);
  }, [localFilters.types, handleFilterChange]);

  const clearAllFilters = useCallback(() => {
    const clearedFilters: EncyclopediaFilters = {};
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  }, [onFiltersChange]);

  const hasActiveFilters = Object.keys(localFilters).some(key => {
    const value = localFilters[key as keyof EncyclopediaFilters];
    return value !== undefined && value !== null && 
           (Array.isArray(value) ? value.length > 0 : true);
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <FunnelIcon className="w-5 h-5 mr-2" />
          Filtres
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-red-600 hover:text-red-700 flex items-center"
          >
            <XMarkIcon className="w-4 h-4 mr-1" />
            Effacer tout
          </button>
        )}
      </div>

      {/* Search */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Recherche
        </label>
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher dans l'encyclopédie..."
            value={localFilters.searchQuery || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Statistiques
        </h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-gray-500">Groupes:</span>
            <span className="ml-1 font-medium">{stats.totalGroups}</span>
          </div>
          <div>
            <span className="text-gray-500">Traditions:</span>
            <span className="ml-1 font-medium">{stats.totalTraditions}</span>
          </div>
          <div>
            <span className="text-gray-500">Cuisine:</span>
            <span className="ml-1 font-medium">{stats.totalCuisineItems}</span>
          </div>
          <div>
            <span className="text-gray-500">Artisanats:</span>
            <span className="ml-1 font-medium">{stats.totalCrafts}</span>
          </div>
        </div>
      </div>

      {/* Expandable Filters */}
      <div className="space-y-4">
        {/* Regions */}
        <div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <span>Régions</span>
            <AdjustmentsHorizontalIcon className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
          
          {isExpanded && (
            <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
              {CAMEROON_REGIONS.map((region) => (
                <label key={region} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localFilters.regions?.includes(region) || false}
                    onChange={() => handleRegionToggle(region)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {region}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Categories */}
        <div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <span>Catégories</span>
            <AdjustmentsHorizontalIcon className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
          
          {isExpanded && (
            <div className="mt-2 space-y-2">
              {[
                { value: 'main', label: 'Plat principal' },
                { value: 'side', label: 'Accompagnement' },
                { value: 'beverage', label: 'Boisson' },
                { value: 'dessert', label: 'Dessert' },
                { value: 'snack', label: 'Collation' }
              ].map((category) => (
                <label key={category.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localFilters.categories?.includes(category.value) || false}
                    onChange={() => handleCategoryToggle(category.value)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {category.label}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Types */}
        <div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <span>Types</span>
            <AdjustmentsHorizontalIcon className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
          
          {isExpanded && (
            <div className="mt-2 space-y-2">
              {[
                { value: 'ceremonial', label: 'Cérémoniel' },
                { value: 'social', label: 'Social' },
                { value: 'religious', label: 'Religieux' },
                { value: 'seasonal', label: 'Saisonnier' },
                { value: 'life-cycle', label: 'Cycle de vie' }
              ].map((type) => (
                <label key={type.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localFilters.types?.includes(type.value) || false}
                    onChange={() => handleTypeToggle(type.value)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {type.label}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Media Filter */}
        <div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={localFilters.hasMedia || false}
              onChange={(e) => handleFilterChange('hasMedia', e.target.checked || undefined)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Avec médias (images, vidéos, audio)
            </span>
          </label>
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Filtres actifs
          </h4>
          <div className="flex flex-wrap gap-2">
            {localFilters.regions?.map((region) => (
              <span key={region} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                {region}
                <button
                  onClick={() => handleRegionToggle(region)}
                  className="ml-1 hover:text-green-600"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </span>
            ))}
            {localFilters.categories?.map((category) => (
              <span key={category} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                {category}
                <button
                  onClick={() => handleCategoryToggle(category)}
                  className="ml-1 hover:text-blue-600"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </span>
            ))}
            {localFilters.types?.map((type) => (
              <span key={type} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                {type}
                <button
                  onClick={() => handleTypeToggle(type)}
                  className="ml-1 hover:text-purple-600"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EncyclopediaFiltersComponent;
