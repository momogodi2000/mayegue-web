/**
 * AI Features Service - Firebase service for AI features
 * 
 * @version 1.1.0
 * @author Ma'a yegue Team
 */

import { db } from '@/core/config/firebase.config';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  addDoc,
  updateDoc,
  Timestamp,
  arrayUnion,
  writeBatch
} from 'firebase/firestore';
import {
  AIMentor,
  VirtualGrandmother,
  AdaptiveLearning,
  ConversationMessage,
  AdaptiveInsight,
  AdaptiveRecommendation,
  GrandmotherStory,
  GrandmotherRecipe,
  GrandmotherWisdom,
  GrandmotherMemory,
  PersonalizedContent,
  LearningPath,
  PerformanceData
} from '../types/ai.types';
import { geminiService } from '@/core/services/ai/geminiService';

const AI_MENTORS_COLLECTION = 'ai_mentors';
const VIRTUAL_GRANDMOTHERS_COLLECTION = 'virtual_grandmothers';
const ADAPTIVE_LEARNING_COLLECTION = 'adaptive_learning';
const CONVERSATIONS_COLLECTION = 'ai_conversations';
const LEARNING_PATHS_COLLECTION = 'learning_paths';
const PERSONALIZED_CONTENT_COLLECTION = 'personalized_content';

export const aiFeaturesService = {
  // AI Mentor CRUD operations
  async getMentor(userId: string): Promise<AIMentor | null> {
    try {
      const q = query(collection(db, AI_MENTORS_COLLECTION), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date()
        } as AIMentor;
      }
      // Return null if no data exists (this is not an error)
      return null;
    } catch (error) {
      console.error('Error fetching AI mentor:', error);
      // Only throw for actual Firebase errors
      throw error;
    }
  },

  async createMentor(mentor: Omit<AIMentor, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, AI_MENTORS_COLLECTION), {
        ...mentor,
        createdAt: Timestamp.fromDate(mentor.createdAt),
        updatedAt: Timestamp.fromDate(mentor.updatedAt)
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating AI mentor:', error);
      throw new Error('Failed to create AI mentor');
    }
  },

  async updateMentor(mentorId: string, updates: Partial<AIMentor>): Promise<void> {
    try {
      const docRef = doc(db, AI_MENTORS_COLLECTION, mentorId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.fromDate(new Date())
      });
    } catch (error) {
      console.error('Error updating AI mentor:', error);
      throw new Error('Failed to update AI mentor');
    }
  },

  // AI Mentor Conversation
  async sendMessage(mentorId: string, message: ConversationMessage): Promise<ConversationMessage> {
    try {
      // Save user message
      const conversationRef = doc(db, CONVERSATIONS_COLLECTION, mentorId);
      await updateDoc(conversationRef, {
        conversationHistory: arrayUnion(message),
        updatedAt: Timestamp.fromDate(new Date())
      });

      // Generate AI response using Gemini
      const mentor = await this.getMentor(mentorId);
      if (!mentor) throw new Error('Mentor not found');

      const systemPrompt = this.buildMentorSystemPrompt(mentor);
      const context = this.buildConversationContext(mentor.conversationHistory);
      
      const aiResponse = await geminiService.generateResponse(
        `${systemPrompt}\n\nContext: ${context}\n\nUser: ${message.content}`,
        undefined,
        {
          temperature: 0.7,
          maxOutputTokens: 500,
          topP: 0.9
        }
      );

      const aiMessage: ConversationMessage = {
        id: `msg-${Date.now()}`,
        type: 'mentor',
        content: aiResponse,
        timestamp: new Date(),
        language: message.language,
        emotion: this.detectEmotion(aiResponse),
        context: message.context
      };

      // Save AI response
      await updateDoc(conversationRef, {
        conversationHistory: arrayUnion(aiMessage),
        updatedAt: Timestamp.fromDate(new Date())
      });

      return aiMessage;
    } catch (error) {
      console.error('Error sending message to AI mentor:', error);
      throw new Error('Failed to send message to AI mentor');
    }
  },

  async getConversationHistory(mentorId: string, limit: number = 50): Promise<ConversationMessage[]> {
    try {
      const docRef = doc(db, CONVERSATIONS_COLLECTION, mentorId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const conversationHistory = docSnap.data().conversationHistory || [];
        return conversationHistory.slice(-limit);
      }
      // Return empty array if no conversation history exists
      return [];
    } catch (error) {
      console.error('Error fetching conversation history:', error);
      // Return empty array instead of throwing to prevent page crash
      return [];
    }
  },

  // Virtual Grandmother CRUD operations
  async getVirtualGrandmother(userId: string): Promise<VirtualGrandmother | null> {
    try {
      const q = query(collection(db, VIRTUAL_GRANDMOTHERS_COLLECTION), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date()
        } as VirtualGrandmother;
      }
      // Return null if no data exists (this is not an error)
      return null;
    } catch (error) {
      console.error('Error fetching virtual grandmother:', error);
      // Only throw for actual Firebase errors
      throw error;
    }
  },

  async createVirtualGrandmother(grandmother: Omit<VirtualGrandmother, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, VIRTUAL_GRANDMOTHERS_COLLECTION), {
        ...grandmother,
        createdAt: Timestamp.fromDate(grandmother.createdAt),
        updatedAt: Timestamp.fromDate(grandmother.updatedAt)
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating virtual grandmother:', error);
      throw new Error('Failed to create virtual grandmother');
    }
  },

  async getGrandmotherStories(grandmotherId: string): Promise<GrandmotherStory[]> {
    try {
      const docRef = doc(db, VIRTUAL_GRANDMOTHERS_COLLECTION, grandmotherId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data().stories || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching grandmother stories:', error);
      // Return empty array instead of throwing
      return [];
    }
  },

  async getGrandmotherRecipes(grandmotherId: string): Promise<GrandmotherRecipe[]> {
    try {
      const docRef = doc(db, VIRTUAL_GRANDMOTHERS_COLLECTION, grandmotherId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data().recipes || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching grandmother recipes:', error);
      // Return empty array instead of throwing
      return [];
    }
  },

  async getGrandmotherWisdom(grandmotherId: string): Promise<GrandmotherWisdom[]> {
    try {
      const docRef = doc(db, VIRTUAL_GRANDMOTHERS_COLLECTION, grandmotherId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data().wisdom || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching grandmother wisdom:', error);
      // Return empty array instead of throwing
      return [];
    }
  },

  async getGrandmotherMemories(grandmotherId: string): Promise<GrandmotherMemory[]> {
    try {
      const docRef = doc(db, VIRTUAL_GRANDMOTHERS_COLLECTION, grandmotherId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data().memories || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching grandmother memories:', error);
      // Return empty array instead of throwing
      return [];
    }
  },

  // Adaptive Learning CRUD operations
  async getAdaptiveLearning(userId: string): Promise<AdaptiveLearning | null> {
    try {
      const q = query(collection(db, ADAPTIVE_LEARNING_COLLECTION), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date()
        } as AdaptiveLearning;
      }
      // Return null if no data exists (this is not an error)
      return null;
    } catch (error) {
      console.error('Error fetching adaptive learning:', error);
      // Only throw for actual Firebase errors
      throw error;
    }
  },

  async createAdaptiveLearning(adaptiveLearning: Omit<AdaptiveLearning, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, ADAPTIVE_LEARNING_COLLECTION), {
        ...adaptiveLearning,
        createdAt: Timestamp.fromDate(adaptiveLearning.createdAt),
        updatedAt: Timestamp.fromDate(adaptiveLearning.updatedAt)
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating adaptive learning:', error);
      throw new Error('Failed to create adaptive learning');
    }
  },

  async updateAdaptiveLearning(adaptiveLearningId: string, updates: Partial<AdaptiveLearning>): Promise<void> {
    try {
      const docRef = doc(db, ADAPTIVE_LEARNING_COLLECTION, adaptiveLearningId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.fromDate(new Date())
      });
    } catch (error) {
      console.error('Error updating adaptive learning:', error);
      throw new Error('Failed to update adaptive learning');
    }
  },

  // Performance Analysis
  async analyzePerformance(userId: string, performanceData: PerformanceData): Promise<AdaptiveInsight[]> {
    try {
      // Use Gemini AI to analyze performance data
      const analysisPrompt = `
        Analyze the following learning performance data and provide insights:
        
        Accuracy: ${performanceData.accuracy}%
        Speed: ${performanceData.speed} items/min
        Consistency: ${performanceData.consistency}%
        Engagement: ${performanceData.engagement}%
        Retention: ${performanceData.retention}%
        Application: ${performanceData.application}%
        Creativity: ${performanceData.creativity}%
        Collaboration: ${performanceData.collaboration}%
        Cultural Understanding: ${performanceData.culturalUnderstanding}%
        Language Proficiency: ${performanceData.languageProficiency}%
        
        Please provide insights about:
        1. Strengths and weaknesses
        2. Learning patterns
        3. Areas for improvement
        4. Recommended actions
        5. Cultural and linguistic considerations
        
        Format the response as structured insights with actionable recommendations.
      `;

      const analysis = await geminiService.generateResponse(analysisPrompt, undefined, {
        temperature: 0.3,
        maxOutputTokens: 1000,
        topP: 0.8
      });

      // Parse and structure the insights
      const insights = this.parsePerformanceInsights(analysis, performanceData);
      
      // Save insights to database
      const adaptiveLearning = await this.getAdaptiveLearning(userId);
      if (adaptiveLearning) {
        await this.updateAdaptiveLearning(adaptiveLearning.id, {
          insights: [...adaptiveLearning.insights, ...insights],
          performanceData
        });
      }

      return insights;
    } catch (error) {
      console.error('Error analyzing performance:', error);
      throw new Error('Failed to analyze performance');
    }
  },

  // Learning Path Generation
  async generateLearningPath(userId: string, objectives: string[]): Promise<LearningPath> {
    try {
      const adaptiveLearning = await this.getAdaptiveLearning(userId);
      if (!adaptiveLearning) throw new Error('Adaptive learning profile not found');

      // Use Gemini AI to generate personalized learning path
      const pathPrompt = `
        Generate a personalized learning path for a user with the following profile:
        
        Learning Style: ${JSON.stringify(adaptiveLearning.learningStyle)}
        Performance Data: ${JSON.stringify(adaptiveLearning.performanceData)}
        Cultural Preferences: ${JSON.stringify(adaptiveLearning.learningStyle.culturalPreferences)}
        
        Objectives: ${objectives.join(', ')}
        
        Please create a comprehensive learning path that includes:
        1. Structured milestones
        2. Personalized content recommendations
        3. Assessment strategies
        4. Cultural and linguistic considerations
        5. Adaptive elements based on learning style
        
        Format the response as a structured learning path with clear progression.
      `;

      const pathData = await geminiService.generateResponse(pathPrompt, undefined, {
        temperature: 0.4,
        maxOutputTokens: 1500,
        topP: 0.8
      });

      // Parse and structure the learning path
      const learningPath = this.parseLearningPath(pathData, adaptiveLearning);
      
      // Save learning path to database
      const docRef = await addDoc(collection(db, LEARNING_PATHS_COLLECTION), {
        ...learningPath,
        userId,
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date())
      });

      return { ...learningPath, id: docRef.id };
    } catch (error) {
      console.error('Error generating learning path:', error);
      throw new Error('Failed to generate learning path');
    }
  },

  // Content Personalization
  async personalizeContent(userId: string, content: any): Promise<PersonalizedContent[]> {
    try {
      const adaptiveLearning = await this.getAdaptiveLearning(userId);
      if (!adaptiveLearning) throw new Error('Adaptive learning profile not found');

      // Use Gemini AI to personalize content
      const personalizationPrompt = `
        Personalize the following content for a user with this learning profile:
        
        Learning Style: ${JSON.stringify(adaptiveLearning.learningStyle)}
        Performance Data: ${JSON.stringify(adaptiveLearning.performanceData)}
        Cultural Preferences: ${JSON.stringify(adaptiveLearning.learningStyle.culturalPreferences)}
        
        Original Content: ${JSON.stringify(content)}
        
        Please provide personalized versions that:
        1. Match the user's learning style
        2. Consider cultural preferences
        3. Adapt difficulty based on performance
        4. Include relevant cultural context
        5. Use appropriate language level
        
        Format the response as structured personalized content.
      `;

      const personalizedData = await geminiService.generateResponse(personalizationPrompt, undefined, {
        temperature: 0.5,
        maxOutputTokens: 1200,
        topP: 0.8
      });

      // Parse and structure the personalized content
      const personalizedContent = this.parsePersonalizedContent(personalizedData, adaptiveLearning);
      
      // Save personalized content to database
      const batch = writeBatch(db);
      personalizedContent.forEach(content => {
        const docRef = doc(collection(db, PERSONALIZED_CONTENT_COLLECTION));
        batch.set(docRef, {
          ...content,
          userId,
          createdAt: Timestamp.fromDate(new Date()),
          updatedAt: Timestamp.fromDate(new Date())
        });
      });
      await batch.commit();

      return personalizedContent;
    } catch (error) {
      console.error('Error personalizing content:', error);
      throw new Error('Failed to personalize content');
    }
  },

  // Learning Recommendations
  async generateRecommendations(userId: string): Promise<AdaptiveRecommendation[]> {
    try {
      const adaptiveLearning = await this.getAdaptiveLearning(userId);
      if (!adaptiveLearning) throw new Error('Adaptive learning profile not found');

      // Use Gemini AI to generate recommendations
      const recommendationPrompt = `
        Generate learning recommendations for a user with this profile:
        
        Learning Style: ${JSON.stringify(adaptiveLearning.learningStyle)}
        Performance Data: ${JSON.stringify(adaptiveLearning.performanceData)}
        Cultural Preferences: ${JSON.stringify(adaptiveLearning.learningStyle.culturalPreferences)}
        Current Progress: ${JSON.stringify(adaptiveLearning.progress)}
        
        Please provide recommendations that:
        1. Address identified weaknesses
        2. Build on existing strengths
        3. Consider cultural and linguistic context
        4. Match learning style preferences
        5. Include specific, actionable steps
        
        Format the response as structured recommendations with priorities and expected outcomes.
      `;

      const recommendationData = await geminiService.generateResponse(recommendationPrompt, undefined, {
        temperature: 0.4,
        maxOutputTokens: 1000,
        topP: 0.8
      });

      // Parse and structure the recommendations
      const recommendations = this.parseRecommendations(recommendationData, adaptiveLearning);
      
      // Save recommendations to database
      await this.updateAdaptiveLearning(adaptiveLearning.id, {
        recommendations: [...adaptiveLearning.recommendations, ...recommendations]
      });

      return recommendations;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw new Error('Failed to generate recommendations');
    }
  },

  // Helper methods
  buildMentorSystemPrompt(mentor: AIMentor): string {
    return `
      You are ${mentor.name}, an AI mentor specializing in ${mentor.expertise.join(', ')}.
      
      Personality: ${mentor.personality.type}
      Traits: ${mentor.personality.traits.join(', ')}
      Communication Style: ${mentor.personality.communicationStyle}
      Patience Level: ${mentor.personality.patience}/10
      Enthusiasm Level: ${mentor.personality.enthusiasm}/10
      
      Cultural Background: ${mentor.culturalBackground}
      Language: ${mentor.language}
      
      Your role is to:
      1. Provide personalized guidance and support
      2. Adapt your communication style to the learner's needs
      3. Offer cultural context and insights
      4. Encourage and motivate the learner
      5. Provide constructive feedback
      6. Share relevant knowledge and expertise
      
      Always respond in a helpful, encouraging, and culturally sensitive manner.
    `;
  },

  buildConversationContext(history: ConversationMessage[]): string {
    const recentMessages = history.slice(-10);
    return recentMessages.map(msg => 
      `${msg.type}: ${msg.content}`
    ).join('\n');
  },

  detectEmotion(text: string): string {
    // Simple emotion detection based on keywords
    const emotions = {
      happy: ['joy', 'happy', 'excited', 'great', 'wonderful', 'amazing'],
      sad: ['sad', 'disappointed', 'frustrated', 'difficult', 'challenging'],
      neutral: ['okay', 'fine', 'good', 'well', 'understand'],
      encouraging: ['encourage', 'support', 'believe', 'can do', 'proud'],
      wise: ['wisdom', 'experience', 'learn', 'grow', 'understand']
    };

    const lowerText = text.toLowerCase();
    for (const [emotion, keywords] of Object.entries(emotions)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        return emotion;
      }
    }
    return 'neutral';
  },

  parsePerformanceInsights(_analysis: string, performanceData: PerformanceData): AdaptiveInsight[] {
    // Parse AI analysis into structured insights
    // This is a simplified implementation
    const insights: AdaptiveInsight[] = [];

    // Add insights based on performance data
    if (performanceData.accuracy < 70) {
      insights.push({
        id: `insight-${Date.now()}`,
        type: 'performance',
        title: 'Accuracy Improvement Needed',
        description: 'Focus on improving accuracy through practice and review',
        data: { accuracy: performanceData.accuracy },
        confidence: 0.8,
        actionable: true,
        priority: 'high',
        recommendations: ['Practice more exercises', 'Review previous lessons'],
        createdAt: new Date()
      });
    }

    if (performanceData.engagement > 80) {
      insights.push({
        id: `insight-${Date.now() + 1}`,
        type: 'behavior',
        title: 'High Engagement',
        description: 'Excellent engagement levels indicate strong motivation',
        data: { engagement: performanceData.engagement },
        confidence: 0.9,
        actionable: true,
        priority: 'medium',
        recommendations: ['Keep up the good work', 'Try more challenging content'],
        createdAt: new Date()
      });
    }

    return insights;
  },

  parseLearningPath(_pathData: string, adaptiveLearning: AdaptiveLearning): Omit<LearningPath, 'id'> {
    // Parse AI-generated learning path
    // This is a simplified implementation
    return {
      name: 'Personalized Learning Path',
      description: 'AI-generated learning path tailored to your needs',
      objectives: [],
      milestones: [],
      content: [],
      assessments: [],
      adaptations: [],
      progress: {
        overall: 0,
        objectives: {},
        milestones: {},
        content: {},
        assessments: {},
        timeSpent: 0,
        efficiency: 0,
        quality: 0,
        engagement: 0,
        lastUpdated: new Date()
      },
      estimatedDuration: 30,
      difficulty: 'intermediate',
      culturalFocus: adaptiveLearning.learningStyle.culturalPreferences.culturalGroups,
      language: adaptiveLearning.learningStyle.culturalPreferences.languages[0] || 'fr',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  },

  parsePersonalizedContent(_contentData: string, _adaptiveLearning: AdaptiveLearning): PersonalizedContent[] {
    // Parse AI-generated personalized content
    // This is a simplified implementation
    return [];
  },

  parseRecommendations(_recommendationData: string, _adaptiveLearning: AdaptiveLearning): AdaptiveRecommendation[] {
    // Parse AI-generated recommendations
    // This is a simplified implementation
    return [];
  }
};
