import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClockIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  XMarkIcon,
  SpeakerWaveIcon,
  PauseIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardHeader, CardTitle, Button, Progress } from '@/shared/components/ui';
import type { Quiz, QuizQuestion, QuizSession, QuizAnswer } from '../types/quiz.types';
import { quizService } from '../services/quiz.service';
import toast from 'react-hot-toast';

interface QuizPlayerProps {
  quiz: Quiz;
  session: QuizSession;
  onComplete: (sessionId: string) => void;
  onExit: () => void;
}

export const QuizPlayer: React.FC<QuizPlayerProps> = ({
  quiz,
  session: initialSession,
  onComplete,
  onExit
}) => {
  const [session, setSession] = useState<QuizSession>(initialSession);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion>(quiz.questions[0]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[]>('');
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<{ isCorrect: boolean; pointsEarned: number; explanation?: string } | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | undefined>(session.timeRemaining);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  // Timer effect
  useEffect(() => {
    if (!timeRemaining) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev && prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev ? prev - 1 : undefined;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  // Update current question when session changes
  useEffect(() => {
    const questionIndex = Math.min(session.currentQuestionIndex, quiz.questions.length - 1);
    setCurrentQuestion(quiz.questions[questionIndex]);
    setSelectedAnswer('');
    setShowResult(false);
    setLastResult(null);
    setQuestionStartTime(Date.now());
  }, [session.currentQuestionIndex, quiz.questions]);

  const handleTimeUp = useCallback(() => {
    toast.error('Temps écoulé !');
    onComplete(session.id);
  }, [session.id, onComplete]);

  const handleAnswerSelect = (answer: string) => {
    if (currentQuestion.type === 'multiple_choice' && Array.isArray(selectedAnswer)) {
      const newSelection = [...selectedAnswer];
      const index = newSelection.indexOf(answer);
      if (index > -1) {
        newSelection.splice(index, 1);
      } else {
        newSelection.push(answer);
      }
      setSelectedAnswer(newSelection);
    } else {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || (Array.isArray(selectedAnswer) && selectedAnswer.length === 0)) {
      toast.error('Veuillez sélectionner une réponse');
      return;
    }

    setIsSubmitting(true);
    try {
      const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
      const result = await quizService.submitAnswer(
        session.id,
        currentQuestion.id,
        selectedAnswer,
        timeSpent
      );

      setLastResult(result);
      setShowResult(true);

      // Update session
      const updatedSession = { ...session };
      updatedSession.currentQuestionIndex++;
      setSession(updatedSession);

      // Auto-advance after showing result
      setTimeout(() => {
        if (updatedSession.currentQuestionIndex >= quiz.questions.length) {
          onComplete(session.id);
        } else {
          setShowResult(false);
        }
      }, 2000);

    } catch (error) {
      console.error('Error submitting answer:', error);
      toast.error('Erreur lors de la soumission de la réponse');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (session.currentQuestionIndex > 0) {
      const updatedSession = { ...session };
      updatedSession.currentQuestionIndex--;
      setSession(updatedSession);
    }
  };

  const handleNextQuestion = () => {
    if (session.currentQuestionIndex < quiz.questions.length - 1) {
      const updatedSession = { ...session };
      updatedSession.currentQuestionIndex++;
      setSession(updatedSession);
    }
  };

  const playAudio = async () => {
    if (!currentQuestion.audioUrl) return;

    try {
      setAudioPlaying(true);
      const audio = new Audio(currentQuestion.audioUrl);
      audio.onended = () => setAudioPlaying(false);
      audio.onerror = () => {
        setAudioPlaying(false);
        toast.error('Erreur lors de la lecture audio');
      };
      await audio.play();
    } catch (error) {
      setAudioPlaying(false);
      toast.error('Erreur lors de la lecture audio');
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((session.currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {quiz.title}
          </h1>
          <div className="flex items-center space-x-4">
            {timeRemaining && (
              <div className="flex items-center text-orange-600 dark:text-orange-400">
                <ClockIcon className="w-5 h-5 mr-2" />
                <span className="font-mono text-lg">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
            <Button variant="outline" onClick={onExit}>
              Quitter
            </Button>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Question {session.currentQuestionIndex + 1} sur {quiz.questions.length}</span>
            <span>{Math.round(progress)}% terminé</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Question Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900 dark:text-white">
            {currentQuestion.question}
          </CardTitle>
          {currentQuestion.audioUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={playAudio}
              disabled={audioPlaying}
              className="w-fit"
            >
              {audioPlaying ? (
                <PauseIcon className="w-4 h-4 mr-2" />
              ) : (
                <SpeakerWaveIcon className="w-4 h-4 mr-2" />
              )}
              {audioPlaying ? 'Lecture...' : 'Écouter'}
            </Button>
          )}
        </CardHeader>

        <CardContent>
          {currentQuestion.imageUrl && (
            <div className="mb-6">
              <img
                src={currentQuestion.imageUrl}
                alt="Question illustration"
                className="max-w-full h-auto rounded-lg"
              />
            </div>
          )}

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQuestion.type === 'multiple_choice' && currentQuestion.options?.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswerSelect(option)}
                disabled={showResult}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                  (Array.isArray(selectedAnswer) ? selectedAnswer.includes(option) : selectedAnswer === option)
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                } ${showResult ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-900 dark:text-white">{option}</span>
                  {(Array.isArray(selectedAnswer) ? selectedAnswer.includes(option) : selectedAnswer === option) && (
                    <CheckIcon className="w-5 h-5 text-primary-600" />
                  )}
                </div>
              </motion.button>
            ))}

            {currentQuestion.type === 'true_false' && (
              <div className="grid grid-cols-2 gap-4">
                {['Vrai', 'Faux'].map((option) => (
                  <motion.button
                    key={option}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={showResult}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      selectedAnswer === option
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    } ${showResult ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center justify-center">
                      <span className="text-gray-900 dark:text-white font-medium">{option}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            {currentQuestion.type === 'fill_blank' && (
              <div className="space-y-4">
                <input
                  type="text"
                  value={selectedAnswer as string}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  disabled={showResult}
                  placeholder="Tapez votre réponse..."
                  className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-primary-500 focus:outline-none dark:bg-gray-800 dark:text-white"
                />
              </div>
            )}
          </div>

          {/* Result Display */}
          <AnimatePresence>
            {showResult && lastResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`mt-6 p-4 rounded-lg ${
                  lastResult.isCorrect
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                }`}
              >
                <div className="flex items-center mb-2">
                  {lastResult.isCorrect ? (
                    <CheckIcon className="w-6 h-6 text-green-600 mr-2" />
                  ) : (
                    <XMarkIcon className="w-6 h-6 text-red-600 mr-2" />
                  )}
                  <span className={`font-semibold ${
                    lastResult.isCorrect ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
                  }`}>
                    {lastResult.isCorrect ? 'Correct !' : 'Incorrect'}
                  </span>
                  <span className="ml-auto text-sm font-medium">
                    +{lastResult.pointsEarned} points
                  </span>
                </div>
                {lastResult.explanation && (
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {lastResult.explanation}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          {!showResult && (
            <div className="flex justify-between items-center mt-6">
              <Button
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={session.currentQuestionIndex === 0}
              >
                <ChevronLeftIcon className="w-4 h-4 mr-2" />
                Précédent
              </Button>

              <Button
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer || (Array.isArray(selectedAnswer) && selectedAnswer.length === 0) || isSubmitting}
              >
                {session.currentQuestionIndex === quiz.questions.length - 1 ? 'Terminer' : 'Suivant'}
                <ChevronRightIcon className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
