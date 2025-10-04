import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Layout } from '../../../../../shared/components/layout/Layout';

describe('Layout', () => {
  it('renders navigation links', () => {
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    );
    expect(screen.getByText('Dictionnaire')).toBeTruthy();
    expect(screen.getByText('Leçons')).toBeTruthy();
    expect(screen.getByText('À propos')).toBeTruthy();
  });
});

