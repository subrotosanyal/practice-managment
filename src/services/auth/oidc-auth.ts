import { AuthConfig, AuthService, AuthUser, TokenSet, UserInfo } from './types';

export class OIDCAuthService implements AuthService {
  private tokenSet: TokenSet | null = null;
  private userInfo: UserInfo | null = null;

  constructor(private config: AuthConfig) {
    if (!config.oidc) {
      throw new Error('OIDC configuration is required');
    }
    console.log('OIDC Service initialized with config:', {
      issuer: config.oidc.issuer,
      clientId: config.oidc.clientId,
      redirectUri: config.oidc.redirectUri,
      scope: config.oidc.scope
    });
  }

  async init(): Promise<void> {
    try {
      console.log('Initializing OIDC service...');
      // Check if we have a valid session
      const storedTokenSet = localStorage.getItem('tokenSet');
      const storedUserInfo = localStorage.getItem('userInfo');
      
      if (storedTokenSet) {
        console.log('Found stored token set');
        this.tokenSet = JSON.parse(storedTokenSet) as TokenSet;
        
        if (this.isTokenValid()) {
          console.log('Token is valid');
          if (storedUserInfo) {
            console.log('Found stored user info');
            this.userInfo = JSON.parse(storedUserInfo);
          } else {
            console.log('No stored user info, fetching from server');
            try {
              this.userInfo = await this.fetchUserInfo();
            } catch (error) {
              console.error('Failed to fetch user info during init:', error);
              this.clearSession();
            }
          }
        } else {
          console.log('Stored token is invalid, clearing session');
          this.clearSession();
        }
      } else {
        console.log('No stored token set found');
      }
    } catch (error) {
      console.error('Failed to initialize OIDC client:', error);
      this.clearSession();
      throw error;
    }
  }

  async login(): Promise<void> {
    console.log('Starting login process...');
    const codeVerifier = this.generateRandomString();
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);
    
    localStorage.setItem('code_verifier', codeVerifier);
    localStorage.setItem('auth_state', this.generateRandomString());

    try {
      const oidcConfig = await this.getOIDCEndpoints();
      const authorizationEndpoint = oidcConfig.authorization_endpoint;

      const params = new URLSearchParams({
        response_type: this.config.oidc.responseType || 'code',
        client_id: this.config.oidc.clientId,
        scope: this.config.oidc.scope || 'openid profile email',
        redirect_uri: this.config.oidc.redirectUri,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        state: localStorage.getItem('auth_state') || '',
        ...this.config.oidc.extraParams
      });

      const loginUrl = `${authorizationEndpoint}?${params.toString()}`;
      console.log('Redirecting to:', loginUrl);
      window.location.href = loginUrl;
    } catch (error) {
      console.error('Login failed:', error);
      this.clearSession();
      throw error;
    }
  }

  async handleCallback(callbackUrl: string): Promise<void> {
    console.log('Handling callback:', callbackUrl);
    const url = new URL(callbackUrl);
    const params = new URLSearchParams(url.search);
    const code = params.get('code');
    const state = params.get('state');
    const storedState = localStorage.getItem('auth_state');
    const codeVerifier = localStorage.getItem('code_verifier');

    console.log('Callback parameters:', {
      hasCode: !!code,
      hasState: !!state,
      hasStoredState: !!storedState,
      hasCodeVerifier: !!codeVerifier,
      stateMatch: state === storedState
    });

    if (!code) {
      throw new Error('No authorization code found in the callback URL');
    }

    if (!codeVerifier) {
      console.error('No code verifier found in storage');
      this.clearSession();
      throw new Error('No code verifier found');
    }

    if (!state || !storedState || state !== storedState) {
      console.error('Invalid state parameter');
      this.clearSession();
      throw new Error('Invalid state parameter');
    }

    try {
      console.log('Found authorization code and code verifier');

      const oidcConfig = await this.getOIDCEndpoints();
      const tokenEndpoint = oidcConfig.token_endpoint;

      console.log('Using token endpoint:', tokenEndpoint);
      const tokenParams = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.config.oidc.redirectUri,
        client_id: this.config.oidc.clientId,
        code_verifier: codeVerifier
      });

      console.log('Exchanging code for tokens...');
      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: tokenParams.toString()
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Token exchange failed:', error);
        throw new Error('Failed to exchange code for tokens');
      }

      const tokenData = await response.json();
      console.log('Token exchange successful');
      const now = Math.floor(Date.now() / 1000);

      this.tokenSet = {
        access_token: tokenData.access_token,
        id_token: tokenData.id_token,
        refresh_token: tokenData.refresh_token,
        token_type: tokenData.token_type || 'Bearer',
        expires_at: now + (tokenData.expires_in || 3600)
      };

      console.log('Token set created, expires at:', new Date(this.tokenSet.expires_at * 1000));
      localStorage.setItem('tokenSet', JSON.stringify(this.tokenSet));

      console.log('Fetching user info...');
      this.userInfo = await this.fetchUserInfo();
      console.log('User info fetched successfully');

      // Only clear auth state after successful token exchange
      localStorage.removeItem('code_verifier');
      localStorage.removeItem('auth_state');
    } catch (error) {
      console.error('Error during callback handling:', error);
      this.clearSession();
      throw error;
    }
  }

  async logout(): Promise<void> {
    console.log('Starting logout process...');
    try {
      const oidcConfig = await this.getOIDCEndpoints();
      const endSessionEndpoint = oidcConfig.end_session_endpoint;
      
      if (!endSessionEndpoint) {
        console.error('No end session endpoint found in OIDC configuration');
        this.clearSession();
        window.location.href = '/';
        return;
      }

      const params = new URLSearchParams({
        id_token_hint: this.tokenSet?.id_token || '',
        post_logout_redirect_uri: this.config.oidc.redirectUri,
        state: this.generateRandomString()
      });

      const logoutUrl = `${endSessionEndpoint}?${params.toString()}`;
      console.log('Redirecting to logout URL:', logoutUrl);
      
      // Clear session before redirecting
      this.clearSession();
      
      window.location.href = logoutUrl;
    } catch (error) {
      console.error('Logout failed:', error);
      // If logout fails, clear session and redirect to home
      this.clearSession();
      window.location.href = '/';
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const storedTokenSet = localStorage.getItem('tokenSet');
      if (storedTokenSet) {
        this.tokenSet = JSON.parse(storedTokenSet);
      }
      const isValid = this.isTokenValid();
      console.log('Authentication check:', isValid);
      return isValid;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  async getUser(): Promise<AuthUser | null> {
    console.log('Getting user...', {
      hasUserInfo: !!this.userInfo,
      isTokenValid: this.isTokenValid()
    });

    if (!this.isTokenValid()) {
      console.log('Token is invalid');
      return null;
    }

    try {
      if (!this.userInfo) {
        console.log('No user info in memory, fetching from server...');
        this.userInfo = await this.fetchUserInfo();
      }

      const user: AuthUser = {
        id: this.userInfo.sub,
        username: this.userInfo.preferred_username || '',
        email: this.userInfo.email || '',
        firstName: this.userInfo.given_name || '',
        lastName: this.userInfo.family_name || '',
        roles: this.userInfo.realm_access?.roles || [],
        accessToken: this.tokenSet?.access_token,
        idToken: this.tokenSet?.id_token,
      };

      console.log('Mapped user object:', user);
      return user;
    } catch (error) {
      console.error('Failed to get user:', error);
      return null;
    }
  }

  async getToken(): Promise<string | null> {
    if (!this.isTokenValid()) {
      return null;
    }
    return this.tokenSet?.access_token || null;
  }

  async updateToken(minValidity: number): Promise<boolean> {
    if (!this.tokenSet?.refresh_token) {
      return false;
    }

    try {
      const now = Math.floor(Date.now() / 1000);
      if (this.tokenSet.expires_at - now > minValidity) {
        return true;
      }

      console.log('Token needs refresh');
      const oidcConfig = await this.getOIDCEndpoints();
      const tokenEndpoint = oidcConfig.token_endpoint;

      const params = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: this.tokenSet.refresh_token,
        client_id: this.config.oidc.clientId
      });

      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const tokenData = await response.json();
      const newExpiry = now + (tokenData.expires_in || 3600);

      this.tokenSet = {
        access_token: tokenData.access_token,
        id_token: tokenData.id_token,
        refresh_token: tokenData.refresh_token || this.tokenSet.refresh_token,
        token_type: tokenData.token_type || 'Bearer',
        expires_at: newExpiry
      };

      localStorage.setItem('tokenSet', JSON.stringify(this.tokenSet));
      console.log('Token refreshed successfully');
      return true;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return false;
    }
  }

  private isTokenValid(): boolean {
    if (!this.tokenSet) {
      console.log('No token set available');
      return false;
    }
    const isValid = Date.now() < this.tokenSet.expires_at * 1000;
    console.log('Token validity check:', isValid, 'Expires at:', new Date(this.tokenSet.expires_at * 1000));
    return isValid;
  }

  private async getOIDCEndpoints(): Promise<any> {
    const discoveryUrl = `${this.config.oidc.issuer}/.well-known/openid-configuration`;
    console.log('Fetching OIDC configuration from:', discoveryUrl);
    const response = await fetch(discoveryUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch OIDC configuration');
    }
    const config = await response.json();
    console.log('OIDC configuration:', config);
    return config;
  }

  private async fetchUserInfo(): Promise<UserInfo> {
    if (!this.tokenSet?.access_token) {
      throw new Error('No valid access token available');
    }

    try {
      const oidcConfig = await this.getOIDCEndpoints();
      const userInfoEndpoint = oidcConfig.userinfo_endpoint;

      console.log('Using userinfo endpoint:', userInfoEndpoint);
      const response = await fetch(userInfoEndpoint, {
        headers: {
          'Authorization': `Bearer ${this.tokenSet.access_token}`
        }
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Failed to fetch user info:', error);
        throw new Error('Failed to fetch user info');
      }

      const userInfo = await response.json();
      console.log('User info fetched:', userInfo);
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      return userInfo;
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  }

  private generateRandomString(): string {
    const array = new Uint32Array(28);
    window.crypto.getRandomValues(array);
    return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
  }

  private async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  private clearSession(): void {
    console.log('Clearing session...');
    localStorage.removeItem('tokenSet');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('code_verifier');
    localStorage.removeItem('auth_state');
    this.tokenSet = null;
    this.userInfo = null;
  }
}
