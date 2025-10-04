/**
 * Language Filters Component - Filtering interface for the Atlas
 * 
 * This component provides filtering options for the linguistic atlas,
 * including family, region, status, and speaker count filters.
 * 
 * @version 1.1.0
 * @author Ma'a yegue Team
 */

import React, { useState, useCallback } from 'react';
import { LanguageFamily, AtlasFilters, AtlasStats } from '../types/atlas.types';
import { 
  MagnifyingGlassIcon, 
  XMarkIcon,
  FunnelIcon,
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
  const [localFilters, setLocalFilters] = useState<AtlasFilters>(filters);

  const handleFilterChange = useCallback((key: keyof AtlasFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  }, [localFilters, onFiltersChange]);

  const handleSearchChange = useCallback((value: string) => {
    handleFilterChange('searchQuery', value || undefined);
  }, [handleFilterChange]);

  const handleFamilyToggle = useCallback((familyId: string) => {
    const currentFamilies = localFilters.families || [];
    const newFamilies = currentFamilies.includes(familyId)
      ? currentFamilies.filter(id => id !== familyId)
      : [...currentFamilies, familyId];
    handleFilterChange('families', newFamilies.length > 0 ? newFamilies : undefined);
  }, [localFilters.families, handleFilterChange]);

  const handleRegionToggle = useCallback((region: string) => {
    const currentRegions = localFilters.regions || [];
    const newRegions = currentRegions.includes(region)
      ? currentRegions.filter(r => r !== region)
      : [...currentRegions, region];
    handleFilterChange('regions', newRegions.length > 0 ? newRegions : undefined);
  }, [localFilters.regions, handleFilterChange]);

  const handleStatusToggle = useCallback((status: string) => {
    const currentStatuses = localFilters.status || [];
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter(s => s !== status)
      : [...currentStatuses, status];
    handleFilterChange('status', newStatuses.length > 0 ? newStatuses : undefined);
  }, [localFilters.status, handleFilterChange]);

  const handleSpeakerRangeChange = useCallback((min: number, max: number) => {
    handleFilterChange('speakerRange', { min, max });
  }, [handleFilterChange]);

  const clearAllFilters = useCallback(() => {
    const clearedFilters: AtlasFilters = {};
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  }, [onFiltersChange]);

  const hasActiveFilters = Object.keys(localFilters).some(key => {
    const value = localFilters[key as keyof AtlasFilters];
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
            placeholder="Nom de langue, région..."
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
            <span className="text-gray-500">Langues:</span>
            <span className="ml-1 font-medium">{stats.totalLanguages}</span>
          </div>
          <div>
            <span className="text-gray-500">Locuteurs:</span>
            <span className="ml-1 font-medium">{Math.round(stats.totalSpeakers / 1000000)}M</span>
          </div>
          <div>
            <span className="text-gray-500">Familles:</span>
            <span className="ml-1 font-medium">{stats.families}</span>
          </div>
          <div>
            <span className="text-gray-500">En danger:</span>
            <span className="ml-1 font-medium text-red-600">{stats.endangered}</span>
          </div>
        </div>
      </div>

      {/* Expandable Filters */}
      <div className="space-y-4">
        {/* Language Families */}
        <div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <span>Familles linguistiques</span>
            <AdjustmentsHorizontalIcon className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
          
          {isExpanded && (
            <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
              {availableFamilies.map((family) => (
                <label key={family.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localFilters.families?.includes(family.id) || false}
                    onChange={() => handleFamilyToggle(family.id)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {family.name} ({family.totalLanguages})
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

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
              {availableRegions.map((region) => (
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

        {/* Language Status */}
        <div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <span>Statut</span>
            <AdjustmentsHorizontalIcon className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
          
          {isExpanded && (
            <div className="mt-2 space-y-2">
              {[
                { value: 'vital', label: 'Vital', color: 'green' },
                { value: 'threatened', label: 'Menacé', color: 'yellow' },
                { value: 'endangered', label: 'En danger', color: 'orange' },
                { value: 'critically_endangered', label: 'Critiquement', color: 'red' },
                { value: 'extinct', label: 'Éteint', color: 'gray' }
              ].map((status) => (
                <label key={status.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localFilters.status?.includes(status.value) || false}
                    onChange={() => handleStatusToggle(status.value)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {status.label}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Speaker Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nombre de locuteurs
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="10000000"
              step="1000"
              value={localFilters.speakerRange?.max || 10000000}
              onChange={(e) => handleSpeakerRangeChange(
                localFilters.speakerRange?.min || 0,
                parseInt(e.target.value)
              )}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0</span>
              <span>{((localFilters.speakerRange?.max || 10000000) / 1000000).toFixed(1)}M</span>
            </div>
          </div>
        </div>

        {/* Writing Systems */}
        <div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={localFilters.hasWritingSystem || false}
              onChange={(e) => handleFilterChange('hasWritingSystem', e.target.checked || undefined)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Avec système d'écriture
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
            {localFilters.families?.map((familyId) => {
              const family = availableFamilies.find(f => f.id === familyId);
              return (
                <span key={familyId} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                  {family?.name}
                  <button
                    onClick={() => handleFamilyToggle(familyId)}
                    className="ml-1 hover:text-blue-600"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
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
            {localFilters.status?.map((status) => (
              <span key={status} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                {status}
                <button
                  onClick={() => handleStatusToggle(status)}
                  className="ml-1 hover:text-yellow-600"
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

export default LanguageFilters;
