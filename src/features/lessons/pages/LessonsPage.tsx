import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
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
import { AnimatedSection, FloatingCard, CountUp } from '@/shared/components/ui/AnimatedComponents';
import { VERSION_INFO } from '@/shared/constants/version';
import { 
  AcademicCapIcon,
  SparklesIcon,
  TrophyIcon,
  PlayIcon,
  ClockIcon,
  UserGroupIcon,
  StarIcon,
  ChartBarIcon,
  CogIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '@/features/auth/store/authStore';
import { paymentService } from '@/core/services/payment/payment.service';
import { geminiService } from '@/core/services/ai/geminiService';

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

  const { user } = useAuthStore();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  
  // V1.1 New State
  const [hasFullAccess, setHasFullAccess] = useState(false);
  const [adaptiveLearningEnabled, setAdaptiveLearningEnabled] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<Lesson[]>([]);
  const [learningPath, setLearningPath] = useState<any>(null);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [userProgress, setUserProgress] = useState({
    completedLessons: 0,
    totalXP: 0,
    currentLevel: 1,
    streak: 0
  });

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

  // Check user access and initialize V1.1 features
  useEffect(() => {
    const initializeV1Features = async () => {
      if (user?.id) {
        try {
          // Check access level
          const hasAccess = await paymentService.userHasAccess(user.id, 'unlimited_lessons');
          setHasFullAccess(hasAccess);
          
          // Initialize adaptive learning for premium users
          if (hasAccess) {
            setAdaptiveLearningEnabled(true);
            await loadAIRecommendations();
            await loadLearningPath();
          }
          
          // Load user progress
          await loadUserProgress();
          
        } catch (error) {
          console.error('Error initializing V1.1 features:', error);
        }
      }
    };

    initializeV1Features();
  }, [user]);

  // Load AI-powered recommendations
  const loadAIRecommendations = async () => {
    try {
      if (user?.id && hasFullAccess) {
        const level = userProgress.currentLevel === 1 ? 'beginner' : userProgress.currentLevel === 2 ? 'intermediate' : 'advanced';
        const recommendations = await geminiService.generateLearningPath(
          'visual',
          level,
          'ewo',
          ['basic-conversation', 'vocabulary']
        );

        setAiRecommendations(recommendations.lessons || []);
      }
    } catch (error) {
      console.error('Error loading AI recommendations:', error);
    }
  };

  // Load personalized learning path
  const loadLearningPath = async () => {
    try {
      if (user?.id && hasFullAccess) {
        const level = userProgress.currentLevel === 1 ? 'beginner' : userProgress.currentLevel === 2 ? 'intermediate' : 'advanced';
        const path = await geminiService.generateLearningPath(
          'visual',
          level,
          'ewo',
          ['comprehensive-learning', 'cultural-understanding']
        );

        setLearningPath(path);
      }
    } catch (error) {
      console.error('Error loading learning path:', error);
    }
  };

  // Load user progress and stats
  const loadUserProgress = async () => {
    try {
      // Mock progress data - in real app, this would come from Firebase
      setUserProgress({
        completedLessons: 12,
        totalXP: 2450,
        currentLevel: 3,
        streak: 7
      });
    } catch (error) {
      console.error('Error loading user progress:', error);
    }
  };

  // Filter lessons based on search criteria and access level
  const filteredLessons = lessons.filter((lesson) => {
    const matchesSearch = !searchQuery || 
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLanguage = !selectedLanguage || lesson.languageId === selectedLanguage;
    const matchesLevel = !selectedDifficulty || lesson.level === selectedDifficulty;
    
    // V1.1: Limit access for freemium users (only beginner lessons)
    const hasAccess = hasFullAccess || lesson.level === 'beginner';
    
    return matchesSearch && matchesLanguage && matchesLevel && hasAccess;
  });

  // Show upgrade prompt for freemium users trying to access premium content
  const premiumLessons = lessons.filter(lesson => lesson.level !== 'beginner');
  if (!hasFullAccess && premiumLessons.length > 0 && !showUpgradePrompt) {
    setShowUpgradePrompt(true);
  }

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Helmet>
        <title>Leçons Interactives V1.1 - Ma'a yegue | Apprentissage Adaptatif IA</title>
        <meta name="description" content="Apprenez les langues camerounaises avec nos leçons interactives V1.1, alimentées par l'IA Gemini et l'apprentissage adaptatif." />
      </Helmet>

      <div className="container-custom py-8">
        {/* Header */}
        <AnimatedSection className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 mb-6 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
            🆕 Version {VERSION_INFO.version} - {VERSION_INFO.name}
          </div>
          <h1 className="heading-1 mb-6">
            🎓 Leçons Interactives V1.1
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6">
            Apprenez les langues traditionnelles du Cameroun avec l'IA adaptative
            {!hasFullAccess && (
              <span className="block mt-2 text-sm text-orange-600 dark:text-orange-400">
                Accès limité - Passez à Premium pour débloquer toutes les leçons
              </span>
            )}
          </p>

          {/* V1.1 Features Banner */}
          <div className="bg-gradient-to-r from-primary-500 to-purple-600 rounded-xl p-6 text-white mb-8">
            <h2 className="text-2xl font-bold mb-4">Nouvelles Fonctionnalités V1.1</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <SparklesIcon className="w-6 h-6" />
                <span className="text-sm">IA Gemini Adaptative</span>
              </div>
              <div className="flex items-center space-x-2">
                <ChartBarIcon className="w-6 h-6" />
                <span className="text-sm">Parcours Personnalisés</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrophyIcon className="w-6 h-6" />
                <span className="text-sm">Gamification RPG</span>
              </div>
              <div className="flex items-center space-x-2">
                <CogIcon className="w-6 h-6" />
                <span className="text-sm">Apprentissage Adaptatif</span>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* User Progress Dashboard */}
        <AnimatedSection delay={200} className="mb-8">
          <div className="grid md:grid-cols-4 gap-6">
            <FloatingCard className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full mx-auto mb-4">
                <BookOpenIcon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                <CountUp end={userProgress.completedLessons} />
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Leçons terminées</p>
            </FloatingCard>

            <FloatingCard className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-full mx-auto mb-4">
                <TrophyIcon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                <CountUp end={userProgress.totalXP} />
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Points d'expérience</p>
            </FloatingCard>

            <FloatingCard className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 text-purple-600 rounded-full mx-auto mb-4">
                <StarIcon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Niveau {userProgress.currentLevel}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Niveau actuel</p>
            </FloatingCard>

            <FloatingCard className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 text-orange-600 rounded-full mx-auto mb-4">
                <ClockIcon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                <CountUp end={userProgress.streak} />
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Jours de suite</p>
            </FloatingCard>
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
                    <h3 className="text-xl font-bold">Débloquez toutes les leçons !</h3>
                    <p className="text-orange-100">Accédez à l'apprentissage adaptatif avec Premium</p>
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

        {/* AI Recommendations (Premium only) */}
        {hasFullAccess && aiRecommendations.length > 0 && (
          <AnimatedSection delay={300} className="mb-8">
            <FloatingCard className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <SparklesIcon className="w-6 h-6 text-primary-600" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Recommandations IA
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                L'IA Gemini a analysé votre progression et vous recommande ces leçons :
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {aiRecommendations.slice(0, 3).map((lesson, index) => (
                  <Card key={lesson.id} className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{lesson.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{lesson.description}</p>
                      <Button 
                        size="sm" 
                        onClick={() => handleStartLesson(lesson.id)}
                        className="w-full"
                      >
                        <PlayIcon className="w-4 h-4 mr-2" />
                        Commencer
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </FloatingCard>
          </AnimatedSection>
        )}

        {/* Learning Path (Premium only) */}
        {hasFullAccess && learningPath && (
          <AnimatedSection delay={400} className="mb-8">
            <FloatingCard className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <ChartBarIcon className="w-6 h-6 text-primary-600" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Votre Parcours d'Apprentissage
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Parcours personnalisé basé sur votre style d'apprentissage et vos objectifs.
              </p>
              <div className="bg-gradient-to-r from-primary-100 to-purple-100 dark:from-primary-900 dark:to-purple-900 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Parcours Actuel</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {learningPath.name || 'Parcours Adaptatif IA'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {learningPath.progress || 25}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Complété</div>
                  </div>
                </div>
                <div className="mt-3 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${learningPath.progress || 25}%` }}
                  ></div>
                </div>
              </div>
            </FloatingCard>
          </AnimatedSection>
        )}

        {/* Filters */}
        <AnimatedSection delay={500} className="mb-8">
          <FloatingCard className="p-6">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-gray-900 dark:text-white">Filtres</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Recherche
                  </label>
                  <Input
                    type="text"
                    placeholder="Rechercher une leçon..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    fullWidth
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Langue
                  </label>
                  <select
                    value={selectedLanguage || ''}
                    onChange={(e) => setSelectedLanguage(e.target.value || null)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Niveau
                  </label>
                  <select
                    value={selectedDifficulty || ''}
                    onChange={(e) => setSelectedDifficulty(e.target.value || null)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Tous les niveaux</option>
                    <option value="beginner">Débutant</option>
                    <option value="intermediate">Intermédiaire</option>
                    <option value="advanced">Avancé</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </FloatingCard>
        </AnimatedSection>

        {/* Error State */}
        {error && (
          <AnimatedSection className="mb-8">
            <FloatingCard className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
              <CardContent className="text-center py-8">
                <div className="text-red-600 dark:text-red-400 text-lg mb-2">
                  ⚠️ Erreur de chargement
                </div>
                <p className="text-red-600 dark:text-red-400">{error}</p>
                <Button 
                  variant="outline" 
                  onClick={() => fetchLessons()}
                  className="mt-4"
                >
                  Réessayer
                </Button>
              </CardContent>
            </FloatingCard>
          </AnimatedSection>
        )}

        {/* Loading State */}
        {loading && (
          <AnimatedSection className="flex items-center justify-center h-64">
            <div className="text-center">
              <Spinner size="lg" />
              <span className="ml-3 text-lg text-gray-600 dark:text-gray-400">Chargement des leçons...</span>
            </div>
          </AnimatedSection>
        )}

        {/* Empty State */}
        {!loading && !error && filteredLessons.length === 0 && (
          <AnimatedSection>
            <FloatingCard>
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Aucune leçon trouvée
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
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
            </FloatingCard>
          </AnimatedSection>
        )}

        {/* Lessons Grid */}
        {!loading && !error && filteredLessons.length > 0 && (
          <AnimatedSection delay={600}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLessons.map((lesson: Lesson, index: number) => (
                <FloatingCard
                  key={lesson.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 group"
                  delay={index * 100}
                  onClick={() => handleStartLesson(lesson.id)}
                >
                  <CardContent className="p-6">
                    {/* Premium Badge */}
                    {lesson.level !== 'beginner' && hasFullAccess && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                          Premium
                        </Badge>
                      </div>
                    )}

                    {/* Lock Icon for Premium Lessons */}
                    {lesson.level !== 'beginner' && !hasFullAccess && (
                      <div className="absolute top-2 right-2">
                        <div className="bg-gray-500 text-white rounded-full p-1">
                          🔒
                        </div>
                      </div>
                    )}

                    {/* Lesson Header */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {lesson.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                        {lesson.description}
                      </p>
                    </div>

                    {/* Lesson Meta */}
                    <div className="flex items-center justify-between mb-4">
                      <Badge className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                        {lesson.languageId}
                      </Badge>
                      <Badge className={`${
                        lesson.level === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        lesson.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {lesson.level === 'beginner' ? 'Débutant' :
                         lesson.level === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
                      </Badge>
                    </div>

                    {/* Lesson Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="w-4 h-4" />
                        <span>{lesson.duration || '15'} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <UserGroupIcon className="w-4 h-4" />
                        <span>{lesson.studentsCount || 0} étudiants</span>
                      </div>
                    </div>

                    {/* Start Button */}
                    <Button 
                      className="w-full group-hover:bg-primary-600 transition-colors"
                      disabled={lesson.level !== 'beginner' && !hasFullAccess}
                    >
                      <PlayIcon className="w-4 h-4 mr-2" />
                      {lesson.level !== 'beginner' && !hasFullAccess ? 'Premium requis' : 'Commencer'}
                    </Button>

                    {/* V1.1 AI Features Indicator */}
                    {hasFullAccess && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-2 text-xs text-primary-600 dark:text-primary-400">
                          <SparklesIcon className="w-3 h-3" />
                          <span>IA Adaptative activée</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </FloatingCard>
              ))}
            </div>
          </AnimatedSection>
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
