// AI Service Types and Interfaces

export interface AIPromptRequest {
  prompt: string;
  context?: string;
  language?: string;
  userId?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AIPromptResponse {
  success: boolean;
  response: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
  model: string;
  timestamp: Date;
  error?: string;
}

export interface PronunciationFeedback {
  accuracy: number; // 0-100
  phonemes: Array<{
    phoneme: string;
    accuracy: number;
    feedback: string;
  }>;
  overallFeedback: string;
  improvements: string[];
  score: number; // 0-10
}

export interface PronunciationAssessmentRequest {
  audioData: Blob;
  targetText: string;
  language: string;
  userId: string;
}

export interface PronunciationAssessmentResponse {
  success: boolean;
  feedback: PronunciationFeedback;
  suggestions: string[];
  practiceWords: string[];
  timestamp: Date;
  error?: string;
}

export interface LanguageLearningContext {
  userId: string;
  currentLanguage: string;
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced';
  learningGoals: string[];
  weakAreas: string[];
  strengths: string[];
  recentLessons: string[];
  vocabulary: string[];
}

export interface TutoringRequest {
  question: string;
  context: LanguageLearningContext;
  lessonId?: string;
  exerciseId?: string;
  conversationHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
}

export interface TutoringResponse {
  answer: string;
  explanation?: string;
  examples: string[];
  relatedTopics: string[];
  practiceExercises?: Array<{
    question: string;
    options?: string[];
    correctAnswer: string;
  }>;
  confidence: number; // 0-1
  timestamp: Date;
}

export interface ContentGenerationRequest {
  type: 'lesson' | 'exercise' | 'story' | 'dialogue' | 'vocabulary_list';
  language: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  topic: string;
  requirements?: {
    wordCount?: number;
    includeAudio?: boolean;
    difficulty?: number;
    focusGrammar?: string[];
    focusVocabulary?: string[];
  };
}

export interface ContentGenerationResponse {
  success: boolean;
  content: {
    title: string;
    description: string;
    body: string;
    metadata: {
      wordCount: number;
      estimatedDuration: number; // minutes
      difficulty: number;
      keyVocabulary: string[];
      grammarPoints: string[];
    };
  };
  timestamp: Date;
  error?: string;
}

export interface TranslationRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
  context?: string;
  formality?: 'formal' | 'informal' | 'neutral';
}

export interface TranslationResponse {
  success: boolean;
  translation: string;
  alternatives: string[];
  confidence: number;
  explanation?: string;
  culturalNotes?: string[];
  timestamp: Date;
  error?: string;
}

export interface AIUsageStats {
  userId: string;
  totalRequests: number;
  requestsByType: Record<string, number>;
  totalTokensUsed: number;
  averageResponseTime: number; // milliseconds
  lastUsed: Date;
  monthlyUsage: number;
  quotaRemaining?: number;
}

export interface ConversationSession {
  id: string;
  userId: string;
  language: string;
  scenario: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    audioUrl?: string;
  }>;
  startTime: Date;
  endTime?: Date;
  feedback?: {
    overallScore: number;
    fluency: number;
    accuracy: number;
    vocabulary: number;
    suggestions: string[];
  };
}

export interface GrammarCorrectionRequest {
  text: string;
  language: string;
  userId: string;
}

export interface GrammarCorrectionResponse {
  success: boolean;
  corrections: Array<{
    original: string;
    corrected: string;
    explanation: string;
    rule: string;
    severity: 'minor' | 'moderate' | 'major';
    position: { start: number; end: number };
  }>;
  correctedText: string;
  overallScore: number; // 0-100
  improvements: string[];
  timestamp: Date;
  error?: string;
}

export interface VocabularyAssessmentRequest {
  words: string[];
  language: string;
  userId: string;
  context?: string;
}

export interface VocabularyAssessmentResponse {
  success: boolean;
  assessments: Array<{
    word: string;
    difficulty: number; // 1-10
    frequency: 'common' | 'uncommon' | 'rare';
    category: string;
    definition: string;
    examples: string[];
    relatedWords: string[];
  }>;
  recommendations: {
    easyWords: string[];
    challengingWords: string[];
    studyPlan: string[];
  };
  timestamp: Date;
  error?: string;
}

// Error types
export class AIServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AIServiceError';
  }
}

export class QuotaExceededError extends AIServiceError {
  constructor(message = 'AI service quota exceeded') {
    super(message, 'QUOTA_EXCEEDED', 429);
  }
}

export class InvalidRequestError extends AIServiceError {
  constructor(message = 'Invalid AI service request') {
    super(message, 'INVALID_REQUEST', 400);
  }
}