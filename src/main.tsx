// React imports
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthServiceFactory } from './services/auth/auth-service';
import { AuthConfig } from './services/auth/types';
import { AuthProvider } from './services/auth/auth-context';
import { theme } from './theme';
import './i18n'; // Import i18n configuration

const config: AuthConfig = {
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
};

AuthServiceFactory.createInstance(config)
  .then((authService) => {
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <BrowserRouter>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <ChakraProvider theme={theme}>
            <AuthProvider authService={authService}>
              <App />
            </AuthProvider>
          </ChakraProvider>
        </BrowserRouter>
      </React.StrictMode>
    );
  })
  .catch((error: Error) => {
    console.error('Failed to initialize auth service:', error);
  });
