import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLessonsStore } from '../store/lessonsStore';
import { LessonPlayer } from '../components';
import { Lesson } from '@/shared/types/lesson.types';
import { 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  Input, 
  Badge, 
  Spinner,
  useToastActions 
} from '@/shared/components/ui';

type ViewMode = 'list' | 'player';

export default function LessonsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { success: showSuccess } = useToastActions();
  
  const {
    lessons,
    loading,
    error,
    fetchLessons
  } = useLessonsStore();

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  // Check URL parameters for lesson player
  useEffect(() => {
    const lessonId = searchParams.get('lesson');
    if (lessonId) {
      setSelectedLessonId(lessonId);
      setViewMode('player');
    }
  }, [searchParams]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  // Filter lessons based on search criteria
  const filteredLessons = lessons.filter((lesson) => {
    const matchesSearch = !searchQuery || 
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLanguage = !selectedLanguage || lesson.languageId === selectedLanguage;
    const matchesLevel = !selectedDifficulty || lesson.level === selectedDifficulty;
    
    return matchesSearch && matchesLanguage && matchesLevel;
  });

  const handleStartLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setViewMode('player');
    setSearchParams({ lesson: lessonId });
  };

  const handleLessonComplete = () => {
    showSuccess('Leçon terminée avec succès! Continuez votre apprentissage.');
    setViewMode('list');
    setSelectedLessonId(null);
    setSearchParams({});
  };

  const handleExitLesson = () => {
    setViewMode('list');
    setSelectedLessonId(null);
    setSearchParams({});
  };

  if (viewMode === 'player' && selectedLessonId) {
    return (
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-4xl mx-auto px-4">
          <LessonPlayer
            lessonId={selectedLessonId}
            onComplete={handleLessonComplete}
            onExit={handleExitLesson}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Leçons</h1>
              <p className="text-gray-600 mt-1">
                Apprenez les langues traditionnelles du Cameroun
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="info">
                {filteredLessons.length} leçon(s) disponible(s)
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filtres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recherche
                </label>
                <Input
                  type="text"
                  placeholder="Rechercher une leçon..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  fullWidth
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Langue
                </label>
                <select
                  value={selectedLanguage || ''}
                  onChange={(e) => setSelectedLanguage(e.target.value || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Toutes les langues</option>
                  <option value="bamileke">Bamiléké</option>
                  <option value="douala">Douala</option>
                  <option value="ewondo">Ewondo</option>
                  <option value="fulfulde">Fulfulde</option>
                  <option value="bassa">Bassa</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Niveau
                </label>
                <select
                  value={selectedDifficulty || ''}
                  onChange={(e) => setSelectedDifficulty(e.target.value || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tous les niveaux</option>
                  <option value="beginner">Débutant</option>
                  <option value="intermediate">Intermédiaire</option>
                  <option value="advanced">Avancé</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="text-center py-8">
              <div className="text-red-600 text-lg mb-2">
                ⚠️ Erreur de chargement
              </div>
              <p className="text-red-600">{error}</p>
              <Button 
                variant="outline" 
                onClick={() => fetchLessons()}
                className="mt-4"
              >
                Réessayer
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <Spinner size="lg" />
            <span className="ml-3 text-lg">Chargement des leçons...</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredLessons.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucune leçon trouvée
              </h3>
              <p className="text-gray-600 mb-6">
                Essayez d'ajuster vos filtres ou revenez plus tard pour de nouvelles leçons.
              </p>
              <Button 
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedLanguage(null);
                  setSelectedDifficulty(null);
                }}
              >
                Réinitialiser les filtres
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Lessons Grid */}
        {!loading && !error && filteredLessons.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map((lesson: Lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                onStart={() => handleStartLesson(lesson.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface LessonCardProps {
  lesson: Lesson;
  onStart: () => void;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson, onStart }) => {
  const getDifficultyColor = (level: string): string => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (level: string): string => {
    switch (level) {
      case 'beginner': return 'Débutant';
      case 'intermediate': return 'Intermédiaire';
      case 'advanced': return 'Avancé';
      default: return level;
    }
  };

  const formatEstimatedTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      {lesson.thumbnailUrl && (
        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
          <img 
            src={lesson.thumbnailUrl} 
            alt={lesson.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2">
            {lesson.title}
          </CardTitle>
          <div className="flex items-center space-x-1 ml-2">
            {lesson.audioUrl && <span className="text-blue-500">🎵</span>}
            {lesson.videoUrl && <span className="text-purple-500">🎥</span>}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="info" size="sm">
            {lesson.languageId}
          </Badge>
          <Badge 
            variant="secondary" 
            size="sm"
            className={getDifficultyColor(lesson.level)}
          >
            {getDifficultyLabel(lesson.level)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {lesson.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <span className="mr-2">⏱️</span>
            {formatEstimatedTime(lesson.estimatedDuration)}
          </div>
          
          <div className="flex items-center">
            <span className="mr-2">📝</span>
            {lesson.exercises?.length || 0} exercice(s)
          </div>
        </div>
        
        {lesson.tags && lesson.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {lesson.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" size="sm">
                {tag}
              </Badge>
            ))}
            {lesson.tags.length > 3 && (
              <Badge variant="secondary" size="sm">
                +{lesson.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm text-gray-500">
            {lesson.isFavorite && <span className="mr-1">❤️</span>}
            {lesson.isDownloaded && <span className="mr-1">📱</span>}
          </div>
          
          <Button onClick={onStart} size="sm">
            Commencer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
