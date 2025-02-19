export interface AuthUser {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  accessToken?: string;
  idToken?: string;
}

export interface OIDCConfig {
  issuer: string;
  clientId: string;
  redirectUri: string;
  scope?: string;
  responseType?: string;
  extraParams?: Record<string, string>;
  clockTolerance?: number;
}

export interface AuthConfig {
  type: 'oidc';
  clientId: string;
  oidc: OIDCConfig;
}

export interface AuthService {
  init(): Promise<void>;
  login(): Promise<void>;
  logout(): Promise<void>;
  isAuthenticated(): Promise<boolean>;
  getUser(): Promise<AuthUser | null>;
  getToken(): Promise<string | null>;
  updateToken(minValidity: number): Promise<boolean>;
  handleCallback(callbackUrl: string): Promise<void>;
}

export interface TokenSet {
  access_token: string;
  id_token?: string;
  refresh_token?: string;
  token_type: string;
  expires_at: number;
}

export interface UserInfo {
  sub: string;
  email?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  realm_access?: {
    roles: string[];
  };
}
