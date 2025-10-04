/**
 * Encyclopedia Service - Cultural Encyclopedia Data Management
 * 
 * This service manages all data operations for the Cultural Encyclopedia,
 * including ethnic groups, traditions, cuisine, crafts, and cultural artifacts.
 * 
 * @version 1.1.0
 * @author Ma'a yegue Team
 */

import { 
  EthnicGroup, 
  Tradition, 
  CuisineItem, 
  Craft, 
  Story, 
  Proverb, 
  MusicItem, 
  Dance, 
  Ceremony, 
  EncyclopediaFilters, 
  EncyclopediaStats, 
  EncyclopediaSearchResult,
  CAMEROON_REGIONS
} from '../types/encyclopedia.types';
import { db } from '@/core/config/firebase.config';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit
} from 'firebase/firestore';

class EncyclopediaService {
  private static instance: EncyclopediaService;
  private cache: Map<string, any> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  static getInstance(): EncyclopediaService {
    if (!EncyclopediaService.instance) {
      EncyclopediaService.instance = new EncyclopediaService();
    }
    return EncyclopediaService.instance;
  }

  /**
   * Get all ethnic groups
   */
  async getEthnicGroups(filters?: EncyclopediaFilters): Promise<EthnicGroup[]> {
    const cacheKey = `ethnic_groups_${JSON.stringify(filters || {})}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      let groupsQuery = query(
        collection(db, 'ethnic_groups'),
        orderBy('name', 'asc')
      );

      const snapshot = await getDocs(groupsQuery);
      let groups = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as EthnicGroup[];

      // Apply filters
      if (filters) {
        groups = this.applyEthnicGroupFilters(groups, filters);
      }

      this.setCache(cacheKey, groups);
      return groups;
    } catch (error) {
      console.error('Error fetching ethnic groups:', error);
      throw new Error('Failed to fetch ethnic groups');
    }
  }

  /**
   * Get ethnic group by ID
   */
  async getEthnicGroupById(id: string): Promise<EthnicGroup | null> {
    const cacheKey = `ethnic_group_${id}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const groupDoc = await getDoc(doc(db, 'ethnic_groups', id));
      
      if (!groupDoc.exists()) {
        return null;
      }

      const group = { id: groupDoc.id, ...groupDoc.data() } as EthnicGroup;
      this.setCache(cacheKey, group);
      return group;
    } catch (error) {
      console.error('Error fetching ethnic group:', error);
      throw new Error('Failed to fetch ethnic group');
    }
  }

  /**
   * Get traditions
   */
  async getTraditions(filters?: EncyclopediaFilters): Promise<Tradition[]> {
    const cacheKey = `traditions_${JSON.stringify(filters || {})}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      let traditionsQuery = query(
        collection(db, 'traditions'),
        orderBy('name', 'asc')
      );

      const snapshot = await getDocs(traditionsQuery);
      let traditions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Tradition[];

      // Apply filters
      if (filters) {
        traditions = this.applyTraditionFilters(traditions, filters);
      }

      this.setCache(cacheKey, traditions);
      return traditions;
    } catch (error) {
      console.error('Error fetching traditions:', error);
      throw new Error('Failed to fetch traditions');
    }
  }

  /**
   * Get cuisine items
   */
  async getCuisineItems(filters?: EncyclopediaFilters): Promise<CuisineItem[]> {
    const cacheKey = `cuisine_${JSON.stringify(filters || {})}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      let cuisineQuery = query(
        collection(db, 'cuisine'),
        orderBy('name', 'asc')
      );

      const snapshot = await getDocs(cuisineQuery);
      let cuisine = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CuisineItem[];

      // Apply filters
      if (filters) {
        cuisine = this.applyCuisineFilters(cuisine, filters);
      }

      this.setCache(cacheKey, cuisine);
      return cuisine;
    } catch (error) {
      console.error('Error fetching cuisine items:', error);
      throw new Error('Failed to fetch cuisine items');
    }
  }

  /**
   * Get crafts
   */
  async getCrafts(filters?: EncyclopediaFilters): Promise<Craft[]> {
    const cacheKey = `crafts_${JSON.stringify(filters || {})}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      let craftsQuery = query(
        collection(db, 'crafts'),
        orderBy('name', 'asc')
      );

      const snapshot = await getDocs(craftsQuery);
      let crafts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Craft[];

      // Apply filters
      if (filters) {
        crafts = this.applyCraftFilters(crafts, filters);
      }

      this.setCache(cacheKey, crafts);
      return crafts;
    } catch (error) {
      console.error('Error fetching crafts:', error);
      throw new Error('Failed to fetch crafts');
    }
  }

  /**
   * Get stories
   */
  async getStories(filters?: EncyclopediaFilters): Promise<Story[]> {
    const cacheKey = `stories_${JSON.stringify(filters || {})}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      let storiesQuery = query(
        collection(db, 'stories'),
        orderBy('title', 'asc')
      );

      const snapshot = await getDocs(storiesQuery);
      let stories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Story[];

      // Apply filters
      if (filters) {
        stories = this.applyStoryFilters(stories, filters);
      }

      this.setCache(cacheKey, stories);
      return stories;
    } catch (error) {
      console.error('Error fetching stories:', error);
      throw new Error('Failed to fetch stories');
    }
  }

  /**
   * Get proverbs
   */
  async getProverbs(filters?: EncyclopediaFilters): Promise<Proverb[]> {
    const cacheKey = `proverbs_${JSON.stringify(filters || {})}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      let proverbsQuery = query(
        collection(db, 'proverbs'),
        orderBy('text', 'asc')
      );

      const snapshot = await getDocs(proverbsQuery);
      let proverbs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Proverb[];

      // Apply filters
      if (filters) {
        proverbs = this.applyProverbFilters(proverbs, filters);
      }

      this.setCache(cacheKey, proverbs);
      return proverbs;
    } catch (error) {
      console.error('Error fetching proverbs:', error);
      throw new Error('Failed to fetch proverbs');
    }
  }

  /**
   * Get music items
   */
  async getMusicItems(filters?: EncyclopediaFilters): Promise<MusicItem[]> {
    const cacheKey = `music_${JSON.stringify(filters || {})}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      let musicQuery = query(
        collection(db, 'music'),
        orderBy('name', 'asc')
      );

      const snapshot = await getDocs(musicQuery);
      let music = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MusicItem[];

      // Apply filters
      if (filters) {
        music = this.applyMusicFilters(music, filters);
      }

      this.setCache(cacheKey, music);
      return music;
    } catch (error) {
      console.error('Error fetching music items:', error);
      throw new Error('Failed to fetch music items');
    }
  }

  /**
   * Get dances
   */
  async getDances(filters?: EncyclopediaFilters): Promise<Dance[]> {
    const cacheKey = `dances_${JSON.stringify(filters || {})}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      let dancesQuery = query(
        collection(db, 'dances'),
        orderBy('name', 'asc')
      );

      const snapshot = await getDocs(dancesQuery);
      let dances = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Dance[];

      // Apply filters
      if (filters) {
        dances = this.applyDanceFilters(dances, filters);
      }

      this.setCache(cacheKey, dances);
      return dances;
    } catch (error) {
      console.error('Error fetching dances:', error);
      throw new Error('Failed to fetch dances');
    }
  }

  /**
   * Get ceremonies
   */
  async getCeremonies(filters?: EncyclopediaFilters): Promise<Ceremony[]> {
    const cacheKey = `ceremonies_${JSON.stringify(filters || {})}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      let ceremoniesQuery = query(
        collection(db, 'ceremonies'),
        orderBy('name', 'asc')
      );

      const snapshot = await getDocs(ceremoniesQuery);
      let ceremonies = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Ceremony[];

      // Apply filters
      if (filters) {
        ceremonies = this.applyCeremonyFilters(ceremonies, filters);
      }

      this.setCache(cacheKey, ceremonies);
      return ceremonies;
    } catch (error) {
      console.error('Error fetching ceremonies:', error);
      throw new Error('Failed to fetch ceremonies');
    }
  }

  /**
   * Search encyclopedia content
   */
  async searchEncyclopedia(query: string, limit: number = 20): Promise<EncyclopediaSearchResult> {
    const startTime = Date.now();
    
    try {
      const searchQuery = query.toLowerCase().trim();
      
      if (searchQuery.length < 2) {
        return {
          groups: [],
          traditions: [],
          cuisine: [],
          crafts: [],
          stories: [],
          proverbs: [],
          music: [],
          dances: [],
          ceremonies: [],
          totalResults: 0,
          searchTime: Date.now() - startTime
        };
      }

      const [
        groups, traditions, cuisine, crafts, stories, 
        proverbs, music, dances, ceremonies
      ] = await Promise.all([
        this.getEthnicGroups(),
        this.getTraditions(),
        this.getCuisineItems(),
        this.getCrafts(),
        this.getStories(),
        this.getProverbs(),
        this.getMusicItems(),
        this.getDances(),
        this.getCeremonies()
      ]);

      // Filter results
      const matchingGroups = groups
        .filter(item => this.matchesSearch(item.name, item.description, searchQuery))
        .slice(0, limit);

      const matchingTraditions = traditions
        .filter(item => this.matchesSearch(item.name, item.description, searchQuery))
        .slice(0, limit);

      const matchingCuisine = cuisine
        .filter(item => this.matchesSearch(item.name, item.description, searchQuery))
        .slice(0, limit);

      const matchingCrafts = crafts
        .filter(item => this.matchesSearch(item.name, item.description, searchQuery))
        .slice(0, limit);

      const matchingStories = stories
        .filter(item => this.matchesSearch(item.title, item.description, searchQuery))
        .slice(0, limit);

      const matchingProverbs = proverbs
        .filter(item => this.matchesSearch(item.text, item.meaning, searchQuery))
        .slice(0, limit);

      const matchingMusic = music
        .filter(item => this.matchesSearch(item.name, item.description, searchQuery))
        .slice(0, limit);

      const matchingDances = dances
        .filter(item => this.matchesSearch(item.name, item.description, searchQuery))
        .slice(0, limit);

      const matchingCeremonies = ceremonies
        .filter(item => this.matchesSearch(item.name, item.description, searchQuery))
        .slice(0, limit);

      const totalResults = matchingGroups.length + matchingTraditions.length + 
                          matchingCuisine.length + matchingCrafts.length +
                          matchingStories.length + matchingProverbs.length +
                          matchingMusic.length + matchingDances.length +
                          matchingCeremonies.length;

      return {
        groups: matchingGroups,
        traditions: matchingTraditions,
        cuisine: matchingCuisine,
        crafts: matchingCrafts,
        stories: matchingStories,
        proverbs: matchingProverbs,
        music: matchingMusic,
        dances: matchingDances,
        ceremonies: matchingCeremonies,
        totalResults,
        searchTime: Date.now() - startTime,
        suggestions: this.generateSearchSuggestions(searchQuery, groups, traditions)
      };
    } catch (error) {
      console.error('Error searching encyclopedia:', error);
      throw new Error('Search failed');
    }
  }

  /**
   * Get encyclopedia statistics
   */
  async getEncyclopediaStats(filters?: EncyclopediaFilters): Promise<EncyclopediaStats> {
    const cacheKey = `encyclopedia_stats_${JSON.stringify(filters || {})}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const [
        groups, traditions, cuisine, crafts, stories, 
        proverbs, music, dances, ceremonies
      ] = await Promise.all([
        this.getEthnicGroups(filters),
        this.getTraditions(filters),
        this.getCuisineItems(filters),
        this.getCrafts(filters),
        this.getStories(filters),
        this.getProverbs(filters),
        this.getMusicItems(filters),
        this.getDances(filters),
        this.getCeremonies(filters)
      ]);

      const stats: EncyclopediaStats = {
        totalGroups: groups.length,
        totalTraditions: traditions.length,
        totalCuisineItems: cuisine.length,
        totalCrafts: crafts.length,
        totalStories: stories.length,
        totalProverbs: proverbs.length,
        totalMusicItems: music.length,
        totalDances: dances.length,
        totalCeremonies: ceremonies.length,
        regions: new Set(groups.map(g => g.region)).size,
        languages: new Set(groups.flatMap(g => g.languages)).size
      };

      this.setCache(cacheKey, stats);
      return stats;
    } catch (error) {
      console.error('Error fetching encyclopedia stats:', error);
      throw new Error('Failed to fetch encyclopedia statistics');
    }
  }

  /**
   * Get content by region
   */
  async getContentByRegion(region: string): Promise<{
    groups: EthnicGroup[];
    traditions: Tradition[];
    cuisine: CuisineItem[];
    crafts: Craft[];
  }> {
    const cacheKey = `region_content_${region}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const [groups, traditions, cuisine, crafts] = await Promise.all([
        this.getEthnicGroups({ regions: [region] }),
        this.getTraditions({ regions: [region] }),
        this.getCuisineItems({ regions: [region] }),
        this.getCrafts({ regions: [region] })
      ]);

      const result = { groups, traditions, cuisine, crafts };
      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error fetching content by region:', error);
      throw new Error('Failed to fetch content by region');
    }
  }

  // Helper methods for filtering
  private applyEthnicGroupFilters(groups: EthnicGroup[], filters: EncyclopediaFilters): EthnicGroup[] {
    let filtered = groups;

    if (filters.regions && filters.regions.length > 0) {
      filtered = filtered.filter(group => 
        filters.regions!.includes(group.region)
      );
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(group =>
        group.name.toLowerCase().includes(query) ||
        group.nativeName.toLowerCase().includes(query) ||
        group.description.toLowerCase().includes(query) ||
        group.region.toLowerCase().includes(query)
      );
    }

    if (filters.hasMedia !== undefined) {
      filtered = filtered.filter(group => 
        filters.hasMedia ? 
          (group.images.length > 0 || group.videos.length > 0 || group.audio.length > 0) :
          (group.images.length === 0 && group.videos.length === 0 && group.audio.length === 0)
      );
    }

    return filtered;
  }

  private applyTraditionFilters(traditions: Tradition[], filters: EncyclopediaFilters): Tradition[] {
    let filtered = traditions;

    if (filters.types && filters.types.length > 0) {
      filtered = filtered.filter(tradition => 
        filters.types!.includes(tradition.type)
      );
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(tradition =>
        tradition.name.toLowerCase().includes(query) ||
        tradition.description.toLowerCase().includes(query) ||
        tradition.significance.toLowerCase().includes(query)
      );
    }

    return filtered;
  }

  private applyCuisineFilters(cuisine: CuisineItem[], filters: EncyclopediaFilters): CuisineItem[] {
    let filtered = cuisine;

    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(item => 
        filters.categories!.includes(item.category)
      );
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.nativeName.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }

  private applyCraftFilters(crafts: Craft[], filters: EncyclopediaFilters): Craft[] {
    let filtered = crafts;

    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(craft => 
        filters.categories!.includes(craft.category)
      );
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(craft =>
        craft.name.toLowerCase().includes(query) ||
        craft.nativeName.toLowerCase().includes(query) ||
        craft.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }

  private applyStoryFilters(stories: Story[], filters: EncyclopediaFilters): Story[] {
    let filtered = stories;

    if (filters.types && filters.types.length > 0) {
      filtered = filtered.filter(story => 
        filters.types!.includes(story.type)
      );
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(story =>
        story.title.toLowerCase().includes(query) ||
        story.nativeTitle.toLowerCase().includes(query) ||
        story.description.toLowerCase().includes(query) ||
        story.content.toLowerCase().includes(query)
      );
    }

    return filtered;
  }

  private applyProverbFilters(proverbs: Proverb[], filters: EncyclopediaFilters): Proverb[] {
    let filtered = proverbs;

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(proverb =>
        proverb.text.toLowerCase().includes(query) ||
        proverb.nativeText.toLowerCase().includes(query) ||
        proverb.translation.toLowerCase().includes(query) ||
        proverb.meaning.toLowerCase().includes(query)
      );
    }

    return filtered;
  }

  private applyMusicFilters(music: MusicItem[], filters: EncyclopediaFilters): MusicItem[] {
    let filtered = music;

    if (filters.types && filters.types.length > 0) {
      filtered = filtered.filter(item => 
        filters.types!.includes(item.type)
      );
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.nativeName.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }

  private applyDanceFilters(dances: Dance[], filters: EncyclopediaFilters): Dance[] {
    let filtered = dances;

    if (filters.types && filters.types.length > 0) {
      filtered = filtered.filter(dance => 
        filters.types!.includes(dance.type)
      );
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(dance =>
        dance.name.toLowerCase().includes(query) ||
        dance.nativeName.toLowerCase().includes(query) ||
        dance.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }

  private applyCeremonyFilters(ceremonies: Ceremony[], filters: EncyclopediaFilters): Ceremony[] {
    let filtered = ceremonies;

    if (filters.types && filters.types.length > 0) {
      filtered = filtered.filter(ceremony => 
        filters.types!.includes(ceremony.type)
      );
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(ceremony =>
        ceremony.name.toLowerCase().includes(query) ||
        ceremony.nativeName.toLowerCase().includes(query) ||
        ceremony.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }

  private matchesSearch(text1: string, text2: string, query: string): boolean {
    return text1.toLowerCase().includes(query) || text2.toLowerCase().includes(query);
  }

  private generateSearchSuggestions(
    query: string, 
    groups: EthnicGroup[], 
    traditions: Tradition[]
  ): string[] {
    const suggestions = new Set<string>();
    
    // Add group names that start with the query
    groups
      .filter(group => group.name.toLowerCase().startsWith(query))
      .slice(0, 3)
      .forEach(group => suggestions.add(group.name));

    // Add tradition names that start with the query
    traditions
      .filter(tradition => tradition.name.toLowerCase().startsWith(query))
      .slice(0, 2)
      .forEach(tradition => suggestions.add(tradition.name));

    // Add regions that start with the query
    CAMEROON_REGIONS
      .filter(region => region.toLowerCase().startsWith(query))
      .slice(0, 2)
      .forEach(region => suggestions.add(region));

    return Array.from(suggestions).slice(0, 5);
  }

  // Cache management
  private isCacheValid(key: string): boolean {
    const expiry = this.cacheExpiry.get(key);
    return expiry ? Date.now() < expiry : false;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, data);
    this.cacheExpiry.set(key, Date.now() + this.CACHE_DURATION);
  }

  clearCache(): void {
    this.cache.clear();
    this.cacheExpiry.clear();
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Export singleton instance
export const encyclopediaService = EncyclopediaService.getInstance();

// Export class for testing
export { EncyclopediaService };
