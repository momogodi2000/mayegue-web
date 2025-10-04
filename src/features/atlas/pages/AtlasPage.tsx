/**
 * Atlas Page - Interactive Linguistic Atlas
 * 
 * This page provides an interactive map showing all 280+ Cameroonian languages
 * with filtering, search, and detailed information capabilities.
 * 
 * @version 1.1.0
 * @author Ma'a yegue Team
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useInView } from 'react-intersection-observer';
import { 
  LanguageMap, 
  LanguageFilters, 
  LanguageDetail, 
  EndangeredLanguages,
  MigrationHistory 
} from '../components';
import { atlasService } from '../services/atlasService';
import { 
  Language, 
  LanguageFamily, 
  AtlasFilters, 
  AtlasStats, 
  AtlasSettings,
  MapViewport,
  ViewMode
} from '../types/atlas.types';
import { AnimatedSection } from '@/shared/components/ui/AnimatedComponents';

const AtlasPage: React.FC = () => {
  // State management
  const [languages, setLanguages] = useState<Language[]>([]);
  const [families, setFamilies] = useState<LanguageFamily[]>([]);
  const [stats, setStats] = useState<AtlasStats | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [filters, setFilters] = useState<AtlasFilters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [viewport, setViewport] = useState<MapViewport>({
    center: [12.3547, 7.3697], // Cameroon center
    zoom: 6
  });

  // Settings
  const [settings, setSettings] = useState<AtlasSettings>({
    showEndangeredOnly: false,
    showFamilies: true,
    showMigrationPaths: false,
    showWritingSystems: true,
    clusteringEnabled: true,
    animationSpeed: 1,
    colorScheme: 'family',
    language: 'fr'
  });

  // Intersection observer for animations
  const [statsRef, statsInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [mapRef, mapInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  // Load initial data
  useEffect(() => {
    loadAtlasData();
  }, []);

  // Load data when filters change
  useEffect(() => {
    if (families.length > 0) {
      loadFilteredData();
    }
  }, [filters, families]);

  const loadAtlasData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [languagesData, familiesData, statsData] = await Promise.all([
        atlasService.getLanguages(),
        atlasService.getLanguageFamilies(),
        atlasService.getAtlasStats()
      ]);

      setLanguages(languagesData);
      setFamilies(familiesData);
      setStats(statsData);
    } catch (err) {
      console.error('Error loading atlas data:', err);
      setError('Erreur lors du chargement des données de l\'atlas');
    } finally {
      setLoading(false);
    }
  };

  const loadFilteredData = async () => {
    try {
      const [filteredLanguages, filteredStats] = await Promise.all([
        atlasService.getLanguages(filters),
        atlasService.getAtlasStats(filters)
      ]);

      setLanguages(filteredLanguages);
      setStats(filteredStats);
    } catch (err) {
      console.error('Error loading filtered data:', err);
      setError('Erreur lors du filtrage des données');
    }
  };

  const handleLanguageSelect = useCallback((language: Language) => {
    setSelectedLanguage(language);
  }, []);

  const handleLanguageDeselect = useCallback(() => {
    setSelectedLanguage(null);
  }, []);

  const handleFiltersChange = useCallback((newFilters: AtlasFilters) => {
    setFilters(newFilters);
  }, []);

  const handleViewportChange = useCallback((newViewport: MapViewport) => {
    setViewport(newViewport);
  }, []);

  const handleSettingsChange = useCallback((newSettings: AtlasSettings) => {
    setSettings(newSettings);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Chargement de l'Atlas Linguistique...
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
            onClick={loadAtlasData}
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
        <title>Atlas Linguistique Interactif - Ma'a yegue</title>
        <meta name="description" content="Explorez les 280+ langues camerounaises sur une carte interactive avec données géolocalisées, informations culturelles et historique migratoire." />
        <meta name="keywords" content="atlas linguistique, langues camerounaises, carte interactive, géolocalisation, langues en danger, UNESCO" />
      </Helmet>

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container-custom py-6">
          <AnimatedSection>
            <div className="text-center">
              <h1 className="heading-1 mb-4">
                Atlas Linguistique Interactif
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Explorez la richesse linguistique du Cameroun avec plus de 280 langues 
                représentées sur une carte interactive. Découvrez l'histoire, la culture 
                et le statut de chaque langue.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <AnimatedSection ref={statsRef} className="container-custom py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-1">
                {stats.totalLanguages.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Langues</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-1">
                {Math.round(stats.totalSpeakers / 1000000)}M
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Locuteurs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-1">
                {stats.families}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Familles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-1">
                {stats.endangered}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">En danger</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-1">
                {stats.criticallyEndangered}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Critiquement</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-1">
                {stats.regions}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Régions</div>
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Main Content */}
      <div className="container-custom py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <LanguageFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                availableFamilies={families}
                availableRegions={[
                  'Adamaoua', 'Centre', 'Est', 'Extrême-Nord', 'Littoral',
                  'Nord', 'Nord-Ouest', 'Ouest', 'Sud', 'Sud-Ouest'
                ]}
                stats={stats || {
                  totalLanguages: 0,
                  totalSpeakers: 0,
                  families: 0,
                  endangered: 0,
                  criticallyEndangered: 0,
                  extinct: 0,
                  withWritingSystems: 0,
                  regions: 0
                }}
              />
            </div>
          </div>

          {/* Map and Content */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* View Mode Toggle */}
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  {(['map', 'list', 'grid'] as ViewMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        viewMode === mode
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {mode === 'map' ? 'Carte' : mode === 'list' ? 'Liste' : 'Grille'}
                    </button>
                  ))}
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {languages.length} langues affichées
                </div>
              </div>

              {/* Map Component */}
              <AnimatedSection ref={mapRef}>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                  <LanguageMap
                    languages={languages}
                    filters={filters}
                    viewport={viewport}
                    onLanguageSelect={handleLanguageSelect}
                    onViewportChange={handleViewportChange}
                    settings={settings}
                  />
                </div>
              </AnimatedSection>

              {/* Endangered Languages Section */}
              <AnimatedSection>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Langues en Danger
                  </h2>
                  <EndangeredLanguages
                    languages={languages.filter(lang => 
                      lang.status === 'endangered' || 
                      lang.status === 'critically_endangered'
                    )}
                    onLanguageSelect={handleLanguageSelect}
                  />
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </div>

      {/* Language Detail Modal */}
      {selectedLanguage && (
        <LanguageDetail
          language={selectedLanguage}
          onClose={handleLanguageDeselect}
        />
      )}
    </div>
  );
};

export default AtlasPage;