export interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'audio_recognition' | 'translation';
  question: string;
  audioUrl?: string;
  imageUrl?: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  category: string;
  tags?: string[];
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  language: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  questions: QuizQuestion[];
  timeLimit?: number; // in minutes
  passingScore: number; // percentage
  maxAttempts?: number;
  isPublished: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  startedAt: Date;
  completedAt?: Date;
  answers: QuizAnswer[];
  score: number;
  percentage: number;
  passed: boolean;
  timeSpent: number; // in seconds
  status: 'in_progress' | 'completed' | 'abandoned';
}

export interface QuizAnswer {
  questionId: string;
  userAnswer: string | string[];
  isCorrect: boolean;
  pointsEarned: number;
  timeSpent: number; // in seconds
  attempts: number;
}

export interface QuizResult {
  attempt: QuizAttempt;
  quiz: Quiz;
  correctAnswers: number;
  totalQuestions: number;
  score: number;
  percentage: number;
  passed: boolean;
  timeSpent: number;
  breakdown: {
    category: string;
    correct: number;
    total: number;
    percentage: number;
  }[];
}

export interface QuizStats {
  totalQuizzes: number;
  completedQuizzes: number;
  averageScore: number;
  bestScore: number;
  totalTimeSpent: number;
  streakDays: number;
  lastQuizDate?: Date;
  categoryStats: {
    [category: string]: {
      attempted: number;
      completed: number;
      averageScore: number;
      bestScore: number;
    };
  };
}

export interface QuizSession {
  id: string;
  quizId: string;
  userId: string;
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  startedAt: Date;
  timeRemaining?: number;
  status: 'active' | 'paused' | 'completed';
}
