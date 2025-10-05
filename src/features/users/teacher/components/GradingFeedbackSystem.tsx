import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Textarea,
  Badge,
  Progress,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  useToastActions
} from '@/shared/components/ui';
import {
  AcademicCapIcon,
  CheckCircleIcon,
  XCircleIcon,
  StarIcon,
  ChatBubbleLeftIcon,
  ClockIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  lessonId: string;
  lessonTitle: string;
  submittedAt: Date;
  status: 'pending' | 'graded' | 'returned';
  answers: Answer[];
  grade?: number;
  feedback?: string;
  teacherNotes?: string;
}

interface Answer {
  questionId: string;
  question: string;
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  points: number;
  maxPoints: number;
  feedback?: string;
}

interface GradingCriteria {
  category: string;
  weight: number;
  score: number;
  maxScore: number;
  comments: string;
}

const GradingFeedbackSystem: React.FC = () => {
  const { success: showSuccess, error: showError } = useToastActions();

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'graded'>('pending');
  const [currentGrade, setCurrentGrade] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [teacherNotes, setTeacherNotes] = useState('');
  const [gradingCriteria, setGradingCriteria] = useState<GradingCriteria[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock data - Replace with actual API calls
  useEffect(() => {
    fetchSubmissions();
  }, [filterStatus]);

  const fetchSubmissions = async () => {
    setLoading(true);

    // Mock submissions
    const mockSubmissions: Submission[] = [
      {
        id: '1',
        studentId: '101',
        studentName: 'Marie Kouam',
        lessonId: 'l1',
        lessonTitle: 'Les Salutations en Dualaba',
        submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
        status: 'pending',
        answers: [
          {
            questionId: 'q1',
            question: 'Comment dit-on "Bonjour" en Dualaba ?',
            studentAnswer: 'Mbolo',
            correctAnswer: 'Mbolo',
            isCorrect: true,
            points: 10,
            maxPoints: 10
          },
          {
            questionId: 'q2',
            question: 'Traduisez "Comment allez-vous ?"',
            studentAnswer: 'Boni eyano?',
            correctAnswer: 'Boni ?',
            isCorrect: false,
            points: 0,
            maxPoints: 10
          },
          {
            questionId: 'q3',
            question: 'Quelle est la réponse appropriée à "Boni ?"',
            studentAnswer: 'Malamu',
            correctAnswer: 'Malamu',
            isCorrect: true,
            points: 10,
            maxPoints: 10
          }
        ]
      },
      {
        id: '2',
        studentId: '102',
        studentName: 'Jean-Paul Dibango',
        lessonId: 'l2',
        lessonTitle: 'Les Nombres en Ewondo',
        submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
        status: 'pending',
        answers: [
          {
            questionId: 'q1',
            question: 'Comptez de 1 à 5 en Ewondo',
            studentAnswer: 'fok, bè, lal, nin, tan',
            correctAnswer: 'fok, bè, lal, nin, tan',
            isCorrect: true,
            points: 15,
            maxPoints: 15
          }
        ]
      }
    ];

    setTimeout(() => {
      setSubmissions(mockSubmissions);
      setLoading(false);
    }, 500);
  };

  const handleSelectSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
    setCurrentGrade(submission.grade || calculateAutoGrade(submission));
    setFeedbackText(submission.feedback || '');
    setTeacherNotes(submission.teacherNotes || '');

    // Initialize grading criteria
    setGradingCriteria([
      {
        category: 'Exactitude',
        weight: 40,
        score: 0,
        maxScore: 100,
        comments: ''
      },
      {
        category: 'Compréhension',
        weight: 30,
        score: 0,
        maxScore: 100,
        comments: ''
      },
      {
        category: 'Expression',
        weight: 20,
        score: 0,
        maxScore: 100,
        comments: ''
      },
      {
        category: 'Effort',
        weight: 10,
        score: 0,
        maxScore: 100,
        comments: ''
      }
    ]);
  };

  const calculateAutoGrade = (submission: Submission): number => {
    const totalPoints = submission.answers.reduce((sum, a) => sum + a.points, 0);
    const maxPoints = submission.answers.reduce((sum, a) => sum + a.maxPoints, 0);
    return Math.round((totalPoints / maxPoints) * 100);
  };

  const calculateWeightedGrade = (): number => {
    const weightedSum = gradingCriteria.reduce((sum, criteria) => {
      return sum + (criteria.score * criteria.weight / 100);
    }, 0);
    return Math.round(weightedSum);
  };

  const handleUpdateCriteria = (index: number, field: keyof GradingCriteria, value: any) => {
    setGradingCriteria(prev => prev.map((criteria, i) =>
      i === index ? { ...criteria, [field]: value } : criteria
    ));
  };

  const handleSubmitGrade = async () => {
    if (!selectedSubmission) return;

    setLoading(true);

    try {
      const finalGrade = calculateWeightedGrade();

      // Update submission
      setSubmissions(prev => prev.map(sub =>
        sub.id === selectedSubmission.id
          ? {
              ...sub,
              status: 'graded',
              grade: finalGrade,
              feedback: feedbackText,
              teacherNotes
            }
          : sub
      ));

      showSuccess(`Note de ${finalGrade}% attribuée à ${selectedSubmission.studentName}`);
      setSelectedSubmission(null);
    } catch (error) {
      showError('Erreur lors de la soumission de la note');
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade: number): string => {
    if (grade >= 85) return 'text-green-600';
    if (grade >= 70) return 'text-blue-600';
    if (grade >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeBadgeVariant = (grade: number): 'success' | 'warning' | 'danger' | 'secondary' => {
    if (grade >= 85) return 'success';
    if (grade >= 70) return 'secondary';
    if (grade >= 60) return 'warning';
    return 'danger';
  };

  const filteredSubmissions = submissions.filter(sub => {
    if (filterStatus === 'all') return true;
    return sub.status === filterStatus;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
      {/* Submissions List */}
      <div className="lg:col-span-1">
        <Card className="h-full flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <AcademicCapIcon className="w-5 h-5" />
              Devoirs à Corriger
            </CardTitle>
          </CardHeader>

          <div className="p-4 border-b">
            <SelectRoot value={filterStatus} onValueChange={(value: string) => setFilterStatus(value as 'all' | 'pending' | 'graded')}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="graded">Corrigés</SelectItem>
              </SelectContent>
            </SelectRoot>
          </div>

          <CardContent className="flex-1 overflow-y-auto p-0">
            {filteredSubmissions.map((submission) => (
              <motion.div
                key={submission.id}
                whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                onClick={() => handleSelectSubmission(submission)}
                className={`p-4 border-b cursor-pointer transition-colors ${
                  selectedSubmission?.id === submission.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold">
                    {submission.studentName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm truncate">{submission.studentName}</p>
                      {submission.status === 'pending' && (
                        <Badge variant="warning" className="ml-2">En attente</Badge>
                      )}
                      {submission.status === 'graded' && submission.grade !== undefined && (
                        <Badge variant={getGradeBadgeVariant(submission.grade)}>
                          {submission.grade}%
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate mb-1">
                      {submission.lessonTitle}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <ClockIcon className="w-3 h-3" />
                      {new Date(submission.submittedAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Grading Panel */}
      <div className="lg:col-span-2">
        {selectedSubmission ? (
          <Card className="h-full flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle>Évaluation de {selectedSubmission.studentName}</CardTitle>
                <Badge variant="secondary">{selectedSubmission.lessonTitle}</Badge>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto space-y-6">
              {/* Auto-calculated Score */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Note Automatique</p>
                    <p className={`text-4xl font-bold ${getGradeColor(calculateAutoGrade(selectedSubmission))}`}>
                      {calculateAutoGrade(selectedSubmission)}%
                    </p>
                  </div>
                  <ChartBarIcon className="w-12 h-12 text-blue-500 opacity-50" />
                </div>
                <div className="mt-4">
                  <Progress value={calculateAutoGrade(selectedSubmission)} className="h-2" />
                </div>
              </div>

              {/* Answers Review */}
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  📝 Réponses de l'Étudiant
                </h3>
                <div className="space-y-4">
                  {selectedSubmission.answers.map((answer, index) => (
                    <div
                      key={answer.questionId}
                      className={`p-4 rounded-lg border-2 ${
                        answer.isCorrect
                          ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                          : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium text-sm">Q{index + 1}: {answer.question}</p>
                        <div className="flex items-center gap-2">
                          {answer.isCorrect ? (
                            <CheckCircleIcon className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircleIcon className="w-5 h-5 text-red-600" />
                          )}
                          <Badge variant={answer.isCorrect ? 'success' : 'danger'}>
                            {answer.points}/{answer.maxPoints} pts
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Réponse de l'étudiant: </span>
                          <span className={answer.isCorrect ? 'text-green-700' : 'text-red-700'}>
                            {answer.studentAnswer}
                          </span>
                        </div>
                        {!answer.isCorrect && (
                          <div>
                            <span className="font-medium">Réponse correcte: </span>
                            <span className="text-green-700">{answer.correctAnswer}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-3">
                        <Textarea
                          placeholder="Commentaire personnalisé pour cette réponse..."
                          rows={2}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grading Criteria */}
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  ⭐ Critères d'Évaluation
                </h3>
                <div className="space-y-4">
                  {gradingCriteria.map((criteria, index) => (
                    <div key={criteria.category} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <p className="font-medium">{criteria.category}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Poids: {criteria.weight}%</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={criteria.score}
                            onChange={(e) => handleUpdateCriteria(index, 'score', parseInt(e.target.value) || 0)}
                            className="w-20 text-center"
                          />
                          <span className="text-sm text-gray-600">/ {criteria.maxScore}</span>
                        </div>
                      </div>
                      <Progress value={criteria.score} className="h-2 mb-2" />
                      <Textarea
                        placeholder="Commentaires..."
                        value={criteria.comments}
                        onChange={(e) => handleUpdateCriteria(index, 'comments', e.target.value)}
                        rows={2}
                        className="text-sm"
                      />
                    </div>
                  ))}

                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-lg">Note Finale Pondérée</p>
                      <p className={`text-3xl font-bold ${getGradeColor(calculateWeightedGrade())}`}>
                        {calculateWeightedGrade()}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feedback */}
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <ChatBubbleLeftIcon className="w-5 h-5" />
                  Feedback pour l'Étudiant
                </h3>
                <Textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Écrivez vos commentaires et encouragements..."
                  rows={6}
                  className="mb-3"
                />

                <div>
                  <label className="block text-sm font-medium mb-2">Notes Personnelles (non visibles par l'étudiant)</label>
                  <Textarea
                    value={teacherNotes}
                    onChange={(e) => setTeacherNotes(e.target.value)}
                    placeholder="Notes privées pour votre suivi..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setSelectedSubmission(null)}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleSubmitGrade}
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? 'Enregistrement...' : 'Soumettre la Note'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="h-full">
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <AcademicCapIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Sélectionnez un devoir à corriger</p>
                <p className="text-sm mt-2">
                  {filteredSubmissions.length} devoir(s) {filterStatus === 'pending' ? 'en attente' : ''}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GradingFeedbackSystem;
