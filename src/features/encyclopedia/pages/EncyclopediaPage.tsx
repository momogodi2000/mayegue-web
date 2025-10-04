/**
 * Encyclopedia Page - Cultural Encyclopedia
 * 
 * This page provides access to the comprehensive cultural encyclopedia
 * featuring ethnic groups, traditions, cuisine, crafts, and cultural artifacts.
 * 
 * @version 1.1.0
 * @author Ma'a yegue Team
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useInView } from 'react-intersection-observer';
import { 
  EthnicGroupCard, 
  TraditionCard, 
  CuisineCard, 
  CraftCard, 
  StoryCard,
  EncyclopediaFilters,
  EncyclopediaSearch,
  EncyclopediaStats,
  EncyclopediaNavigation
} from '../components';
import { encyclopediaService } from '../services/encyclopediaService';
import { 
  EthnicGroup, 
  Tradition, 
  CuisineItem, 
  Craft, 
  Story, 
  EncyclopediaFilters as Filters, 
  EncyclopediaStats 
} from '../types/encyclopedia.types';
import { AnimatedSection } from '@/shared/components/ui/AnimatedComponents';
import { 
  MagnifyingGlassIcon,
  BookOpenIcon,
  MapIcon,
  MusicalNoteIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const EncyclopediaPage: React.FC = () => {
  // State management
  const [groups, setGroups] = useState<EthnicGroup[]>([]);
  const [traditions, setTraditions] = useState<Tradition[]>([]);
  const [cuisine, setCuisine] = useState<CuisineItem[]>([]);
  const [crafts, setCrafts] = useState<Craft[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [stats, setStats] = useState<EncyclopediaStats | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [filters, setFilters] = useState<Filters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'groups' | 'traditions' | 'cuisine' | 'crafts' | 'stories'>('overview');

  // Intersection observer for animations
  const [statsRef, statsInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [contentRef, contentInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  // Load initial data
  useEffect(() => {
    loadEncyclopediaData();
  }, []);

  // Load data when filters change
  useEffect(() => {
    if (stats) {
      loadFilteredData();
    }
  }, [filters, stats]);

  const loadEncyclopediaData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        groupsData, traditionsData, cuisineData, craftsData, storiesData, statsData
      ] = await Promise.all([
        encyclopediaService.getEthnicGroups(),
        encyclopediaService.getTraditions(),
        encyclopediaService.getCuisineItems(),
        encyclopediaService.getCrafts(),
        encyclopediaService.getStories(),
        encyclopediaService.getEncyclopediaStats()
      ]);

      setGroups(groupsData);
      setTraditions(traditionsData);
      setCuisine(cuisineData);
      setCrafts(craftsData);
      setStories(storiesData);
      setStats(statsData);
    } catch (err) {
      console.error('Error loading encyclopedia data:', err);
      setError('Erreur lors du chargement des données de l\'encyclopédie');
    } finally {
      setLoading(false);
    }
  };

  const loadFilteredData = async () => {
    try {
      const [filteredGroups, filteredTraditions, filteredCuisine, filteredCrafts, filteredStories] = await Promise.all([
        encyclopediaService.getEthnicGroups(filters),
        encyclopediaService.getTraditions(filters),
        encyclopediaService.getCuisineItems(filters),
        encyclopediaService.getCrafts(filters),
        encyclopediaService.getStories(filters)
      ]);

      setGroups(filteredGroups);
      setTraditions(filteredTraditions);
      setCuisine(filteredCuisine);
      setCrafts(filteredCrafts);
      setStories(filteredStories);
    } catch (err) {
      console.error('Error loading filtered data:', err);
      setError('Erreur lors du filtrage des données');
    }
  };

  const handleFiltersChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
  }, []);

  const handleItemSelect = useCallback((item: any) => {
    setSelectedItem(item);
  }, []);

  const handleItemDeselect = useCallback(() => {
    setSelectedItem(null);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Chargement de l'Encyclopédie Culturelle...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Erreur de chargement
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button 
            onClick={loadEncyclopediaData}
            className="btn-primary btn"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>Encyclopédie Culturelle - Ma'a yegue</title>
        <meta name="description" content="Découvrez la richesse culturelle camerounaise : traditions, art, histoire et pratiques de plus de 280 groupes ethniques." />
        <meta name="keywords" content="encyclopédie culturelle, traditions camerounaises, ethnies, artisanat, cuisine traditionnelle, contes, proverbes" />
      </Helmet>

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container-custom py-6">
          <AnimatedSection>
            <div className="text-center">
              <h1 className="heading-1 mb-4">
              Encyclopédie Culturelle
            </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Explorez la richesse culturelle du Cameroun à travers les traditions, 
                l'art, l'histoire et les pratiques de plus de 280 groupes ethniques.
              </p>
            </div>
          </AnimatedSection>
        </div>
            </div>

      {/* Statistics */}
      {stats && (
        <AnimatedSection ref={statsRef} className="container-custom py-8">
          <EncyclopediaStats onStatsLoad={setStats} />
        </AnimatedSection>
      )}

      {/* Main Content */}
      <div className="container-custom py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <EncyclopediaNavigation currentSection={activeTab} />
              <EncyclopediaFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                stats={stats || {
                  totalGroups: 0,
                  totalTraditions: 0,
                  totalCuisineItems: 0,
                  totalCrafts: 0,
                  totalStories: 0,
                  totalMediaItems: 0,
                  regionsCovered: 0,
                  lastUpdated: new Date()
                }}
              />
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Search */}
              <EncyclopediaSearch
                onResultsChange={(results) => {
                  // Handle search results
                  console.log('Search results:', results);
                }}
                onLoadingChange={(loading) => {
                  // Handle loading state
                  console.log('Search loading:', loading);
                }}
                onErrorChange={(error) => {
                  // Handle search errors
                  if (error) {
                    setError(error);
                  }
                }}
              />

              {/* Tabs */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <nav className="flex space-x-8 px-6">
                    {[
                      { id: 'overview', label: 'Aperçu', icon: BookOpenIcon },
                      { id: 'groups', label: 'Groupes ethniques', icon: MapIcon },
                      { id: 'traditions', label: 'Traditions', icon: SparklesIcon },
                      { id: 'cuisine', label: 'Cuisine', icon: MusicalNoteIcon },
                      { id: 'crafts', label: 'Artisanat', icon: BookOpenIcon },
                      { id: 'stories', label: 'Contes', icon: BookOpenIcon }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                          activeTab === tab.id
                            ? 'border-primary-500 text-primary-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <tab.icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  <AnimatedSection ref={contentRef}>
                    {activeTab === 'overview' && (
                      <div className="space-y-6">
                        <div className="text-center">
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Aperçu de l'Encyclopédie
                          </h2>
                          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Découvrez la diversité culturelle du Cameroun à travers nos collections 
                            organisées par catégories et régions.
                </p>
              </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-6">
                            <MapIcon className="w-8 h-8 text-blue-600 mb-3" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              Groupes Ethniques
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              {stats?.totalGroups} groupes ethniques documentés avec leur histoire, 
                              culture et traditions.
                            </p>
                            <button
                              onClick={() => setActiveTab('groups')}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              Explorer →
                            </button>
              </div>

                          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-6">
                            <SparklesIcon className="w-8 h-8 text-green-600 mb-3" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              Traditions
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              {stats?.totalTraditions} traditions cérémonielles, sociales et 
                              religieuses préservées.
                            </p>
                            <button
                              onClick={() => setActiveTab('traditions')}
                              className="text-green-600 hover:text-green-700 text-sm font-medium"
                            >
                              Explorer →
                            </button>
              </div>

                          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-6">
                            <MusicalNoteIcon className="w-8 h-8 text-orange-600 mb-3" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              Cuisine
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              {stats?.totalCuisineItems} plats traditionnels avec recettes, 
                              ingrédients et signification culturelle.
                            </p>
                            <button
                              onClick={() => setActiveTab('cuisine')}
                              className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                            >
                              Explorer →
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'groups' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Groupes Ethniques ({groups.length})
                          </h2>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {groups.map((group) => (
                            <EthnicGroupCard
                              key={group.id}
                              group={group}
                              onSelect={handleItemSelect}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'traditions' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Traditions ({traditions.length})
                          </h2>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {traditions.map((tradition) => (
                            <TraditionCard
                              key={tradition.id}
                              tradition={tradition}
                              onSelect={handleItemSelect}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'cuisine' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Cuisine Traditionnelle ({cuisine.length})
                          </h2>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {cuisine.map((item) => (
                            <CuisineCard
                              key={item.id}
                              item={item}
                              onSelect={handleItemSelect}
                            />
                          ))}
              </div>
            </div>
                    )}

                    {activeTab === 'crafts' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Artisanat ({crafts.length})
                          </h2>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {crafts.map((craft) => (
                            <CraftCard
                              key={craft.id}
                              craft={craft}
                              onSelect={handleItemSelect}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'stories' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Contes & Légendes ({stories.length})
                          </h2>
                </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {stories.map((story) => (
                            <StoryCard
                              key={story.id}
                              story={story}
                              onSelect={handleItemSelect}
                            />
                          ))}
                </div>
                </div>
                    )}
                  </AnimatedSection>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedItem.name || selectedItem.title}
                </h2>
                <button
                  onClick={handleItemDeselect}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300">
                  {selectedItem.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EncyclopediaPage;