import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../auth-context';
import { AuthService } from '../types';

describe('Auth Context', () => {
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
      {children}
    </AuthProvider>
  );

  it('should initialize auth service on mount', async () => {
    renderHook(() => useAuth(), { wrapper });
    await waitFor(() => {
      expect(mockAuthService.init).toHaveBeenCalled();
    });
  });

  it('should provide authentication state', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.user).toEqual(mockUser);
    });
  });

  it('should handle login', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {
      await result.current.login();
    });
    expect(mockAuthService.login).toHaveBeenCalled();
  });

  it('should handle logout', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {
      await result.current.logout();
    });
    expect(mockAuthService.logout).toHaveBeenCalled();
  });

  it('should get token', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {
      const token = await result.current.getToken();
      expect(token).toBe('mock-token');
    });
    expect(mockAuthService.getToken).toHaveBeenCalled();
  });
});
