/**
 * Historical Sites Page - Main page for Historical Sites module
 * 
 * @version 1.1.0
 * @author Ma'a yegue Team
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useInView } from 'react-intersection-observer';
import { 
  MapIcon,
  BuildingOfficeIcon,
  CameraIcon,
  SpeakerWaveIcon,
  ClockIcon,
  StarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  GlobeAltIcon,
  CalendarIcon,
  UserGroupIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import { historicalSitesService } from '../services/historicalSitesService';
import { 
  HistoricalSite, 
  SiteFilter, 
  SiteStats, 
  CulturalRoute,
  SiteSearchResult
} from '../types/historical-sites.types';
import { AnimatedSection } from '@/shared/components/ui/AnimatedComponents';
import { CountUp } from '@/shared/components/ui/AnimatedComponents';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/shared/components/ui/ErrorMessage';

const HistoricalSitesPage: React.FC = () => {
  // State management
  const [sites, setSites] = useState<HistoricalSite[]>([]);
  const [featuredSites, setFeaturedSites] = useState<HistoricalSite[]>([]);
  const [culturalRoutes, setCulturalRoutes] = useState<CulturalRoute[]>([]);
  const [stats, setStats] = useState<SiteStats | null>(null);
  const [searchResults, setSearchResults] = useState<SiteSearchResult[]>([]);
  const [filters, setFilters] = useState<SiteFilter>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'sites' | 'routes' | 'virtual-tours'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

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
    loadInitialData();
  }, []);

  // Load data when filters change
  useEffect(() => {
    if (stats) {
      loadFilteredData();
    }
  }, [filters, stats]);

  // Search when query changes
  useEffect(() => {
    if (searchQuery) {
      performSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, filters]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [sitesData, featuredData, routesData, statsData] = await Promise.all([
        historicalSitesService.getAllSites(),
        historicalSitesService.getFeaturedSites(),
        historicalSitesService.getAllCulturalRoutes(),
        historicalSitesService.getSiteStats()
      ]);

      setSites(sitesData);
      setFeaturedSites(featuredData);
      setCulturalRoutes(routesData);
      setStats(statsData);
    } catch (err) {
      console.error('Error loading historical sites data:', err);
      setError('Erreur lors du chargement des sites historiques');
    } finally {
      setLoading(false);
    }
  };

  const loadFilteredData = async () => {
    try {
      const filteredSites = await historicalSitesService.searchSites('', filters);
      // Convert search results back to full site objects
      const fullSites = await Promise.all(
        filteredSites.map(result => historicalSitesService.getSiteById(result.id))
      );
      setSites(fullSites.filter(Boolean) as HistoricalSite[]);
    } catch (err) {
      console.error('Error loading filtered data:', err);
      setError('Erreur lors du filtrage des données');
    }
  };

  const performSearch = async () => {
    try {
      const results = await historicalSitesService.searchSites(searchQuery, filters);
      setSearchResults(results);
    } catch (err) {
      console.error('Error performing search:', err);
      setError('Erreur lors de la recherche');
    }
  };

  const handleFiltersChange = useCallback((newFilters: SiteFilter) => {
    setFilters(newFilters);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Chargement des sites historiques...
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
            onClick={loadInitialData}
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
        <title>Sites Historiques Géolocalisés - Ma'a yegue</title>
        <meta name="description" content="Découvrez les sites historiques du Cameroun : musées, monuments, palais royaux et centres culturels avec visites virtuelles 360°." />
        <meta name="keywords" content="sites historiques, musées Cameroun, monuments, palais royaux, centres culturels, visites virtuelles, patrimoine" />
      </Helmet>

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container-custom py-6">
          <AnimatedSection>
            <div className="text-center">
              <h1 className="heading-1 mb-4">
                Sites Historiques Géolocalisés
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Explorez le patrimoine historique du Cameroun à travers nos musées, 
                monuments, palais royaux et centres culturels avec visites virtuelles 360°.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <AnimatedSection className="container-custom py-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Statistiques du Patrimoine
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-1">
                  <CountUp end={stats.totalSites} duration={2} />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Sites historiques</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-1">
                  <CountUp end={stats.totalMuseums} duration={2} />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Musées</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-1">
                  <CountUp end={stats.totalVirtualTours} duration={2} />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Visites virtuelles</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-1">
                  <CountUp end={stats.totalAudioGuides} duration={2} />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Guides audio</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-1">
                  <CountUp end={stats.regionsCovered} duration={2} />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Régions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-1">
                  <CountUp end={stats.totalVisitors} duration={2} />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Visiteurs</div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Main Content */}
      <div className="container-custom py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Search */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
                  Recherche
                </h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher un site..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <FunnelIcon className="w-5 h-5 mr-2" />
                  Filtres
                </h3>
                <div className="space-y-4">
                  {/* Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Type de site
                    </label>
                    <select
                      value={filters.type?.[0] || ''}
                      onChange={(e) => handleFiltersChange({ 
                        ...filters, 
                        type: e.target.value ? [e.target.value] : undefined 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="">Tous les types</option>
                      <option value="museum">Musée</option>
                      <option value="cultural_center">Centre culturel</option>
                      <option value="archaeological">Site archéologique</option>
                      <option value="monument">Monument</option>
                      <option value="royal_palace">Palais royal</option>
                      <option value="chiefdom">Chefferie</option>
                    </select>
                  </div>

                  {/* Region Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Région
                    </label>
                    <select
                      value={filters.region?.[0] || ''}
                      onChange={(e) => handleFiltersChange({ 
                        ...filters, 
                        region: e.target.value ? [e.target.value] : undefined 
                      })}
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

                  {/* Features Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fonctionnalités
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.hasVirtualTour || false}
                          onChange={(e) => handleFiltersChange({ 
                            ...filters, 
                            hasVirtualTour: e.target.checked || undefined 
                          })}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          Visite virtuelle
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.hasAudioGuide || false}
                          onChange={(e) => handleFiltersChange({ 
                            ...filters, 
                            hasAudioGuide: e.target.checked || undefined 
                          })}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          Guide audio
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.isAccessible || false}
                          onChange={(e) => handleFiltersChange({ 
                            ...filters, 
                            isAccessible: e.target.checked || undefined 
                          })}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          Accessible
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Tabs */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <nav className="flex space-x-8 px-6">
                    {[
                      { id: 'overview', label: 'Aperçu', icon: GlobeAltIcon },
                      { id: 'sites', label: 'Sites historiques', icon: BuildingOfficeIcon },
                      { id: 'routes', label: 'Routes culturelles', icon: MapIcon },
                      { id: 'virtual-tours', label: 'Visites virtuelles', icon: CameraIcon }
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
                  <AnimatedSection>
                    {activeTab === 'overview' && (
                      <div className="space-y-6">
                        <div className="text-center">
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Aperçu du Patrimoine Historique
                          </h2>
                          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Découvrez la richesse du patrimoine historique camerounais à travers 
                            nos collections organisées par type et région.
                          </p>
                        </div>

                        {/* Featured Sites */}
                        {featuredSites.length > 0 && (
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                              <StarIcon className="w-5 h-5 mr-2" />
                              Sites en vedette
                            </h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {featuredSites.slice(0, 6).map((site) => (
                                <div key={site.id} className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                  {site.images.length > 0 && (
                                    <img 
                                      src={site.images[0]} 
                                      alt={site.name}
                                      className="w-full h-48 object-cover"
                                    />
                                  )}
                                  <div className="p-4">
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                      {site.name}
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                      {site.type} • {site.region}
                                    </p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                                      {site.description}
                                    </p>
                                    <div className="flex items-center justify-between mt-3">
                                      <div className="flex items-center">
                                        <StarIcon className="w-4 h-4 text-yellow-500 mr-1" />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                          {site.averageRating.toFixed(1)}
                                        </span>
                                      </div>
                                      <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                                        Voir détails →
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Quick Stats */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-6">
                            <BuildingOfficeIcon className="w-8 h-8 text-blue-600 mb-3" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              Musées
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              {stats?.totalMuseums} musées documentés avec leurs collections 
                              et expositions temporaires.
                            </p>
                            <button
                              onClick={() => setActiveTab('sites')}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              Explorer →
                            </button>
                          </div>

                          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-6">
                            <CameraIcon className="w-8 h-8 text-green-600 mb-3" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              Visites Virtuelles
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              {stats?.totalVirtualTours} visites 360° pour explorer 
                              les sites depuis chez vous.
                            </p>
                            <button
                              onClick={() => setActiveTab('virtual-tours')}
                              className="text-green-600 hover:text-green-700 text-sm font-medium"
                            >
                              Explorer →
                            </button>
                          </div>

                          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-6">
                            <SpeakerWaveIcon className="w-8 h-8 text-purple-600 mb-3" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              Guides Audio
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              {stats?.totalAudioGuides} guides multilingues pour 
                              une visite enrichie.
                            </p>
                            <button
                              onClick={() => setActiveTab('sites')}
                              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                            >
                              Explorer →
                            </button>
                          </div>

                          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-6">
                            <MapIcon className="w-8 h-8 text-orange-600 mb-3" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              Routes Culturelles
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              {culturalRoutes.length} itinéraires thématiques pour 
                              découvrir le patrimoine.
                            </p>
                            <button
                              onClick={() => setActiveTab('routes')}
                              className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                            >
                              Explorer →
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'sites' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Sites Historiques ({sites.length})
                          </h2>
                        </div>
                        
                        {searchResults.length > 0 ? (
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {searchResults.map((result) => (
                              <div key={result.id} className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                {result.imageUrl && (
                                  <img 
                                    src={result.imageUrl} 
                                    alt={result.name}
                                    className="w-full h-48 object-cover"
                                  />
                                )}
                                <div className="p-4">
                                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                    {result.name}
                                  </h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    {result.type} • {result.region}
                                  </p>
                                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                                    {result.description}
                                  </p>
                                  <div className="flex items-center justify-between mt-3">
                                    <div className="flex items-center">
                                      <StarIcon className="w-4 h-4 text-yellow-500 mr-1" />
                                      <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {result.rating.toFixed(1)}
                                      </span>
                                    </div>
                                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                                      Voir détails →
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sites.map((site) => (
                              <div key={site.id} className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                {site.images.length > 0 && (
                                  <img 
                                    src={site.images[0]} 
                                    alt={site.name}
                                    className="w-full h-48 object-cover"
                                  />
                                )}
                                <div className="p-4">
                                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                    {site.name}
                                  </h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    {site.type} • {site.region}
                                  </p>
                                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                                    {site.description}
                                  </p>
                                  <div className="flex items-center justify-between mt-3">
                                    <div className="flex items-center">
                                      <StarIcon className="w-4 h-4 text-yellow-500 mr-1" />
                                      <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {site.averageRating.toFixed(1)}
                                      </span>
                                    </div>
                                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                                      Voir détails →
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'routes' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Routes Culturelles ({culturalRoutes.length})
                          </h2>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {culturalRoutes.map((route) => (
                            <div key={route.id} className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                              {route.images.length > 0 && (
                                <img 
                                  src={route.images[0]} 
                                  alt={route.name}
                                  className="w-full h-48 object-cover"
                                />
                              )}
                              <div className="p-4">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                  {route.name}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                  {route.region} • {route.duration}
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                                  {route.description}
                                </p>
                                <div className="flex items-center justify-between mt-3">
                                  <div className="flex items-center">
                                    <MapIcon className="w-4 h-4 text-primary-600 mr-1" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                      {route.sites.length} sites
                                    </span>
                                  </div>
                                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                                    Voir itinéraire →
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'virtual-tours' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Visites Virtuelles 360°
                          </h2>
                        </div>
                        <div className="text-center py-12">
                          <CameraIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            Visites virtuelles en cours de développement
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                            Les visites virtuelles 360° seront bientôt disponibles pour explorer 
                            les sites historiques depuis votre navigateur.
                          </p>
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
    </div>
  );
};

export default HistoricalSitesPage;