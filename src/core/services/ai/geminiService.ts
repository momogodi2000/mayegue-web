/**
 * Gemini AI Service - Core AI Integration for Ma'a yegue V1.1
 * 
 * This service provides the main interface to Google's Gemini AI,
 * powering all AI features including:
 * - Virtual Mentor
 * - Adaptive Learning
 * - Grand-Mère Virtuelle (Virtual Grandmother)
 * - Content Moderation
 * - Pronunciation Analysis
 * - Contextual Conversations
 * 
 * @version 1.1.0
 * @author Ma'a yegue Team
 */

import { GoogleGenerativeAI, GenerativeModel, ChatSession } from '@google/generative-ai';

// Configuration
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const MODEL_NAME = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.0-flash-exp';

interface GeminiConfig {
  temperature?: number;
  topK?: number;
  topP?: number;
  maxOutputTokens?: number;
  safetySettings?: Array<{
    category: string;
    threshold: string;
  }>;
}

interface ConversationContext {
  userId: string;
  language: string;
  learningLevel?: 'beginner' | 'intermediate' | 'advanced';
  culturalContext?: string;
  conversationHistory?: Array<{
    role: 'user' | 'model';
    content: string;
    timestamp: Date;
  }>;
}

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private activeChats: Map<string, ChatSession>;
  private initialized: boolean = false;

  constructor() {
    if (!API_KEY) {
      console.error('⚠️ Gemini API key not configured. Please set VITE_GEMINI_API_KEY in .env');
    }
    
    this.genAI = new GoogleGenerativeAI(API_KEY);
    this.activeChats = new Map();
  }

  /**
   * Initialize Gemini AI service
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Test connection
      const model = this.genAI.getGenerativeModel({ model: MODEL_NAME });
      const result = await model.generateContent('Hello');
      const response = await result.response;
      
      if (response) {
        this.initialized = true;
        console.log('✅ Gemini AI service initialized successfully');
      }
    } catch (error) {
      console.error('❌ Failed to initialize Gemini AI:', error);
      throw new Error('Gemini AI initialization failed');
    }
  }

  /**
   * Get a configured Gemini model
   */
  private getModel(config?: GeminiConfig): GenerativeModel {
    const defaultConfig: GeminiConfig = {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
    };

    const finalConfig = { ...defaultConfig, ...config };

    return this.genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: {
        temperature: finalConfig.temperature,
        topK: finalConfig.topK,
        topP: finalConfig.topP,
        maxOutputTokens: finalConfig.maxOutputTokens,
      },
      safetySettings: finalConfig.safetySettings as any,
    });
  }

  /**
   * Generate a single response (one-shot)
   */
  async generateResponse(
    prompt: string,
    context?: ConversationContext,
    config?: GeminiConfig
  ): Promise<string> {
    try {
      const model = this.getModel(config);
      
      // Build enhanced prompt with context
      const enhancedPrompt = this.buildPromptWithContext(prompt, context);
      
      const result = await model.generateContent(enhancedPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating Gemini response:', error);
      throw error;
    }
  }

  /**
   * Start or continue a conversation (multi-turn chat)
   */
  async chat(
    userId: string,
    message: string,
    context?: ConversationContext,
    config?: GeminiConfig
  ): Promise<string> {
    try {
      let chatSession = this.activeChats.get(userId);

      if (!chatSession) {
        const model = this.getModel(config);
        const systemPrompt = this.buildSystemPrompt(context);
        
        chatSession = model.startChat({
          history: [
            {
              role: 'user',
              parts: [{ text: systemPrompt }],
            },
            {
              role: 'model',
              parts: [{ text: 'Understood. I\'m ready to assist with Cameroonian language learning.' }],
            },
          ],
        });

        this.activeChats.set(userId, chatSession);
      }

      const result = await chatSession.sendMessage(message);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error in Gemini chat:', error);
      throw error;
    }
  }

  /**
   * Analyze text for language learning purposes
   */
  async analyzeText(
    text: string,
    language: string,
    analysisType: 'grammar' | 'pronunciation' | 'semantics' | 'cultural'
  ): Promise<any> {
    const prompts = {
      grammar: `Analyze the following text in ${language} for grammatical correctness. Identify errors and provide corrections:\n\n${text}`,
      pronunciation: `Analyze the phonetic structure of this ${language} text. Identify difficult sounds for non-native speakers:\n\n${text}`,
      semantics: `Analyze the semantic meaning and context of this ${language} text. Explain cultural nuances:\n\n${text}`,
      cultural: `Explain the cultural context and significance of this ${language} expression:\n\n${text}`,
    };

    const response = await this.generateResponse(prompts[analysisType]);
    
    try {
      return JSON.parse(response);
    } catch {
      return { analysis: response };
    }
  }

  /**
   * Generate personalized learning path
   */
  async generateLearningPath(
    learningStyle: 'visual' | 'auditory' | 'reading' | 'kinesthetic',
    currentLevel: 'beginner' | 'intermediate' | 'advanced',
    language: string,
    goals: string[]
  ): Promise<any> {
    const prompt = `
      Create a personalized learning path for ${language} with the following criteria:
      - Learning Style: ${learningStyle} (VARK model)
      - Current Level: ${currentLevel}
      - Goals: ${goals.join(', ')}
      
      Provide a structured learning plan in JSON format with:
      1. Weekly milestones
      2. Recommended activities tailored to ${learningStyle} learning
      3. Resources and exercises
      4. Assessment checkpoints
      5. Estimated time to proficiency
    `;

    const response = await this.generateResponse(prompt);
    
    try {
      return JSON.parse(response);
    } catch {
      return { learningPath: response };
    }
  }

  /**
   * Moderate content for appropriateness
   */
  async moderateContent(content: string): Promise<{
    isAppropriate: boolean;
    issues: string[];
    severity: 'none' | 'low' | 'medium' | 'high';
    suggestions: string[];
  }> {
    const prompt = `
      Analyze the following content for:
      1. Hate speech
      2. Inappropriate language
      3. Offensive content
      4. Violations of community standards
      
      Content: "${content}"
      
      Respond in JSON format with:
      {
        "isAppropriate": boolean,
        "issues": string[],
        "severity": "none" | "low" | "medium" | "high",
        "suggestions": string[]
      }
    `;

    const response = await this.generateResponse(prompt, undefined, {
      temperature: 0.2, // Lower temperature for more consistent moderation
    });

    try {
      return JSON.parse(response);
    } catch {
      return {
        isAppropriate: true,
        issues: [],
        severity: 'none',
        suggestions: [],
      };
    }
  }

  /**
   * Translate with cultural context
   */
  async translateWithContext(
    text: string,
    fromLanguage: string,
    toLanguage: string,
    culturalContext?: string
  ): Promise<{
    translation: string;
    literalMeaning: string;
    culturalNotes: string;
    usage: string;
  }> {
    const prompt = `
      Translate the following from ${fromLanguage} to ${toLanguage}:
      "${text}"
      
      ${culturalContext ? `Cultural Context: ${culturalContext}` : ''}
      
      Provide:
      1. Natural translation
      2. Literal meaning
      3. Cultural significance
      4. Usage examples
      
      Format as JSON.
    `;

    const response = await this.generateResponse(prompt);
    
    try {
      return JSON.parse(response);
    } catch {
      return {
        translation: response,
        literalMeaning: '',
        culturalNotes: '',
        usage: '',
      };
    }
  }

  /**
   * Clear chat history for a user
   */
  clearChatHistory(userId: string): void {
    this.activeChats.delete(userId);
  }

  /**
   * Build system prompt with context
   */
  private buildSystemPrompt(context?: ConversationContext): string {
    if (!context) {
      return 'You are an expert in Cameroonian languages and cultures, helping users learn traditional languages.';
    }

    const { language, learningLevel, culturalContext } = context;

    return `
      You are an expert tutor for ${language || 'Cameroonian languages'}.
      Student Level: ${learningLevel || 'not specified'}
      ${culturalContext ? `Cultural Context: ${culturalContext}` : ''}
      
      Your role:
      - Provide accurate, culturally appropriate responses
      - Adapt to the student's proficiency level
      - Include pronunciation guidance when relevant
      - Share cultural insights and context
      - Be encouraging and patient
      - Use simple explanations for beginners
      - Challenge advanced learners appropriately
    `.trim();
  }

  /**
   * Build enhanced prompt with conversation context
   */
  private buildPromptWithContext(
    prompt: string,
    context?: ConversationContext
  ): string {
    if (!context) return prompt;

    const contextInfo = [];
    
    if (context.language) {
      contextInfo.push(`Target Language: ${context.language}`);
    }
    
    if (context.learningLevel) {
      contextInfo.push(`Proficiency: ${context.learningLevel}`);
    }
    
    if (context.culturalContext) {
      contextInfo.push(`Cultural Context: ${context.culturalContext}`);
    }

    if (context.conversationHistory && context.conversationHistory.length > 0) {
      const recentHistory = context.conversationHistory
        .slice(-5)
        .map(h => `${h.role}: ${h.content}`)
        .join('\n');
      contextInfo.push(`\nRecent Conversation:\n${recentHistory}`);
    }

    return `${contextInfo.join('\n')}\n\n${prompt}`;
  }

  /**
   * Generate level test questions
   */
  async generateLevelTestQuestions(
    language: string,
    level: 'beginner' | 'intermediate' | 'advanced',
    count: number = 10
  ): Promise<any[]> {
    try {
      const model = this.getModel();
      const prompt = `
        Generate ${count} level test questions for ${language} language learning at ${level} level.
        
        Each question should include:
        - question: The question text
        - type: 'multiple_choice', 'translation', 'pronunciation', 'cultural', or 'fill_blank'
        - options: Array of options (for multiple choice)
        - correctAnswer: The correct answer
        - explanation: Brief explanation of the answer
        - points: Points value (1-10)
        - culturalContext: Cultural information if relevant
        
        Format as JSON array with diverse question types covering vocabulary, grammar, culture, and comprehension.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return JSON.parse(response.text());
    } catch (error) {
      console.error('Error generating level test questions:', error);
      throw new Error('Failed to generate level test questions');
    }
  }

  /**
   * Evaluate level test responses
   */
  async evaluateLevelTest(
    questions: any[],
    answers: any[],
    language: string
  ): Promise<any> {
    try {
      const model = this.getModel();
      const prompt = `
        Evaluate the level test responses for ${language} language learning.
        
        Questions: ${JSON.stringify(questions)}
        Answers: ${JSON.stringify(answers)}
        
        Provide evaluation including:
        - totalScore: Total points earned
        - percentage: Percentage score
        - level: Recommended level ('beginner', 'intermediate', 'advanced')
        - strengths: Areas of strength
        - weaknesses: Areas needing improvement
        - recommendations: Specific learning recommendations
        
        Format as JSON with detailed feedback.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return JSON.parse(response.text());
    } catch (error) {
      console.error('Error evaluating level test:', error);
      throw new Error('Failed to evaluate level test');
    }
  }

  /**
   * Generate lesson content with AI
   */
  async generateLessonContent(params: {
    title: string;
    language: string;
    level: string;
    category: string;
    objectives: string[];
  }): Promise<any> {
    try {
      const model = this.getModel();
      const prompt = `
        Generate comprehensive lesson content for: ${params.title}
        
        Language: ${params.language}
        Level: ${params.level}
        Category: ${params.category}
        Objectives: ${params.objectives.join(', ')}
        
        Provide:
        - content: Main lesson content (detailed and educational)
        - description: Brief description of the lesson
        - culturalNotes: Cultural context and information
        - exercises: Array of exercises with questions, answers, and explanations
        
        Format as JSON with rich, engaging content suitable for language learning.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return JSON.parse(response.text());
    } catch (error) {
      console.error('Error generating lesson content:', error);
      throw new Error('Failed to generate lesson content');
    }
  }

  /**
   * Get service status
   */
  getStatus(): {
    initialized: boolean;
    activeChats: number;
    apiKeyConfigured: boolean;
  } {
    return {
      initialized: this.initialized,
      activeChats: this.activeChats.size,
      apiKeyConfigured: !!API_KEY,
    };
  }
}

// Export singleton instance
export const geminiService = new GeminiService();

// Export types
export type {
  GeminiConfig,
  ConversationContext,
};
