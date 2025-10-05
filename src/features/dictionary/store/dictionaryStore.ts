import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DictionaryEntry, Language, DictionarySearchFilters, LanguageId } from '@/shared/types/dictionary.types';

interface DictionaryState {
  // Data
  entries: DictionaryEntry[];
  languages: Language[];
  favorites: string[];
  searchHistory: string[];
  
  // UI State
  searchTerm: string;
  selectedLanguage?: LanguageId;
  selectedCategory?: string;
  loading: boolean;
  error: string | null;
  searchResults: DictionaryEntry[];
  
  // Actions
  setSearchTerm: (term: string) => void;
  setSelectedLanguage: (languageId?: LanguageId) => void;
  setSelectedCategory: (category?: string) => void;
  searchEntries: (term: string, filters?: DictionarySearchFilters) => Promise<void>;
  loadEntries: () => Promise<void>;
  loadLanguages: () => Promise<void>;
  
  // Favorites
  addToFavorites: (entryId: string) => void;
  removeFromFavorites: (entryId: string) => void;
  isFavorite: (entryId: string) => boolean;
  
  // History
  addToHistory: (term: string) => void;
  clearHistory: () => void;
  
  // Audio
  playPronunciation: (entryId: string) => Promise<void>;
  
  // Offline
  syncOfflineData: () => Promise<void>;
  getOfflineEntries: () => Promise<DictionaryEntry[]>;
  
  // Clear states
  clearSearch: () => void;
  clearError: () => void;
}

// Mock data for development
const mockLanguages: Language[] = [
  {
    id: 'ewo',
    name: 'Ewondo',
    family: 'Bantu',
    region: 'Centre',
    speakers: 577000,
    description: 'Langue bantoue parlée principalement au Cameroun',
    isoCode: 'ewo'
  },
  {
    id: 'dua',
    name: 'Duala',
    family: 'Bantu',
    region: 'Littoral',
    speakers: 87700,
    description: 'Langue bantoue parlée sur la côte camerounaise',
    isoCode: 'dua'
  },
  {
    id: 'fef',
    name: 'Fe\'efe\'e',
    family: 'Bantu',
    region: 'Ouest',
    speakers: 50000,
    description: 'Langue bantoue des hauts plateaux de l\'Ouest',
    isoCode: 'fef'
  },
  {
    id: 'ful',
    name: 'Fulfulde',
    family: 'Niger-Congo',
    region: 'Nord',
    speakers: 300000,
    description: 'Langue peule parlée dans le nord du Cameroun',
    isoCode: 'ful'
  },
  {
    id: 'bas',
    name: 'Basaa',
    family: 'Bantu',
    region: 'Centre-Sud',
    speakers: 230000,
    description: 'Langue bantoue du centre et sud Cameroun',
    isoCode: 'bas'
  },
  {
    id: 'bam',
    name: 'Bamoun',
    family: 'Bantu',
    region: 'Ouest',
    speakers: 215000,
    description: 'Langue avec système d\'écriture traditionnel',
    isoCode: 'bam'
  },
  {
    id: 'yem',
    name: 'Yemba',
    family: 'Bantu',
    region: 'Ouest (Dschang)',
    speakers: 180000,
    description: 'Langue traditionnelle du peuple Dschang, centre éducatif important',
    isoCode: 'yem'
  }
];

const mockEntries: DictionaryEntry[] = [
  {
    id: '1',
    frenchText: 'Bonjour',
    languageId: 'ewo',
    translation: 'Mbolo',
    pronunciation: 'm-boh-loh',
    category: 'greetings',
    usageNotes: 'Salutation courante utilisée à tout moment de la journée',
    difficultyLevel: 'beginner',
    examples: ['Mbolo, bɔ nné?', 'Mbolo mô!'],
    audioUrl: '/audio/ewo/mbolo.mp3',
    tags: ['salutation', 'politesse'],
    createdAt: new Date('2024-01-01'),
    reviewStatus: 'verified'
  },
  {
    id: '2',
    frenchText: 'Merci',
    languageId: 'ewo',
    translation: 'Akiba',
    pronunciation: 'ah-kee-bah',
    category: 'greetings',
    usageNotes: 'Expression de gratitude universelle',
    difficultyLevel: 'beginner',
    examples: ['Akiba mingi!', 'Akiba ôe!'],
    audioUrl: '/audio/ewo/akiba.mp3',
    tags: ['gratitude', 'politesse'],
    createdAt: new Date('2024-01-01'),
    reviewStatus: 'verified'
  },
  {
    id: '3',
    frenchText: 'Bonjour',
    languageId: 'dua',
    translation: 'Mmôni',
    pronunciation: 'm-moh-nee',
    category: 'greetings',
    usageNotes: 'Salutation matinale traditionnelle',
    difficultyLevel: 'beginner',
    examples: ['Mmôni, ndôe e?', 'Mmôni mama!'],
    audioUrl: '/audio/dua/mmoni.mp3',
    tags: ['matin', 'salutation'],
    createdAt: new Date('2024-01-01'),
    reviewStatus: 'verified'
  },
  {
    id: '4',
    frenchText: 'Merci',
    languageId: 'dua',
    translation: 'Masido',
    pronunciation: 'mah-see-doh',
    category: 'greetings',
    usageNotes: 'Remerciement respectueux',
    difficultyLevel: 'beginner',
    examples: ['Masido o mulam!', 'Masido tata!'],
    audioUrl: '/audio/dua/masido.mp3',
    tags: ['gratitude', 'respect'],
    createdAt: new Date('2024-01-01'),
    reviewStatus: 'verified'
  },
  {
    id: '5',
    frenchText: 'Eau',
    languageId: 'ewo',
    translation: 'Mendim',
    pronunciation: 'men-deem',
    category: 'food',
    usageNotes: 'Terme générique pour l\'eau',
    difficultyLevel: 'beginner',
    examples: ['Mendim wo mefô', 'Ma zom mendim'],
    audioUrl: '/audio/ewo/mendim.mp3',
    tags: ['boisson', 'nature'],
    createdAt: new Date('2024-01-01'),
    reviewStatus: 'verified'
  },
  {
    id: '6',
    frenchText: 'Maison',
    languageId: 'ewo',
    translation: 'Nda',
    pronunciation: 'n-dah',
    category: 'home',
    usageNotes: 'Maison, habitation, domicile',
    difficultyLevel: 'beginner',
    examples: ['Nda ém', 'Ke nda ndogo'],
    audioUrl: '/audio/ewo/nda.mp3',
    tags: ['habitat', 'famille'],
    createdAt: new Date('2024-01-01'),
    reviewStatus: 'verified'
  }
];

export const useDictionaryStore = create<DictionaryState>()(
  persist(
    (set, get) => ({
      // Initial state
      entries: [],
      languages: [],
      favorites: [],
      searchHistory: [],
      searchTerm: '',
      selectedLanguage: undefined,
      selectedCategory: undefined,
      loading: false,
      error: null,
      searchResults: [],

      // Search actions
      setSearchTerm: (term: string) => {
        set({ searchTerm: term });
        if (term.trim()) {
          get().searchEntries(term);
        } else {
          set({ searchResults: [] });
        }
      },

      setSelectedLanguage: (languageId?: LanguageId) => {
        set({ selectedLanguage: languageId });
        const { searchTerm } = get();
        if (searchTerm.trim()) {
          get().searchEntries(searchTerm, { languageId });
        }
      },

      setSelectedCategory: (category?: string) => {
        set({ selectedCategory: category });
        const { searchTerm } = get();
        if (searchTerm.trim()) {
          get().searchEntries(searchTerm, { 
            category: category as 'greetings' | 'numbers' | 'family' | 'food' | 'body' | 'time' | 'colors' | 'animals' | 'verbs' | 'adjectives' | 'phrases' | 'clothing' | 'home' | 'professions' | 'transportation' | 'emotions' | 'nature' | 'education' | 'health' | 'money' | 'directions' | 'religion' | 'music' | 'sports'
          });
        }
      },

      searchEntries: async (term: string, filters?: DictionarySearchFilters) => {
        set({ loading: true, error: null });
        
        try {
          // Add to search history
          get().addToHistory(term);
          
          // Simulate API call with mock data
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const { entries, selectedLanguage, selectedCategory } = get();
          let results = entries.length > 0 ? entries : mockEntries;
          
          // Filter by search term
          if (term.trim()) {
            const searchLower = term.toLowerCase();
            results = results.filter(entry =>
              entry.frenchText.toLowerCase().includes(searchLower) ||
              entry.translation.toLowerCase().includes(searchLower) ||
              entry.tags?.some(tag => tag.toLowerCase().includes(searchLower))
            );
          }
          
          // Filter by language
          const languageFilter = filters?.languageId || selectedLanguage;
          if (languageFilter) {
            results = results.filter(entry => entry.languageId === languageFilter);
          }
          
          // Filter by category
          const categoryFilter = filters?.category || selectedCategory;
          if (categoryFilter) {
            results = results.filter(entry => entry.category === categoryFilter);
          }
          
          set({ searchResults: results, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Erreur de recherche', 
            loading: false 
          });
        }
      },

      loadEntries: async () => {
        set({ loading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          set({ entries: mockEntries, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Erreur de chargement', 
            loading: false 
          });
        }
      },

      loadLanguages: async () => {
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 300));
          set({ languages: mockLanguages });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Erreur de chargement des langues'
          });
        }
      },

      // Favorites management
      addToFavorites: (entryId: string) => {
        const { favorites } = get();
        if (!favorites.includes(entryId)) {
          set({ favorites: [...favorites, entryId] });
        }
      },

      removeFromFavorites: (entryId: string) => {
        const { favorites } = get();
        set({ favorites: favorites.filter(id => id !== entryId) });
      },

      isFavorite: (entryId: string) => {
        return get().favorites.includes(entryId);
      },

      // History management
      addToHistory: (term: string) => {
        const { searchHistory } = get();
        const trimmedTerm = term.trim();
        if (trimmedTerm && !searchHistory.includes(trimmedTerm)) {
          const newHistory = [trimmedTerm, ...searchHistory.slice(0, 9)]; // Keep last 10
          set({ searchHistory: newHistory });
        }
      },

      clearHistory: () => {
        set({ searchHistory: [] });
      },

      // Audio playback
      playPronunciation: async (entryId: string) => {
        const { entries, searchResults } = get();
        const allEntries = [...entries, ...searchResults];
        const entry = allEntries.find(e => e.id === entryId);
        
        if (entry?.audioUrl) {
          try {
            const audio = new Audio(entry.audioUrl);
            await audio.play();
          } catch (error) {
            console.warn('Impossible de lire l\'audio:', error);
            // Fallback: use Web Speech API for text-to-speech
            if ('speechSynthesis' in window) {
              const utterance = new SpeechSynthesisUtterance(entry.translation);
              utterance.lang = 'fr-FR'; // Approximation
              speechSynthesis.speak(utterance);
            }
          }
        }
      },

      // Offline functionality
      syncOfflineData: async () => {
        // TODO: Implement IndexedDB sync
        console.log('Synchronizing offline data...');
      },

      getOfflineEntries: async () => {
        // TODO: Get from IndexedDB
        return get().entries;
      },

      // Clear functions
      clearSearch: () => {
        set({ 
          searchTerm: '', 
          searchResults: [], 
          selectedLanguage: undefined, 
          selectedCategory: undefined 
        });
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'dictionary-storage',
      partialize: (state) => ({
        favorites: state.favorites,
        searchHistory: state.searchHistory
      })
    }
  )
);


