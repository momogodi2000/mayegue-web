import { create } from 'zustand';
import { User } from '@/shared/types/user.types';

interface AuthState {
  user: User | null;
  loading: boolean;
  isLoading: boolean; // Alias for loading to maintain consistency
  error: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  isLoading: true,
  error: null,
  isAuthenticated: false,
  
  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user,
    loading: false,
    isLoading: false,
    error: null
  }),
  
  setLoading: (loading) => set({ 
    loading, 
    isLoading: loading 
  }),
  
  setError: (error) => set({ 
    error, 
    loading: false,
    isLoading: false 
  }),
  
  logout: () => set({ 
    user: null, 
    isAuthenticated: false, 
    loading: false,
    isLoading: false,
    error: null
  }),
}));
