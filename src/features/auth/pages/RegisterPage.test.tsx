import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { RegisterPage } from './RegisterPage';
import { authService } from '@/core/services/firebase/auth.service';

// Mock the auth service
vi.mock('@/core/services/firebase/auth.service', () => ({
  authService: {
    signUpWithEmail: vi.fn(),
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

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders registration form correctly', () => {
    render(
      <TestWrapper>
        <RegisterPage />
      </TestWrapper>
    );

    expect(screen.getByText('Créer un compte')).toBeInTheDocument();
    expect(screen.getByLabelText(/nom complet/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmer le mot de passe/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /créer un compte/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    render(
      <TestWrapper>
        <RegisterPage />
      </TestWrapper>
    );

    const submitButton = screen.getByRole('button', { name: /créer un compte/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/nom requis/i)).toBeInTheDocument();
      expect(screen.getByText(/email requis/i)).toBeInTheDocument();
      expect(screen.getByText(/mot de passe requis/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid email', async () => {
    render(
      <TestWrapper>
        <RegisterPage />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /créer un compte/i });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email invalide/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for weak password', async () => {
    render(
      <TestWrapper>
        <RegisterPage />
      </TestWrapper>
    );

    const passwordInput = screen.getByLabelText(/mot de passe/i);
    const submitButton = screen.getByRole('button', { name: /créer un compte/i });

    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/le mot de passe doit contenir au moins 8 caractères/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for password mismatch', async () => {
    render(
      <TestWrapper>
        <RegisterPage />
      </TestWrapper>
    );

    const passwordInput = screen.getByLabelText(/mot de passe/i);
    const confirmPasswordInput = screen.getByLabelText(/confirmer le mot de passe/i);
    const submitButton = screen.getByRole('button', { name: /créer un compte/i });

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'different123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/les mots de passe ne correspondent pas/i)).toBeInTheDocument();
    });
  });

  it('shows validation error when terms are not accepted', async () => {
    render(
      <TestWrapper>
        <RegisterPage />
      </TestWrapper>
    );

    const nameInput = screen.getByLabelText(/nom complet/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    const confirmPasswordInput = screen.getByLabelText(/confirmer le mot de passe/i);
    const submitButton = screen.getByRole('button', { name: /créer un compte/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/vous devez accepter les conditions/i)).toBeInTheDocument();
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

    vi.mocked(authService.signUpWithEmail).mockResolvedValue(mockUser);

    render(
      <TestWrapper>
        <RegisterPage />
      </TestWrapper>
    );

    const nameInput = screen.getByLabelText(/nom complet/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    const confirmPasswordInput = screen.getByLabelText(/confirmer le mot de passe/i);
    const termsCheckbox = screen.getByLabelText(/j'accepte les conditions/i);
    const submitButton = screen.getByRole('button', { name: /créer un compte/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(termsCheckbox);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(authService.signUpWithEmail).toHaveBeenCalledWith('john@example.com', 'password123', 'John Doe');
    });
  });

  it('handles registration error', async () => {
    const errorMessage = 'Email already exists';
    vi.mocked(authService.signUpWithEmail).mockRejectedValue(new Error(errorMessage));

    render(
      <TestWrapper>
        <RegisterPage />
      </TestWrapper>
    );

    const nameInput = screen.getByLabelText(/nom complet/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    const confirmPasswordInput = screen.getByLabelText(/confirmer le mot de passe/i);
    const termsCheckbox = screen.getByLabelText(/j'accepte les conditions/i);
    const submitButton = screen.getByRole('button', { name: /créer un compte/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(termsCheckbox);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('navigates to login page when clicking login link', () => {
    render(
      <TestWrapper>
        <RegisterPage />
      </TestWrapper>
    );

    const loginLink = screen.getByText(/déjà un compte/i);
    fireEvent.click(loginLink);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});

