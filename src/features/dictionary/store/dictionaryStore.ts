import { create } from 'zustand';

interface DictionaryState {
  searchTerm: string;
  languageId?: string;
  setSearchTerm: (s: string) => void;
  setLanguageId: (id?: string) => void;
}

export const useDictionaryStore = create<DictionaryState>((set) => ({
  searchTerm: '',
  languageId: undefined,
  setSearchTerm: (s) => set({ searchTerm: s }),
  setLanguageId: (id) => set({ languageId: id }),
}));


