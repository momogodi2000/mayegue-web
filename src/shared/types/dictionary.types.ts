/**
 * Dictionary-related TypeScript types
 */

export type LanguageId = 'ewo' | 'dua' | 'fef' | 'ful' | 'bas' | 'bam' | 'yem';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type Category = 
  | 'greetings'
  | 'numbers'
  | 'family'
  | 'food'
  | 'body'
  | 'time'
  | 'colors'
  | 'animals'
  | 'verbs'
  | 'adjectives'
  | 'phrases'
  | 'clothing'
  | 'home'
  | 'professions'
  | 'transportation'
  | 'emotions'
  | 'nature'
  | 'education'
  | 'health'
  | 'money'
  | 'directions'
  | 'religion'
  | 'music'
  | 'sports';

export interface Language {
  id: LanguageId;
  name: string;
  family: string;
  region: string;
  speakers: number;
  description: string;
  isoCode: string;
}

export interface DictionaryEntry {
  id: string;
  frenchText: string;
  languageId: LanguageId;
  translation: string;
  pronunciation?: string;
  category?: Category;
  usageNotes?: string;
  difficultyLevel?: DifficultyLevel;
  examples?: string[];
  audioUrl?: string;
  contributorId?: string;
  reviewStatus?: 'pending' | 'verified' | 'rejected';
  tags?: string[];
  createdAt: Date;
  updatedAt?: Date;
}

export interface DictionarySearchFilters {
  languageId?: LanguageId;
  category?: Category;
  difficultyLevel?: DifficultyLevel;
  searchTerm?: string;
}

export interface DictionaryState {
  entries: DictionaryEntry[];
  favorites: string[];
  searchHistory: string[];
  filters: DictionarySearchFilters;
  loading: boolean;
  error: string | null;
}
