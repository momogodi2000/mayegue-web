/**
 * Language Filters Component - Advanced filtering for the atlas
 * 
 * @version 1.1.0
 * @author Ma'a yegue Team
 */

import React, { useState, useEffect } from 'react';
import { AtlasFilters, LanguageFamily, AtlasStats } from '../types/atlas.types';
import { FloatingCard } from '@/shared/components/ui/AnimatedComponents';
import { 
  FunnelIcon, 
  MagnifyingGlassIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

interface LanguageFiltersProps {
  filters: AtlasFilters;
  onFiltersChange: (filters: AtlasFilters) => void;
  availableFamilies: LanguageFamily[];
  availableRegions: string[];
  stats: AtlasStats;
}

const LanguageFilters: React.FC<LanguageFiltersProps> = ({
  filters,
  onFiltersChange,
  availableFamilies,
  availableRegions,
  stats
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState(filters.searchQuery || '');

  const handleFilterChange = (key: keyof AtlasFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
    setSearchQuery('');
  };

  const hasActiveFilters = () => {
    return !!(
      filters.families?.length ||
      filters.regions?.length ||
      filters.status?.length ||
      filters.endangeredLevel?.length ||
      filters.speakerRange ||
      filters.hasWritingSystem !== undefined ||
      filters.searchQuery
    );
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery !== filters.searchQuery) {
        handleFilterChange('searchQuery', searchQuery || undefined);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <FloatingCard className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <FunnelIcon className="w-5 h-5 mr-2" />
          Filtres
        </h3>
        <div className="flex items-center space-x-2">
          {hasActiveFilters() && (
            <button
              onClick={clearFilters}
              className="text-sm text-red-600 hover:text-red-700 flex items-center"
            >
              <XMarkIcon className="w-4 h-4 mr-1" />
              Effacer
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
          >
            <AdjustmentsHorizontalIcon className="w-4 h-4 mr-1" />
            {isExpanded ? 'Réduire' : 'Étendre'}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une langue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
          <div className="font-semibold text-blue-800 dark:text-blue-200">
            {stats.totalLanguages}
          </div>
          <div className="text-blue-600 dark:text-blue-300">Langues</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded">
          <div className="font-semibold text-green-800 dark:text-green-200">
            {stats.families}
          </div>
          <div className="text-green-600 dark:text-green-300">Familles</div>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded">
          <div className="font-semibold text-orange-800 dark:text-orange-200">
            {stats.endangered}
          </div>
          <div className="text-orange-600 dark:text-orange-300">En danger</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded">
          <div className="font-semibold text-purple-800 dark:text-purple-200">
            {stats.regions}
          </div>
          <div className="text-purple-600 dark:text-purple-300">Régions</div>
        </div>
      </div>

      {/* Basic Filters */}
      <div className="space-y-4">
        {/* Language Families */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Familles Linguistiques
          </label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {availableFamilies.map(family => (
              <label key={family.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.families?.includes(family.id) || false}
                  onChange={(e) => {
                    const currentFamilies = filters.families || [];
                    const newFamilies = e.target.checked
                      ? [...currentFamilies, family.id]
                      : currentFamilies.filter(f => f !== family.id);
                    handleFilterChange('families', newFamilies.length ? newFamilies : undefined);
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: family.color }}
                  />
                  {family.name} ({family.totalLanguages})
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Regions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Régions
          </label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {availableRegions.map(region => (
              <label key={region} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.regions?.includes(region) || false}
                  onChange={(e) => {
                    const currentRegions = filters.regions || [];
                    const newRegions = e.target.checked
                      ? [...currentRegions, region]
                      : currentRegions.filter(r => r !== region);
                    handleFilterChange('regions', newRegions.length ? newRegions : undefined);
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {region}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Statut des Langues
          </label>
          <div className="space-y-2">
            {[
              { value: 'vital', label: 'Vital', color: 'bg-green-100 text-green-800' },
              { value: 'threatened', label: 'Menacé', color: 'bg-yellow-100 text-yellow-800' },
              { value: 'endangered', label: 'En danger', color: 'bg-orange-100 text-orange-800' },
              { value: 'critically_endangered', label: 'Critiquement en danger', color: 'bg-red-100 text-red-800' },
              { value: 'extinct', label: 'Éteint', color: 'bg-gray-100 text-gray-800' }
            ].map(status => (
              <label key={status.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.status?.includes(status.value as any) || false}
                  onChange={(e) => {
                    const currentStatus = filters.status || [];
                    const newStatus = e.target.checked
                      ? [...currentStatus, status.value as any]
                      : currentStatus.filter(s => s !== status.value);
                    handleFilterChange('status', newStatus.length ? newStatus : undefined);
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className={`ml-2 text-sm px-2 py-1 rounded-full ${status.color}`}>
                  {status.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Writing Systems */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.hasWritingSystem || false}
              onChange={(e) => handleFilterChange('hasWritingSystem', e.target.checked || undefined)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Avec système d'écriture
            </span>
          </label>
        </div>
      </div>

      {/* Advanced Filters (Collapsible) */}
      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
          <h4 className="font-medium text-gray-900 dark:text-white">
            Filtres Avancés
          </h4>

          {/* Speaker Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre de Locuteurs
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.speakerRange?.min || ''}
                onChange={(e) => {
                  const min = e.target.value ? parseInt(e.target.value) : undefined;
                  handleFilterChange('speakerRange', {
                    min: min || 0,
                    max: filters.speakerRange?.max || 10000000
                  });
                }}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.speakerRange?.max || ''}
                onChange={(e) => {
                  const max = e.target.value ? parseInt(e.target.value) : undefined;
                  handleFilterChange('speakerRange', {
                    min: filters.speakerRange?.min || 0,
                    max: max || 10000000
                  });
                }}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Endangered Levels */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Niveau de Danger (UNESCO)
            </label>
            <div className="space-y-2">
              {[
                { value: 'safe', label: 'Sûr', color: 'bg-green-100 text-green-800' },
                { value: 'vulnerable', label: 'Vulnérable', color: 'bg-yellow-100 text-yellow-800' },
                { value: 'definitely_endangered', label: 'Définitivement en danger', color: 'bg-orange-100 text-orange-800' },
                { value: 'severely_endangered', label: 'Sévèrement en danger', color: 'bg-red-100 text-red-800' },
                { value: 'critically_endangered', label: 'Critiquement en danger', color: 'bg-red-100 text-red-800' },
                { value: 'extinct', label: 'Éteint', color: 'bg-gray-100 text-gray-800' }
              ].map(level => (
                <label key={level.value} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.endangeredLevel?.includes(level.value as any) || false}
                    onChange={(e) => {
                      const currentLevels = filters.endangeredLevel || [];
                      const newLevels = e.target.checked
                        ? [...currentLevels, level.value as any]
                        : currentLevels.filter(l => l !== level.value);
                      handleFilterChange('endangeredLevel', newLevels.length ? newLevels : undefined);
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className={`ml-2 text-sm px-2 py-1 rounded-full ${level.color}`}>
                    {level.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters() && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Filtres actifs:</strong>
            <div className="mt-1 flex flex-wrap gap-1">
              {filters.families?.map(familyId => {
                const family = availableFamilies.find(f => f.id === familyId);
                return (
                  <span key={familyId} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
                    {family?.name}
                  </span>
                );
              })}
              {filters.regions?.map(region => (
                <span key={region} className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs">
                  {region}
                </span>
              ))}
              {filters.status?.map(status => (
                <span key={status} className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded text-xs">
                  {status}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </FloatingCard>
  );
};

export default LanguageFilters;