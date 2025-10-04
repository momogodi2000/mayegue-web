import { describe, it, expect } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { ProtectedRoute } from '../../../../../shared/components/auth/ProtectedRoute';
import { useAuthStore } from '@/features/auth/store/authStore';

function renderWithAuth(user: any) {
  useAuthStore.setState({ user, loading: false, isAuthenticated: !!user, error: null });
  return render(
    <MemoryRouter initialEntries={["/protected"]}>
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route element={<ProtectedRoute />}> 
          <Route path="/protected" element={<div>Protected Content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe('ProtectedRoute', () => {
  it('redirects unauthenticated users to login', () => {
    renderWithAuth(null);
    expect(screen.getByText('Login Page')).toBeTruthy();
  });

  it('renders children for authenticated users', () => {
    renderWithAuth({ id: '1', email: 'a@b.c', displayName: 'A', role: 'learner', createdAt: new Date(), lastLoginAt: new Date() });
    expect(screen.getByText('Protected Content')).toBeTruthy();
  });
});

