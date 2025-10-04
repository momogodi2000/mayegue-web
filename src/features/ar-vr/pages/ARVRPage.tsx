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

// Mock data for demo purposes
const getMockScenes = (): ARScene[] => {
  const now = new Date();

  return [
    {
      id: 'demo-market-1',
      name: 'Marché de Mokolo',
      description: 'Explorez le célèbre marché de Mokolo à Yaoundé, découvrez les étals colorés, négociez avec les vendeurs et apprenez le vocabulaire du commerce en langue locale.',
      type: 'market',
      category: 'cultural',
      language: 'Français',
      culturalGroup: 'Beti',
      region: 'Centre',
      difficulty: 'beginner',
      duration: 15,
      thumbnailUrl: '/images/market-mokolo.jpg',
      arContent: {} as any,
      interactions: [],
      learningObjectives: ['Vocabulaire du marché', 'Négociation', 'Culture locale'],
      prerequisites: [],
      targetAudience: ['Débutants', 'Étudiants'],
      accessibility: {} as any,
      metadata: {} as any,
      isActive: true,
      isFeatured: true,
      rating: 4.8,
      totalUsers: 1250,
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'demo-village-1',
      name: 'Village Bamiléké',
      description: 'Visitez un village traditionnel Bamiléké dans l\'Ouest du Cameroun. Découvrez l\'architecture traditionnelle, les chefferies et les coutumes ancestrales.',
      type: 'village',
      category: 'educational',
      language: 'Français',
      culturalGroup: 'Bamiléké',
      region: 'Ouest',
      difficulty: 'intermediate',
      duration: 25,
      thumbnailUrl: '/images/village-bamileke.jpg',
      arContent: {} as any,
      interactions: [],
      learningObjectives: ['Architecture traditionnelle', 'Hiérarchie sociale', 'Artisanat'],
      prerequisites: ['Niveau débutant complété'],
      targetAudience: ['Intermédiaires', 'Passionnés de culture'],
      accessibility: {} as any,
      metadata: {} as any,
      isActive: true,
      isFeatured: true,
      rating: 4.9,
      totalUsers: 980,
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'demo-ceremony-1',
      name: 'Cérémonie Ngondo',
      description: 'Participez à la cérémonie traditionnelle Ngondo du peuple Sawa. Assistez aux danses rituelles, aux offrandes à l\'eau et aux festivités culturelles.',
      type: 'ceremony',
      category: 'cultural',
      language: 'Français',
      culturalGroup: 'Sawa',
      region: 'Littoral',
      difficulty: 'advanced',
      duration: 30,
      thumbnailUrl: '/images/ceremony-ngondo.jpg',
      arContent: {} as any,
      interactions: [],
      learningObjectives: ['Rites traditionnels', 'Symbolisme culturel', 'Histoire du peuple Sawa'],
      prerequisites: ['Niveau intermédiaire complété'],
      targetAudience: ['Avancés', 'Chercheurs'],
      accessibility: {} as any,
      metadata: {} as any,
      isActive: true,
      isFeatured: true,
      rating: 4.7,
      totalUsers: 650,
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'demo-conversation-1',
      name: 'Conversation au Restaurant',
      description: 'Pratiquez vos compétences linguistiques dans un restaurant camerounais. Commandez des plats locaux, discutez avec le serveur et apprenez les expressions courantes.',
      type: 'conversation',
      category: 'educational',
      language: 'Français',
      culturalGroup: 'Multi-ethnique',
      region: 'Littoral',
      difficulty: 'beginner',
      duration: 10,
      thumbnailUrl: '/images/restaurant-conversation.jpg',
      arContent: {} as any,
      interactions: [],
      learningObjectives: ['Vocabulaire culinaire', 'Phrases de politesse', 'Expressions courantes'],
      prerequisites: [],
      targetAudience: ['Débutants', 'Touristes'],
      accessibility: {} as any,
      metadata: {} as any,
      isActive: true,
      isFeatured: true,
      rating: 4.6,
      totalUsers: 1580,
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'demo-workshop-1',
      name: 'Atelier de Poterie',
      description: 'Apprenez l\'art traditionnel de la poterie avec un artisan local. Découvrez les techniques ancestrales et créez votre propre pièce de céramique.',
      type: 'workshop',
      category: 'educational',
      language: 'Français',
      culturalGroup: 'Bamoun',
      region: 'Ouest',
      difficulty: 'intermediate',
      duration: 20,
      thumbnailUrl: '/images/pottery-workshop.jpg',
      arContent: {} as any,
      interactions: [],
      learningObjectives: ['Techniques de poterie', 'Motifs traditionnels', 'Artisanat local'],
      prerequisites: ['Intérêt pour l\'artisanat'],
      targetAudience: ['Intermédiaires', 'Artistes'],
      accessibility: {} as any,
      metadata: {} as any,
      isActive: true,
      isFeatured: false,
      rating: 4.5,
      totalUsers: 420,
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'demo-museum-1',
      name: 'Musée des Civilisations',
      description: 'Explorez un musée virtuel présentant les différentes civilisations du Cameroun. Découvrez les artefacts, les costumes traditionnels et l\'histoire de chaque peuple.',
      type: 'museum',
      category: 'educational',
      language: 'Français',
      culturalGroup: 'Multi-ethnique',
      region: 'Centre',
      difficulty: 'beginner',
      duration: 18,
      thumbnailUrl: '/images/museum-virtual.jpg',
      arContent: {} as any,
      interactions: [],
      learningObjectives: ['Histoire du Cameroun', 'Diversité culturelle', 'Patrimoine'],
      prerequisites: [],
      targetAudience: ['Tous niveaux', 'Étudiants'],
      accessibility: {} as any,
      metadata: {} as any,
      isActive: true,
      isFeatured: true,
      rating: 4.8,
      totalUsers: 1120,
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'demo-market-2',
      name: 'Marché Sandaga',
      description: 'Découvrez le marché Sandaga de Douala, le plus grand marché d\'Afrique Centrale. Explorez les différents quartiers, des textiles aux épices.',
      type: 'market',
      category: 'cultural',
      language: 'Français',
      culturalGroup: 'Sawa',
      region: 'Littoral',
      difficulty: 'intermediate',
      duration: 22,
      thumbnailUrl: '/images/market-sandaga.jpg',
      arContent: {} as any,
      interactions: [],
      learningObjectives: ['Commerce international', 'Diversité des produits', 'Négociation avancée'],
      prerequisites: ['Marché de Mokolo'],
      targetAudience: ['Intermédiaires', 'Commerçants'],
      accessibility: {} as any,
      metadata: {} as any,
      isActive: true,
      isFeatured: false,
      rating: 4.7,
      totalUsers: 890,
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'demo-village-2',
      name: 'Village Pygmée',
      description: 'Immergez-vous dans la vie d\'un village pygmée dans la forêt équatoriale. Apprenez les techniques de chasse, de cueillette et les traditions de ce peuple forestier.',
      type: 'village',
      category: 'cultural',
      language: 'Français',
      culturalGroup: 'Pygmée',
      region: 'Est',
      difficulty: 'advanced',
      duration: 28,
      thumbnailUrl: '/images/village-pygmee.jpg',
      arContent: {} as any,
      interactions: [],
      learningObjectives: ['Vie en forêt', 'Techniques de survie', 'Harmonie avec la nature'],
      prerequisites: ['Village Bamiléké'],
      targetAudience: ['Avancés', 'Anthropologues'],
      accessibility: {} as any,
      metadata: {} as any,
      isActive: true,
      isFeatured: true,
      rating: 4.9,
      totalUsers: 520,
      createdAt: now,
      updatedAt: now
    }
  ];
};

const getMockStats = (): ARStats => {
  return {
    totalScenes: 8,
    totalUsers: 7410,
    totalSessions: 15230,
    averageSessionDuration: 18.5,
    completionRate: 0.78,
    userSatisfaction: 4.7,
    topScenes: [
      { sceneId: 'demo-conversation-1', sceneName: 'Conversation au Restaurant', sessions: 3250, completionRate: 0.85, averageRating: 4.6, averageDuration: 10 },
      { sceneId: 'demo-market-1', sceneName: 'Marché de Mokolo', sessions: 2850, completionRate: 0.82, averageRating: 4.8, averageDuration: 15 },
      { sceneId: 'demo-museum-1', sceneName: 'Musée des Civilisations', sessions: 2420, completionRate: 0.75, averageRating: 4.8, averageDuration: 18 }
    ],
    topLanguages: [
      { language: 'Français', scenes: 8, sessions: 15230, completionRate: 0.78, averageRating: 4.7 },
      { language: 'Anglais', scenes: 5, sessions: 8420, completionRate: 0.72, averageRating: 4.5 },
      { language: 'Duala', scenes: 3, sessions: 4120, completionRate: 0.68, averageRating: 4.6 }
    ],
    topRegions: [
      { region: 'Littoral', scenes: 3, sessions: 6250, completionRate: 0.80, averageRating: 4.7 },
      { region: 'Centre', scenes: 2, sessions: 4820, completionRate: 0.76, averageRating: 4.8 },
      { region: 'Ouest', scenes: 2, sessions: 3180, completionRate: 0.74, averageRating: 4.7 }
    ],
    deviceStats: [
      { device: 'iOS', sessions: 7250, averagePerformance: 95, errorRate: 0.02, userSatisfaction: 4.8 },
      { device: 'Android', sessions: 6420, averagePerformance: 88, errorRate: 0.04, userSatisfaction: 4.6 },
      { device: 'Web', sessions: 1560, averagePerformance: 82, errorRate: 0.06, userSatisfaction: 4.4 }
    ],
    performanceStats: [
      { metric: 'Taux de rafraîchissement', average: 58, min: 30, max: 60, trend: 'stable' },
      { metric: 'Latence', average: 18, min: 10, max: 35, trend: 'improving' },
      { metric: 'Usage mémoire', average: 485, min: 280, max: 920, trend: 'stable' }
    ],
    lastUpdated: new Date()
  };
};

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
        arVrService.getAllScenes().catch(() => []),
        arVrService.getFeaturedScenes().catch(() => []),
        arVrService.getARStats().catch(() => null)
      ]);

      // Use mock data if no data is available
      if (scenesData.length === 0) {
        const mockScenes = getMockScenes();
        setScenes(mockScenes);
        setFeaturedScenes(mockScenes.filter(s => s.isFeatured).slice(0, 6));
        setStats(getMockStats());
      } else {
        setScenes(scenesData);
        setFeaturedScenes(featuredData);
        setStats(statsData || getMockStats());
      }
    } catch (err) {
      console.error('Error loading AR/VR data:', err);
      // Use mock data on error
      const mockScenes = getMockScenes();
      setScenes(mockScenes);
      setFeaturedScenes(mockScenes.filter(s => s.isFeatured).slice(0, 6));
      setStats(getMockStats());
    } finally {
      setLoading(false);
    }
  };

  const loadFilteredData = async () => {
    try {
      const filteredScenes = await arVrService.searchScenes('', filters).catch(() => []);

      if (filteredScenes.length === 0) {
        // Use mock data if no filtered results
        const mockScenes = getMockScenes();
        const filtered = mockScenes.filter(scene => {
          if (filters.type && filters.type.length > 0 && !filters.type.includes(scene.type)) return false;
          if (filters.difficulty && filters.difficulty.length > 0 && !filters.difficulty.includes(scene.difficulty)) return false;
          if (filters.language && filters.language.length > 0 && !filters.language.includes(scene.language)) return false;
          if (filters.isFeatured !== undefined && scene.isFeatured !== filters.isFeatured) return false;
          if (filters.duration) {
            if (scene.duration < filters.duration.min || scene.duration > filters.duration.max) return false;
          }
          return true;
        });
        setScenes(filtered);
      } else {
        // Convert search results back to full scene objects
        const fullScenes = await Promise.all(
          filteredScenes.map(result => arVrService.getSceneById(result.id).catch(() => null))
        );
        setScenes(fullScenes.filter(Boolean) as ARScene[]);
      }
    } catch (err) {
      console.error('Error loading filtered data:', err);
      // Use mock data on error
      setScenes(getMockScenes());
    }
  };

  const performSearch = async () => {
    try {
      const results = await arVrService.searchScenes(searchQuery, filters).catch(() => []);

      if (results.length === 0) {
        // Search in mock data
        const mockScenes = getMockScenes();
        const lowerQuery = searchQuery.toLowerCase();
        const filtered = mockScenes.filter(scene => {
          const matchesSearch =
            scene.name.toLowerCase().includes(lowerQuery) ||
            scene.description.toLowerCase().includes(lowerQuery) ||
            scene.culturalGroup.toLowerCase().includes(lowerQuery) ||
            scene.region.toLowerCase().includes(lowerQuery);

          if (!matchesSearch) return false;
          if (filters.type && filters.type.length > 0 && !filters.type.includes(scene.type)) return false;
          if (filters.difficulty && filters.difficulty.length > 0 && !filters.difficulty.includes(scene.difficulty)) return false;
          if (filters.language && filters.language.length > 0 && !filters.language.includes(scene.language)) return false;
          if (filters.isFeatured !== undefined && scene.isFeatured !== filters.isFeatured) return false;
          if (filters.duration) {
            if (scene.duration < filters.duration.min || scene.duration > filters.duration.max) return false;
          }
          return true;
        });

        const searchResults: ARSearchResult[] = filtered.map(scene => ({
          id: scene.id,
          name: scene.name,
          type: scene.type,
          category: scene.category,
          language: scene.language,
          culturalGroup: scene.culturalGroup,
          region: scene.region,
          difficulty: scene.difficulty,
          duration: scene.duration,
          rating: scene.rating,
          thumbnailUrl: scene.thumbnailUrl,
          relevanceScore: 0
        }));
        setSearchResults(searchResults);
      } else {
        setSearchResults(results);
      }
    } catch (err) {
      console.error('Error performing search:', err);
      // Don't set error, just return empty results
      setSearchResults([]);
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

  // Show welcome screen if no scenes and no loading
  if (!loading && scenes.length === 0 && !error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Helmet>
          <title>Système d'Immersion AR/VR - Ma'a yegue</title>
          <meta name="description" content="Explorez la culture camerounaise en réalité augmentée et virtuelle" />
        </Helmet>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-2xl px-4">
            <div className="mb-8">
              <CameraIcon className="w-24 h-24 text-primary-600 mx-auto mb-6" />
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Bienvenue dans le Système d'Immersion AR/VR
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Plongez au cœur de la culture camerounaise avec nos expériences de réalité augmentée et virtuelle.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Aucune expérience disponible pour le moment
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Les expériences AR/VR sont en cours de préparation. Revenez bientôt pour découvrir nos immersions culturelles interactives.
              </p>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div className="flex items-start">
                  <GlobeAltIcon className="w-6 h-6 text-primary-600 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Marchés Traditionnels</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Explorez des marchés authentiques en réalité virtuelle
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <UsersIcon className="w-6 h-6 text-primary-600 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Villages Traditionnels</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Visitez des villages et découvrez les traditions
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <SparklesIcon className="w-6 h-6 text-primary-600 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Cérémonies Culturelles</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Participez à des cérémonies traditionnelles
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MicrophoneIcon className="w-6 h-6 text-primary-600 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Conversations Guidées</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Dialoguez avec des locuteurs natifs
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={loadInitialData}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Actualiser la page
            </button>
          </div>
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

      {/* Demo Mode Banner */}
      {scenes.length > 0 && scenes[0]?.id.startsWith('demo-') && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
          <div className="container-custom py-3">
            <div className="flex items-center justify-center text-sm">
              <SparklesIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
              <p className="text-blue-800 dark:text-blue-300">
                <strong>Mode Démo :</strong> Vous explorez des données de démonstration. Les expériences réelles seront bientôt disponibles.
              </p>
            </div>
          </div>
        </div>
      )}

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
                            {activeTab === 'scenes' ? 'Toutes les expériences' : getSceneTypeLabel(activeTab)} ({scenes.filter(scene => activeTab === 'scenes' || scene.type === activeTab).length})
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
                        ) : scenes.filter(scene => activeTab === 'scenes' || scene.type === activeTab).length > 0 ? (
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
                        ) : (
                          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-12 text-center">
                            <CameraIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                              Aucune expérience trouvée
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                              Aucune expérience ne correspond à vos critères de recherche. Essayez de modifier vos filtres.
                            </p>
                            <button
                              onClick={() => {
                                setFilters({});
                                setSearchQuery('');
                              }}
                              className="text-primary-600 hover:text-primary-700 font-medium"
                            >
                              Réinitialiser les filtres
                            </button>
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
