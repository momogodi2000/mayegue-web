import { describe, it, expect } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { RoleRedirect } from './RoleRedirect';
import { useAuthStore } from '@/features/auth/store/authStore';

function renderWithRole(role: string) {
  useAuthStore.setState({ user: { id: '1', email: 'a@b.c', displayName: 'A', role, createdAt: new Date(), lastLoginAt: new Date() }, loading: false, isAuthenticated: true, error: null });
  return render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/dashboard" element={<RoleRedirect />} />
        <Route path="/dashboard/guest" element={<div>Guest</div>} />
        <Route path="/dashboard/learner" element={<div>Learner</div>} />
        <Route path="/dashboard/teacher" element={<div>Teacher</div>} />
        <Route path="/dashboard/admin" element={<div>Admin</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('RoleRedirect', () => {
  it('redirects unauthenticated to login', () => {
    useAuthStore.setState({ user: null, loading: false, isAuthenticated: false, error: null });
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/dashboard" element={<RoleRedirect />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Login Page')).toBeTruthy();
  });

  it('redirects by role correctly', () => {
    renderWithRole('learner');
    expect(screen.getByText('Learner')).toBeTruthy();
  });
});

