/**
 * Encyclopedia Types - TypeScript definitions for the Cultural Encyclopedia
 * 
 * @version 1.1.0
 * @author Ma'a yegue Team
 */

export interface EthnicGroup {
  id: string;
  name: string;
  nativeName: string;
  region: string;
  population: number;
  languages: string[];
  description: string;
  history: string;
  culture: Culture;
  traditions: Tradition[];
  cuisine: CuisineItem[];
  crafts: Craft[];
  medicine: MedicineItem[];
  stories: Story[];
  proverbs: Proverb[];
  music: MusicItem[];
  dances: Dance[];
  ceremonies: Ceremony[];
  symbols: symbol[];
  artifacts: Artifact[];
  images: string[];
  videos: string[];
  audio: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Culture {
  overview: string;
  socialStructure: string;
  governance: string;
  religion: string;
  values: string[];
  customs: string[];
  taboos: string[];
  genderRoles: string;
  education: string;
  economy: string;
}

export interface Tradition {
  id: string;
  name: string;
  type: 'ceremonial' | 'social' | 'religious' | 'seasonal' | 'life-cycle';
  description: string;
  significance: string;
  participants: string;
  timing: string;
  location: string;
  materials: string[];
  steps: string[];
  variations: string[];
  images: string[];
  videos: string[];
}

export interface CuisineItem {
  id: string;
  name: string;
  nativeName: string;
  category: 'main' | 'side' | 'beverage' | 'dessert' | 'snack';
  description: string;
  ingredients: Ingredient[];
  preparation: string;
  cookingTime: string;
  servingSize: number;
  nutritionalInfo?: NutritionalInfo;
  culturalSignificance: string;
  occasions: string[];
  variations: string[];
  images: string[];
  videos: string[];
  recipes: Recipe[];
}

export interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
  notes?: string;
}

export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  vitamins: Record<string, number>;
  minerals: Record<string, number>;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  time: string;
  servings: number;
  ingredients: Ingredient[];
  instructions: string[];
  tips: string[];
  variations: string[];
}

export interface Craft {
  id: string;
  name: string;
  nativeName: string;
  category: 'textile' | 'pottery' | 'woodwork' | 'metalwork' | 'basketwork' | 'sculpture' | 'jewelry';
  description: string;
  materials: string[];
  tools: string[];
  techniques: string[];
  process: string[];
  culturalSignificance: string;
  uses: string[];
  symbolism: string;
  artisans: string[];
  images: string[];
  videos: string[];
  tutorials: Tutorial[];
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  steps: TutorialStep[];
  materials: string[];
  tools: string[];
  tips: string[];
  images: string[];
  videos: string[];
}

export interface TutorialStep {
  order: number;
  title: string;
  description: string;
  duration: string;
  image?: string;
  video?: string;
  tips: string[];
}

export interface MedicineItem {
  id: string;
  name: string;
  nativeName: string;
  category: 'plant' | 'mineral' | 'animal' | 'spiritual';
  description: string;
  uses: string[];
  preparation: string;
  dosage: string;
  contraindications: string[];
  sideEffects: string[];
  culturalSignificance: string;
  practitioners: string[];
  images: string[];
  videos: string[];
  scientificName?: string;
  activeCompounds?: string[];
}

export interface Story {
  id: string;
  title: string;
  nativeTitle: string;
  type: 'folktale' | 'legend' | 'myth' | 'history' | 'moral' | 'creation';
  description: string;
  content: string;
  moral: string;
  characters: Character[];
  setting: string;
  themes: string[];
  culturalSignificance: string;
  variations: string[];
  images: string[];
  audio: string[];
  videos: string[];
  narrator?: string;
  language: string;
  translation?: string;
}

export interface Character {
  name: string;
  role: 'protagonist' | 'antagonist' | 'helper' | 'mentor' | 'trickster';
  description: string;
  traits: string[];
  significance: string;
}

export interface Proverb {
  id: string;
  text: string;
  nativeText: string;
  translation: string;
  meaning: string;
  context: string;
  usage: string;
  culturalSignificance: string;
  similarProverbs: string[];
  language: string;
  audio: string[];
  images: string[];
}

export interface MusicItem {
  id: string;
  name: string;
  nativeName: string;
  type: 'song' | 'instrumental' | 'chant' | 'drumming';
  description: string;
  instruments: Instrument[];
  lyrics?: string;
  translation?: string;
  culturalSignificance: string;
  occasions: string[];
  performers: string[];
  audio: string[];
  videos: string[];
  sheetMusic?: string;
  notation?: string;
}

export interface Instrument {
  id: string;
  name: string;
  nativeName: string;
  category: 'string' | 'wind' | 'percussion' | 'membranophone' | 'idiophone';
  description: string;
  materials: string[];
  construction: string;
  playing: string;
  tuning: string;
  culturalSignificance: string;
  images: string[];
  videos: string[];
  audio: string[];
}

export interface Dance {
  id: string;
  name: string;
  nativeName: string;
  type: 'ceremonial' | 'social' | 'ritual' | 'entertainment' | 'war';
  description: string;
  movements: string[];
  music: string[];
  costumes: string[];
  props: string[];
  participants: string;
  occasions: string[];
  culturalSignificance: string;
  steps: DanceStep[];
  images: string[];
  videos: string[];
  audio: string[];
}

export interface DanceStep {
  order: number;
  name: string;
  description: string;
  duration: string;
  movements: string[];
  image?: string;
  video?: string;
}

export interface Ceremony {
  id: string;
  name: string;
  nativeName: string;
  type: 'birth' | 'initiation' | 'marriage' | 'death' | 'harvest' | 'healing' | 'spiritual';
  description: string;
  purpose: string;
  participants: string;
  duration: string;
  location: string;
  timing: string;
  preparation: string[];
  process: string[];
  symbols: string[];
  offerings: string[];
  culturalSignificance: string;
  variations: string[];
  images: string[];
  videos: string[];
  audio: string[];
}

export interface Symbol {
  id: string;
  name: string;
  nativeName: string;
  type: 'visual' | 'gesture' | 'sound' | 'color' | 'pattern';
  description: string;
  meaning: string;
  usage: string;
  culturalSignificance: string;
  variations: string[];
  images: string[];
  videos: string[];
}

export interface Artifact {
  id: string;
  name: string;
  nativeName: string;
  category: 'tool' | 'weapon' | 'clothing' | 'jewelry' | 'container' | 'decoration' | 'ritual';
  description: string;
  materials: string[];
  construction: string;
  uses: string[];
  culturalSignificance: string;
  age: string;
  location: string;
  images: string[];
  videos: string[];
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
}

export interface EncyclopediaFilters {
  regions?: string[];
  region?: string;
  categories?: string[];
  types?: string[];
  searchQuery?: string;
  hasMedia?: boolean;
  difficulty?: string[];
}

export interface EncyclopediaStats {
  totalGroups: number;
  totalTraditions: number;
  totalCuisineItems: number;
  totalCrafts: number;
  totalStories: number;
  totalProverbs: number;
  totalMusicItems: number;
  totalDances: number;
  totalCeremonies: number;
  regions: number;
  languages: number;
  totalMediaItems: number;
  regionsCovered: number;
  lastUpdated: Date;
}

export interface EncyclopediaSearchResult {
  groups: EthnicGroup[];
  traditions: Tradition[];
  cuisine: CuisineItem[];
  crafts: Craft[];
  stories: Story[];
  proverbs: Proverb[];
  music: MusicItem[];
  dances: Dance[];
  ceremonies: Ceremony[];
  totalResults: number;
  searchTime: number;
  suggestions?: string[];
}

export interface SearchResult {
  id: string;
  type: 'ethnic-group' | 'tradition' | 'cuisine' | 'craft' | 'story' | 'proverb' | 'music' | 'dance' | 'ceremony';
  title: string;
  description: string;
  category: string;
  region: string;
  imageUrl?: string;
  relevanceScore: number;
}

// Component Props types
export interface EncyclopediaPageProps {
  filters: EncyclopediaFilters;
  onFiltersChange: (filters: EncyclopediaFilters) => void;
}

export interface EthnicGroupCardProps {
  group: EthnicGroup;
  onSelect: (group: EthnicGroup) => void;
}

export interface TraditionCardProps {
  tradition: Tradition;
  onSelect: (tradition: Tradition) => void;
}

export interface CuisineCardProps {
  item: CuisineItem;
  onSelect: (item: CuisineItem) => void;
}

export interface CraftCardProps {
  craft: Craft;
  onSelect: (craft: Craft) => void;
}

export interface StoryCardProps {
  story: Story;
  onSelect: (story: Story) => void;
}

// Hook types
export interface UseEncyclopediaDataReturn {
  groups: EthnicGroup[];
  traditions: Tradition[];
  cuisine: CuisineItem[];
  crafts: Craft[];
  stories: Story[];
  proverbs: Proverb[];
  music: MusicItem[];
  dances: Dance[];
  ceremonies: Ceremony[];
  stats: EncyclopediaStats;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface UseEncyclopediaFiltersReturn {
  filters: EncyclopediaFilters;
  setFilters: (filters: EncyclopediaFilters) => void;
  clearFilters: () => void;
  filteredResults: EncyclopediaSearchResult;
  filteredStats: EncyclopediaStats;
}

// Constants
export const CAMEROON_REGIONS = [
  'Adamaoua',
  'Centre',
  'Est',
  'Extrême-Nord',
  'Littoral',
  'Nord',
  'Nord-Ouest',
  'Ouest',
  'Sud',
  'Sud-Ouest'
];

export const TRADITION_TYPES = [
  { value: 'ceremonial', label: 'Cérémoniel' },
  { value: 'social', label: 'Social' },
  { value: 'religious', label: 'Religieux' },
  { value: 'seasonal', label: 'Saisonnier' },
  { value: 'life-cycle', label: 'Cycle de vie' }
];

export const CUISINE_CATEGORIES = [
  { value: 'main', label: 'Plat principal' },
  { value: 'side', label: 'Accompagnement' },
  { value: 'beverage', label: 'Boisson' },
  { value: 'dessert', label: 'Dessert' },
  { value: 'snack', label: 'Collation' }
];

export const CRAFT_CATEGORIES = [
  { value: 'textile', label: 'Textile' },
  { value: 'pottery', label: 'Poterie' },
  { value: 'woodwork', label: 'Bois' },
  { value: 'metalwork', label: 'Métal' },
  { value: 'basketwork', label: 'Vannerie' },
  { value: 'sculpture', label: 'Sculpture' },
  { value: 'jewelry', label: 'Bijoux' }
];

export const STORY_TYPES = [
  { value: 'folktale', label: 'Conte populaire' },
  { value: 'legend', label: 'Légende' },
  { value: 'myth', label: 'Mythe' },
  { value: 'history', label: 'Histoire' },
  { value: 'moral', label: 'Morale' },
  { value: 'creation', label: 'Création' }
];

export const DANCE_TYPES = [
  { value: 'ceremonial', label: 'Cérémoniel' },
  { value: 'social', label: 'Social' },
  { value: 'ritual', label: 'Rituel' },
  { value: 'entertainment', label: 'Divertissement' },
  { value: 'war', label: 'Guerre' }
];

export const CEREMONY_TYPES = [
  { value: 'birth', label: 'Naissance' },
  { value: 'initiation', label: 'Initiation' },
  { value: 'marriage', label: 'Mariage' },
  { value: 'death', label: 'Mort' },
  { value: 'harvest', label: 'Récolte' },
  { value: 'healing', label: 'Guérison' },
  { value: 'spiritual', label: 'Spirituel' }
];
