import { describe, it, expect, vi, beforeEach } from 'vitest';
import { geminiService } from '../../../../core/services/ai/geminiService';

// Mock the Google Generative AI
vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
    getGenerativeModel: vi.fn().mockReturnValue({
      generateContent: vi.fn(),
      startChat: vi.fn().mockReturnValue({
        sendMessage: vi.fn(),
        getHistory: vi.fn().mockReturnValue([])
      })
    })
  })),
  HarmCategory: {
    HARM_CATEGORY_HARASSMENT: 'HARM_CATEGORY_HARASSMENT',
    HARM_CATEGORY_HATE_SPEECH: 'HARM_CATEGORY_HATE_SPEECH',
    HARM_CATEGORY_SEXUALLY_EXPLICIT: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
    HARM_CATEGORY_DANGEROUS_CONTENT: 'HARM_CATEGORY_DANGEROUS_CONTENT'
  },
  HarmBlockThreshold: {
    BLOCK_MEDIUM_AND_ABOVE: 'BLOCK_MEDIUM_AND_ABOVE'
  }
}));

describe('GeminiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock environment variable
    vi.stubEnv('VITE_GEMINI_API_KEY', 'test-api-key');
  });

  describe('initialization', () => {
    it('should initialize successfully with API key', async () => {
      const result = await geminiService.initialize();
      expect(result).toBe(true);
    });

    it('should fail initialization without API key', async () => {
      vi.stubEnv('VITE_GEMINI_API_KEY', '');
      const result = await geminiService.initialize();
      expect(result).toBe(false);
    });
  });

  describe('generateResponse', () => {
    it('should generate response successfully', async () => {
      const mockResponse = {
        response: {
          text: () => 'Test response'
        }
      };

      const mockModel = {
        generateContent: vi.fn().mockResolvedValue(mockResponse)
      };

      vi.mocked(geminiService['genAI']?.getGenerativeModel).mockReturnValue(mockModel);

      await geminiService.initialize();
      const result = await geminiService.generateResponse('Test prompt');

      expect(result).toBe('Test response');
      expect(mockModel.generateContent).toHaveBeenCalledWith('Test prompt');
    });

    it('should handle generation errors', async () => {
      const mockModel = {
        generateContent: vi.fn().mockRejectedValue(new Error('API Error'))
      };

      vi.mocked(geminiService['genAI']?.getGenerativeModel).mockReturnValue(mockModel);

      await geminiService.initialize();
      
      await expect(geminiService.generateResponse('Test prompt')).rejects.toThrow('API Error');
    });
  });

  describe('chat functionality', () => {
    it('should start and maintain chat sessions', async () => {
      const mockChat = {
        sendMessage: vi.fn().mockResolvedValue({
          response: {
            text: () => 'Chat response'
          }
        }),
        getHistory: vi.fn().mockReturnValue([])
      };

      const mockModel = {
        startChat: vi.fn().mockReturnValue(mockChat)
      };

      vi.mocked(geminiService['genAI']?.getGenerativeModel).mockReturnValue(mockModel);

      await geminiService.initialize();
      const result = await geminiService.chat('user1', 'Hello', { language: 'Ewondo' });

      expect(result).toBe('Chat response');
      expect(mockChat.sendMessage).toHaveBeenCalled();
    });
  });

  describe('text analysis', () => {
    it('should analyze text for grammar', async () => {
      const mockResponse = {
        response: {
          text: () => JSON.stringify({
            isCorrect: true,
            corrections: [],
            explanation: 'Grammar is correct'
          })
        }
      };

      const mockModel = {
        generateContent: vi.fn().mockResolvedValue(mockResponse)
      };

      vi.mocked(geminiService['genAI']?.getGenerativeModel).mockReturnValue(mockModel);

      await geminiService.initialize();
      const result = await geminiService.analyzeText('Mbolo', 'Duala', 'grammar');

      expect(result).toEqual({
        isCorrect: true,
        corrections: [],
        explanation: 'Grammar is correct'
      });
    });

    it('should analyze text for pronunciation', async () => {
      const mockResponse = {
        response: {
          text: () => JSON.stringify({
            phonetic: '/mbo.lo/',
            difficulty: 'easy',
            tips: ['Emphasize the first syllable']
          })
        }
      };

      const mockModel = {
        generateContent: vi.fn().mockResolvedValue(mockResponse)
      };

      vi.mocked(geminiService['genAI']?.getGenerativeModel).mockReturnValue(mockModel);

      await geminiService.initialize();
      const result = await geminiService.analyzeText('Mbolo', 'Duala', 'pronunciation');

      expect(result).toEqual({
        phonetic: '/mbo.lo/',
        difficulty: 'easy',
        tips: ['Emphasize the first syllable']
      });
    });
  });

  describe('content moderation', () => {
    it('should moderate content successfully', async () => {
      const mockResponse = {
        response: {
          text: () => JSON.stringify({
            isAppropriate: true,
            confidence: 0.95,
            categories: []
          })
        }
      };

      const mockModel = {
        generateContent: vi.fn().mockResolvedValue(mockResponse)
      };

      vi.mocked(geminiService['genAI']?.getGenerativeModel).mockReturnValue(mockModel);

      await geminiService.initialize();
      const result = await geminiService.moderateContent('Hello world');

      expect(result).toEqual({
        isAppropriate: true,
        confidence: 0.95,
        categories: []
      });
    });

    it('should flag inappropriate content', async () => {
      const mockResponse = {
        response: {
          text: () => JSON.stringify({
            isAppropriate: false,
            confidence: 0.98,
            categories: ['hate_speech'],
            reason: 'Contains offensive language'
          })
        }
      };

      const mockModel = {
        generateContent: vi.fn().mockResolvedValue(mockResponse)
      };

      vi.mocked(geminiService['genAI']?.getGenerativeModel).mockReturnValue(mockModel);

      await geminiService.initialize();
      const result = await geminiService.moderateContent('Inappropriate content');

      expect(result).toEqual({
        isAppropriate: false,
        confidence: 0.98,
        categories: ['hate_speech'],
        reason: 'Contains offensive language'
      });
    });
  });

  describe('learning path generation', () => {
    it('should generate personalized learning path', async () => {
      const mockResponse = {
        response: {
          text: () => JSON.stringify({
            path: [
              { topic: 'Basic Greetings', difficulty: 1, estimatedTime: 30 },
              { topic: 'Family Terms', difficulty: 2, estimatedTime: 45 }
            ],
            totalLessons: 2,
            estimatedDuration: 75
          })
        }
      };

      const mockModel = {
        generateContent: vi.fn().mockResolvedValue(mockResponse)
      };

      vi.mocked(geminiService['genAI']?.getGenerativeModel).mockReturnValue(mockModel);

      await geminiService.initialize();
      const result = await geminiService.generateLearningPath('Ewondo', 'beginner', 'visual');

      expect(result).toEqual({
        path: [
          { topic: 'Basic Greetings', difficulty: 1, estimatedTime: 30 },
          { topic: 'Family Terms', difficulty: 2, estimatedTime: 45 }
        ],
        totalLessons: 2,
        estimatedDuration: 75
      });
    });
  });

  describe('cultural translation', () => {
    it('should provide cultural context for translations', async () => {
      const mockResponse = {
        response: {
          text: () => JSON.stringify({
            translation: 'Hello',
            culturalContext: 'Used as a general greeting throughout the day',
            usage: 'formal',
            alternatives: ['Bonjour', 'Salut']
          })
        }
      };

      const mockModel = {
        generateContent: vi.fn().mockResolvedValue(mockResponse)
      };

      vi.mocked(geminiService['genAI']?.getGenerativeModel).mockReturnValue(mockModel);

      await geminiService.initialize();
      const result = await geminiService.translateWithCulturalContext('Mbolo', 'Duala', 'French');

      expect(result).toEqual({
        translation: 'Hello',
        culturalContext: 'Used as a general greeting throughout the day',
        usage: 'formal',
        alternatives: ['Bonjour', 'Salut']
      });
    });
  });
});
