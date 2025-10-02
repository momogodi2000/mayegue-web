import React, { useState, useCallback, useEffect } from 'react';
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

interface VocabularyItem {
  word: string;
  translation: string;
  pronunciation?: string;
}

interface VocabularyExerciseProps {
  vocabulary: VocabularyItem[];
  exerciseType: 'flashcard' | 'matching' | 'fill_blank' | 'pronunciation';
  onComplete: (score: number) => void;
  timeLimit?: number;
  className?: string;
}

interface ExerciseState {
  currentIndex: number;
  score: number;
  answers: Record<string, string>;
  showAnswer: boolean;
  isCompleted: boolean;
  timeRemaining?: number;
  shuffledItems: VocabularyItem[];
}

const VocabularyExercise: React.FC<VocabularyExerciseProps> = ({
  vocabulary,
  exerciseType,
  onComplete,
  timeLimit,
  className
}) => {
  const { success: showSuccess, error: showError } = useToastActions();

  const [state, setState] = useState<ExerciseState>(() => ({
    currentIndex: 0,
    score: 0,
    answers: {},
    showAnswer: false,
    isCompleted: false,
    timeRemaining: timeLimit,
    shuffledItems: [...vocabulary].sort(() => Math.random() - 0.5)
  }));

  const handleComplete = useCallback(() => {
    const finalScore = Math.round((state.score / vocabulary.length) * 100);
    setState(prev => ({ ...prev, isCompleted: true }));
    onComplete(finalScore);
  }, [state.score, vocabulary.length, onComplete]);

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
      handleComplete();
    }
  }, [state.timeRemaining, state.isCompleted, timeLimit, handleComplete]);

  const currentItem = state.shuffledItems[state.currentIndex];

  const handleNext = useCallback(() => {
    if (state.currentIndex === state.shuffledItems.length - 1) {
      handleComplete();
    } else {
      setState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
        showAnswer: false
      }));
    }
  }, [state.currentIndex, state.shuffledItems.length, handleComplete]);

  const handleCorrect = useCallback(() => {
    setState(prev => ({
      ...prev,
      score: prev.score + 1,
      showAnswer: true
    }));
    showSuccess('Correct!');
    setTimeout(handleNext, 1500);
  }, [handleNext, showSuccess]);

  const handleIncorrect = useCallback(() => {
    setState(prev => ({ ...prev, showAnswer: true }));
    showError('Incorrect. Voyez la bonne réponse.');
    setTimeout(handleNext, 2000);
  }, [handleNext, showError]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = (): number => {
    return ((state.currentIndex + 1) / state.shuffledItems.length) * 100;
  };

  if (state.isCompleted) {
    const percentage = Math.round((state.score / vocabulary.length) * 100);
    
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-center">Exercice de vocabulaire terminé!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="text-6xl">
            {percentage >= 80 ? '🌟' : percentage >= 60 ? '👍' : '📚'}
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Score: {state.score}/{vocabulary.length}
            </h3>
            <p className="text-lg text-gray-600">
              {percentage}% de réussite
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="text-center">
              <p className="text-sm text-gray-500">Mots appris</p>
              <p className="text-xl font-semibold text-green-600">
                {state.score}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Vocabulaire total</p>
              <p className="text-xl font-semibold text-gray-900">
                {vocabulary.length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            Vocabulaire {state.currentIndex + 1}/{state.shuffledItems.length}
          </CardTitle>
          
          <div className="flex items-center space-x-3">
            {timeLimit && state.timeRemaining !== undefined && (
              <Badge variant={state.timeRemaining < 30 ? 'danger' : 'info'}>
                ⏰ {formatTime(state.timeRemaining)}
              </Badge>
            )}
            
            <Badge variant="secondary">
              Score: {state.score}
            </Badge>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {exerciseType === 'flashcard' && (
          <FlashcardExercise
            item={currentItem}
            showAnswer={state.showAnswer}
            onCorrect={handleCorrect}
            onIncorrect={handleIncorrect}
          />
        )}

        {exerciseType === 'fill_blank' && (
          <FillBlankExercise
            item={currentItem}
            onAnswer={(isCorrect) => isCorrect ? handleCorrect() : handleIncorrect()}
          />
        )}

        {exerciseType === 'matching' && (
          <MatchingExercise
            items={state.shuffledItems}
            onAnswer={(isCorrect) => isCorrect ? handleCorrect() : handleIncorrect()}
          />
        )}

        {exerciseType === 'pronunciation' && (
          <PronunciationExercise
            item={currentItem}
            onAnswer={(isCorrect) => isCorrect ? handleCorrect() : handleIncorrect()}
          />
        )}
      </CardContent>
    </Card>
  );
};

interface FlashcardExerciseProps {
  item: VocabularyItem;
  showAnswer: boolean;
  onCorrect: () => void;
  onIncorrect: () => void;
}

const FlashcardExercise: React.FC<FlashcardExerciseProps> = ({
  item,
  showAnswer,
  onCorrect,
  onIncorrect
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="space-y-6">
      <div 
        className={`relative w-full h-64 cursor-pointer transition-transform duration-500 ${
          isFlipped ? 'transform rotate-y-180' : ''
        }`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className="absolute inset-0 bg-blue-50 border-2 border-blue-200 rounded-lg flex items-center justify-center p-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-blue-900 mb-2">
              {isFlipped ? item.translation : item.word}
            </h3>
            {isFlipped && item.pronunciation && (
              <p className="text-lg text-blue-600 italic">
                [{item.pronunciation}]
              </p>
            )}
            {!isFlipped && (
              <p className="text-gray-600 mt-4">
                Cliquez pour voir la traduction
              </p>
            )}
          </div>
        </div>
      </div>

      {showAnswer ? (
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-4">
            <strong>{item.word}</strong> = {item.translation}
          </p>
          {item.pronunciation && (
            <p className="text-blue-600 italic mb-4">
              Prononciation: [{item.pronunciation}]
            </p>
          )}
        </div>
      ) : (
        <div className="flex justify-center space-x-4">
          <Button 
            variant="outline" 
            onClick={onIncorrect}
            className="border-red-200 text-red-700 hover:bg-red-50"
          >
            ❌ Difficile
          </Button>
          <Button 
            onClick={onCorrect}
            className="bg-green-600 hover:bg-green-700"
          >
            ✅ Facile
          </Button>
        </div>
      )}
    </div>
  );
};

interface FillBlankExerciseProps {
  item: VocabularyItem;
  onAnswer: (isCorrect: boolean) => void;
}

const FillBlankExercise: React.FC<FillBlankExerciseProps> = ({
  item,
  onAnswer
}) => {
  const [answer, setAnswer] = useState('');
  const [hasAnswered, setHasAnswered] = useState(false);

  const handleSubmit = useCallback(() => {
    if (hasAnswered) return;
    
    const isCorrect = answer.toLowerCase().trim() === item.word.toLowerCase().trim() ||
                     answer.toLowerCase().trim() === item.translation.toLowerCase().trim();
    
    setHasAnswered(true);
    onAnswer(isCorrect);
  }, [answer, item, onAnswer, hasAnswered]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-4">
          Que signifie ce mot?
        </h3>
        <div className="text-3xl font-bold text-blue-600 mb-6">
          {item.word}
        </div>
        {item.pronunciation && (
          <p className="text-lg text-gray-600 italic mb-4">
            [{item.pronunciation}]
          </p>
        )}
      </div>

      <div className="max-w-md mx-auto">
        <Input
          type="text"
          placeholder="Tapez votre réponse..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          disabled={hasAnswered}
          fullWidth
        />
      </div>

      <div className="text-center">
        <Button 
          onClick={handleSubmit}
          disabled={!answer.trim() || hasAnswered}
        >
          Vérifier
        </Button>
      </div>
    </div>
  );
};

interface MatchingExerciseProps {
  items: VocabularyItem[];
  onAnswer: (isCorrect: boolean) => void;
}

const MatchingExercise: React.FC<MatchingExerciseProps> = ({
  items,
  onAnswer
}) => {
  const [selectedPairs, setSelectedPairs] = useState<Record<string, string>>({});
  const [hasAnswered, setHasAnswered] = useState(false);

  // Take first 4 items for matching
  const exerciseItems = items.slice(0, 4);
  const shuffledTranslations = [...exerciseItems.map(item => item.translation)]
    .sort(() => Math.random() - 0.5);

  const handlePairSelect = useCallback((word: string, translation: string) => {
    if (hasAnswered) return;
    
    setSelectedPairs(prev => ({
      ...prev,
      [word]: translation
    }));
  }, [hasAnswered]);

  const handleSubmit = useCallback(() => {
    if (hasAnswered || Object.keys(selectedPairs).length < exerciseItems.length) return;
    
    const correctPairs = exerciseItems.every(item => 
      selectedPairs[item.word] === item.translation
    );
    
    setHasAnswered(true);
    onAnswer(correctPairs);
  }, [selectedPairs, exerciseItems, onAnswer, hasAnswered]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-4">
          Associez les mots à leurs traductions
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700 text-center">Mots</h4>
          {exerciseItems.map((item) => (
            <div
              key={item.word}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedPairs[item.word] 
                  ? 'bg-blue-100 border-blue-300' 
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className="font-medium">{item.word}</div>
              {selectedPairs[item.word] && (
                <div className="text-sm text-blue-600 mt-1">
                  → {selectedPairs[item.word]}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-gray-700 text-center">Traductions</h4>
          {shuffledTranslations.map((translation) => (
            <button
              key={translation}
              onClick={() => {
                // Find which word is currently selected for pairing
                const availableWords = exerciseItems.filter(item => 
                  !selectedPairs[item.word] || selectedPairs[item.word] === translation
                );
                if (availableWords.length > 0) {
                  handlePairSelect(availableWords[0].word, translation);
                }
              }}
              disabled={hasAnswered}
              className={`w-full p-3 border rounded-lg transition-colors ${
                Object.values(selectedPairs).includes(translation)
                  ? 'bg-green-100 border-green-300 text-green-700'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {translation}
            </button>
          ))}
        </div>
      </div>

      <div className="text-center">
        <Button 
          onClick={handleSubmit}
          disabled={Object.keys(selectedPairs).length < exerciseItems.length || hasAnswered}
        >
          Vérifier les associations
        </Button>
      </div>
    </div>
  );
};

interface PronunciationExerciseProps {
  item: VocabularyItem;
  onAnswer: (isCorrect: boolean) => void;
}

const PronunciationExercise: React.FC<PronunciationExerciseProps> = ({
  item,
  onAnswer
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);

  const handleRecord = useCallback(() => {
    setIsRecording(!isRecording);
    if (isRecording) {
      setHasRecorded(true);
      // Simulate pronunciation check - in real app, this would use speech recognition
      setTimeout(() => {
        onAnswer(Math.random() > 0.3); // 70% success rate for demo
      }, 1000);
    }
  }, [isRecording, onAnswer]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-4">
          Prononcez ce mot
        </h3>
        <div className="text-3xl font-bold text-blue-600 mb-2">
          {item.word}
        </div>
        <div className="text-lg text-gray-600 mb-2">
          {item.translation}
        </div>
        {item.pronunciation && (
          <p className="text-lg text-blue-600 italic mb-6">
            [{item.pronunciation}]
          </p>
        )}
      </div>

      <div className="text-center space-y-4">
        <button
          onClick={handleRecord}
          disabled={hasRecorded}
          className={`w-24 h-24 rounded-full text-white text-3xl transition-all ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
              : hasRecorded
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          🎤
        </button>
        
        <p className="text-sm text-gray-600">
          {isRecording 
            ? 'Enregistrement en cours...' 
            : hasRecorded 
            ? 'Enregistrement terminé' 
            : 'Cliquez pour enregistrer votre prononciation'
          }
        </p>
        
        <p className="text-xs text-gray-500">
          Fonctionnalité de reconnaissance vocale en développement
        </p>
      </div>
    </div>
  );
};

export { VocabularyExercise };