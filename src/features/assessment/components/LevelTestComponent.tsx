import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Button,
  Progress,
  Badge,
  Spinner,
  useToastActions
} from '@/shared/components/ui';
import { 
  AcademicCapIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  TrophyIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '@/features/auth/store/authStore';
import { geminiService } from '@/core/services/ai/geminiService';
import { userService } from '@/core/services/firebase/user.service';

interface Question {
  id: string;
  type: 'multiple_choice' | 'translation' | 'pronunciation' | 'cultural';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  culturalContext?: string;
}

interface TestResult {
  score: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  recommendations: string[];
  strengths: string[];
  weaknesses: string[];
  nextSteps: string[];
}

export default function LevelTestComponent() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { success: showSuccess, error: showError } = useToastActions();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Timer effect
  useEffect(() => {
    if (testStarted && !testCompleted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleTestComplete();
    }
  }, [testStarted, testCompleted, timeLeft]);

  // Load test questions
  useEffect(() => {
    loadTestQuestions();
  }, []);

  const loadTestQuestions = async () => {
    setLoading(true);
    try {
      // Generate adaptive questions using Gemini AI
      const questions = await geminiService.generateLevelTestQuestions({
        userId: user?.id || 'anonymous',
        language: 'dualaba', // Default language
        testType: 'comprehensive'
      });
      
      setQuestions(questions);
    } catch (error) {
      console.error('Error loading test questions:', error);
      // Fallback to default questions
      setQuestions(getDefaultQuestions());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultQuestions = (): Question[] => [
    {
      id: '1',
      type: 'multiple_choice',
      question: 'Comment dit-on "bonjour" en dualaba ?',
      options: ['Mbolo', 'Ndewo', 'Salaam', 'Hello'],
      correctAnswer: 'Mbolo',
      explanation: 'En dualaba, "bonjour" se dit "Mbolo". C\'est une salutation courante utilisée toute la journée.',
      difficulty: 'beginner',
      language: 'dualaba'
    },
    {
      id: '2',
      type: 'translation',
      question: 'Traduisez: "Je m\'appelle Marie"',
      correctAnswer: 'Ngom na Marie',
      explanation: 'La traduction correcte est "Ngom na Marie". "Ngom" signifie "je m\'appelle" et "na" est une particule de liaison.',
      difficulty: 'beginner',
      language: 'dualaba'
    },
    {
      id: '3',
      type: 'cultural',
      question: 'Quelle est la signification culturelle du masque Ngondo ?',
      options: ['Protection spirituelle', 'Célébration de la récolte', 'Commémoration des ancêtres', 'Toutes les réponses'],
      correctAnswer: 'Toutes les réponses',
      explanation: 'Le masque Ngondo a plusieurs significations culturelles : protection spirituelle, célébration de la récolte, et commémoration des ancêtres.',
      difficulty: 'intermediate',
      language: 'dualaba',
      culturalContext: 'Culture dualaba traditionnelle'
    },
    {
      id: '4',
      type: 'multiple_choice',
      question: 'Quel est le mot pour "eau" en dualaba ?',
      options: ['Maza', 'Mai', 'Nji', 'Mvula'],
      correctAnswer: 'Maza',
      explanation: 'En dualaba, "eau" se dit "Maza". C\'est un mot essentiel dans la vie quotidienne.',
      difficulty: 'beginner',
      language: 'dualaba'
    },
    {
      id: '5',
      type: 'translation',
      question: 'Traduisez: "Merci beaucoup"',
      correctAnswer: 'Tosepeli mingi',
      explanation: 'La traduction correcte est "Tosepeli mingi". "Tosepeli" signifie "merci" et "mingi" signifie "beaucoup".',
      difficulty: 'beginner',
      language: 'dualaba'
    }
  ];

  const startTest = () => {
    setTestStarted(true);
    setTimeLeft(1800); // Reset timer
  };

  const handleAnswerSelect = (answer: string) => {
    if (currentQuestion) {
      setAnswers({
        ...answers,
        [currentQuestion.id]: answer
      });
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowExplanation(false);
    } else {
      handleTestComplete();
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowExplanation(false);
    }
  };

  const handleTestComplete = async () => {
    setTestCompleted(true);
    setLoading(true);

    try {
      // Calculate score and generate result using AI
      const result = await geminiService.evaluateLevelTest({
        userId: user?.id || 'anonymous',
        questions,
        answers,
        timeSpent: 1800 - timeLeft
      });

      setResult(result);

      // Update user level in database
      if (user?.id) {
        await userService.updateUserLevel(user.id, result.level);
        showSuccess(`Test terminé ! Votre niveau est : ${result.level}`);
      }

    } catch (error) {
      console.error('Error evaluating test:', error);
      // Fallback result
      const score = calculateScore();
      setResult({
        score,
        level: score >= 80 ? 'advanced' : score >= 60 ? 'intermediate' : 'beginner',
        recommendations: ['Continuez à pratiquer quotidiennement'],
        strengths: ['Motivation élevée'],
        weaknesses: ['Vocabulaire de base'],
        nextSteps: ['Commencez par les leçons de niveau débutant']
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateScore = (): number => {
    let correct = 0;
    questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'text-green-600';
      case 'intermediate': return 'text-yellow-600';
      case 'advanced': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading && questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Préparation du test de niveau...</p>
        </div>
      </div>
    );
  }

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <Helmet>
          <title>Test de Niveau - Ma'a yegue</title>
          <meta name="description" content="Évaluez votre niveau en dualaba avec notre test adaptatif" />
        </Helmet>

        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 dark:bg-primary-900 rounded-full mb-6">
              <AcademicCapIcon className="w-10 h-10 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="heading-1 mb-4">Test de Niveau</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Évaluez votre niveau en dualaba et recevez des recommandations personnalisées pour votre apprentissage.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClockIcon className="w-5 h-5" />
                  Durée du Test
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Le test dure environ 30 minutes et comprend 20 questions adaptatives qui s'ajustent à votre niveau.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5" />
                  Questions Adaptatives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Les questions s'adaptent à vos réponses pour évaluer précisément votre niveau réel.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button 
              onClick={startTest}
              size="lg"
              className="px-8 py-4 text-lg"
            >
              Commencer le Test
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (testCompleted && result) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <Helmet>
          <title>Résultats du Test - Ma'a yegue</title>
        </Helmet>

        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full mb-6">
              <TrophyIcon className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="heading-1 mb-4">Test Terminé !</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Voici vos résultats et recommandations personnalisées.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Votre Score</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {result.score}%
                </div>
                <Badge className={`text-lg px-4 py-2 ${getLevelColor(result.level)}`}>
                  Niveau {result.level}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Points Forts</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.strengths.map((strength, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircleIcon className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Points à Améliorer</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <XCircleIcon className="w-4 h-4 text-red-500" />
                      <span className="text-sm">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prochaines Étapes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.nextSteps.map((step, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <SparklesIcon className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">{step}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button 
              onClick={() => navigate('/lessons')}
              size="lg"
              className="px-8 py-4 text-lg"
            >
              Commencer les Leçons
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <Helmet>
        <title>Test de Niveau - Question {currentQuestionIndex + 1} - Ma'a yegue</title>
      </Helmet>

      <div className="container-custom max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Question {currentQuestionIndex + 1} sur {questions.length}
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {formatTime(timeLeft)}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">
                    {currentQuestion?.question}
                  </CardTitle>
                  <Badge className={getDifficultyColor(currentQuestion?.difficulty || 'beginner')}>
                    {currentQuestion?.difficulty}
                  </Badge>
                </div>
                {currentQuestion?.culturalContext && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Contexte culturel : {currentQuestion.culturalContext}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                {currentQuestion?.type === 'multiple_choice' && (
                  <div className="space-y-3">
                    {currentQuestion.options?.map((option, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleAnswerSelect(option)}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                          answers[currentQuestion.id] === option
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="font-medium">{option}</span>
                      </motion.button>
                    ))}
                  </div>
                )}

                {currentQuestion?.type === 'translation' && (
                  <div className="space-y-4">
                    <textarea
                      className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none"
                      rows={3}
                      placeholder="Votre traduction..."
                      value={answers[currentQuestion.id] || ''}
                      onChange={(e) => handleAnswerSelect(e.target.value)}
                    />
                  </div>
                )}

                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg"
                  >
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      Explication :
                    </h4>
                    <p className="text-blue-800 dark:text-blue-200">
                      {currentQuestion?.explanation}
                    </p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            onClick={previousQuestion}
            disabled={currentQuestionIndex === 0}
            variant="outline"
          >
            Précédent
          </Button>

          <div className="flex gap-2">
            <Button
              onClick={() => setShowExplanation(!showExplanation)}
              variant="outline"
            >
              {showExplanation ? 'Masquer' : 'Afficher'} l'explication
            </Button>
            <Button
              onClick={nextQuestion}
              disabled={!answers[currentQuestion.id]}
            >
              {currentQuestionIndex === questions.length - 1 ? 'Terminer' : 'Suivant'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
