import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from './authStore';
import { authService } from '@/core/services/firebase/auth.service';

// Mock the auth service
vi.mock('@/core/services/firebase/auth.service', () => ({
  authService: {
    signInWithEmail: vi.fn(),
    signInWithGoogle: vi.fn(),
    signUpWithEmail: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChange: vi.fn(),
  },
}));

// Mock Firebase user
const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  displayName: 'Test User',
  role: 'learner' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('AuthStore', () => {
  beforeEach(() => {
    // Reset the store state before each test
    useAuthStore.setState({
      user: null,
      loading: false,
      error: null,
      isAuthenticated: false,
    });
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useAuthStore());
    
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should set user and update authentication state', () => {
    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      result.current.setUser(mockUser);
    });
    
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should clear user and update authentication state', () => {
    const { result } = renderHook(() => useAuthStore());
    
    // First set a user
    act(() => {
      result.current.setUser(mockUser);
    });
    
    expect(result.current.isAuthenticated).toBe(true);
    
    // Then clear the user
    act(() => {
      result.current.setUser(null);
    });
    
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should set loading state', () => {
    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      result.current.setLoading(true);
    });
    
    expect(result.current.loading).toBe(true);
    
    act(() => {
      result.current.setLoading(false);
    });
    
    expect(result.current.loading).toBe(false);
  });

  it('should set error state', () => {
    const { result } = renderHook(() => useAuthStore());
    const errorMessage = 'Authentication failed';
    
    act(() => {
      result.current.setError(errorMessage);
    });
    
    expect(result.current.error).toBe(errorMessage);
  });

  it('should clear error when setting user', () => {
    const { result } = renderHook(() => useAuthStore());
    
    // Set an error first
    act(() => {
      result.current.setError('Some error');
    });
    
    expect(result.current.error).toBe('Some error');
    
    // Set user should clear the error
    act(() => {
      result.current.setUser(mockUser);
    });
    
    expect(result.current.error).toBeNull();
  });

  it('should handle logout', async () => {
    const { result } = renderHook(() => useAuthStore());
    
    // Set a user first
    act(() => {
      result.current.setUser(mockUser);
    });
    
    expect(result.current.isAuthenticated).toBe(true);
    
    // Mock successful logout
    vi.mocked(authService.signOut).mockResolvedValue(undefined);
    
    await act(async () => {
      await result.current.logout();
    });
    
    expect(authService.signOut).toHaveBeenCalled();
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should handle logout error', async () => {
    const { result } = renderHook(() => useAuthStore());
    
    // Set a user first
    act(() => {
      result.current.setUser(mockUser);
    });
    
    // Mock failed logout
    const errorMessage = 'Logout failed';
    vi.mocked(authService.signOut).mockRejectedValue(new Error(errorMessage));
    
    await act(async () => {
      await result.current.logout();
    });
    
    expect(authService.signOut).toHaveBeenCalled();
    expect(result.current.error).toBe(errorMessage);
  });
});
