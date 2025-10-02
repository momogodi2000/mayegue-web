import { useEffect } from 'react';
import { useDictionaryStore } from '../store/dictionaryStore';
import { Card, CardContent, Badge, Button, Spinner } from '@/shared/components/ui';

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

  useEffect(() => {
    loadLanguages();
    loadEntries();
  }, [loadLanguages, loadEntries]);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📖 Dictionnaire Interactif
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Recherchez parmi 10,000+ mots en 6 langues camerounaises
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-red-600 mr-2">⚠️</span>
              <span className="text-red-700">{error}</span>
            </div>
            <Button size="sm" variant="outline" onClick={clearError}>
              Fermer
            </Button>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-3xl mx-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un mot... (ex: bonjour, merci, eau)"
              className="w-full px-6 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-14"
            />
            <svg
              className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
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

          {/* Language Filters */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Button
              size="sm"
              variant={!selectedLanguage ? undefined : 'outline'}
              onClick={() => setSelectedLanguage(undefined)}
            >
              Toutes les langues
            </Button>
            {languages.map(language => (
              <Button
                key={language.id}
                size="sm"
                variant={selectedLanguage === language.id ? undefined : 'outline'}
                onClick={() => setSelectedLanguage(language.id)}
              >
                {language.name}
              </Button>
            ))}
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <Button
              size="sm"
              variant={!selectedCategory ? 'outline' : 'ghost'}
              onClick={() => setSelectedCategory(undefined)}
              className="text-xs"
            >
              Toutes catégories
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                size="sm"
                variant={selectedCategory === category ? undefined : 'ghost'}
                onClick={() => setSelectedCategory(category)}
                className="text-xs"
              >
                {getCategoryLabel(category)}
              </Button>
            ))}
          </div>
        </div>

        {/* Search History */}
        {!searchTerm && searchHistory.length > 0 && (
          <Card className="mb-8">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Recherches récentes</h3>
                <Button size="sm" variant="ghost" onClick={clearHistory}>
                  Effacer
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((term, index) => (
                  <Badge
                    key={index}
                    className="cursor-pointer hover:bg-blue-100"
                    onClick={() => setSearchTerm(term)}
                  >
                    {term}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
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
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''} trouvé{searchResults.length > 1 ? 's' : ''}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map(entry => (
                <Card
                  key={entry.id}
                  className="hover:shadow-lg transition-shadow duration-300 relative"
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
                      {isFavorite(entry.id) ? '⭐' : '☆'}
                    </Button>

                    {/* Word Header */}
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {entry.frenchText}
                        </h3>
                        <Badge size="sm" className="ml-2">
                          {getLanguageName(entry.languageId)}
                        </Badge>
                      </div>
                      
                      {entry.category && (
                        <Badge size="sm" className="bg-blue-100 text-blue-800 mb-2">
                          {getCategoryLabel(entry.category)}
                        </Badge>
                      )}
                    </div>

                    {/* Translation */}
                    <div className="mb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl font-bold text-blue-600">
                          {entry.translation}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => playPronunciation(entry.id)}
                          className="text-blue-600 hover:bg-blue-50"
                        >
                          🔊
                        </Button>
                      </div>
                      
                      {entry.pronunciation && (
                        <p className="text-sm text-gray-500 italic">
                          /{entry.pronunciation}/
                        </p>
                      )}
                    </div>

                    {/* Usage Notes */}
                    {entry.usageNotes && (
                      <p className="text-sm text-gray-600 mb-3">
                        {entry.usageNotes}
                      </p>
                    )}

                    {/* Examples */}
                    {entry.examples && entry.examples.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-sm font-semibold text-gray-700 mb-1">
                          Exemples:
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-1">
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
                            className="bg-gray-100 text-gray-600 text-xs"
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
                            ${entry.difficultyLevel === 'beginner' ? 'bg-green-100 text-green-800' : ''}
                            ${entry.difficultyLevel === 'intermediate' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${entry.difficultyLevel === 'advanced' ? 'bg-red-100 text-red-800' : ''}
                          `}
                        >
                          {entry.difficultyLevel === 'beginner' ? 'Débutant' :
                           entry.difficultyLevel === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && searchTerm && searchResults.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun résultat trouvé
            </h3>
            <p className="text-gray-600 mb-4">
              Essayez avec d'autres mots-clés ou modifiez vos filtres
            </p>
            <Button onClick={clearSearch}>
              Nouvelle recherche
            </Button>
          </div>
        )}

        {/* Welcome State */}
        {!loading && !searchTerm && searchResults.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-6">📚</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Bienvenue dans le Dictionnaire Mayegue
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Découvrez la richesse des langues camerounaises. Tapez un mot dans la barre de recherche 
              pour commencer votre exploration linguistique !
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
              {languages.map(language => (
                <Card
                  key={language.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedLanguage(language.id)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">🌍</div>
                    <h4 className="font-semibold text-gray-900">{language.name}</h4>
                    <p className="text-xs text-gray-500">
                      {language.speakers.toLocaleString()} locuteurs
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Favorites Summary */}
        {favorites.length > 0 && (
          <Card className="mt-8">
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                ⭐ Vos mots favoris ({favorites.length})
              </h3>
              <p className="text-sm text-gray-600">
                Vous avez {favorites.length} mot{favorites.length > 1 ? 's' : ''} dans vos favoris.
                Utilisez-les pour créer vos propres exercices de révision !
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}