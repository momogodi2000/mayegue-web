import { 
  AIPromptRequest, 
  AIPromptResponse, 
  TutoringRequest, 
  TutoringResponse,
  ContentGenerationRequest,
  ContentGenerationResponse,
  TranslationRequest,
  TranslationResponse,
  GrammarCorrectionRequest,
  GrammarCorrectionResponse,
  AIServiceError,
  QuotaExceededError
} from './types';

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  usageMetadata?: {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
    totalTokenCount?: number;
  };
}

interface Message {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

interface ChatSession {
  messages: Message[];
}

export interface GeminiConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

export class GeminiService {
  private readonly config: GeminiConfig;
  private requestCount = 0;
  private readonly maxRequestsPerMinute = 60;
  private lastResetTime = Date.now();

  constructor(config?: Partial<GeminiConfig>) {
    this.config = {
      apiKey: config?.apiKey || import.meta.env.VITE_GEMINI_API_KEY || '',
      baseUrl: config?.baseUrl || 'https://generativelanguage.googleapis.com/v1beta',
      model: config?.model || 'gemini-1.5-flash',
      maxTokens: config?.maxTokens || 2048,
      temperature: config?.temperature || 0.7
    };

    if (!this.config.apiKey) {
      console.warn('Gemini API key not configured');
    }
  }

  private checkRateLimit(): void {
    const now = Date.now();
    const timeDiff = now - this.lastResetTime;

    if (timeDiff >= 60000) { // Reset every minute
      this.requestCount = 0;
      this.lastResetTime = now;
    }

    if (this.requestCount >= this.maxRequestsPerMinute) {
      throw new QuotaExceededError('Rate limit exceeded. Please try again later.');
    }

    this.requestCount++;
  }

  async sendMessage(prompt: string, _chatHistory: Message[] = []): Promise<string> {
    try {
      const response = await this.generateContent({ prompt });
      return response.success ? response.response : this.getMockResponse(prompt);
    } catch (error) {
      console.error('Send message failed:', error);
      return this.getMockResponse(prompt);
    }
  }

  async generateContent(request: AIPromptRequest): Promise<AIPromptResponse> {
    try {
      this.checkRateLimit();

      if (!this.config.apiKey || this.config.apiKey === 'your_gemini_api_key_here') {
        // Return mock response for demo
        return {
          success: true,
          response: this.getMockResponse(request.prompt),
          model: this.config.model,
          timestamp: new Date()
        };
      }

      const payload = {
        contents: [{
          parts: [{
            text: request.prompt
          }]
        }],
        generationConfig: {
          maxOutputTokens: request.maxTokens || this.config.maxTokens,
          temperature: request.temperature || this.config.temperature,
          topP: 0.8,
          topK: 40
        }
      };

      const response = await this.makeRequest(`/models/${this.config.model}:generateContent`, payload);

      if (!response.candidates || response.candidates.length === 0) {
        throw new AIServiceError('No response generated', 'NO_RESPONSE');
      }

      const content = response.candidates[0]?.content?.parts?.[0]?.text;
      if (!content) {
        throw new AIServiceError('Invalid response format', 'INVALID_RESPONSE');
      }

      return {
        success: true,
        response: content,
        usage: {
          inputTokens: response.usageMetadata?.promptTokenCount || 0,
          outputTokens: response.usageMetadata?.candidatesTokenCount || 0,
          totalTokens: response.usageMetadata?.totalTokenCount || 0
        },
        model: this.config.model,
        timestamp: new Date()
      };

    } catch (error) {
      console.error('Gemini AI request failed:', error);
      
      if (error instanceof AIServiceError) {
        throw error;
      }

      return {
        success: false,
        response: this.getMockResponse(request.prompt),
        model: this.config.model,
        timestamp: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async provideTutoring(request: TutoringRequest): Promise<TutoringResponse> {
    const conversationContext = request.conversationHistory
      ?.map(msg => `${msg.role}: ${msg.content}`)
      .join('\n') || '';

    const prompt = `
You are an expert language tutor for ${request.context.currentLanguage}. 
The student's proficiency level is ${request.context.proficiencyLevel}.

Student's learning goals: ${request.context.learningGoals.join(', ')}
Student's weak areas: ${request.context.weakAreas.join(', ')}
Student's strengths: ${request.context.strengths.join(', ')}

${conversationContext ? 'Previous conversation:\n' + conversationContext + '\n' : ''}

Student's question: ${request.question}

Please provide:
1. A clear, helpful answer
2. A brief explanation of the concept
3. 2-3 practical examples
4. Related topics the student might want to explore
5. A confidence score (0-1) for your answer

Format your response as JSON with the following structure:
{
  "answer": "...",
  "explanation": "...",
  "examples": ["...", "...", "..."],
  "relatedTopics": ["...", "...", "..."],
  "confidence": 0.95
}
    `;

    try {
      const response = await this.generateContent({ 
        prompt,
        maxTokens: 1500,
        temperature: 0.8
      });

      if (!response.success) {
        throw new AIServiceError('Failed to generate tutoring response', 'TUTORING_FAILED');
      }

      const parsed = JSON.parse(response.response);
      
      return {
        answer: parsed.answer,
        explanation: parsed.explanation,
        examples: parsed.examples || [],
        relatedTopics: parsed.relatedTopics || [],
        confidence: parsed.confidence || 0.5,
        timestamp: new Date()
      };

    } catch (error) {
      console.error('Tutoring request failed:', error);
      
      return {
        answer: "I'm sorry, I'm having trouble processing your question right now. Please try rephrasing it or try again later.",
        explanation: "There was a technical issue with the AI service.",
        examples: [],
        relatedTopics: [],
        confidence: 0,
        timestamp: new Date()
      };
    }
  }

  async translateText(request: TranslationRequest): Promise<TranslationResponse> {
    const prompt = `
Translate the following text from ${request.sourceLanguage} to ${request.targetLanguage}.

Text to translate: "${request.text}"
${request.context ? `Context: ${request.context}` : ''}
${request.formality ? `Formality level: ${request.formality}` : ''}

Provide the translation in JSON format:
{
  "translation": "...",
  "alternatives": ["...", "...", "..."],
  "confidence": 0.95,
  "explanation": "...",
  "culturalNotes": ["...", "..."]
}

The confidence should be between 0 and 1.
Include cultural notes if there are important cultural considerations.
Provide 2-3 alternative translations if applicable.
    `;

    try {
      const response = await this.generateContent({
        prompt,
        maxTokens: 1000,
        temperature: 0.3 // Lower temperature for more consistent translations
      });

      if (!response.success) {
        throw new AIServiceError('Translation failed', 'TRANSLATION_FAILED');
      }

      const parsed = JSON.parse(response.response);

      return {
        success: true,
        translation: parsed.translation,
        alternatives: parsed.alternatives || [],
        confidence: parsed.confidence || 0.8,
        explanation: parsed.explanation,
        culturalNotes: parsed.culturalNotes || [],
        timestamp: new Date()
      };

    } catch (error) {
      console.error('Translation failed:', error);
      
      return {
        success: false,
        translation: '',
        alternatives: [],
        confidence: 0,
        timestamp: new Date(),
        error: error instanceof Error ? error.message : 'Translation failed'
      };
    }
  }

  private async makeRequest(endpoint: string, data: unknown): Promise<GeminiResponse> {
    const url = `${this.config.baseUrl}${endpoint}?key=${this.config.apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 429) {
        throw new QuotaExceededError('API quota exceeded');
      }
      
      throw new AIServiceError(
        errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`,
        'API_ERROR',
        response.status
      );
    }

    return response.json() as Promise<GeminiResponse>;
  }

  private getMockResponse(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('bonjour') || lowerPrompt.includes('salut')) {
      return 'Bonjour! Comment puis-je vous aider à apprendre les langues camerounaises aujourd\'hui?';
    }
    
    if (lowerPrompt.includes('ewondo') || lowerPrompt.includes('duala')) {
      return 'Les langues camerounaises sont riches et fascinantes! Souhaitez-vous apprendre des salutations de base ou explorer le vocabulaire?';
    }
    
    if (lowerPrompt.includes('merci')) {
      return 'De rien! N\'hésitez pas à me poser d\'autres questions. En Ewondo, on dit "Akiba" pour merci!';
    }
    
    return 'C\'est une excellente question! Pour utiliser l\'IA complète, configurez votre clé API Gemini. En attendant, explorez nos leçons et notre dictionnaire!';
  }

  createChatSession(): ChatSession {
    return {
      messages: [],
    };
  }

  addMessageToSession(session: ChatSession, role: 'user' | 'model', text: string): void {
    session.messages.push({
      role,
      parts: [{ text }],
    });
  }

  // Utility methods
  getUsageStats(): { requestCount: number; resetTime: Date } {
    return {
      requestCount: this.requestCount,
      resetTime: new Date(this.lastResetTime + 60000)
    };
  }

  isConfigured(): boolean {
    return !!this.config.apiKey && this.config.apiKey !== 'your_gemini_api_key_here';
  }

  // Enhanced content generation methods
  async generateLessonContent(topic: string, language: string, level: string): Promise<ContentGenerationResponse> {
    return this.generateLearningContent({
      type: 'lesson',
      language,
      level: level as 'beginner' | 'intermediate' | 'advanced',
      topic
    });
  }

  async generateLearningContent(request: ContentGenerationRequest): Promise<ContentGenerationResponse> {
    const prompt = `
Create a ${request.type} for learning ${request.language} at ${request.level} level.
Topic: ${request.topic}

Requirements:
${request.requirements?.wordCount ? `- Word count: approximately ${request.requirements.wordCount} words` : ''}
${request.requirements?.difficulty ? `- Difficulty level: ${request.requirements.difficulty}/10` : ''}
${request.requirements?.focusGrammar?.length ? `- Focus on grammar: ${request.requirements.focusGrammar.join(', ')}` : ''}
${request.requirements?.focusVocabulary?.length ? `- Include vocabulary: ${request.requirements.focusVocabulary.join(', ')}` : ''}

Provide the content in JSON format:
{
  "title": "...",
  "description": "...",
  "body": "...",
  "metadata": {
    "wordCount": number,
    "estimatedDuration": number,
    "difficulty": number,
    "keyVocabulary": ["...", "..."],
    "grammarPoints": ["...", "..."]
  }
}

Make sure the content is engaging, educational, and appropriate for the specified level.
    `;

    try {
      const response = await this.generateContent({
        prompt,
        maxTokens: 2000,
        temperature: 0.8
      });

      if (!response.success) {
        throw new AIServiceError('Failed to generate content', 'CONTENT_GENERATION_FAILED');
      }

      const parsed = JSON.parse(response.response);

      return {
        success: true,
        content: {
          title: parsed.title,
          description: parsed.description,
          body: parsed.body,
          metadata: {
            wordCount: parsed.metadata?.wordCount || 0,
            estimatedDuration: parsed.metadata?.estimatedDuration || 5,
            difficulty: parsed.metadata?.difficulty || 5,
            keyVocabulary: parsed.metadata?.keyVocabulary || [],
            grammarPoints: parsed.metadata?.grammarPoints || []
          }
        },
        timestamp: new Date()
      };

    } catch (error) {
      console.error('Content generation failed:', error);
      
      return {
        success: false,
        content: {
          title: '',
          description: '',
          body: '',
          metadata: {
            wordCount: 0,
            estimatedDuration: 0,
            difficulty: 0,
            keyVocabulary: [],
            grammarPoints: []
          }
        },
        timestamp: new Date(),
        error: error instanceof Error ? error.message : 'Content generation failed'
      };
    }
  }

  // Grammar correction method
  async correctGrammar(request: GrammarCorrectionRequest): Promise<GrammarCorrectionResponse> {
    try {
      const prompt = `
Analyze and correct the grammar in this ${request.language} text: "${request.text}"

Provide a JSON response with:
{
  "success": true,
  "corrections": [
    {
      "original": "incorrect text",
      "corrected": "correct text", 
      "explanation": "explanation of the error",
      "rule": "grammar rule applied",
      "severity": "minor|moderate|major",
      "position": {"start": 0, "end": 10}
    }
  ],
  "correctedText": "full corrected text",
  "overallScore": 85,
  "improvements": ["suggestion 1", "suggestion 2"]
}
      `;
      
      const response = await this.makeRequest('/generateContent', {
        contents: [{
          parts: [{ text: prompt }]
        }]
      });
      
      const text = response.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      const parsed = JSON.parse(text);
      
      return {
        success: true,
        corrections: parsed.corrections || [],
        correctedText: parsed.correctedText || request.text,
        overallScore: parsed.overallScore || 100,
        improvements: parsed.improvements || [],
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Grammar correction failed:', error);
      return {
        success: false,
        corrections: [],
        correctedText: request.text,
        overallScore: 0,
        improvements: [],
        timestamp: new Date(),
        error: error instanceof Error ? error.message : 'Grammar correction failed'
      };
    }
  }
}

export const geminiService = new GeminiService();

