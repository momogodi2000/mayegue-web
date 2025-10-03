import React, { useState, useEffect, useCallback } from 'react';
import { Lesson, ContentBlock as LessonContent, ExerciseResult } from '@/shared/types/lesson.types';
import { QuizComponent } from './QuizComponent';
import { useLessonsStore } from '../store/lessonsStore';
import { 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  Badge,
  Spinner,
  useToastActions 
} from '@/shared/components/ui';

interface LessonPlayerProps {
  lessonId: string;
  onComplete: () => void;
  onExit: () => void;
  className?: string;
}

type ContentStep = 'content' | 'exercises' | 'completed';

interface PlayerState {
  currentStep: ContentStep;
  currentContentIndex: number;
  lessonStartTime: Date;
  exerciseResults: ExerciseResult[];
  isCompleted: boolean;
}

const LessonPlayer: React.FC<LessonPlayerProps> = ({
  lessonId,
  onComplete,
  onExit,
  className
}) => {
  const { success: showSuccess, error: showError } = useToastActions();
  const {
    currentLesson,
    loading: isLoading,
    fetchLessonById,
    updateProgress: updateLessonProgress,
    submitExerciseResult: recordExerciseResult
  } = useLessonsStore();

  const [state, setState] = useState<PlayerState>({
    currentStep: 'content',
    currentContentIndex: 0,
    lessonStartTime: new Date(),
    exerciseResults: [],
    isCompleted: false
  });

  useEffect(() => {
    if (lessonId) {
      fetchLessonById(lessonId);
    }
  }, [lessonId, fetchLessonById]);

  const handleLessonComplete = useCallback(async () => {
    if (!currentLesson) return;

    const completionTime = new Date();
    const timeSpent = Math.round((completionTime.getTime() - state.lessonStartTime.getTime()) / 1000);
    
    const totalExercises = currentLesson.exercises?.length || 0;
    const correctAnswers = state.exerciseResults.filter(r => r.isCorrect).length;
    const score = totalExercises > 0 ? Math.round((correctAnswers / totalExercises) * 100) : 100;

    try {
      await updateLessonProgress({
        completed: true,
        score,
        timeSpent,
        completedAt: completionTime,
        exerciseResults: state.exerciseResults
      });

      setState(prev => ({ ...prev, isCompleted: true }));
      showSuccess('Leçon terminée avec succès!');
      onComplete();
    } catch (error) {
      showError('Erreur lors de la sauvegarde du progrès');
      console.error('Error updating lesson progress:', error);
    }
  }, [
    currentLesson,
    state.lessonStartTime,
    state.exerciseResults,
    updateLessonProgress,
    onComplete,
    showSuccess,
    showError
  ]);

  const handleContentNext = useCallback(() => {
    if (!currentLesson) return;

    const nextIndex = state.currentContentIndex + 1;
    
    if (nextIndex >= currentLesson.content.length) {
      // Move to exercises if available
      if (currentLesson.exercises && currentLesson.exercises.length > 0) {
        setState(prev => ({ ...prev, currentStep: 'exercises' }));
      } else {
        handleLessonComplete();
      }
    } else {
      setState(prev => ({ ...prev, currentContentIndex: nextIndex }));
    }
  }, [currentLesson, state.currentContentIndex, handleLessonComplete]);

  const handleContentPrevious = useCallback(() => {
    if (state.currentContentIndex > 0) {
      setState(prev => ({ 
        ...prev, 
        currentContentIndex: prev.currentContentIndex - 1 
      }));
    }
  }, [state.currentContentIndex]);

  const handleExerciseComplete = useCallback((result: ExerciseResult) => {
    setState(prev => ({
      ...prev,
      exerciseResults: [...prev.exerciseResults, result]
    }));
    
    recordExerciseResult(result);
  }, [recordExerciseResult]);

  const handleQuizComplete = useCallback((results: ExerciseResult[]) => {
    setState(prev => ({
      ...prev,
      exerciseResults: results,
      currentStep: 'completed'
    }));
    
    handleLessonComplete();
  }, [handleLessonComplete]);

  const getProgressPercentage = (): number => {
    if (!currentLesson) return 0;
    
    const totalSteps = currentLesson.content.length + (currentLesson.exercises?.length ? 1 : 0);
    let currentStepNumber = 0;

    if (state.currentStep === 'content') {
      currentStepNumber = state.currentContentIndex + 1;
    } else if (state.currentStep === 'exercises') {
      currentStepNumber = currentLesson.content.length + 1;
    } else {
      currentStepNumber = totalSteps;
    }

    return (currentStepNumber / totalSteps) * 100;
  };

  const formatEstimatedTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
        <span className="ml-3 text-lg">Chargement de la leçon...</span>
      </div>
    );
  }

  if (!currentLesson) {
    return (
      <Card className={className}>
        <CardContent className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Leçon introuvable
          </h3>
          <p className="text-gray-600 mb-6">
            La leçon demandée n'a pas pu être chargée.
          </p>
          <Button onClick={onExit} variant="outline">
            Retour aux leçons
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{currentLesson.title}</CardTitle>
              <p className="text-gray-600 mt-1">{currentLesson.description}</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge variant="info">
                {currentLesson.languageId}
              </Badge>
              <Badge variant="secondary">
                {currentLesson.level}
              </Badge>
              <Badge outlined>
                ⏱️ {formatEstimatedTime(currentLesson.estimatedDuration)}
              </Badge>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
          
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>Progression</span>
            <span>{Math.round(getProgressPercentage())}%</span>
          </div>
        </CardHeader>
      </Card>

      {/* Content Step */}
      {state.currentStep === 'content' && (
        <ContentDisplay
          content={currentLesson.content[state.currentContentIndex]}
          currentIndex={state.currentContentIndex}
          totalCount={currentLesson.content.length}
          onNext={handleContentNext}
          onPrevious={handleContentPrevious}
          onExit={onExit}
        />
      )}

      {/* Exercises Step */}
      {state.currentStep === 'exercises' && currentLesson.exercises && (
        <QuizComponent
          exercises={currentLesson.exercises}
          onComplete={handleQuizComplete}
          onExerciseComplete={handleExerciseComplete}
          showProgress={true}
          allowRetry={false}
        />
      )}

      {/* Completion Step */}
      {state.currentStep === 'completed' && (
        <LessonCompletionCard
          lesson={currentLesson}
          results={state.exerciseResults}
          timeSpent={Math.round((new Date().getTime() - state.lessonStartTime.getTime()) / 1000)}
          onContinue={onComplete}
        />
      )}
    </div>
  );
};

interface ContentDisplayProps {
  content: LessonContent;
  currentIndex: number;
  totalCount: number;
  onNext: () => void;
  onPrevious: () => void;
  onExit: () => void;
}

const ContentDisplay: React.FC<ContentDisplayProps> = ({
  content,
  currentIndex,
  totalCount,
  onNext,
  onPrevious,
  onExit
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Contenu {content.order + 1}</CardTitle>
          <Badge variant="default" outlined>
            {currentIndex + 1} / {totalCount}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {content.content && (
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">
              {content.content}
            </p>
          </div>
        )}

        {content.mediaUrl && content.type === 'audio' && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              🎵 Audio de la leçon
            </h4>
            <audio controls className="w-full">
              <source src={content.mediaUrl} type="audio/mpeg" />
              Votre navigateur ne supporte pas l'élément audio.
            </audio>
          </div>
        )}

        {content.mediaUrl && content.type === 'image' && (
          <div className="text-center">
            <img 
              src={content.mediaUrl} 
              alt={`Contenu ${content.order + 1}`}
              className="max-w-full h-auto rounded-lg shadow-md mx-auto"
            />
          </div>
        )}

        {content.metadata?.vocabulary && content.metadata.vocabulary.length > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-700 mb-3">
              📚 Vocabulaire clé
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {content.metadata.vocabulary.map((item: any, index: number) => (
                <div key={index} className="bg-white p-3 rounded border">
                  <div className="font-medium text-gray-900">{item.word}</div>
                  <div className="text-sm text-gray-600">{item.translation}</div>
                  {item.pronunciation && (
                    <div className="text-xs text-blue-600 italic">
                      [{item.pronunciation}]
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-4">
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onExit}>
              Quitter
            </Button>
            {currentIndex > 0 && (
              <Button variant="outline" onClick={onPrevious}>
                Précédent
              </Button>
            )}
          </div>
          
          <Button onClick={onNext}>
            {currentIndex === totalCount - 1 ? 'Continuer aux exercices' : 'Suivant'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

interface LessonCompletionCardProps {
  lesson: Lesson;
  results: ExerciseResult[];
  timeSpent: number;
  onContinue: () => void;
}

const LessonCompletionCard: React.FC<LessonCompletionCardProps> = ({
  lesson,
  results,
  timeSpent,
  onContinue
}) => {
  const correctAnswers = results.filter(r => r.isCorrect).length;
  const totalQuestions = results.length;
  const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 100;

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-2xl">
          🎉 Leçon terminée!
        </CardTitle>
      </CardHeader>
      
      <CardContent className="text-center space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {lesson.title}
          </h3>
          <p className="text-gray-600">
            Félicitations! Vous avez terminé cette leçon.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-md mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{score}%</div>
            <div className="text-sm text-gray-500">Score</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {correctAnswers}/{totalQuestions}
            </div>
            <div className="text-sm text-gray-500">Bonnes réponses</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {formatTime(timeSpent)}
            </div>
            <div className="text-sm text-gray-500">Temps</div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button onClick={onContinue} size="lg">
            Continuer l'apprentissage
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { LessonPlayer };