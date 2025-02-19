import { describe, it, expect, vi } from 'vitest';
import { useRBAC, RBACProvider } from '../rbac-context';
import { renderHook, waitFor } from '@testing-library/react';
import { AuthProvider } from '../../auth/auth-context';
import { AuthService } from '../../auth/types';

describe('RBAC Context', () => {
  const mockUser = {
    id: 'test-user',
    username: 'testuser',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    roles: ['admin']
  };

  const mockAuthService: AuthService = {
    init: vi.fn().mockResolvedValue(undefined),
    login: vi.fn().mockResolvedValue(undefined),
    logout: vi.fn().mockResolvedValue(undefined),
    isAuthenticated: vi.fn().mockResolvedValue(true),
    getUser: vi.fn().mockResolvedValue(mockUser),
    getToken: vi.fn().mockResolvedValue('mock-token'),
    updateToken: vi.fn().mockResolvedValue(true),
    handleCallback: vi.fn().mockResolvedValue(undefined)
  };

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider authService={mockAuthService}>
      <RBACProvider>
        {children}
      </RBACProvider>
    </AuthProvider>
  );

  it('should return false for unauthorized role', async () => {
    const { result } = renderHook(() => useRBAC(), { wrapper });
    await waitFor(() => expect(result.current.hasRole('unauthorized-role')).toBe(false));
  });

  it('should return true for authorized role', async () => {
    const { result } = renderHook(() => useRBAC(), { wrapper });
    await waitFor(() => expect(result.current.hasRole('admin')).toBe(true));
  });

  it('should return all roles', async () => {
    const { result } = renderHook(() => useRBAC(), { wrapper });
    await waitFor(() => expect(result.current.roles).toEqual(['admin']));
  });

  it('should handle multiple roles', async () => {
    const { result } = renderHook(() => useRBAC(), { wrapper });
    await waitFor(() => expect(result.current.hasRole(['admin', 'user'])).toBe(true));
  });
});
