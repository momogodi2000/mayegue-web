/**
 * Atlas Types - TypeScript definitions for the Interactive Linguistic Atlas
 * 
 * @version 1.1.0
 * @author Ma'a yegue Team
 */

export interface Language {
  id: string;
  name: string;
  nativeName: string;
  isoCode?: string;
  family: LanguageFamily;
  region: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  speakers: number;
  status: LanguageStatus;
  endangeredLevel?: EndangeredLevel;
  description: string;
  culturalNotes?: string;
  dialects?: Dialect[];
  writingSystems?: WritingSystem[];
  relatedLanguages?: string[];
  migrationHistory?: MigrationEvent[];
}

export interface LanguageFamily {
  id: string;
  name: string;
  description: string;
  color: string; // For map visualization
  subfamilies?: string[];
  totalLanguages: number;
  totalSpeakers: number;
}

export interface Dialect {
  id: string;
  name: string;
  region: string;
  speakers: number;
  characteristics: string[];
}

export interface WritingSystem {
  id: string;
  name: string;
  type: 'alphabet' | 'syllabary' | 'logographic' | 'mixed';
  script: string;
  description: string;
  example?: string;
}

export interface MigrationEvent {
  id: string;
  period: string;
  from: {
    lat: number;
    lng: number;
  };
  to: {
    lat: number;
    lng: number;
  };
  description: string;
  impact: string;
  sources?: string[];
}

export type LanguageStatus = 
  | 'vital'           // Widely spoken, stable
  | 'threatened'      // Declining but still spoken
  | 'endangered'      // Few speakers, at risk
  | 'critically_endangered' // Very few speakers
  | 'extinct';        // No native speakers

export type EndangeredLevel = 
  | 'safe'           // Not endangered
  | 'vulnerable'     // Potentially threatened
  | 'definitely_endangered' // Definitely endangered
  | 'severely_endangered'   // Severely endangered
  | 'critically_endangered' // Critically endangered
  | 'extinct';       // Extinct

export interface AtlasFilters {
  families?: string[];
  regions?: string[];
  status?: LanguageStatus[];
  endangeredLevel?: EndangeredLevel[];
  speakerRange?: {
    min: number;
    max: number;
  };
  hasWritingSystem?: boolean;
  searchQuery?: string;
}

export interface AtlasStats {
  totalLanguages: number;
  totalSpeakers: number;
  families: number;
  endangered: number;
  criticallyEndangered: number;
  extinct: number;
  withWritingSystems: number;
  regions: number;
}

export interface MapViewport {
  center: [number, number];
  zoom: number;
  bearing?: number;
  pitch?: number;
}

export interface LanguageCluster {
  id: string;
  center: [number, number];
  languages: Language[];
  radius: number;
  density: number;
}

export interface AtlasSearchResult {
  languages: Language[];
  families: LanguageFamily[];
  totalResults: number;
  searchTime: number;
  suggestions?: string[];
}

export interface CulturalContext {
  id: string;
  languageId: string;
  traditions: string[];
  ceremonies: string[];
  music: string[];
  cuisine: string[];
  crafts: string[];
  stories: string[];
  proverbs: string[];
}

export interface AtlasSettings {
  showEndangeredOnly: boolean;
  showFamilies: boolean;
  showMigrationPaths: boolean;
  showWritingSystems: boolean;
  clusteringEnabled: boolean;
  animationSpeed: number;
  colorScheme: 'family' | 'status' | 'speakers' | 'endangered';
  language: 'fr' | 'en';
}

// Map visualization types
export interface MapLayer {
  id: string;
  name: string;
  type: 'markers' | 'polygons' | 'lines' | 'heatmap';
  visible: boolean;
  opacity: number;
  data: any[];
  style?: any;
}

export interface MapStyle {
  id: string;
  name: string;
  url: string;
  attribution: string;
  description: string;
}

// API Response types
export interface AtlasApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface LanguageDetailResponse {
  language: Language;
  culturalContext: CulturalContext;
  relatedLanguages: Language[];
  migrationHistory: MigrationEvent[];
  statistics: {
    totalSpeakers: number;
    growthRate?: number;
    ageDistribution?: Record<string, number>;
    urbanization?: number;
  };
}

// Component Props types
export interface LanguageMapProps {
  languages: Language[];
  filters: AtlasFilters;
  viewport: MapViewport;
  onLanguageSelect: (language: Language) => void;
  onViewportChange: (viewport: MapViewport) => void;
  settings: AtlasSettings;
}

export interface LanguageFiltersProps {
  filters: AtlasFilters;
  onFiltersChange: (filters: AtlasFilters) => void;
  availableFamilies: LanguageFamily[];
  availableRegions: string[];
  stats: AtlasStats;
}

export interface LanguageDetailProps {
  language: Language;
  culturalContext?: CulturalContext;
  onClose: () => void;
}

export interface MigrationHistoryProps {
  language: Language;
  events: MigrationEvent[];
}

export interface EndangeredLanguagesProps {
  languages: Language[];
  onLanguageSelect: (language: Language) => void;
}

// Hook types
export interface UseAtlasDataReturn {
  languages: Language[];
  families: LanguageFamily[];
  stats: AtlasStats;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface UseAtlasFiltersReturn {
  filters: AtlasFilters;
  setFilters: (filters: AtlasFilters) => void;
  clearFilters: () => void;
  filteredLanguages: Language[];
  filteredStats: AtlasStats;
}

// Event types
export interface AtlasEvents {
  'language:selected': { language: Language };
  'language:deselected': { language: Language };
  'filters:changed': { filters: AtlasFilters };
  'viewport:changed': { viewport: MapViewport };
  'settings:changed': { settings: AtlasSettings };
  'search:performed': { query: string; results: AtlasSearchResult };
}

// Utility types
export type SortOption = 'name' | 'speakers' | 'endangered' | 'region' | 'family';
export type ViewMode = 'map' | 'list' | 'grid' | 'timeline';
export type MapProjection = 'mercator' | 'naturalEarth' | 'equalEarth' | 'winkelTripel';

// Constants
export const LANGUAGE_FAMILIES: LanguageFamily[] = [
  {
    id: 'bantu',
    name: 'Bantou',
    description: 'Famille de langues bantoues parlées en Afrique centrale et australe',
    color: '#3B82F6',
    totalLanguages: 0,
    totalSpeakers: 0
  },
  {
    id: 'sudanic',
    name: 'Soudanique',
    description: 'Famille de langues soudaniques parlées en Afrique centrale',
    color: '#10B981',
    totalLanguages: 0,
    totalSpeakers: 0
  },
  {
    id: 'chadic',
    name: 'Tchadique',
    description: 'Famille de langues tchadiques parlées au Tchad et au Cameroun',
    color: '#F59E0B',
    totalLanguages: 0,
    totalSpeakers: 0
  },
  {
    id: 'afro-asiatic',
    name: 'Afro-asiatique',
    description: 'Famille de langues afro-asiatiques incluant l\'arabe et le berbère',
    color: '#EF4444',
    totalLanguages: 0,
    totalSpeakers: 0
  },
  {
    id: 'niger-congo',
    name: 'Niger-Congo',
    description: 'Famille de langues nigéro-congolaises',
    color: '#8B5CF6',
    totalLanguages: 0,
    totalSpeakers: 0
  }
];

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

export const ENDANGERED_LEVELS: { value: EndangeredLevel; label: string; color: string }[] = [
  { value: 'safe', label: 'Sûr', color: '#10B981' },
  { value: 'vulnerable', label: 'Vulnérable', color: '#F59E0B' },
  { value: 'definitely_endangered', label: 'Définitivement en danger', color: '#EF4444' },
  { value: 'severely_endangered', label: 'Sévèrement en danger', color: '#DC2626' },
  { value: 'critically_endangered', label: 'Critiquement en danger', color: '#991B1B' },
  { value: 'extinct', label: 'Éteint', color: '#6B7280' }
];
