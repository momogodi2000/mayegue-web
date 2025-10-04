/**
 * AR/VR Page - Main page for AR/VR module
 * 
 * @version 1.1.0
 * @author Ma'a yegue Team
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  CameraIcon,
  PlayIcon,
  EyeIcon,
  HandRaisedIcon,
  MicrophoneIcon,
  GlobeAltIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  StarIcon,
  ClockIcon,
  UsersIcon,
  TrophyIcon,
  SparklesIcon,
  PuzzlePieceIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { arVrService } from '../services/arVrService';
import { 
  ARScene, 
  ARFilter, 
  ARStats,
  ARSearchResult
} from '../types/ar-vr.types';
import { AnimatedSection } from '@/shared/components/ui/AnimatedComponents';
import { CountUp } from '@/shared/components/ui/AnimatedComponents';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/shared/components/ui/ErrorMessage';

const ARVRPage: React.FC = () => {
  // State management
  const [scenes, setScenes] = useState<ARScene[]>([]);
  const [featuredScenes, setFeaturedScenes] = useState<ARScene[]>([]);
  const [stats, setStats] = useState<ARStats | null>(null);
  const [searchResults, setSearchResults] = useState<ARSearchResult[]>([]);
  const [filters, setFilters] = useState<ARFilter>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'scenes' | 'market' | 'village' | 'ceremony' | 'conversation'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

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

      const [scenesData, featuredData, statsData] = await Promise.all([
        arVrService.getAllScenes(),
        arVrService.getFeaturedScenes(),
        arVrService.getARStats()
      ]);

      setScenes(scenesData);
      setFeaturedScenes(featuredData);
      setStats(statsData);
    } catch (err) {
      console.error('Error loading AR/VR data:', err);
      setError('Erreur lors du chargement des expériences AR/VR');
    } finally {
      setLoading(false);
    }
  };

  const loadFilteredData = async () => {
    try {
      const filteredScenes = await arVrService.searchScenes('', filters);
      // Convert search results back to full scene objects
      const fullScenes = await Promise.all(
        filteredScenes.map(result => arVrService.getSceneById(result.id))
      );
      setScenes(fullScenes.filter(Boolean) as ARScene[]);
    } catch (err) {
      console.error('Error loading filtered data:', err);
      setError('Erreur lors du filtrage des données');
    }
  };

  const performSearch = async () => {
    try {
      const results = await arVrService.searchScenes(searchQuery, filters);
      setSearchResults(results);
    } catch (err) {
      console.error('Error performing search:', err);
      setError('Erreur lors de la recherche');
    }
  };

  const handleFiltersChange = useCallback((newFilters: ARFilter) => {
    setFilters(newFilters);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const getSceneTypeLabel = (type: string) => {
    const typeLabels: Record<string, string> = {
      market: 'Marché traditionnel',
      village: 'Village traditionnel',
      ceremony: 'Cérémonie culturelle',
      conversation: 'Conversation guidée',
      workshop: 'Atelier artisanal',
      museum: 'Musée virtuel'
    };
    return typeLabels[type] || type;
  };

  const getSceneTypeIcon = (type: string) => {
    const typeIcons: Record<string, any> = {
      market: GlobeAltIcon,
      village: UsersIcon,
      ceremony: SparklesIcon,
      conversation: MicrophoneIcon,
      workshop: PuzzlePieceIcon,
      museum: AcademicCapIcon
    };
    return typeIcons[type] || CameraIcon;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Chargement des expériences AR/VR...
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
        <title>Système d'Immersion AR/VR - Ma'a yegue</title>
        <meta name="description" content="Explorez la culture camerounaise en réalité augmentée et virtuelle : marchés traditionnels, villages, cérémonies et conversations immersives." />
        <meta name="keywords" content="réalité augmentée, réalité virtuelle, immersion culturelle, AR, VR, expériences interactives, apprentissage immersif" />
      </Helmet>

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container-custom py-6">
          <AnimatedSection>
            <div className="text-center">
              <h1 className="heading-1 mb-4">
                Système d'Immersion AR/VR
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Plongez au cœur de la culture camerounaise avec nos expériences de réalité augmentée et virtuelle. 
                Explorez des marchés traditionnels, visitez des villages, participez à des cérémonies et conversez avec des locuteurs natifs.
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
              Statistiques AR/VR
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-1">
                  <CountUp end={stats.totalScenes} duration={2} />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Expériences AR/VR</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-1">
                  <CountUp end={stats.totalUsers} duration={2} />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Utilisateurs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-1">
                  <CountUp end={stats.totalSessions} duration={2} />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-1">
                  <CountUp end={Math.round(stats.averageSessionDuration)} duration={2} />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">min/session</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-1">
                  <CountUp end={Math.round(stats.completionRate * 100)} duration={2} />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">% complétion</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-1">
                  <CountUp end={Math.round(stats.userSatisfaction * 10) / 10} duration={2} />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Satisfaction</div>
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
                    placeholder="Rechercher une expérience..."
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
                      Type d'expérience
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
                      <option value="market">Marché traditionnel</option>
                      <option value="village">Village traditionnel</option>
                      <option value="ceremony">Cérémonie culturelle</option>
                      <option value="conversation">Conversation guidée</option>
                      <option value="workshop">Atelier artisanal</option>
                      <option value="museum">Musée virtuel</option>
                    </select>
                  </div>

                  {/* Language Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Langue
                    </label>
                    <select
                      value={filters.language?.[0] || ''}
                      onChange={(e) => handleFiltersChange({ 
                        ...filters, 
                        language: e.target.value ? [e.target.value] : undefined 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="">Toutes les langues</option>
                      <option value="fr">Français</option>
                      <option value="en">Anglais</option>
                      <option value="ar">Arabe</option>
                      <option value="de">Allemand</option>
                      <option value="es">Espagnol</option>
                    </select>
                  </div>

                  {/* Difficulty Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Difficulté
                    </label>
                    <select
                      value={filters.difficulty?.[0] || ''}
                      onChange={(e) => handleFiltersChange({ 
                        ...filters, 
                        difficulty: e.target.value ? [e.target.value] : undefined 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="">Tous les niveaux</option>
                      <option value="beginner">Débutant</option>
                      <option value="intermediate">Intermédiaire</option>
                      <option value="advanced">Avancé</option>
                    </select>
                  </div>

                  {/* Duration Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Durée (minutes)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.duration?.min || ''}
                        onChange={(e) => handleFiltersChange({ 
                          ...filters, 
                          duration: { 
                            min: parseInt(e.target.value) || 0, 
                            max: filters.duration?.max || 120 
                          } 
                        })}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.duration?.max || ''}
                        onChange={(e) => handleFiltersChange({ 
                          ...filters, 
                          duration: { 
                            min: filters.duration?.min || 0, 
                            max: parseInt(e.target.value) || 120 
                          } 
                        })}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
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
                          checked={filters.isFeatured || false}
                          onChange={(e) => handleFiltersChange({ 
                            ...filters, 
                            isFeatured: e.target.checked || undefined 
                          })}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          En vedette
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.hasVR || false}
                          onChange={(e) => handleFiltersChange({ 
                            ...filters, 
                            hasVR: e.target.checked || undefined 
                          })}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          Compatible VR
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
                      { id: 'overview', label: 'Aperçu', icon: EyeIcon },
                      { id: 'scenes', label: 'Toutes les expériences', icon: CameraIcon },
                      { id: 'market', label: 'Marchés', icon: GlobeAltIcon },
                      { id: 'village', label: 'Villages', icon: UsersIcon },
                      { id: 'ceremony', label: 'Cérémonies', icon: SparklesIcon },
                      { id: 'conversation', label: 'Conversations', icon: MicrophoneIcon }
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
                            Aperçu des Expériences AR/VR
                          </h2>
                          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Découvrez la richesse culturelle camerounaise à travers nos expériences immersives 
                            en réalité augmentée et virtuelle.
                          </p>
                        </div>

                        {/* Featured Scenes */}
                        {featuredScenes.length > 0 && (
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                              <StarIcon className="w-5 h-5 mr-2" />
                              Expériences en vedette
                            </h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {featuredScenes.slice(0, 6).map((scene) => {
                                const IconComponent = getSceneTypeIcon(scene.type);
                                return (
                                  <div key={scene.id} className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="p-4">
                                      <div className="flex items-center mb-3">
                                        <IconComponent className="w-8 h-8 text-primary-600 mr-3" />
                                        <div>
                                          <h4 className="font-semibold text-gray-900 dark:text-white">
                                            {scene.name}
                                          </h4>
                                          <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {getSceneTypeLabel(scene.type)}
                                          </p>
                                        </div>
                                      </div>
                                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-3">
                                        {scene.description}
                                      </p>
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(scene.difficulty)}`}>
                                            {scene.difficulty}
                                          </span>
                                          <div className="flex items-center text-xs text-gray-500">
                                            <ClockIcon className="w-3 h-3 mr-1" />
                                            <span>{scene.duration} min</span>
                                          </div>
                                        </div>
                                        <div className="flex items-center">
                                          <StarIcon className="w-4 h-4 text-yellow-500 mr-1" />
                                          <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {scene.rating.toFixed(1)}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Quick Stats */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-6">
                            <GlobeAltIcon className="w-8 h-8 text-blue-600 mb-3" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              Marchés Traditionnels
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              Explorez des marchés authentiques avec des vendeurs interactifs 
                              et des produits traditionnels.
                            </p>
                            <button
                              onClick={() => setActiveTab('market')}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              Explorer →
                            </button>
                          </div>

                          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-6">
                            <UsersIcon className="w-8 h-8 text-green-600 mb-3" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              Villages Traditionnels
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              Visitez des villages camerounais et découvrez la vie quotidienne 
                              et les traditions locales.
                            </p>
                            <button
                              onClick={() => setActiveTab('village')}
                              className="text-green-600 hover:text-green-700 text-sm font-medium"
                            >
                              Explorer →
                            </button>
                          </div>

                          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-6">
                            <SparklesIcon className="w-8 h-8 text-purple-600 mb-3" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              Cérémonies Culturelles
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              Participez à des cérémonies traditionnelles et découvrez 
                              les rites et coutumes ancestrales.
                            </p>
                            <button
                              onClick={() => setActiveTab('ceremony')}
                              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                            >
                              Explorer →
                            </button>
                          </div>

                          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-6">
                            <MicrophoneIcon className="w-8 h-8 text-orange-600 mb-3" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              Conversations Guidées
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              Dialoguez avec des locuteurs natifs dans des situations 
                              réelles de communication.
                            </p>
                            <button
                              onClick={() => setActiveTab('conversation')}
                              className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                            >
                              Explorer →
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {(activeTab === 'scenes' || activeTab === 'market' || activeTab === 'village' || activeTab === 'ceremony' || activeTab === 'conversation') && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {activeTab === 'scenes' ? 'Toutes les expériences' : getSceneTypeLabel(activeTab)} ({scenes.length})
                          </h2>
                        </div>
                        
                        {searchResults.length > 0 ? (
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {searchResults.map((result) => {
                              const IconComponent = getSceneTypeIcon(result.type);
                              return (
                                <div key={result.id} className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                  <div className="p-4">
                                    <div className="flex items-center mb-3">
                                      <IconComponent className="w-8 h-8 text-primary-600 mr-3" />
                                      <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">
                                          {result.name}
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                          {result.language} • {result.region}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between mb-3">
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(result.difficulty)}`}>
                                        {result.difficulty}
                                      </span>
                                      <div className="flex items-center text-xs text-gray-500">
                                        <ClockIcon className="w-3 h-3 mr-1" />
                                        <span>{result.duration} min</span>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center">
                                        <StarIcon className="w-4 h-4 text-yellow-500 mr-1" />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                          {result.rating.toFixed(1)}
                                        </span>
                                      </div>
                                      <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                                        Lancer →
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {scenes
                              .filter(scene => activeTab === 'scenes' || scene.type === activeTab)
                              .map((scene) => {
                                const IconComponent = getSceneTypeIcon(scene.type);
                                return (
                                  <div key={scene.id} className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="p-4">
                                      <div className="flex items-center mb-3">
                                        <IconComponent className="w-8 h-8 text-primary-600 mr-3" />
                                        <div>
                                          <h4 className="font-semibold text-gray-900 dark:text-white">
                                            {scene.name}
                                          </h4>
                                          <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {scene.language} • {scene.region}
                                          </p>
                                        </div>
                                      </div>
                                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-3">
                                        {scene.description}
                                      </p>
                                      <div className="flex items-center justify-between mb-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(scene.difficulty)}`}>
                                          {scene.difficulty}
                                        </span>
                                        <div className="flex items-center text-xs text-gray-500">
                                          <ClockIcon className="w-3 h-3 mr-1" />
                                          <span>{scene.duration} min</span>
                                        </div>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                          <StarIcon className="w-4 h-4 text-yellow-500 mr-1" />
                                          <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {scene.rating.toFixed(1)}
                                          </span>
                                        </div>
                                        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                                          Lancer →
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        )}
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

export default ARVRPage;
