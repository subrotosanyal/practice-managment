import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../services/auth/auth-context';
import { RBACProvider } from '../services/rbac/rbac-context';
import { SkinProvider } from '../theme/skin-context';
import { AuthService, AuthUser } from '../services/auth/types';
import { vi } from 'vitest';

// Mock providers
vi.mock('../services/auth/auth-context', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuth: () => ({
    isAuthenticated: true,
    isLoading: false,
    user: { sub: 'test-user', roles: ['admin'] },
    login: vi.fn(),
    logout: vi.fn(),
    getToken: vi.fn()
  })
}));

vi.mock('../services/rbac/rbac-context', () => ({
  RBACProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useRBAC: () => ({
    hasRole: () => true,
    roles: ['admin']
  })
}));

vi.mock('../theme/skin-context', () => ({
  SkinProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useSkin: () => ({
    currentSkin: 'modern',
    setSkin: vi.fn(),
    isEnabled: true,
    availableSkins: [
      {
        name: 'modern',
        label: 'Modern',
        description: 'Clean and minimalist design with vibrant accents'
      },
      {
        name: 'classic',
        label: 'Classic',
        description: 'Traditional design with serif fonts and muted colors'
      }
    ]
  })
}));

function render(ui: React.ReactElement, { route = '/' } = {}) {
  window.history.pushState({}, 'Test page', route);

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const mockUser: AuthUser = {
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

    return (
      <ChakraProvider>
        <BrowserRouter>
          <AuthProvider authService={mockAuthService}>
            <RBACProvider>
              <SkinProvider>
                {children}
              </SkinProvider>
            </RBACProvider>
          </AuthProvider>
        </BrowserRouter>
      </ChakraProvider>
    );
  };

  return rtlRender(ui, { wrapper: Wrapper });
}

export * from '@testing-library/react';
export { render };
