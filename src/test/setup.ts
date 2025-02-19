/// <reference types="vitest" />
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock environment variables
vi.mock('../env', () => ({
  VITE_OIDC_ISSUER: 'http://localhost:8080/realms/practice-management',
  VITE_OIDC_CLIENT_ID: 'practice-management-client',
  VITE_OIDC_REDIRECT_URI: 'http://localhost:3000/callback',
  VITE_OIDC_SCOPE: 'openid profile email',
  VITE_OIDC_RESPONSE_TYPE: 'code',
  VITE_ENABLE_SKINS: 'true',
  VITE_USER_CONFIG: 'http://localhost:8080/admin/practice-management/console',
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
  // @ts-ignore
  I18nextProvider: ({ children }) => children,
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
