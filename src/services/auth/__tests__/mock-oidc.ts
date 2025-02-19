import { AuthService, AuthUser } from '../types';

export class MockOIDCAuthService implements AuthService {
  private _isAuthenticated = false;
  private _token: string | null = null;

  async init(): Promise<void> {
    return Promise.resolve();
  }

  async isAuthenticated(): Promise<boolean> {
    return Promise.resolve(this._isAuthenticated);
  }

  async login(): Promise<void> {
    this._isAuthenticated = true;
    this._token = 'mock-token';
    return Promise.resolve();
  }

  async logout(): Promise<void> {
    this._isAuthenticated = false;
    this._token = null;
    return Promise.resolve();
  }

  async getToken(): Promise<string | null> {
    return Promise.resolve(this._token);
  }

  async updateToken(): Promise<boolean> {
    return Promise.resolve(true);
  }

  async handleCallback(): Promise<void> {
    this._isAuthenticated = true;
    this._token = 'mock-token';
    return Promise.resolve();
  }

  async getUser(): Promise<AuthUser | null> {
    return Promise.resolve({
      id: 'test-user',
      username: 'testuser',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      roles: ['admin']
    });
  }
}
