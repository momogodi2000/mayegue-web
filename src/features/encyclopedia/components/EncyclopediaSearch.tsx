/**
 * Encyclopedia Search Component - Advanced search interface for Encyclopedia
 * 
 * @version 1.1.0
 * @author Ma'a yegue Team
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  MagnifyingGlassIcon, 
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  DocumentTextIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { EncyclopediaFilters, SearchResult } from '../types/encyclopedia.types';
import { encyclopediaService } from '../services/encyclopediaService';

interface EncyclopediaSearchProps {
  onResultsChange: (results: SearchResult[]) => void;
  onLoadingChange: (loading: boolean) => void;
  onErrorChange: (error: string | null) => void;
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'ethnic-group' | 'tradition' | 'cuisine' | 'craft' | 'story';
  category: string;
}

const EncyclopediaSearchComponent: React.FC<EncyclopediaSearchProps> = ({
  onResultsChange,
  onLoadingChange,
  onErrorChange
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [filters, setFilters] = useState<EncyclopediaFilters>({});
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);

  // Debounced search
  const debouncedSearch = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    return (searchQuery: string) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        performSearch(searchQuery, filters);
      }, 300);
    };
  }, [filters]);

  // Load popular searches on mount
  useEffect(() => {
    const loadPopularSearches = () => {
      const popular = [
        'Bamiléké',
        'Douala',
        'Bassa',
        'Fang',
        'Béti',
        'Fulani',
        'Tikar',
        'Kirdi',
        'Massa',
        'Maka'
      ];
      setPopularSearches(popular);
    };

    const loadRecentSearches = () => {
      const recent = JSON.parse(localStorage.getItem('encyclopedia-recent-searches') || '[]');
      setRecentSearches(recent);
    };

    loadPopularSearches();
    loadRecentSearches();
  }, []);

  // Generate suggestions based on query
  const generateSuggestions = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const ethnicGroups = await encyclopediaService.getEthnicGroups();
      const suggestions: SearchSuggestion[] = [];

      // Add ethnic group suggestions
      ethnicGroups.forEach((group: any) => {
        if (group.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          suggestions.push({
            id: group.id,
            text: group.name,
            type: 'ethnic-group',
            category: 'Groupe ethnique'
          });
        }
      });

      // Add tradition suggestions
      ethnicGroups.forEach((group: any) => {
        group.traditions.forEach((tradition: any) => {
          if (tradition.toLowerCase().includes(searchQuery.toLowerCase())) {
            suggestions.push({
              id: `${group.id}-tradition-${tradition}`,
              text: tradition,
              type: 'tradition',
              category: 'Tradition'
            });
          }
        });
      });

      // Add cuisine suggestions
      ethnicGroups.forEach((group: any) => {
        group.cuisine.forEach((cuisine: any) => {
          if (cuisine.toLowerCase().includes(searchQuery.toLowerCase())) {
            suggestions.push({
              id: `${group.id}-cuisine-${cuisine}`,
              text: cuisine,
              type: 'cuisine',
              category: 'Cuisine'
            });
          }
        });
      });

      setSuggestions(suggestions.slice(0, 8));
    } catch (error) {
      console.error('Error generating suggestions:', error);
    }
  }, []);

  // Perform search
  const performSearch = useCallback(async (searchQuery: string, searchFilters: EncyclopediaFilters) => {
    if (!searchQuery.trim()) {
      onResultsChange([]);
      return;
    }

    try {
      onLoadingChange(true);
      onErrorChange(null);

      const ethnicGroups = await encyclopediaService.getEthnicGroups();
      const results: SearchResult[] = [];

      // Search in ethnic groups
      ethnicGroups.forEach((group: any) => {
        const matchesQuery = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           group.history.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           group.traditions.some((t: any) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
                           group.cuisine.some((c: any) => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
                           group.crafts.some((c: any) => c.toLowerCase().includes(searchQuery.toLowerCase()));

        if (matchesQuery) {
          // Check filters
          if (searchFilters.regions && !searchFilters.regions.includes(group.region)) return;
          if (searchFilters.hasMedia && !group.imageUrl) return;

          results.push({
            id: group.id,
            type: 'ethnic-group',
            title: group.name,
            description: group.history,
            category: 'Groupe ethnique',
            region: group.region,
            imageUrl: group.imageUrl,
            relevanceScore: calculateRelevanceScore(group, searchQuery)
          });
        }
      });

      // Sort by relevance
      results.sort((a, b) => b.relevanceScore - a.relevanceScore);

      onResultsChange(results);
      
      // Save to recent searches
      if (searchQuery && !recentSearches.includes(searchQuery)) {
        const newRecent = [searchQuery, ...recentSearches].slice(0, 10);
        setRecentSearches(newRecent);
        localStorage.setItem('encyclopedia-recent-searches', JSON.stringify(newRecent));
      }
    } catch (error) {
      console.error('Search error:', error);
      onErrorChange('Erreur lors de la recherche. Veuillez réessayer.');
    } finally {
      onLoadingChange(false);
    }
  }, [onResultsChange, onLoadingChange, onErrorChange, recentSearches]);

  // Calculate relevance score
  const calculateRelevanceScore = (group: any, query: string): number => {
    let score = 0;
    const lowerQuery = query.toLowerCase();
    
    if (group.name.toLowerCase().includes(lowerQuery)) score += 10;
    if (group.history.toLowerCase().includes(lowerQuery)) score += 5;
    if (group.traditions.some((t: string) => t.toLowerCase().includes(lowerQuery))) score += 3;
    if (group.cuisine.some((c: string) => c.toLowerCase().includes(lowerQuery))) score += 3;
    if (group.crafts.some((c: string) => c.toLowerCase().includes(lowerQuery))) score += 3;
    
    return score;
  };

  // Handle input change
  const handleInputChange = (value: string) => {
    setQuery(value);
    generateSuggestions(value);
    setShowSuggestions(true);
    debouncedSearch(value);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    setShowSuggestions(false);
    performSearch(suggestion.text, filters);
  };

  // Handle search
  const handleSearch = () => {
    setShowSuggestions(false);
    performSearch(query, filters);
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Handle filter change
  const handleFilterChange = (newFilters: EncyclopediaFilters) => {
    setFilters(newFilters);
    if (query) {
      performSearch(query, newFilters);
    }
  };

  // Clear search
  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    onResultsChange([]);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      {/* Search Input */}
      <div className="relative mb-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher dans l'encyclopédie culturelle..."
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setShowSuggestions(true)}
            className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Search Suggestions */}
        {showSuggestions && (suggestions.length > 0 || recentSearches.length > 0) && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="p-2">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 px-2">
                  Suggestions
                </div>
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center space-x-2"
                  >
                    <DocumentTextIcon className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-900 dark:text-white">
                        {suggestion.text}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {suggestion.category}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="p-2 border-t border-gray-200 dark:border-gray-600">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 px-2">
                  Recherches récentes
                </div>
                {recentSearches.slice(0, 5).map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick({
                      id: `recent-${index}`,
                      text: search,
                      type: 'ethnic-group',
                      category: 'Recherche récente'
                    })}
                    className="w-full text-left px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center space-x-2"
                  >
                    <CalendarIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900 dark:text-white">{search}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Popular Searches */}
            {!query && popularSearches.length > 0 && (
              <div className="p-2 border-t border-gray-200 dark:border-gray-600">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 px-2">
                  Recherches populaires
                </div>
                <div className="flex flex-wrap gap-1">
                  {popularSearches.slice(0, 8).map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick({
                        id: `popular-${index}`,
                        text: search,
                        type: 'ethnic-group',
                        category: 'Populaire'
                      })}
                      className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        disabled={!query.trim()}
        className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
      >
        Rechercher
      </button>

      {/* Advanced Filters Toggle */}
      <div className="mt-4">
        <button
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className="flex items-center justify-center w-full text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <AdjustmentsHorizontalIcon className="w-4 h-4 mr-2" />
          Filtres avancés
        </button>
      </div>

      {/* Advanced Filters */}
      {isAdvancedOpen && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Region Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Région
              </label>
              <select
                value={filters.region || ''}
                onChange={(e) => handleFilterChange({ ...filters, region: e.target.value || undefined })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">Toutes les régions</option>
                <option value="Adamaoua">Adamaoua</option>
                <option value="Centre">Centre</option>
                <option value="Est">Est</option>
                <option value="Extrême-Nord">Extrême-Nord</option>
                <option value="Littoral">Littoral</option>
                <option value="Nord">Nord</option>
                <option value="Nord-Ouest">Nord-Ouest</option>
                <option value="Ouest">Ouest</option>
                <option value="Sud">Sud</option>
                <option value="Sud-Ouest">Sud-Ouest</option>
              </select>
            </div>

            {/* Media Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contenu
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.hasMedia || false}
                    onChange={(e) => handleFilterChange({ ...filters, hasMedia: e.target.checked || undefined })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Avec médias
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EncyclopediaSearchComponent;
