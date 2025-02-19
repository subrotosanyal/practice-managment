import { render, screen } from '@testing-library/react';
import { ProtectedRoute } from '../ProtectedRoute';
import { useRBAC } from '../../services/rbac/rbac-context';
import { useLocation, Navigate } from 'react-router-dom';
import { vi } from 'vitest';

// Mock the RBAC context and router
vi.mock('../../services/rbac/rbac-context');
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useLocation: vi.fn(),
  Navigate: vi.fn()
}));

describe('ProtectedRoute', () => {
  const mockLocation = { pathname: '/test' };
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useLocation as jest.Mock).mockReturnValue(mockLocation);
    (Navigate as jest.Mock).mockImplementation(({ to }) => {
      mockNavigate(to);
      return null;
    });
  });

  it('should render children when user has required role (any)', () => {
    (useRBAC as jest.Mock).mockReturnValue({
      hasAnyRole: () => true,
      hasAllRoles: () => false
    });

    render(
      <ProtectedRoute roles={['admin']}>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should render children when user has all required roles', () => {
    (useRBAC as jest.Mock).mockReturnValue({
      hasAnyRole: () => true,
      hasAllRoles: () => true
    });

    render(
      <ProtectedRoute roles={['admin', 'user']} requireAll>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should redirect when user lacks required role', () => {
    (useRBAC as jest.Mock).mockReturnValue({
      hasAnyRole: () => false,
      hasAllRoles: () => false
    });

    render(
      <ProtectedRoute roles={['admin']}>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('should redirect to custom path when specified', () => {
    (useRBAC as jest.Mock).mockReturnValue({
      hasAnyRole: () => false,
      hasAllRoles: () => false
    });

    render(
      <ProtectedRoute roles={['admin']} redirectTo="/custom">
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/custom');
  });
});
