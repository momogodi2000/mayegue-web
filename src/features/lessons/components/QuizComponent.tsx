import React, { useState, useEffect, useCallback } from 'react';
import { Exercise, ExerciseResult } from '@/shared/types/lesson.types';
import { 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  Input, 
  Badge,
  useToastActions 
} from '@/shared/components/ui';

interface QuizComponentProps {
  exercises: Exercise[];
  onComplete: (results: ExerciseResult[]) => void;
  onExerciseComplete?: (result: ExerciseResult) => void;
  allowRetry?: boolean;
  showProgress?: boolean;
  timeLimit?: number; // in seconds
  className?: string;
}

interface ExerciseState {
  currentIndex: number;
  answers: Record<string, string | string[]>;
  results: ExerciseResult[];
  isCompleted: boolean;
  timeRemaining?: number;
}

const QuizComponent: React.FC<QuizComponentProps> = ({
  exercises,
  onComplete,
  onExerciseComplete,
  allowRetry = true,
  showProgress = true,
  timeLimit,
  className
}) => {
  const { success: showSuccess, error: showError } = useToastActions();
  
  const [state, setState] = useState<ExerciseState>({
    currentIndex: 0,
    answers: {},
    results: [],
    isCompleted: false,
    timeRemaining: timeLimit
  });

  const handleQuizComplete = useCallback(() => {
    setState(prev => ({ ...prev, isCompleted: true }));
    onComplete(state.results);
  }, [state.results, onComplete]);

  // Timer effect
  useEffect(() => {
    if (timeLimit && state.timeRemaining && state.timeRemaining > 0 && !state.isCompleted) {
      const timer = setTimeout(() => {
        setState(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining! - 1
        }));
      }, 1000);

      return () => clearTimeout(timer);
    } else if (timeLimit && state.timeRemaining === 0 && !state.isCompleted) {
      handleQuizComplete();
    }
  }, [state.timeRemaining, state.isCompleted, timeLimit, handleQuizComplete]);

  const currentExercise = exercises[state.currentIndex];
  const isLastExercise = state.currentIndex === exercises.length - 1;

  const handleAnswerChange = useCallback((answer: string | string[]) => {
    setState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [currentExercise.id]: answer
      }
    }));
  }, [currentExercise.id]);

  const checkAnswer = useCallback((exercise: Exercise, userAnswer: string | string[]): boolean => {
    if (Array.isArray(exercise.correctAnswer)) {
      if (Array.isArray(userAnswer)) {
        return exercise.correctAnswer.every(answer => userAnswer.includes(answer)) &&
               userAnswer.every(answer => exercise.correctAnswer.includes(answer));
      }
      return false;
    } else {
      if (Array.isArray(userAnswer)) {
        return userAnswer.length === 1 && userAnswer[0].toLowerCase() === exercise.correctAnswer.toLowerCase();
      }
      return userAnswer.toLowerCase().trim() === exercise.correctAnswer.toLowerCase().trim();
    }
  }, []);

  const calculatePoints = useCallback((exercise: Exercise, isCorrect: boolean): number => {
    return isCorrect ? exercise.points : 0;
  }, []);

  const handleSubmitAnswer = useCallback(() => {
    const userAnswer = state.answers[currentExercise.id];
    
    if (!userAnswer || (Array.isArray(userAnswer) && userAnswer.length === 0)) {
      showError('Veuillez sélectionner une réponse avant de continuer');
      return;
    }

    const isCorrect = checkAnswer(currentExercise, userAnswer);
    const points = calculatePoints(currentExercise, isCorrect);

    const result: ExerciseResult = {
      exerciseId: currentExercise.id,
      userAnswer,
      isCorrect,
      points,
      attemptedAt: new Date()
    };

    setState(prev => ({
      ...prev,
      results: [...prev.results, result]
    }));

    onExerciseComplete?.(result);

    if (isCorrect) {
      showSuccess('Correct! Bien joué!');
    } else {
      showError(`Incorrect. La bonne réponse était: ${currentExercise.correctAnswer}`);
    }

    // Auto-advance after a delay
    setTimeout(() => {
      if (isLastExercise) {
        handleQuizComplete();
      } else {
        setState(prev => ({
          ...prev,
          currentIndex: prev.currentIndex + 1
        }));
      }
    }, 2000);
  }, [
    state.answers, 
    currentExercise, 
    checkAnswer, 
    calculatePoints, 
    onExerciseComplete, 
    isLastExercise, 
    showSuccess, 
    showError,
    handleQuizComplete
  ]);

  const handleRetry = useCallback(() => {
    setState({
      currentIndex: 0,
      answers: {},
      results: [],
      isCompleted: false,
      timeRemaining: timeLimit
    });
  }, [timeLimit]);

  const handlePrevious = useCallback(() => {
    if (state.currentIndex > 0) {
      setState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex - 1
      }));
    }
  }, [state.currentIndex]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = (): number => {
    return ((state.currentIndex + 1) / exercises.length) * 100;
  };

  if (state.isCompleted) {
    const totalPoints = state.results.reduce((sum, result) => sum + result.points, 0);
    const maxPoints = exercises.reduce((sum, exercise) => sum + exercise.points, 0);
    const percentage = Math.round((totalPoints / maxPoints) * 100);

    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-center">Quiz Terminé!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="text-6xl">
            {percentage >= 80 ? '🎉' : percentage >= 60 ? '👏' : '💪'}
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Score: {totalPoints}/{maxPoints}
            </h3>
            <p className="text-lg text-gray-600">
              {percentage}% de réussite
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="text-center">
              <p className="text-sm text-gray-500">Bonnes réponses</p>
              <p className="text-xl font-semibold text-green-600">
                {state.results.filter(r => r.isCorrect).length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-xl font-semibold text-gray-900">
                {exercises.length}
              </p>
            </div>
          </div>

          {allowRetry && (
            <Button onClick={handleRetry} variant="outline" size="lg">
              Recommencer le quiz
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            Question {state.currentIndex + 1} sur {exercises.length}
          </CardTitle>
          
          <div className="flex items-center space-x-3">
            {timeLimit && state.timeRemaining !== undefined && (
              <Badge 
                variant={state.timeRemaining < 30 ? 'danger' : 'info'}
                className="text-sm"
              >
                ⏰ {formatTime(state.timeRemaining)}
              </Badge>
            )}
            
            <Badge variant="secondary">
              {currentExercise.points} pts
            </Badge>
          </div>
        </div>
        
        {showProgress && (
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">
            {currentExercise.question}
          </h3>
          
          {currentExercise.audioUrl && (
            <div className="mb-4">
              <audio controls className="w-full">
                <source src={currentExercise.audioUrl} type="audio/mpeg" />
                Votre navigateur ne supporte pas l'élément audio.
              </audio>
            </div>
          )}
        </div>

        <ExerciseInput
          exercise={currentExercise}
          value={state.answers[currentExercise.id]}
          onChange={handleAnswerChange}
        />

        {currentExercise.explanation && state.results.find(r => r.exerciseId === currentExercise.id) && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <p className="text-sm text-blue-800">
              <strong>Explication:</strong> {currentExercise.explanation}
            </p>
          </div>
        )}

        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={state.currentIndex === 0}
          >
            Précédent
          </Button>

          <Button
            onClick={handleSubmitAnswer}
            disabled={!state.answers[currentExercise.id]}
          >
            {isLastExercise ? 'Terminer' : 'Suivant'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

interface ExerciseInputProps {
  exercise: Exercise;
  value: string | string[] | undefined;
  onChange: (value: string | string[]) => void;
}

const ExerciseInput: React.FC<ExerciseInputProps> = ({ exercise, value, onChange }) => {
  switch (exercise.type) {
    case 'multiple_choice':
      return (
        <div className="space-y-3">
          {exercise.options?.map((option, index) => (
            <label key={index} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name={`exercise-${exercise.id}`}
                value={option}
                checked={value === option}
                onChange={(e) => onChange(e.target.value)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      );

    case 'fill_blank':
      return (
        <Input
          type="text"
          placeholder="Tapez votre réponse..."
          value={value as string || ''}
          onChange={(e) => onChange(e.target.value)}
          fullWidth
        />
      );

    case 'matching':
      return (
        <div className="space-y-3">
          {exercise.options?.map((option, index) => (
            <label key={index} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                value={option}
                checked={Array.isArray(value) ? value.includes(option) : false}
                onChange={(e) => {
                  const currentValues = Array.isArray(value) ? value : [];
                  if (e.target.checked) {
                    onChange([...currentValues, option]);
                  } else {
                    onChange(currentValues.filter(v => v !== option));
                  }
                }}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      );

    case 'translation':
      return (
        <Input
          type="text"
          placeholder="Traduisez cette phrase..."
          value={value as string || ''}
          onChange={(e) => onChange(e.target.value)}
          fullWidth
        />
      );

    case 'pronunciation':
      return (
        <div className="text-center space-y-4">
          <p className="text-gray-600">
            Cliquez sur le bouton pour enregistrer votre prononciation
          </p>
          <Button variant="outline" size="lg">
            🎤 Enregistrer
          </Button>
          <p className="text-sm text-gray-500">
            Fonctionnalité de reconnaissance vocale à venir
          </p>
        </div>
      );

    default:
      return (
        <Input
          type="text"
          placeholder="Votre réponse..."
          value={value as string || ''}
          onChange={(e) => onChange(e.target.value)}
          fullWidth
        />
      );
  }
};

export { QuizComponent };