import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { LoginPage } from './LoginPage';
import { authService } from '@/core/services/firebase/auth.service';

// Mock the auth service
vi.mock('@/core/services/firebase/auth.service', () => ({
  authService: {
    signInWithEmail: vi.fn(),
    signInWithGoogle: vi.fn(),
  },
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form correctly', () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    expect(screen.getByText('Connexion')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const submitButton = screen.getByRole('button', { name: /se connecter/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email requis/i)).toBeInTheDocument();
      expect(screen.getByText(/mot de passe requis/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid email', async () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /se connecter/i });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email invalide/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const mockUser = {
      id: 'test-id',
      email: 'test@example.com',
      displayName: 'Test User',
      role: 'learner' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(authService.signInWithEmail).mockResolvedValue(mockUser);

    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    const submitButton = screen.getByRole('button', { name: /se connecter/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(authService.signInWithEmail).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('handles login error', async () => {
    const errorMessage = 'Invalid credentials';
    vi.mocked(authService.signInWithEmail).mockRejectedValue(new Error(errorMessage));

    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    const submitButton = screen.getByRole('button', { name: /se connecter/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('handles Google sign in', async () => {
    const mockUser = {
      id: 'test-id',
      email: 'test@example.com',
      displayName: 'Test User',
      role: 'learner' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(authService.signInWithGoogle).mockResolvedValue(mockUser);

    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const googleButton = screen.getByRole('button', { name: /continuer avec google/i });
    fireEvent.click(googleButton);

    await waitFor(() => {
      expect(authService.signInWithGoogle).toHaveBeenCalled();
    });
  });

  it('navigates to register page when clicking register link', () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const registerLink = screen.getByText(/créer un compte/i);
    fireEvent.click(registerLink);

    expect(mockNavigate).toHaveBeenCalledWith('/register');
  });

  it('navigates to forgot password page when clicking forgot password link', () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const forgotPasswordLink = screen.getByText(/mot de passe oublié/i);
    fireEvent.click(forgotPasswordLink);

    expect(mockNavigate).toHaveBeenCalledWith('/forgot-password');
  });
});

