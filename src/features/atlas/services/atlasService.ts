/**
 * Atlas Service - Interactive Linguistic Atlas Data Management
 * 
 * This service manages all data operations for the Interactive Linguistic Atlas,
 * including language data, cultural context, migration history, and statistics.
 * 
 * @version 1.1.0
 * @author Ma'a yegue Team
 */

import { 
  Language, 
  LanguageFamily, 
  AtlasFilters, 
  AtlasStats, 
  AtlasSearchResult,
  LanguageDetailResponse,
  CulturalContext,
  MigrationEvent,
  LANGUAGE_FAMILIES,
  CAMEROON_REGIONS,
  ENDANGERED_LEVELS
} from '../types/atlas.types';
import { db } from '@/core/config/firebase.config';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  startAfter,
  DocumentSnapshot
} from 'firebase/firestore';

class AtlasService {
  private static instance: AtlasService;
  private cache: Map<string, any> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  static getInstance(): AtlasService {
    if (!AtlasService.instance) {
      AtlasService.instance = new AtlasService();
    }
    return AtlasService.instance;
  }

  /**
   * Get all languages with optional filtering
   */
  async getLanguages(filters?: AtlasFilters): Promise<Language[]> {
    const cacheKey = `languages_${JSON.stringify(filters || {})}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      let languagesQuery = query(
        collection(db, 'languages'),
        orderBy('speakers', 'desc')
      );

      const snapshot = await getDocs(languagesQuery);
      let languages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Language[];

      // Apply filters
      if (filters) {
        languages = this.applyFilters(languages, filters);
      }

      this.setCache(cacheKey, languages);
      return languages;
    } catch (error) {
      console.error('Error fetching languages:', error);
      throw new Error('Failed to fetch languages');
    }
  }

  /**
   * Get language by ID with full details
   */
  async getLanguageById(id: string): Promise<LanguageDetailResponse | null> {
    const cacheKey = `language_${id}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const languageDoc = await getDoc(doc(db, 'languages', id));
      
      if (!languageDoc.exists()) {
        return null;
      }

      const language = { id: languageDoc.id, ...languageDoc.data() } as Language;
      
      // Get related data
      const [culturalContext, migrationHistory] = await Promise.all([
        this.getCulturalContext(id),
        this.getMigrationHistory(id)
      ]);

      const response: LanguageDetailResponse = {
        language,
        culturalContext,
        relatedLanguages: await this.getRelatedLanguages(language),
        migrationHistory,
        statistics: await this.getLanguageStatistics(id)
      };

      this.setCache(cacheKey, response);
      return response;
    } catch (error) {
      console.error('Error fetching language details:', error);
      throw new Error('Failed to fetch language details');
    }
  }

  /**
   * Get all language families
   */
  async getLanguageFamilies(): Promise<LanguageFamily[]> {
    const cacheKey = 'language_families';
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      // For now, return static data. In production, this would come from Firestore
      const families = LANGUAGE_FAMILIES.map(family => ({
        ...family,
        totalLanguages: 0, // Will be calculated
        totalSpeakers: 0   // Will be calculated
      }));

      // Calculate statistics
      const languages = await this.getLanguages();
      families.forEach(family => {
        const familyLanguages = languages.filter(lang => lang.family.id === family.id);
        family.totalLanguages = familyLanguages.length;
        family.totalSpeakers = familyLanguages.reduce((sum, lang) => sum + lang.speakers, 0);
      });

      this.setCache(cacheKey, families);
      return families;
    } catch (error) {
      console.error('Error fetching language families:', error);
      throw new Error('Failed to fetch language families');
    }
  }

  /**
   * Search languages and families
   */
  async searchAtlas(query: string, limit: number = 20): Promise<AtlasSearchResult> {
    const startTime = Date.now();
    
    try {
      const searchQuery = query.toLowerCase().trim();
      
      if (searchQuery.length < 2) {
        return {
          languages: [],
          families: [],
          totalResults: 0,
          searchTime: Date.now() - startTime
        };
      }

      const [languages, families] = await Promise.all([
        this.getLanguages(),
        this.getLanguageFamilies()
      ]);

      // Filter languages
      const matchingLanguages = languages
        .filter(lang => 
          lang.name.toLowerCase().includes(searchQuery) ||
          lang.nativeName.toLowerCase().includes(searchQuery) ||
          lang.description.toLowerCase().includes(searchQuery) ||
          lang.region.toLowerCase().includes(searchQuery)
        )
        .slice(0, limit);

      // Filter families
      const matchingFamilies = families
        .filter(family =>
          family.name.toLowerCase().includes(searchQuery) ||
          family.description.toLowerCase().includes(searchQuery)
        )
        .slice(0, limit);

      const totalResults = matchingLanguages.length + matchingFamilies.length;

      return {
        languages: matchingLanguages,
        families: matchingFamilies,
        totalResults,
        searchTime: Date.now() - startTime,
        suggestions: this.generateSearchSuggestions(searchQuery, languages, families)
      };
    } catch (error) {
      console.error('Error searching atlas:', error);
      throw new Error('Search failed');
    }
  }

  /**
   * Get atlas statistics
   */
  async getAtlasStats(filters?: AtlasFilters): Promise<AtlasStats> {
    const cacheKey = `atlas_stats_${JSON.stringify(filters || {})}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const languages = await this.getLanguages(filters);
      const families = await this.getLanguageFamilies();

      const stats: AtlasStats = {
        totalLanguages: languages.length,
        totalSpeakers: languages.reduce((sum, lang) => sum + lang.speakers, 0),
        families: families.length,
        endangered: languages.filter(lang => lang.status === 'endangered' || lang.status === 'critically_endangered').length,
        criticallyEndangered: languages.filter(lang => lang.status === 'critically_endangered').length,
        extinct: languages.filter(lang => lang.status === 'extinct').length,
        withWritingSystems: languages.filter(lang => lang.writingSystems && lang.writingSystems.length > 0).length,
        regions: new Set(languages.map(lang => lang.region)).size
      };

      this.setCache(cacheKey, stats);
      return stats;
    } catch (error) {
      console.error('Error fetching atlas stats:', error);
      throw new Error('Failed to fetch atlas statistics');
    }
  }

  /**
   * Get endangered languages
   */
  async getEndangeredLanguages(): Promise<Language[]> {
    const cacheKey = 'endangered_languages';
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const languages = await this.getLanguages();
      const endangered = languages
        .filter(lang => 
          lang.status === 'endangered' || 
          lang.status === 'critically_endangered' ||
          lang.status === 'threatened'
        )
        .sort((a, b) => {
          // Sort by endangered level
          const levelOrder = { 'critically_endangered': 0, 'endangered': 1, 'threatened': 2 };
          return levelOrder[a.status] - levelOrder[b.status];
        });

      this.setCache(cacheKey, endangered);
      return endangered;
    } catch (error) {
      console.error('Error fetching endangered languages:', error);
      throw new Error('Failed to fetch endangered languages');
    }
  }

  /**
   * Get languages by region
   */
  async getLanguagesByRegion(region: string): Promise<Language[]> {
    const cacheKey = `languages_region_${region}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const languages = await this.getLanguages();
      const regionLanguages = languages.filter(lang => 
        lang.region.toLowerCase() === region.toLowerCase()
      );

      this.setCache(cacheKey, regionLanguages);
      return regionLanguages;
    } catch (error) {
      console.error('Error fetching languages by region:', error);
      throw new Error('Failed to fetch languages by region');
    }
  }

  /**
   * Get cultural context for a language
   */
  private async getCulturalContext(languageId: string): Promise<CulturalContext | undefined> {
    try {
      const culturalDoc = await getDoc(doc(db, 'cultural_contexts', languageId));
      
      if (!culturalDoc.exists()) {
        return undefined;
      }

      return { id: culturalDoc.id, ...culturalDoc.data() } as CulturalContext;
    } catch (error) {
      console.error('Error fetching cultural context:', error);
      return undefined;
    }
  }

  /**
   * Get migration history for a language
   */
  private async getMigrationHistory(languageId: string): Promise<MigrationEvent[]> {
    try {
      const migrationQuery = query(
        collection(db, 'migration_history'),
        where('languageId', '==', languageId),
        orderBy('period', 'asc')
      );

      const snapshot = await getDocs(migrationQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MigrationEvent[];
    } catch (error) {
      console.error('Error fetching migration history:', error);
      return [];
    }
  }

  /**
   * Get related languages
   */
  private async getRelatedLanguages(language: Language): Promise<Language[]> {
    try {
      if (!language.relatedLanguages || language.relatedLanguages.length === 0) {
        return [];
      }

      const relatedLanguages: Language[] = [];
      
      for (const relatedId of language.relatedLanguages) {
        const relatedDoc = await getDoc(doc(db, 'languages', relatedId));
        if (relatedDoc.exists()) {
          relatedLanguages.push({ id: relatedDoc.id, ...relatedDoc.data() } as Language);
        }
      }

      return relatedLanguages;
    } catch (error) {
      console.error('Error fetching related languages:', error);
      return [];
    }
  }

  /**
   * Get language statistics
   */
  private async getLanguageStatistics(languageId: string): Promise<any> {
    try {
      const statsDoc = await getDoc(doc(db, 'language_statistics', languageId));
      
      if (!statsDoc.exists()) {
        return {
          totalSpeakers: 0,
          growthRate: 0,
          ageDistribution: {},
          urbanization: 0
        };
      }

      return statsDoc.data();
    } catch (error) {
      console.error('Error fetching language statistics:', error);
      return {
        totalSpeakers: 0,
        growthRate: 0,
        ageDistribution: {},
        urbanization: 0
      };
    }
  }

  /**
   * Apply filters to languages
   */
  private applyFilters(languages: Language[], filters: AtlasFilters): Language[] {
    let filtered = languages;

    if (filters.families && filters.families.length > 0) {
      filtered = filtered.filter(lang => 
        filters.families!.includes(lang.family.id)
      );
    }

    if (filters.regions && filters.regions.length > 0) {
      filtered = filtered.filter(lang => 
        filters.regions!.includes(lang.region)
      );
    }

    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(lang => 
        filters.status!.includes(lang.status)
      );
    }

    if (filters.endangeredLevel && filters.endangeredLevel.length > 0) {
      filtered = filtered.filter(lang => 
        lang.endangeredLevel && filters.endangeredLevel!.includes(lang.endangeredLevel)
      );
    }

    if (filters.speakerRange) {
      filtered = filtered.filter(lang => 
        lang.speakers >= filters.speakerRange!.min && 
        lang.speakers <= filters.speakerRange!.max
      );
    }

    if (filters.hasWritingSystem !== undefined) {
      filtered = filtered.filter(lang => 
        filters.hasWritingSystem ? 
          (lang.writingSystems && lang.writingSystems.length > 0) :
          (!lang.writingSystems || lang.writingSystems.length === 0)
      );
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(lang =>
        lang.name.toLowerCase().includes(query) ||
        lang.nativeName.toLowerCase().includes(query) ||
        lang.description.toLowerCase().includes(query) ||
        lang.region.toLowerCase().includes(query)
      );
    }

    return filtered;
  }

  /**
   * Generate search suggestions
   */
  private generateSearchSuggestions(
    query: string, 
    languages: Language[], 
    families: LanguageFamily[]
  ): string[] {
    const suggestions = new Set<string>();
    
    // Add language names that start with the query
    languages
      .filter(lang => lang.name.toLowerCase().startsWith(query))
      .slice(0, 3)
      .forEach(lang => suggestions.add(lang.name));

    // Add family names that start with the query
    families
      .filter(family => family.name.toLowerCase().startsWith(query))
      .slice(0, 2)
      .forEach(family => suggestions.add(family.name));

    // Add regions that start with the query
    CAMEROON_REGIONS
      .filter(region => region.toLowerCase().startsWith(query))
      .slice(0, 2)
      .forEach(region => suggestions.add(region));

    return Array.from(suggestions).slice(0, 5);
  }

  /**
   * Check if cache is valid
   */
  private isCacheValid(key: string): boolean {
    const expiry = this.cacheExpiry.get(key);
    return expiry ? Date.now() < expiry : false;
  }

  /**
   * Set cache with expiry
   */
  private setCache(key: string, data: any): void {
    this.cache.set(key, data);
    this.cacheExpiry.set(key, Date.now() + this.CACHE_DURATION);
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    this.cacheExpiry.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Export singleton instance
export const atlasService = AtlasService.getInstance();

// Export class for testing
export { AtlasService };
