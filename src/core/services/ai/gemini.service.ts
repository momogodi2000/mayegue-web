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
      // In a real implementation, this would come from environment variables
      // For now, we'll use a placeholder that can be configured later
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (apiKey) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
      }
    } catch (error) {
      console.warn('Gemini AI not configured:', error);
    }
  }

  async generateResponse(prompt: string): Promise<string> {
    if (!this.model) {
      return "Gemini AI n'est pas encore configuré. Cette fonctionnalité sera disponible bientôt.";
    }

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating response:', error);
      return "Désolé, je ne peux pas répondre pour le moment. Veuillez réessayer plus tard.";
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