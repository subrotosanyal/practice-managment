import { vi } from 'vitest';
import { AuthService, AuthConfig } from '../types';
import { AuthServiceFactory } from '../auth-service';

// Mock implementation with state
interface MockOIDCState {
  _isAuthenticated: boolean;
}

let mockOIDCService: {
  _isAuthenticated: boolean;
  init: ReturnType<typeof vi.fn>;
  isAuthenticated: ReturnType<typeof vi.fn>;
  login: ReturnType<typeof vi.fn>;
  logout: ReturnType<typeof vi.fn>;
  getToken: ReturnType<typeof vi.fn>;
  updateToken: ReturnType<typeof vi.fn>;
  handleCallback: ReturnType<typeof vi.fn>;
  getUser: ReturnType<typeof vi.fn>;
};

beforeEach(() => {
  mockOIDCService = {
    _isAuthenticated: false,
    init: vi.fn().mockResolvedValue(undefined),
    isAuthenticated: vi.fn(function(this: MockOIDCState) {
      return Promise.resolve(this._isAuthenticated);
    }),
    login: vi.fn(function(this: MockOIDCState) {
      this._isAuthenticated = true;
      return Promise.resolve();
    }),
    logout: vi.fn(function(this: MockOIDCState) {
      this._isAuthenticated = false;
      return Promise.resolve();
    }),
    getToken: vi.fn().mockResolvedValue('mock-token'),
    updateToken: vi.fn().mockResolvedValue(true),
    handleCallback: vi.fn().mockResolvedValue(undefined),
    getUser: vi.fn().mockResolvedValue({
      id: 'test-user',
      username: 'testuser',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      roles: ['admin']
    })
  };
});

vi.mock('../oidc-auth', () => ({
  OIDCAuthService: vi.fn().mockImplementation(() => mockOIDCService)
}));

describe('Auth Service', () => {
  let authService: AuthService;

  const mockConfig: AuthConfig = {
    type: 'oidc' as const,
    clientId: 'test-client',
    oidc: {
      issuer: 'http://localhost:8080/auth',
      clientId: 'test-client',
      redirectUri: 'http://localhost:3000/callback',
    }
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    mockOIDCService._isAuthenticated = false;
    authService = await AuthServiceFactory.createInstance(mockConfig);
  });

  it('should initialize auth service', async () => {
    await authService.init();
    expect(authService).toBeDefined();
  });

  it('should handle login', async () => {
    await authService.init();
    await authService.login();
    const isAuthenticated = await authService.isAuthenticated();
    expect(isAuthenticated).toBe(true);
  });

  it('should handle logout', async () => {
    await authService.init();
    await authService.login();
    await authService.logout();
    const isAuthenticated = await authService.isAuthenticated();
    expect(isAuthenticated).toBe(false);
  });

  it('should get token after login', async () => {
    await authService.init();
    await authService.login();
    const token = await authService.getToken();
    expect(token).toBe('mock-token');
  });

  it('should get user after login', async () => {
    await authService.init();
    await authService.login();
    const user = await authService.getUser();
    expect(user).toEqual({
      id: 'test-user',
      username: 'testuser',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      roles: ['admin']
    });
  });
});
