import { ENV } from '@/core/config/env.config';

interface Message {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

interface ChatSession {
  messages: Message[];
}

export class GeminiService {
  private apiKey: string;
  private baseURL = 'https://generativelanguage.googleapis.com/v1beta';
  private model = 'gemini-pro';

  constructor() {
    this.apiKey = ENV.GEMINI_API_KEY;
  }

  async sendMessage(prompt: string, chatHistory: Message[] = []): Promise<string> {
    if (!this.apiKey || this.apiKey === 'your_gemini_api_key_here') {
      // Mock response for demo
      return this.getMockResponse(prompt);
    }

    try {
      const response = await fetch(
        `${this.baseURL}/models/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              ...chatHistory,
              {
                role: 'user',
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
          }),
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'API request failed');
      }

      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Pas de réponse';
    } catch (error: any) {
      console.error('Gemini API error:', error);
      return this.getMockResponse(prompt);
    }
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
}

export const geminiService = new GeminiService();

