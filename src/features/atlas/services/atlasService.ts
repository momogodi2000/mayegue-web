/**
 * Atlas Service - Service for managing linguistic atlas data
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
  DocumentSnapshot,
  Query,
  CollectionReference,
  DocumentData
} from 'firebase/firestore';
import { 
  Language, 
  LanguageFamily, 
  AtlasFilters, 
  AtlasStats, 
  AtlasSearchResult,
  CulturalContext,
  MigrationEvent,
  AtlasApiResponse
} from '../types/atlas.types';

// Collection names
const LANGUAGES_COLLECTION = 'languages';
const FAMILIES_COLLECTION = 'languageFamilies';
const CULTURAL_CONTEXT_COLLECTION = 'culturalContext';
const MIGRATIONS_COLLECTION = 'migrations';

class AtlasService {
  /**
   * Get all languages with optional filtering
   */
  async getLanguages(filters?: AtlasFilters, limitCount?: number): Promise<Language[]> {
    try {
      let q: Query<DocumentData, DocumentData> | CollectionReference<DocumentData, DocumentData> = collection(db, LANGUAGES_COLLECTION);

      // Apply filters
      if (filters?.families && filters.families.length > 0) {
        q = query(q, where('family.id', 'in', filters.families));
      }

      if (filters?.regions && filters.regions.length > 0) {
        q = query(q, where('region', 'in', filters.regions));
      }

      if (filters?.status && filters.status.length > 0) {
        q = query(q, where('status', 'in', filters.status));
      }

      if (filters?.endangeredLevel && filters.endangeredLevel.length > 0) {
        q = query(q, where('endangeredLevel', 'in', filters.endangeredLevel));
      }

      if (filters?.hasWritingSystem !== undefined) {
        q = query(q, where('writingSystems', filters.hasWritingSystem ? '!=' : '==', null));
      }

      if (filters?.speakerRange) {
        q = query(q, 
          where('speakers', '>=', filters.speakerRange.min),
          where('speakers', '<=', filters.speakerRange.max)
        );
      }

      // Order by name
      q = query(q, orderBy('name'));

      // Apply limit
      if (limitCount) {
        q = query(q, limit(limitCount));
      }

      const querySnapshot = await getDocs(q);
      let languages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Language));

      // Apply text search if provided
      if (filters?.searchQuery) {
        const searchTerm = filters.searchQuery.toLowerCase();
        languages = languages.filter(lang => 
          lang.name.toLowerCase().includes(searchTerm) ||
          lang.nativeName.toLowerCase().includes(searchTerm) ||
          lang.description.toLowerCase().includes(searchTerm) ||
          lang.family.name.toLowerCase().includes(searchTerm) ||
          lang.region.toLowerCase().includes(searchTerm)
        );
      }

      return languages;
    } catch (error) {
      console.error('Error fetching languages:', error);
      throw new Error('Failed to fetch languages');
    }
  }

  /**
   * Get a single language by ID
   */
  async getLanguageById(id: string): Promise<Language | null> {
    try {
      const docRef = doc(db, LANGUAGES_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Language;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching language:', error);
      throw new Error('Failed to fetch language');
    }
  }

  /**
   * Get all language families
   */
  async getLanguageFamilies(): Promise<LanguageFamily[]> {
    try {
      const querySnapshot = await getDocs(collection(db, FAMILIES_COLLECTION));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as LanguageFamily));
    } catch (error) {
      console.error('Error fetching language families:', error);
      throw new Error('Failed to fetch language families');
    }
  }

  /**
   * Get languages by region
   */
  async getLanguagesByRegion(region: string): Promise<Language[]> {
    try {
      const q = query(
        collection(db, LANGUAGES_COLLECTION),
        where('region', '==', region),
        orderBy('name')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Language));
    } catch (error) {
      console.error('Error fetching languages by region:', error);
      throw new Error('Failed to fetch languages by region');
    }
  }

  /**
   * Get endangered languages
   */
  async getEndangeredLanguages(): Promise<Language[]> {
    try {
      const q = query(
        collection(db, LANGUAGES_COLLECTION),
        where('status', 'in', ['endangered', 'critically_endangered']),
        orderBy('speakers', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Language));
    } catch (error) {
      console.error('Error fetching endangered languages:', error);
      throw new Error('Failed to fetch endangered languages');
    }
  }

  /**
   * Get cultural context for a language
   */
  async getCulturalContext(languageId: string): Promise<CulturalContext | null> {
    try {
      const q = query(
        collection(db, CULTURAL_CONTEXT_COLLECTION),
        where('languageId', '==', languageId)
      );
      
      const querySnapshot = await getDocs(q);
      if (querySnapshot.docs.length > 0) {
        return {
          id: querySnapshot.docs[0].id,
          ...querySnapshot.docs[0].data()
        } as CulturalContext;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching cultural context:', error);
      throw new Error('Failed to fetch cultural context');
    }
  }

  /**
   * Get migration history for a language
   */
  async getMigrationHistory(languageId: string): Promise<MigrationEvent[]> {
    try {
      const q = query(
        collection(db, MIGRATIONS_COLLECTION),
        where('languageId', '==', languageId),
        orderBy('period')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as MigrationEvent));
    } catch (error) {
      console.error('Error fetching migration history:', error);
      throw new Error('Failed to fetch migration history');
    }
  }

  /**
   * Get all migration events
   */
  async getAllMigrationEvents(): Promise<MigrationEvent[]> {
    try {
      const q = query(
        collection(db, MIGRATIONS_COLLECTION),
        orderBy('period')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as MigrationEvent));
    } catch (error) {
      console.error('Error fetching migration events:', error);
      throw new Error('Failed to fetch migration events');
    }
  }

  /**
   * Search languages
   */
  async searchLanguages(query: string, limitCount: number = 20): Promise<AtlasSearchResult> {
    try {
      const startTime = Date.now();
      
      // Get all languages and filter client-side for now
      // In production, you might want to use a search service like Algolia
      const languages = await this.getLanguages();
      
      const searchTerm = query.toLowerCase();
      const filteredLanguages = languages.filter(lang => 
        lang.name.toLowerCase().includes(searchTerm) ||
        lang.nativeName.toLowerCase().includes(searchTerm) ||
        lang.description.toLowerCase().includes(searchTerm) ||
        lang.family.name.toLowerCase().includes(searchTerm) ||
        lang.region.toLowerCase().includes(searchTerm)
      ).slice(0, limitCount);

      const families = await this.getLanguageFamilies();
      const filteredFamilies = families.filter(family =>
        family.name.toLowerCase().includes(searchTerm) ||
        family.description.toLowerCase().includes(searchTerm)
      );

      const searchTime = Date.now() - startTime;

      return {
        languages: filteredLanguages,
        families: filteredFamilies,
        totalResults: filteredLanguages.length + filteredFamilies.length,
        searchTime,
        suggestions: this.generateSuggestions(query, languages)
      };
    } catch (error) {
      console.error('Error searching languages:', error);
      throw new Error('Failed to search languages');
    }
  }

  /**
   * Get atlas statistics
   */
  async getAtlasStats(): Promise<AtlasStats> {
    try {
      const languages = await this.getLanguages();
      const families = await this.getLanguageFamilies();

      const totalSpeakers = languages.reduce((sum, lang) => sum + lang.speakers, 0);
      const endangered = languages.filter(lang => 
        lang.status === 'endangered' || lang.status === 'critically_endangered'
      ).length;
      const criticallyEndangered = languages.filter(lang => 
        lang.status === 'critically_endangered'
      ).length;
      const extinct = languages.filter(lang => lang.status === 'extinct').length;
      const withWritingSystems = languages.filter(lang => 
        lang.writingSystems && lang.writingSystems.length > 0
      ).length;
      const regions = new Set(languages.map(lang => lang.region)).size;

      return {
        totalLanguages: languages.length,
        totalSpeakers,
        families: families.length,
        endangered,
        criticallyEndangered,
        extinct,
        withWritingSystems,
        regions
      };
    } catch (error) {
      console.error('Error fetching atlas stats:', error);
      throw new Error('Failed to fetch atlas statistics');
    }
  }

  /**
   * Get available regions
   */
  async getAvailableRegions(): Promise<string[]> {
    try {
      const languages = await this.getLanguages();
      const regions = new Set(languages.map(lang => lang.region));
      return Array.from(regions).sort();
    } catch (error) {
      console.error('Error fetching regions:', error);
      throw new Error('Failed to fetch regions');
    }
  }

  /**
   * Generate search suggestions
   */
  private generateSuggestions(query: string, languages: Language[]): string[] {
    const suggestions = new Set<string>();
    const queryLower = query.toLowerCase();

    // Add language names that start with the query
    languages.forEach(lang => {
      if (lang.name.toLowerCase().startsWith(queryLower)) {
        suggestions.add(lang.name);
      }
      if (lang.nativeName.toLowerCase().startsWith(queryLower)) {
        suggestions.add(lang.nativeName);
      }
    });

    // Add regions that start with the query
    const regions = new Set(languages.map(lang => lang.region));
    regions.forEach(region => {
      if (region.toLowerCase().startsWith(queryLower)) {
        suggestions.add(region);
      }
    });

    return Array.from(suggestions).slice(0, 5);
  }

  /**
   * Get paginated languages
   */
  async getPaginatedLanguages(
    page: number = 1,
    pageSize: number = 20,
    filters?: AtlasFilters
  ): Promise<AtlasApiResponse<Language[]>> {
    try {
      const languages = await this.getLanguages(filters);
      const total = languages.length;
      const totalPages = Math.ceil(total / pageSize);
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedLanguages = languages.slice(startIndex, endIndex);

      return {
        success: true,
        data: paginatedLanguages,
        pagination: {
          page,
          limit: pageSize,
          total,
          totalPages
        }
      };
    } catch (error) {
      console.error('Error fetching paginated languages:', error);
      return {
        success: false,
        data: [],
        message: 'Failed to fetch languages'
      };
    }
  }
}

// Export singleton instance
export const atlasService = new AtlasService();
export default atlasService;