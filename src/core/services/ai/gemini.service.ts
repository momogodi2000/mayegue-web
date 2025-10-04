import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

interface LearningContext {
  currentLanguage?: string;
  userLevel?: string;
  previousMessages?: string[];
  lessonTopic?: string;
}

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: GenerativeModel | null = null;

  constructor() {
    // Initialize Gemini when API key is available
    this.initialize();
  }

  private async initialize() {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const modelName = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.0-flash-exp';

      if (apiKey && apiKey !== 'demo-gemini-key') {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        });
        console.log('✅ Gemini AI initialized with model:', modelName);
      } else {
        console.warn('⚠️ Gemini AI not configured - API key missing or demo key used');
      }
    } catch (error) {
      console.error('❌ Gemini AI initialization error:', error);
    }
  }

  async generateResponse(prompt: string): Promise<string> {
    if (!this.model) {
      return "❌ L'assistant IA Gemini n'est pas configuré. Veuillez vérifier votre clé API dans les paramètres.";
    }

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (!text || text.trim() === '') {
        return "⚠️ Aucune réponse générée. Veuillez reformuler votre question.";
      }

      return text;
    } catch (error: any) {
      console.error('❌ Gemini API error:', error);

      // Handle specific error cases
      if (error?.message?.includes('API key')) {
        return "❌ Clé API invalide. Veuillez configurer une clé API Gemini valide.";
      }
      if (error?.message?.includes('quota')) {
        return "⚠️ Quota API dépassé. Veuillez réessayer plus tard.";
      }
      if (error?.message?.includes('SAFETY')) {
        return "⚠️ Votre message a été bloqué par les filtres de sécurité. Veuillez reformuler.";
      }

      return `❌ Erreur: ${error?.message || 'Une erreur est survenue. Veuillez réessayer.'}`;
    }
  }

  // Alias for backward compatibility
  async sendMessage(message: string): Promise<string> {
    return this.generateResponse(message);
  }

  async generateLanguageLearningResponse(
    language: string, 
    userMessage: string, 
    context?: LearningContext
  ): Promise<string> {
    const prompt = `Tu es un assistant IA spécialisé dans l'apprentissage des langues camerounaises, particulièrement ${language}. 
    
    Message de l'utilisateur: ${userMessage}
    
    Contexte: ${context ? JSON.stringify(context) : 'Aucun contexte spécifique'}
    
    Réponds de manière pédagogique, encourageante et culturellement appropriée. 
    Inclus des exemples pratiques et des informations culturelles pertinentes quand c'est possible.`;

    return this.generateResponse(prompt);
  }

  async translateText(text: string, fromLang: string, toLang: string): Promise<string> {
    const prompt = `Traduis le texte suivant de ${fromLang} vers ${toLang}: "${text}"
    
    Fournis seulement la traduction, sans explication supplémentaire.`;

    return this.generateResponse(prompt);
  }

  async explainGrammar(language: string, concept: string): Promise<string> {
    const prompt = `Explique le concept grammatical "${concept}" en ${language} de manière simple et pédagogique. 
    Inclus des exemples pratiques et des comparaisons avec le français si pertinent.`;

    return this.generateResponse(prompt);
  }

  isConfigured(): boolean {
    return this.model !== null;
  }
}

export const geminiService = new GeminiService();