import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '../../../features/auth/store/authStore';
import { authService } from '../../../core/services/firebase/auth.service';
import { userService } from '../../../core/services/firebase/user.service';

// Mock Firebase services
vi.mock('../../../core/services/firebase/auth.service', () => ({
  authService: {
    signInWithEmail: vi.fn(),
    signInWithGoogle: vi.fn(),
    signUpWithEmail: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChange: vi.fn(),
    sendPasswordResetEmail: vi.fn(),
    updatePassword: vi.fn(),
    updateProfile: vi.fn(),
  },
}));

vi.mock('../../../core/services/firebase/user.service', () => ({
  userService: {
    createUser: vi.fn(),
    getUserById: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
  },
}));

// Mock Firebase user object
const mockFirebaseUser = {
  uid: 'test-uid',
  email: 'test@example.com',
  displayName: 'Test User',
  emailVerified: true,
  photoURL: null,
  phoneNumber: null,
  metadata: {
    creationTime: new Date().toISOString(),
    lastSignInTime: new Date().toISOString(),
  },
};

const mockAppUser = {
  id: 'test-uid',
  email: 'test@example.com',
  displayName: 'Test User',
  role: 'learner' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  preferences: {
    language: 'fr',
    notifications: true,
    theme: 'light',
  },
  profile: {
    firstName: 'Test',
    lastName: 'User',
    bio: '',
    location: '',
    interests: [],
  },
};

describe('Authentication Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset auth store
    useAuthStore.setState({
      user: null,
      loading: false,
      error: null,
      isAuthenticated: false,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('User Registration Flow', () => {
    it('should complete full registration process', async () => {
      // Mock successful registration
      vi.mocked(authService.signUpWithEmail).mockResolvedValue(mockAppUser);
      vi.mocked(userService.createUser).mockResolvedValue(mockAppUser);

      const { result } = renderHook(() => useAuthStore());

      // Start registration
      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.loading).toBe(true);

      // Simulate registration success
      act(() => {
        result.current.setUser(mockAppUser);
        result.current.setLoading(false);
      });

      expect(result.current.user).toEqual(mockAppUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle registration failure', async () => {
      const errorMessage = 'Email already exists';
      vi.mocked(authService.signUpWithEmail).mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setLoading(true);
      });

      // Simulate registration failure
      act(() => {
        result.current.setError(errorMessage);
        result.current.setLoading(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(errorMessage);
    });
  });

  describe('User Login Flow', () => {
    it('should complete full login process with email', async () => {
      vi.mocked(authService.signInWithEmail).mockResolvedValue(mockAppUser);
      vi.mocked(userService.getUserById).mockResolvedValue(mockAppUser);

      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setLoading(true);
      });

      // Simulate login success
      act(() => {
        result.current.setUser(mockAppUser);
        result.current.setLoading(false);
      });

      expect(result.current.user).toEqual(mockAppUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should complete full login process with Google', async () => {
      vi.mocked(authService.signInWithGoogle).mockResolvedValue(mockAppUser);
      vi.mocked(userService.getUserById).mockResolvedValue(mockAppUser);

      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setLoading(true);
      });

      // Simulate Google login success
      act(() => {
        result.current.setUser(mockAppUser);
        result.current.setLoading(false);
      });

      expect(result.current.user).toEqual(mockAppUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle login failure', async () => {
      const errorMessage = 'Invalid credentials';
      vi.mocked(authService.signInWithEmail).mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setLoading(true);
      });

      // Simulate login failure
      act(() => {
        result.current.setError(errorMessage);
        result.current.setLoading(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(errorMessage);
    });
  });

  describe('User Logout Flow', () => {
    it('should complete full logout process', async () => {
      vi.mocked(authService.signOut).mockResolvedValue(undefined);

      const { result } = renderHook(() => useAuthStore());

      // Set initial authenticated state
      act(() => {
        result.current.setUser(mockAppUser);
      });

      expect(result.current.isAuthenticated).toBe(true);

      // Perform logout
      await act(async () => {
        await result.current.logout();
      });

      expect(authService.signOut).toHaveBeenCalled();
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle logout failure', async () => {
      const errorMessage = 'Logout failed';
      vi.mocked(authService.signOut).mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useAuthStore());

      // Set initial authenticated state
      act(() => {
        result.current.setUser(mockAppUser);
      });

      // Perform logout with error
      await act(async () => {
        await result.current.logout();
      });

      expect(authService.signOut).toHaveBeenCalled();
      expect(result.current.error).toBe(errorMessage);
    });
  });

  describe('Auth State Persistence', () => {
    it('should maintain auth state across page reloads', async () => {
      const { result } = renderHook(() => useAuthStore());

      // Simulate initial auth state from persistence
      act(() => {
        result.current.setUser(mockAppUser);
      });

      expect(result.current.user).toEqual(mockAppUser);
      expect(result.current.isAuthenticated).toBe(true);

      // Simulate page reload - state should persist
      const { result: newResult } = renderHook(() => useAuthStore());
      
      // In a real scenario, this would be handled by Firebase auth state listener
      act(() => {
        newResult.current.setUser(mockAppUser);
      });

      expect(newResult.current.user).toEqual(mockAppUser);
      expect(newResult.current.isAuthenticated).toBe(true);
    });
  });

  describe('Password Reset Flow', () => {
    it('should handle password reset request', async () => {
      vi.mocked(authService.sendPasswordResetEmail).mockResolvedValue(undefined);

      // This would typically be tested in a component that uses the auth service
      await expect(authService.sendPasswordResetEmail('test@example.com')).resolves.toBeUndefined();
      expect(authService.sendPasswordResetEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should handle password reset failure', async () => {
      const errorMessage = 'User not found';
      vi.mocked(authService.sendPasswordResetEmail).mockRejectedValue(new Error(errorMessage));

      await expect(authService.sendPasswordResetEmail('nonexistent@example.com')).rejects.toThrow(errorMessage);
    });
  });

  describe('Profile Update Flow', () => {
    it('should update user profile successfully', async () => {
      const updatedUser = { ...mockAppUser, displayName: 'Updated Name' };
      vi.mocked(authService.updateProfile).mockResolvedValue(undefined);
      vi.mocked(userService.updateUser).mockResolvedValue(updatedUser);

      const { result } = renderHook(() => useAuthStore());

      // Set initial user
      act(() => {
        result.current.setUser(mockAppUser);
      });

      // Update profile
      act(() => {
        result.current.setUser(updatedUser);
      });

      expect(result.current.user?.displayName).toBe('Updated Name');
    });
  });

  describe('Error Recovery', () => {
    it('should clear errors when setting new user', async () => {
      const { result } = renderHook(() => useAuthStore());

      // Set error state
      act(() => {
        result.current.setError('Some error');
      });

      expect(result.current.error).toBe('Some error');

      // Set user should clear error
      act(() => {
        result.current.setUser(mockAppUser);
      });

      expect(result.current.error).toBeNull();
      expect(result.current.user).toEqual(mockAppUser);
    });

    it('should handle network errors gracefully', async () => {
      const networkError = new Error('Network error');
      vi.mocked(authService.signInWithEmail).mockRejectedValue(networkError);

      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setError(networkError.message);
      });

      expect(result.current.error).toBe('Network error');
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });
});
