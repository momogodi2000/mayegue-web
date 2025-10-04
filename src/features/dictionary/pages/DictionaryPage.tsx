import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDictionaryStore } from '../store/dictionaryStore';
import { Card, CardContent, Badge, Button, Spinner } from '@/shared/components/ui';
import { AnimatedSection, FloatingCard, CountUp } from '@/shared/components/ui/AnimatedComponents';
import { VERSION_INFO } from '@/shared/constants/version';
import { 
  MagnifyingGlassIcon, 
  SpeakerWaveIcon, 
  HeartIcon, 
  StarIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  SparklesIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '@/features/auth/store/authStore';
import { paymentService } from '@/core/services/payment/payment.service';

export default function DictionaryPage() {
  const {
    searchTerm,
    selectedLanguage,
    selectedCategory,
    loading,
    error,
    searchResults,
    languages,
    favorites,
    searchHistory,
    setSearchTerm,
    setSelectedLanguage,
    setSelectedCategory,
    loadEntries,
    loadLanguages,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    playPronunciation,
    clearSearch,
    clearError,
    clearHistory
  } = useDictionaryStore();

  const { user } = useAuthStore();
  const [hasFullAccess, setHasFullAccess] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  useEffect(() => {
    loadLanguages();
    loadEntries();
  }, [loadLanguages, loadEntries]);

  // Check user access level
  useEffect(() => {
    const checkAccess = async () => {
      if (user?.id) {
        try {
          const hasAccess = await paymentService.userHasAccess(user.id, 'full_dictionary');
          setHasFullAccess(hasAccess);
          
          // Set word count based on access level
          setWordCount(hasAccess ? 15000 : 1000);
          
          // Show upgrade prompt for freemium users
          if (!hasAccess && searchResults.length > 1000) {
            setShowUpgradePrompt(true);
          }
        } catch (error) {
          console.error('Error checking user access:', error);
          setHasFullAccess(false);
          setWordCount(1000);
        }
      } else {
        setHasFullAccess(false);
        setWordCount(1000);
      }
    };

    checkAccess();
  }, [user, searchResults.length]);

  const getLanguageName = (languageId: string) => {
    const language = languages.find(l => l.id === languageId);
    return language?.name || languageId;
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      greetings: 'Salutations',
      numbers: 'Nombres',
      family: 'Famille',
      food: 'Nourriture',
      body: 'Corps',
      time: 'Temps',
      colors: 'Couleurs',
      animals: 'Animaux',
      verbs: 'Verbes',
      adjectives: 'Adjectifs',
      phrases: 'Phrases',
      clothing: 'Vêtements',
      home: 'Maison',
      professions: 'Professions',
      transportation: 'Transport',
      emotions: 'Émotions',
      nature: 'Nature',
      education: 'Éducation',
      health: 'Santé',
      money: 'Argent',
      directions: 'Directions',
      religion: 'Religion',
      music: 'Musique',
      sports: 'Sports'
    };
    return labels[category] || category;
  };

  const categories = [
    'greetings', 'numbers', 'family', 'food', 'body', 'time', 'colors', 
    'animals', 'verbs', 'adjectives', 'phrases', 'clothing', 'home'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Helmet>
        <title>Dictionnaire Interactif V1.1 - Ma'a yegue | {wordCount.toLocaleString()}+ mots</title>
        <meta name="description" content={`Découvrez plus de ${wordCount.toLocaleString()} mots en ${languages.length} langues camerounaises avec notre dictionnaire interactif V1.1.`} />
      </Helmet>

      <div className="container-custom py-8">
        {/* Header */}
        <AnimatedSection className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 mb-6 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
            🆕 Version {VERSION_INFO.version} - {VERSION_INFO.name}
          </div>
          <h1 className="heading-1 mb-6">
            📖 Dictionnaire Interactif V1.1
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6">
            Recherchez parmi <CountUp end={wordCount} /> mots en {languages.length} langues camerounaises
            {!hasFullAccess && (
              <span className="block mt-2 text-sm text-orange-600 dark:text-orange-400">
                Accès limité - Passez à Premium pour débloquer tous les mots
              </span>
            )}
          </p>

          {/* V1.1 Features Banner */}
          <div className="bg-gradient-to-r from-primary-500 to-purple-600 rounded-xl p-6 text-white mb-8">
            <h2 className="text-2xl font-bold mb-4">Nouvelles Fonctionnalités V1.1</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <GlobeAltIcon className="w-6 h-6" />
                <span className="text-sm">Atlas Linguistique</span>
              </div>
              <div className="flex items-center space-x-2">
                <SparklesIcon className="w-6 h-6" />
                <span className="text-sm">IA Gemini</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrophyIcon className="w-6 h-6" />
                <span className="text-sm">Gamification</span>
              </div>
              <div className="flex items-center space-x-2">
                <AcademicCapIcon className="w-6 h-6" />
                <span className="text-sm">Apprentissage Adaptatif</span>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Upgrade Prompt for Freemium Users */}
        {showUpgradePrompt && !hasFullAccess && (
          <AnimatedSection className="mb-8">
            <FloatingCard className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-white bg-opacity-20 rounded-full p-3">
                    <StarIcon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Débloquez tous les mots !</h3>
                    <p className="text-orange-100">Accédez à plus de 15,000 mots avec Premium</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    className="border-white text-white hover:bg-white hover:text-orange-500"
                    onClick={() => setShowUpgradePrompt(false)}
                  >
                    Plus tard
                  </Button>
                  <Button 
                    className="bg-white text-orange-500 hover:bg-orange-50"
                    onClick={() => window.location.href = '/pricing'}
                  >
                    Passer à Premium
                  </Button>
                </div>
              </div>
            </FloatingCard>
          </AnimatedSection>
        )}

        {/* Error Message */}
        {error && (
          <AnimatedSection className="mb-6">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-red-600 dark:text-red-400 mr-2">⚠️</span>
                <span className="text-red-700 dark:text-red-300">{error}</span>
              </div>
              <Button size="sm" variant="outline" onClick={clearError}>
                Fermer
              </Button>
            </div>
          </AnimatedSection>
        )}

        {/* Search Bar */}
        <AnimatedSection delay={200} className="mb-8">
          <div className="relative max-w-3xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher un mot... (ex: bonjour, merci, eau)"
                className="w-full px-6 py-4 text-lg border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent pl-14 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <MagnifyingGlassIcon className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
              {searchTerm && (
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={clearSearch}
                >
                  Effacer
                </Button>
              )}
            </div>
            
            {/* AI Search Suggestion */}
            {hasFullAccess && searchTerm && (
              <div className="mt-2 text-sm text-primary-600 dark:text-primary-400">
                💡 Astuce IA: Essayez aussi "{searchTerm} en contexte" ou "synonymes de {searchTerm}"
              </div>
            )}
          </div>

          {/* Language Filters */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Button
              size="sm"
              variant={!selectedLanguage ? undefined : 'outline'}
              onClick={() => setSelectedLanguage(undefined)}
              className="dark:bg-gray-700 dark:text-white"
            >
              Toutes les langues
            </Button>
            {languages.map(language => (
              <Button
                key={language.id}
                size="sm"
                variant={selectedLanguage === language.id ? undefined : 'outline'}
                onClick={() => setSelectedLanguage(language.id)}
                className="dark:bg-gray-700 dark:text-white"
              >
                {language.name}
              </Button>
            ))}
            {hasFullAccess && (
              <Button
                size="sm"
                variant="outline"
                className="border-primary-500 text-primary-600 dark:text-primary-400"
                onClick={() => window.location.href = '/atlas'}
              >
                🌍 Atlas Linguistique
              </Button>
            )}
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <Button
              size="sm"
              variant={!selectedCategory ? 'outline' : 'ghost'}
              onClick={() => setSelectedCategory(undefined)}
              className="text-xs dark:bg-gray-700 dark:text-white"
            >
              Toutes catégories
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                size="sm"
                variant={selectedCategory === category ? undefined : 'ghost'}
                onClick={() => setSelectedCategory(category)}
                className="text-xs dark:bg-gray-700 dark:text-white"
              >
                {getCategoryLabel(category)}
              </Button>
            ))}
          </div>
        </AnimatedSection>

        {/* Search History */}
        {!searchTerm && searchHistory.length > 0 && (
          <AnimatedSection delay={300} className="mb-8">
            <FloatingCard className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Recherches récentes</h3>
                <Button size="sm" variant="ghost" onClick={clearHistory}>
                  Effacer
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((term, index) => (
                  <Badge
                    key={index}
                    className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 dark:bg-gray-700 dark:text-white"
                    onClick={() => setSearchTerm(term)}
                  >
                    {term}
                  </Badge>
                ))}
              </div>
            </FloatingCard>
          </AnimatedSection>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-600">Recherche en cours...</p>
          </div>
        )}

        {/* Search Results */}
        {!loading && searchResults.length > 0 && (
          <AnimatedSection delay={400} className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''} trouvé{searchResults.length > 1 ? 's' : ''}
              </h2>
              {hasFullAccess && (
                <div className="flex items-center space-x-2 text-sm text-primary-600 dark:text-primary-400">
                  <SparklesIcon className="w-4 h-4" />
                  <span>IA Gemini activée</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((entry, index) => (
                <FloatingCard
                  key={entry.id}
                  className="hover:shadow-lg transition-all duration-300 relative group"
                  delay={index * 100}
                >
                  <CardContent className="p-6">
                    {/* Favorite Button */}
                    <Button
                      size="sm"
                      variant="ghost"
                      className={`absolute top-2 right-2 ${
                        isFavorite(entry.id) ? 'text-yellow-500' : 'text-gray-400'
                      }`}
                      onClick={() => 
                        isFavorite(entry.id) 
                          ? removeFromFavorites(entry.id)
                          : addToFavorites(entry.id)
                      }
                    >
                      <HeartIcon className={`w-5 h-5 ${isFavorite(entry.id) ? 'fill-current' : ''}`} />
                    </Button>

                    {/* V1.1 Premium Badge */}
                    {hasFullAccess && entry.difficultyLevel === 'advanced' && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                          Premium
                        </Badge>
                      </div>
                    )}

                    {/* Word Header */}
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {entry.frenchText}
                        </h3>
                        <Badge size="sm" className="ml-2 bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                          {getLanguageName(entry.languageId)}
                        </Badge>
                      </div>
                      
                      {entry.category && (
                        <Badge size="sm" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mb-2">
                          {getCategoryLabel(entry.category)}
                        </Badge>
                      )}
                    </div>

                    {/* Translation */}
                    <div className="mb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                          {entry.translation}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => playPronunciation(entry.id)}
                          className="text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900"
                        >
                          <SpeakerWaveIcon className="w-5 h-5" />
                        </Button>
                      </div>
                      
                      {entry.pronunciation && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                          /{entry.pronunciation}/
                        </p>
                      )}
                    </div>

                    {/* Usage Notes */}
                    {entry.usageNotes && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {entry.usageNotes}
                      </p>
                    )}

                    {/* Examples */}
                    {entry.examples && entry.examples.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                          Exemples:
                        </h4>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          {entry.examples.slice(0, 2).map((example, index) => (
                            <li key={index} className="italic">
                              • {example}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Tags */}
                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {entry.tags.slice(0, 3).map((tag, index) => (
                          <Badge
                            key={index}
                            size="sm"
                            className="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Difficulty Level */}
                    {entry.difficultyLevel && (
                      <div className="mt-3">
                        <Badge
                          size="sm"
                          className={`
                            ${entry.difficultyLevel === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}
                            ${entry.difficultyLevel === 'intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : ''}
                            ${entry.difficultyLevel === 'advanced' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : ''}
                          `}
                        >
                          {entry.difficultyLevel === 'beginner' ? 'Débutant' :
                           entry.difficultyLevel === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
                        </Badge>
                      </div>
                    )}

                    {/* V1.1 AI Context (Premium only) */}
                    {hasFullAccess && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-2 text-xs text-primary-600 dark:text-primary-400">
                          <SparklesIcon className="w-3 h-3" />
                          <span>Contexte IA disponible</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </FloatingCard>
              ))}
            </div>
          </AnimatedSection>
        )}

        {/* No Results */}
        {!loading && searchTerm && searchResults.length === 0 && (
          <AnimatedSection className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Aucun résultat trouvé
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Essayez avec d'autres mots-clés ou modifiez vos filtres
            </p>
            {hasFullAccess && (
              <p className="text-sm text-primary-600 dark:text-primary-400 mb-4">
                💡 Astuce IA: Essayez des synonymes ou des variantes du mot recherché
              </p>
            )}
            <Button onClick={clearSearch}>
              Nouvelle recherche
            </Button>
          </AnimatedSection>
        )}

        {/* Welcome State */}
        {!loading && !searchTerm && searchResults.length === 0 && (
          <AnimatedSection className="text-center py-12">
            <div className="text-6xl mb-6">📚</div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Bienvenue dans le Dictionnaire Ma'a yegue V1.1
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
              Découvrez la richesse des langues camerounaises. Tapez un mot dans la barre de recherche 
              pour commencer votre exploration linguistique !
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
              {languages.map(language => (
                <FloatingCard
                  key={language.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-300"
                  onClick={() => setSelectedLanguage(language.id)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">🌍</div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{language.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {language.speakers.toLocaleString()} locuteurs
                    </p>
                  </CardContent>
                </FloatingCard>
              ))}
            </div>

            {/* V1.1 Quick Actions */}
            <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <FloatingCard className="p-6 text-center cursor-pointer" onClick={() => window.location.href = '/atlas'}>
                <GlobeAltIcon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Atlas Linguistique</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Explorez 280+ langues sur la carte</p>
              </FloatingCard>
              
              <FloatingCard className="p-6 text-center cursor-pointer" onClick={() => window.location.href = '/encyclopedia'}>
                <SparklesIcon className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Encyclopédie Culturelle</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Découvrez traditions et culture</p>
              </FloatingCard>
              
              <FloatingCard className="p-6 text-center cursor-pointer" onClick={() => window.location.href = '/lessons'}>
                <AcademicCapIcon className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Leçons Interactives</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Apprenez avec l'IA adaptative</p>
              </FloatingCard>
            </div>
          </AnimatedSection>
        )}

        {/* Favorites Summary */}
        {favorites.length > 0 && (
          <AnimatedSection className="mt-8">
            <FloatingCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    ⭐ Vos mots favoris ({favorites.length})
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Vous avez {favorites.length} mot{favorites.length > 1 ? 's' : ''} dans vos favoris.
                    Utilisez-les pour créer vos propres exercices de révision !
                  </p>
                </div>
                {hasFullAccess && (
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.href = '/lessons?source=favorites'}
                  >
                    Créer une leçon
                  </Button>
                )}
              </div>
            </FloatingCard>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}