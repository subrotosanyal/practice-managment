import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { AuthService, AuthUser } from './types';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  authService: AuthService;
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ authService, children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const callbackHandled = useRef(false);
  const initialized = useRef(false);

  const checkAuth = useCallback(async () => {
    try {
      console.log('Checking authentication status...');
      const authenticated = await authService.isAuthenticated();
      console.log('Is authenticated:', authenticated);
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        console.log('Fetching user info...');
        const userInfo = await authService.getUser();
        console.log('User info received:', userInfo);
        setUser(userInfo);
      } else {
        console.log('Not authenticated, clearing user');
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [authService]);

  // Initialize auth service
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      authService.init().then(() => {
        const params = new URLSearchParams(window.location.search);
        if (!params.has('code')) {
          checkAuth();
        }
      });
    }
  }, [authService, checkAuth]);

  // Handle OIDC callback
  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      if (params.has('code') && !callbackHandled.current) {
        console.log('Found authorization code, handling callback...');
        callbackHandled.current = true;
        try {
          setIsLoading(true);
          await authService.handleCallback(window.location.href);
          console.log('Callback handled successfully');
          await checkAuth();
          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (error) {
          console.error('Failed to handle auth callback:', error);
          setIsAuthenticated(false);
          setUser(null);
        } finally {
          setIsLoading(false);
        }
      }
    };

    handleCallback();
  }, [authService, checkAuth]);

  const login = useCallback(async () => {
    console.log('Initiating login...');
    setIsLoading(true);
    try {
      await authService.login();
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
    }
  }, [authService]);

  const logout = useCallback(async () => {
    console.log('Logging out...');
    setIsLoading(true);
    try {
      setUser(null);
      setIsAuthenticated(false);
      await authService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, we want to clear the local state
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, [authService]);

  const getToken = useCallback(async () => {
    return authService.getToken();
  }, [authService]);

  const contextValue = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    getToken,
  };

  console.log('Current auth context state:', contextValue);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
