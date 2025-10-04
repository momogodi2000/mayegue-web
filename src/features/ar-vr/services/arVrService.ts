/**
 * AR/VR Service - Firebase service for AR/VR data
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
  orderBy, 
  limit, 
  startAfter,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  increment,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { 
  ARScene, 
  ARSession, 
  ARFilter, 
  ARSearchResult, 
  ARStats,
  AR_SCENE_TYPES,
  AR_CATEGORIES,
  AR_DIFFICULTIES,
  CAMEROON_REGIONS
} from '../types/ar-vr.types';

const AR_SCENES_COLLECTION = 'ar_scenes';
const AR_SESSIONS_COLLECTION = 'ar_sessions';
const AR_ACHIEVEMENTS_COLLECTION = 'ar_achievements';
const AR_ANALYTICS_COLLECTION = 'ar_analytics';

export const arVrService = {
  // AR Scenes CRUD operations
  async getAllScenes(): Promise<ARScene[]> {
    try {
      const querySnapshot = await getDocs(collection(db, AR_SCENES_COLLECTION));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      } as ARScene));
    } catch (error) {
      console.error('Error fetching all AR scenes:', error);
      throw new Error('Failed to fetch AR scenes');
    }
  },

  async getSceneById(id: string): Promise<ARScene | null> {
    try {
      const docRef = doc(db, AR_SCENES_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate() || new Date(),
          updatedAt: docSnap.data().updatedAt?.toDate() || new Date()
        } as ARScene;
      }
      return null;
    } catch (error) {
      console.error('Error fetching AR scene by ID:', error);
      throw new Error('Failed to fetch AR scene');
    }
  },

  async getScenesByType(type: string): Promise<ARScene[]> {
    try {
      const q = query(
        collection(db, AR_SCENES_COLLECTION),
        where('type', '==', type),
        where('isActive', '==', true),
        orderBy('rating', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      } as ARScene));
    } catch (error) {
      console.error('Error fetching AR scenes by type:', error);
      throw new Error('Failed to fetch AR scenes by type');
    }
  },

  async getScenesByLanguage(language: string): Promise<ARScene[]> {
    try {
      const q = query(
        collection(db, AR_SCENES_COLLECTION),
        where('language', '==', language),
        where('isActive', '==', true),
        orderBy('rating', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      } as ARScene));
    } catch (error) {
      console.error('Error fetching AR scenes by language:', error);
      throw new Error('Failed to fetch AR scenes by language');
    }
  },

  async getFeaturedScenes(): Promise<ARScene[]> {
    try {
      const q = query(
        collection(db, AR_SCENES_COLLECTION),
        where('isFeatured', '==', true),
        where('isActive', '==', true),
        orderBy('rating', 'desc'),
        limit(10)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      } as ARScene));
    } catch (error) {
      console.error('Error fetching featured AR scenes:', error);
      throw new Error('Failed to fetch featured AR scenes');
    }
  },

  async searchScenes(query: string, filters?: ARFilter): Promise<ARSearchResult[]> {
    try {
      let q = query(collection(db, AR_SCENES_COLLECTION), where('isActive', '==', true));

      // Apply filters
      if (filters?.type && filters.type.length > 0) {
        q = query(q, where('type', 'in', filters.type));
      }
      if (filters?.category && filters.category.length > 0) {
        q = query(q, where('category', 'in', filters.category));
      }
      if (filters?.language && filters.language.length > 0) {
        q = query(q, where('language', 'in', filters.language));
      }
      if (filters?.culturalGroup && filters.culturalGroup.length > 0) {
        q = query(q, where('culturalGroup', 'in', filters.culturalGroup));
      }
      if (filters?.region && filters.region.length > 0) {
        q = query(q, where('region', 'in', filters.region));
      }
      if (filters?.difficulty && filters.difficulty.length > 0) {
        q = query(q, where('difficulty', 'in', filters.difficulty));
      }
      if (filters?.isFeatured) {
        q = query(q, where('isFeatured', '==', true));
      }
      if (filters?.hasVR) {
        q = query(q, where('vrContent', '!=', null));
      }

      const querySnapshot = await getDocs(q);
      let results = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          type: data.type,
          category: data.category,
          language: data.language,
          culturalGroup: data.culturalGroup,
          region: data.region,
          difficulty: data.difficulty,
          duration: data.duration,
          rating: data.rating || 0,
          thumbnailUrl: data.thumbnailUrl,
          relevanceScore: 0
        } as ARSearchResult;
      });

      // Filter by search query
      if (query) {
        const lowerQuery = query.toLowerCase();
        results = results.filter(scene => 
          scene.name.toLowerCase().includes(lowerQuery) ||
          scene.language.toLowerCase().includes(lowerQuery) ||
          scene.culturalGroup.toLowerCase().includes(lowerQuery) ||
          scene.region.toLowerCase().includes(lowerQuery)
        );
      }

      // Apply duration filter
      if (filters?.duration) {
        results = results.filter(scene => 
          scene.duration >= filters.duration!.min && 
          scene.duration <= filters.duration!.max
        );
      }

      // Apply rating filter
      if (filters?.rating) {
        results = results.filter(scene => 
          scene.rating >= filters.rating!.min && 
          scene.rating <= filters.rating!.max
        );
      }

      // Calculate relevance scores
      results.forEach(scene => {
        let score = 0;
        if (query) {
          const lowerQuery = query.toLowerCase();
          if (scene.name.toLowerCase().includes(lowerQuery)) score += 10;
          if (scene.language.toLowerCase().includes(lowerQuery)) score += 8;
          if (scene.culturalGroup.toLowerCase().includes(lowerQuery)) score += 6;
          if (scene.region.toLowerCase().includes(lowerQuery)) score += 4;
        }
        score += scene.rating * 2;
        scene.relevanceScore = score;
      });

      // Sort by relevance
      results.sort((a, b) => b.relevanceScore - a.relevanceScore);

      return results;
    } catch (error) {
      console.error('Error searching AR scenes:', error);
      throw new Error('Failed to search AR scenes');
    }
  },

  // AR Sessions CRUD operations
  async createSession(session: Omit<ARSession, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, AR_SESSIONS_COLLECTION), {
        ...session,
        startTime: Timestamp.fromDate(session.startTime),
        endTime: session.endTime ? Timestamp.fromDate(session.endTime) : null
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating AR session:', error);
      throw new Error('Failed to create AR session');
    }
  },

  async getSessionById(id: string): Promise<ARSession | null> {
    try {
      const docRef = doc(db, AR_SESSIONS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          startTime: docSnap.data().startTime?.toDate() || new Date(),
          endTime: docSnap.data().endTime?.toDate() || undefined
        } as ARSession;
      }
      return null;
    } catch (error) {
      console.error('Error fetching AR session by ID:', error);
      throw new Error('Failed to fetch AR session');
    }
  },

  async getSessionsByUser(userId: string): Promise<ARSession[]> {
    try {
      const q = query(
        collection(db, AR_SESSIONS_COLLECTION),
        where('userId', '==', userId),
        orderBy('startTime', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startTime: doc.data().startTime?.toDate() || new Date(),
        endTime: doc.data().endTime?.toDate() || undefined
      } as ARSession));
    } catch (error) {
      console.error('Error fetching AR sessions by user:', error);
      throw new Error('Failed to fetch AR sessions');
    }
  },

  async updateSession(id: string, updates: Partial<ARSession>): Promise<void> {
    try {
      const docRef = doc(db, AR_SESSIONS_COLLECTION, id);
      const updateData: any = { ...updates };
      
      if (updates.endTime) {
        updateData.endTime = Timestamp.fromDate(updates.endTime);
      }
      
      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating AR session:', error);
      throw new Error('Failed to update AR session');
    }
  },

  async endSession(id: string, feedback?: any): Promise<void> {
    try {
      const docRef = doc(db, AR_SESSIONS_COLLECTION, id);
      const endTime = new Date();
      
      await updateDoc(docRef, {
        endTime: Timestamp.fromDate(endTime),
        feedback: feedback || null,
        updatedAt: Timestamp.fromDate(new Date())
      });
    } catch (error) {
      console.error('Error ending AR session:', error);
      throw new Error('Failed to end AR session');
    }
  },

  // AR Analytics
  async recordInteraction(sessionId: string, interaction: any): Promise<void> {
    try {
      const docRef = doc(db, AR_SESSIONS_COLLECTION, sessionId);
      await updateDoc(docRef, {
        interactions: arrayUnion({
          ...interaction,
          timestamp: Timestamp.fromDate(new Date())
        })
      });
    } catch (error) {
      console.error('Error recording AR interaction:', error);
      throw new Error('Failed to record AR interaction');
    }
  },

  async recordAchievement(sessionId: string, achievement: any): Promise<void> {
    try {
      const docRef = doc(db, AR_SESSIONS_COLLECTION, sessionId);
      await updateDoc(docRef, {
        achievements: arrayUnion({
          ...achievement,
          unlockedAt: Timestamp.fromDate(new Date())
        })
      });
    } catch (error) {
      console.error('Error recording AR achievement:', error);
      throw new Error('Failed to record AR achievement');
    }
  },

  async recordError(sessionId: string, error: any): Promise<void> {
    try {
      const docRef = doc(db, AR_SESSIONS_COLLECTION, sessionId);
      await updateDoc(docRef, {
        errors: arrayUnion({
          ...error,
          timestamp: Timestamp.fromDate(new Date())
        })
      });
    } catch (err) {
      console.error('Error recording AR error:', err);
      throw new Error('Failed to record AR error');
    }
  },

  // AR Statistics
  async getARStats(): Promise<ARStats> {
    try {
      const [scenes, sessions] = await Promise.all([
        this.getAllScenes(),
        getDocs(collection(db, AR_SESSIONS_COLLECTION))
      ]);

      const totalSessions = sessions.docs.length;
      const averageSessionDuration = sessions.docs.reduce((sum, doc) => {
        const session = doc.data();
        return sum + (session.duration || 0);
      }, 0) / totalSessions || 0;

      const completionRate = sessions.docs.filter(doc => {
        const session = doc.data();
        return session.progress?.completedObjectives?.length > 0;
      }).length / totalSessions || 0;

      const userSatisfaction = sessions.docs.reduce((sum, doc) => {
        const session = doc.data();
        return sum + (session.feedback?.rating || 0);
      }, 0) / totalSessions || 0;

      // Calculate scene stats
      const sceneStats = scenes.map(scene => ({
        sceneId: scene.id,
        sceneName: scene.name,
        sessions: sessions.docs.filter(doc => doc.data().sceneId === scene.id).length,
        completionRate: 0, // Calculate from sessions
        averageRating: scene.rating,
        averageDuration: 0 // Calculate from sessions
      }));

      // Calculate language stats
      const languageStats = Array.from(new Set(scenes.map(s => s.language))).map(language => ({
        language,
        scenes: scenes.filter(s => s.language === language).length,
        sessions: sessions.docs.filter(doc => {
          const scene = scenes.find(s => s.id === doc.data().sceneId);
          return scene?.language === language;
        }).length,
        completionRate: 0, // Calculate from sessions
        averageRating: 0 // Calculate from sessions
      }));

      // Calculate region stats
      const regionStats = CAMEROON_REGIONS.map(region => ({
        region,
        scenes: scenes.filter(s => s.region === region).length,
        sessions: sessions.docs.filter(doc => {
          const scene = scenes.find(s => s.id === doc.data().sceneId);
          return scene?.region === region;
        }).length,
        completionRate: 0, // Calculate from sessions
        averageRating: 0 // Calculate from sessions
      }));

      // Calculate device stats (placeholder)
      const deviceStats = [
        { device: 'iOS', sessions: 0, averagePerformance: 0, errorRate: 0, userSatisfaction: 0 },
        { device: 'Android', sessions: 0, averagePerformance: 0, errorRate: 0, userSatisfaction: 0 },
        { device: 'Web', sessions: 0, averagePerformance: 0, errorRate: 0, userSatisfaction: 0 }
      ];

      // Calculate performance stats (placeholder)
      const performanceStats = [
        { metric: 'frameRate', average: 60, min: 30, max: 120, trend: 'stable' as const },
        { metric: 'latency', average: 16, min: 8, max: 33, trend: 'improving' as const },
        { metric: 'memoryUsage', average: 512, min: 256, max: 1024, trend: 'stable' as const }
      ];

      const stats: ARStats = {
        totalScenes: scenes.length,
        totalUsers: new Set(sessions.docs.map(doc => doc.data().userId)).size,
        totalSessions,
        averageSessionDuration,
        completionRate,
        userSatisfaction,
        topScenes: sceneStats,
        topLanguages: languageStats,
        topRegions: regionStats,
        deviceStats,
        performanceStats,
        lastUpdated: new Date()
      };

      return stats;
    } catch (error) {
      console.error('Error fetching AR stats:', error);
      throw new Error('Failed to fetch AR statistics');
    }
  },

  // AR Scene Management
  async createScene(scene: Omit<ARScene, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, AR_SCENES_COLLECTION), {
        ...scene,
        createdAt: Timestamp.fromDate(scene.createdAt),
        updatedAt: Timestamp.fromDate(scene.updatedAt)
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating AR scene:', error);
      throw new Error('Failed to create AR scene');
    }
  },

  async updateScene(id: string, updates: Partial<ARScene>): Promise<void> {
    try {
      const docRef = doc(db, AR_SCENES_COLLECTION, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.fromDate(new Date())
      });
    } catch (error) {
      console.error('Error updating AR scene:', error);
      throw new Error('Failed to update AR scene');
    }
  },

  async deleteScene(id: string): Promise<void> {
    try {
      const docRef = doc(db, AR_SCENES_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting AR scene:', error);
      throw new Error('Failed to delete AR scene');
    }
  },

  // AR Content Management
  async updateSceneContent(sceneId: string, content: any): Promise<void> {
    try {
      const docRef = doc(db, AR_SCENES_COLLECTION, sceneId);
      await updateDoc(docRef, {
        arContent: content,
        updatedAt: Timestamp.fromDate(new Date())
      });
    } catch (error) {
      console.error('Error updating AR scene content:', error);
      throw new Error('Failed to update AR scene content');
    }
  },

  async updateSceneInteractions(sceneId: string, interactions: any[]): Promise<void> {
    try {
      const docRef = doc(db, AR_SCENES_COLLECTION, sceneId);
      await updateDoc(docRef, {
        interactions,
        updatedAt: Timestamp.fromDate(new Date())
      });
    } catch (error) {
      console.error('Error updating AR scene interactions:', error);
      throw new Error('Failed to update AR scene interactions');
    }
  },

  // AR Performance Monitoring
  async recordPerformanceMetrics(sessionId: string, metrics: any): Promise<void> {
    try {
      const docRef = doc(db, AR_SESSIONS_COLLECTION, sessionId);
      await updateDoc(docRef, {
        performance: metrics,
        updatedAt: Timestamp.fromDate(new Date())
      });
    } catch (error) {
      console.error('Error recording AR performance metrics:', error);
      throw new Error('Failed to record AR performance metrics');
    }
  },

  // AR User Progress
  async getUserProgress(userId: string): Promise<any> {
    try {
      const sessions = await this.getSessionsByUser(userId);
      
      const progress = {
        totalSessions: sessions.length,
        totalTimeSpent: sessions.reduce((sum, session) => sum + session.duration, 0),
        completedScenes: new Set(sessions.filter(s => s.progress.completedObjectives.length > 0).map(s => s.sceneId)).size,
        totalAchievements: sessions.reduce((sum, session) => sum + session.achievements.length, 0),
        averageRating: sessions.reduce((sum, session) => sum + (session.feedback?.rating || 0), 0) / sessions.length || 0,
        favoriteScenes: this.getMostPlayedScenes(sessions),
        recentActivity: sessions.slice(0, 10).map(session => ({
          sceneId: session.sceneId,
          startTime: session.startTime,
          duration: session.duration,
          rating: session.feedback?.rating
        }))
      };

      return progress;
    } catch (error) {
      console.error('Error fetching user progress:', error);
      throw new Error('Failed to fetch user progress');
    }
  },

  // Helper methods
  getMostPlayedScenes(sessions: ARSession[]): any[] {
    const sceneCounts = new Map<string, number>();
    
    sessions.forEach(session => {
      const count = sceneCounts.get(session.sceneId) || 0;
      sceneCounts.set(session.sceneId, count + 1);
    });

    return Array.from(sceneCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([sceneId, count]) => ({ sceneId, count }));
  },

  // AR Scene Validation
  async validateScene(scene: ARScene): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    // Required fields
    if (!scene.name) errors.push('Scene name is required');
    if (!scene.description) errors.push('Scene description is required');
    if (!scene.type) errors.push('Scene type is required');
    if (!scene.language) errors.push('Scene language is required');
    if (!scene.culturalGroup) errors.push('Cultural group is required');
    if (!scene.region) errors.push('Region is required');

    // Content validation
    if (!scene.arContent) errors.push('AR content is required');
    if (!scene.arContent.environment) errors.push('AR environment is required');
    if (!scene.arContent.objects || scene.arContent.objects.length === 0) {
      errors.push('At least one AR object is required');
    }

    // Interaction validation
    if (!scene.interactions || scene.interactions.length === 0) {
      errors.push('At least one interaction is required');
    }

    // Learning objectives validation
    if (!scene.learningObjectives || scene.learningObjectives.length === 0) {
      errors.push('At least one learning objective is required');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
};
