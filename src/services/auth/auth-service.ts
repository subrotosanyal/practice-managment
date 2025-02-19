/// <reference types="vite/client" />

import { AuthConfig, AuthService, AuthUser } from './types';
import { OIDCAuthService } from './oidc-auth';

class AuthServiceWrapper implements AuthService {
  constructor(private instance: AuthService) {}

  async init(): Promise<void> {
    return this.instance.init();
  }

  async login(): Promise<void> {
    return this.instance.login();
  }

  async logout(): Promise<void> {
    return this.instance.logout();
  }

  async isAuthenticated(): Promise<boolean> {
    return this.instance.isAuthenticated();
  }

  async getUser(): Promise<AuthUser | null> {
    return this.instance.getUser();
  }

  async getToken(): Promise<string | null> {
    return this.instance.getToken();
  }

  async updateToken(minValidity: number): Promise<boolean> {
    return this.instance.updateToken(minValidity);
  }

  async handleCallback(callbackUrl: string): Promise<void> {
    return this.instance.handleCallback(callbackUrl);
  }
}

export class AuthServiceFactory {
  private static instance: AuthService | null = null;

  static async createInstance(config: AuthConfig): Promise<AuthService> {
    if (this.instance) {
      return new AuthServiceWrapper(this.instance);
    }

    switch (config.type) {
      case 'oidc':
        const oidcService = new OIDCAuthService(config);
        await oidcService.init();
        this.instance = oidcService;
        return new AuthServiceWrapper(this.instance);
      default:
        throw new Error(`Unsupported auth type: ${config.type}`);
    }
  }

  static getInstance(): AuthService {
    if (!this.instance) {
      throw new Error('AuthService not initialized');
    }
    return new AuthServiceWrapper(this.instance);
  }

  static async destroyInstance(): Promise<void> {
    if (this.instance) {
      await this.instance.logout();
      this.instance = null;
    }
  }
}

// Initialize auth service
let authService: AuthService;

AuthServiceFactory.createInstance({
  type: 'oidc',
  clientId: import.meta.env.VITE_OIDC_CLIENT_ID,
  oidc: {
    issuer: import.meta.env.VITE_OIDC_ISSUER,
    clientId: import.meta.env.VITE_OIDC_CLIENT_ID,
    redirectUri: import.meta.env.VITE_OIDC_REDIRECT_URI || window.location.origin,
    scope: import.meta.env.VITE_OIDC_SCOPE || 'openid profile email',
    responseType: import.meta.env.VITE_OIDC_RESPONSE_TYPE || 'code',
    extraParams: {},
    clockTolerance: 60,
  }
})
  .then(instance => {
    authService = instance;
  })
  .catch(error => {
    console.error('Failed to initialize auth service:', error);
  });

export { authService };
