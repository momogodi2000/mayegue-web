/**
 * Marketplace Page - Main page for Marketplace module
 * 
 * @version 1.1.0
 * @author Ma'a yegue Team
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useInView } from 'react-intersection-observer';
import { 
  ShoppingBagIcon,
  StarIcon,
  HeartIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  GlobeAltIcon,
  CalendarIcon,
  TrophyIcon,
  SparklesIcon,
  BookOpenIcon,
  CameraIcon
} from '@heroicons/react/24/outline';
import { marketplaceService } from '../services/marketplaceService';
import { 
  Product, 
  Seller, 
  PrivateLesson, 
  CulturalExperience,
  MarketplaceFilter, 
  MarketplaceStats,
  MarketplaceSearchResult
} from '../types/marketplace.types';
import { AnimatedSection } from '@/shared/components/ui/AnimatedComponents';
import { CountUp } from '@/shared/components/ui/AnimatedComponents';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/shared/components/ui/ErrorMessage';

const MarketplacePage: React.FC = () => {
  // State management
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [lessons, setLessons] = useState<PrivateLesson[]>([]);
  const [experiences, setExperiences] = useState<CulturalExperience[]>([]);
  const [stats, setStats] = useState<MarketplaceStats | null>(null);
  const [searchResults, setSearchResults] = useState<MarketplaceSearchResult[]>([]);
  const [filters, setFilters] = useState<MarketplaceFilter>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'lessons' | 'experiences' | 'sellers'>('overview');
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

      const [productsData, featuredData, sellersData, lessonsData, experiencesData, statsData] = await Promise.all([
        marketplaceService.getAllProducts(),
        marketplaceService.getFeaturedProducts(),
        marketplaceService.getTopSellers(),
        marketplaceService.getAllLessons(),
        marketplaceService.getAllExperiences(),
        marketplaceService.getMarketplaceStats()
      ]);

      setProducts(productsData);
      setFeaturedProducts(featuredData);
      setSellers(sellersData);
      setLessons(lessonsData);
      setExperiences(experiencesData);
      setStats(statsData);
    } catch (err) {
      console.error('Error loading marketplace data:', err);
      setError('Erreur lors du chargement du marketplace');
    } finally {
      setLoading(false);
    }
  };

  const loadFilteredData = async () => {
    try {
      const filteredProducts = await marketplaceService.searchProducts('', filters);
      // Convert search results back to full product objects
      const fullProducts = await Promise.all(
        filteredProducts.map(result => marketplaceService.getProductById(result.id))
      );
      setProducts(fullProducts.filter(Boolean) as Product[]);
    } catch (err) {
      console.error('Error loading filtered data:', err);
      setError('Erreur lors du filtrage des données');
    }
  };

  const performSearch = async () => {
    try {
      const results = await marketplaceService.searchProducts(searchQuery, filters);
      setSearchResults(results);
    } catch (err) {
      console.error('Error performing search:', err);
      setError('Erreur lors de la recherche');
    }
  };

  const handleFiltersChange = useCallback((newFilters: MarketplaceFilter) => {
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
            Chargement du marketplace culturel...
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
        <title>Marketplace Culturel - Ma'a yegue</title>
        <meta name="description" content="Découvrez et achetez des produits artisanaux, cours de langues, expériences culturelles et objets d'art traditionnels camerounais." />
        <meta name="keywords" content="marketplace culturel, artisanat camerounais, cours de langues, expériences culturelles, objets d'art, commerce local" />
      </Helmet>

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container-custom py-6">
          <AnimatedSection>
            <div className="text-center">
              <h1 className="heading-1 mb-4">
                Marketplace Culturel
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Découvrez et achetez des produits artisanaux, cours de langues, 
                expériences culturelles et objets d'art traditionnels camerounais.
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
              Statistiques du Marketplace
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-1">
                  <CountUp end={stats.totalProducts} duration={2} />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Produits</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-1">
                  <CountUp end={stats.totalSellers} duration={2} />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Vendeurs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-1">
                  <CountUp end={stats.totalOrders} duration={2} />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Commandes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-1">
                  <CountUp end={Math.round(stats.totalRevenue)} duration={2} />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">FCFA</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-1">
                  <CountUp end={Math.round(stats.averageOrderValue)} duration={2} />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Panier moyen</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-1">
                  <CountUp end={stats.topRegions.length} duration={2} />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Régions</div>
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
                    placeholder="Rechercher un produit..."
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
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Catégorie
                    </label>
                    <select
                      value={filters.category?.[0] || ''}
                      onChange={(e) => handleFiltersChange({ 
                        ...filters, 
                        category: e.target.value ? [e.target.value] : undefined 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="">Toutes les catégories</option>
                      <option value="artisanat">Artisanat</option>
                      <option value="cours_prives">Cours privés</option>
                      <option value="experiences_culturelles">Expériences culturelles</option>
                      <option value="livres">Livres</option>
                      <option value="objets_art">Objets d'art</option>
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

                  {/* Price Range Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fourchette de prix
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.priceRange?.min || ''}
                        onChange={(e) => handleFiltersChange({ 
                          ...filters, 
                          priceRange: { 
                            min: parseInt(e.target.value) || 0, 
                            max: filters.priceRange?.max || 100000 
                          } 
                        })}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.priceRange?.max || ''}
                        onChange={(e) => handleFiltersChange({ 
                          ...filters, 
                          priceRange: { 
                            min: filters.priceRange?.min || 0, 
                            max: parseInt(e.target.value) || 100000 
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
                          checked={filters.hasDiscount || false}
                          onChange={(e) => handleFiltersChange({ 
                            ...filters, 
                            hasDiscount: e.target.checked || undefined 
                          })}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          En promotion
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.isDigital || false}
                          onChange={(e) => handleFiltersChange({ 
                            ...filters, 
                            isDigital: e.target.checked || undefined 
                          })}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          Produits numériques
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
                      { id: 'products', label: 'Produits', icon: ShoppingBagIcon },
                      { id: 'lessons', label: 'Cours', icon: BookOpenIcon },
                      { id: 'experiences', label: 'Expériences', icon: CameraIcon },
                      { id: 'sellers', label: 'Vendeurs', icon: UserGroupIcon }
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
                            Aperçu du Marketplace Culturel
                          </h2>
                          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Découvrez la richesse du commerce culturel camerounais à travers 
                            nos catégories organisées par type et région.
                          </p>
                        </div>

                        {/* Featured Products */}
                        {featuredProducts.length > 0 && (
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                              <StarIcon className="w-5 h-5 mr-2" />
                              Produits en vedette
                            </h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {featuredProducts.slice(0, 6).map((product) => (
                                <div key={product.id} className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                  {product.images.length > 0 && (
                                    <img 
                                      src={product.images[0]} 
                                      alt={product.title}
                                      className="w-full h-48 object-cover"
                                    />
                                  )}
                                  <div className="p-4">
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                      {product.title}
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                      {product.category} • {product.region}
                                    </p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                                      {product.description}
                                    </p>
                                    <div className="flex items-center justify-between mt-3">
                                      <div className="flex items-center">
                                        <StarIcon className="w-4 h-4 text-yellow-500 mr-1" />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                          {product.averageRating.toFixed(1)}
                                        </span>
                                      </div>
                                      <div className="text-lg font-bold text-primary-600">
                                        {product.price} {product.currency}
                                      </div>
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
                            <ShoppingBagIcon className="w-8 h-8 text-blue-600 mb-3" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              Artisanat
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              {stats?.topCategories.find(c => c.category === 'artisanat')?.count || 0} produits artisanaux 
                              traditionnels et contemporains.
                            </p>
                            <button
                              onClick={() => setActiveTab('products')}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              Explorer →
                            </button>
                          </div>

                          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-6">
                            <BookOpenIcon className="w-8 h-8 text-green-600 mb-3" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              Cours Privés
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              {lessons.length} cours de langues avec des enseignants 
                              natifs certifiés.
                            </p>
                            <button
                              onClick={() => setActiveTab('lessons')}
                              className="text-green-600 hover:text-green-700 text-sm font-medium"
                            >
                              Explorer →
                            </button>
                          </div>

                          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-6">
                            <CameraIcon className="w-8 h-8 text-purple-600 mb-3" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              Expériences
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              {experiences.length} expériences culturelles immersives 
                              et authentiques.
                            </p>
                            <button
                              onClick={() => setActiveTab('experiences')}
                              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                            >
                              Explorer →
                            </button>
                          </div>

                          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-6">
                            <UserGroupIcon className="w-8 h-8 text-orange-600 mb-3" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              Vendeurs
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              {stats?.totalSellers} vendeurs certifiés et 
                              artisans locaux.
                            </p>
                            <button
                              onClick={() => setActiveTab('sellers')}
                              className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                            >
                              Explorer →
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'products' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Produits ({products.length})
                          </h2>
                        </div>
                        
                        {searchResults.length > 0 ? (
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {searchResults.map((result) => (
                              <div key={result.id} className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                {result.imageUrl && (
                                  <img 
                                    src={result.imageUrl} 
                                    alt={result.title}
                                    className="w-full h-48 object-cover"
                                  />
                                )}
                                <div className="p-4">
                                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                    {result.title}
                                  </h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    {result.category} • {result.region}
                                  </p>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                      <StarIcon className="w-4 h-4 text-yellow-500 mr-1" />
                                      <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {result.rating.toFixed(1)}
                                      </span>
                                    </div>
                                    <div className="text-lg font-bold text-primary-600">
                                      {result.price} {result.currency}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                              <div key={product.id} className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                {product.images.length > 0 && (
                                  <img 
                                    src={product.images[0]} 
                                    alt={product.title}
                                    className="w-full h-48 object-cover"
                                  />
                                )}
                                <div className="p-4">
                                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                    {product.title}
                                  </h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    {product.category} • {product.region}
                                  </p>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                      <StarIcon className="w-4 h-4 text-yellow-500 mr-1" />
                                      <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {product.averageRating.toFixed(1)}
                                      </span>
                                    </div>
                                    <div className="text-lg font-bold text-primary-600">
                                      {product.price} {product.currency}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'lessons' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Cours Privés ({lessons.length})
                          </h2>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {lessons.map((lesson) => (
                            <div key={lesson.id} className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                              <div className="p-4">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                  {lesson.title}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                  {lesson.language} • {lesson.level}
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-3">
                                  {lesson.description}
                                </p>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <StarIcon className="w-4 h-4 text-yellow-500 mr-1" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                      {lesson.averageRating.toFixed(1)}
                                    </span>
                                  </div>
                                  <div className="text-lg font-bold text-primary-600">
                                    {lesson.price} {lesson.currency}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'experiences' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Expériences Culturelles ({experiences.length})
                          </h2>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {experiences.map((experience) => (
                            <div key={experience.id} className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                              {experience.images.length > 0 && (
                                <img 
                                  src={experience.images[0]} 
                                  alt={experience.title}
                                  className="w-full h-48 object-cover"
                                />
                              )}
                              <div className="p-4">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                  {experience.title}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                  {experience.type} • {experience.region}
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-3">
                                  {experience.description}
                                </p>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <StarIcon className="w-4 h-4 text-yellow-500 mr-1" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                      {experience.averageRating.toFixed(1)}
                                    </span>
                                  </div>
                                  <div className="text-lg font-bold text-primary-600">
                                    {experience.price} {experience.currency}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'sellers' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Vendeurs ({sellers.length})
                          </h2>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {sellers.map((seller) => (
                            <div key={seller.id} className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                              <div className="p-4">
                                <div className="flex items-center mb-3">
                                  {seller.avatar && (
                                    <img 
                                      src={seller.avatar} 
                                      alt={seller.name}
                                      className="w-12 h-12 rounded-full mr-3"
                                    />
                                  )}
                                  <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">
                                      {seller.name}
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {seller.location}
                                    </p>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-3">
                                  {seller.bio}
                                </p>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <StarIcon className="w-4 h-4 text-yellow-500 mr-1" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                      {seller.rating.toFixed(1)} ({seller.totalReviews})
                                    </span>
                                  </div>
                                  <div className="text-sm text-gray-600 dark:text-gray-400">
                                    {seller.totalSales} ventes
                                  </div>
                                </div>
                              </div>
                            </div>
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
    </div>
  );
};

export default MarketplacePage;