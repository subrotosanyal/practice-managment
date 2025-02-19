import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Callback } from './pages/Callback';
import { Spinner, Center } from '@chakra-ui/react';
import { pluginRegistry } from './plugins/registry';
import { useAuth } from './services/auth/auth-context';
import { RBACProvider } from './services/rbac/rbac-context';
import { ProtectedRoute } from './components/ProtectedRoute';
import { SkinProvider } from './theme/skin-context';

const App: React.FC = () => {
  const { isAuthenticated, isLoading, login } = useAuth();

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!isAuthenticated && window.location.pathname !== '/callback') {
    login();
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <SkinProvider>
      <RBACProvider>
        <Routes>
          <Route path="/callback" element={<Callback />} />
          <Route path="/" element={<MainLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            {pluginRegistry.getPlugins().map(plugin => {
              const PluginComponent = plugin.component;
              return (
                <Route
                  key={plugin.id}
                  path={plugin.path.replace('/', '')}
                  element={
                    plugin.requiredRoles ? (
                      <ProtectedRoute roles={plugin.requiredRoles}>
                        <PluginComponent />
                      </ProtectedRoute>
                    ) : (
                      <PluginComponent />
                    )
                  }
                />
              );
            })}
            <Route index element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </RBACProvider>
    </SkinProvider>
  );
};

export default App;
