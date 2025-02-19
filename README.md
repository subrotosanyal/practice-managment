# Practice Management Application

A TypeScript-based practice management application with Keycloak authentication, built using React, Chakra UI, and containerized with Docker.

## Features

- Keycloak Authentication (OIDC)
- Responsive Dashboard
- Collapsible Sidebar with Plugin Architecture
- Multi-language Support
- Dark/Light Theme with Custom Skins
- Role-based Access Control (RBAC)

## Prerequisites

- Node.js (v20 or later)
- Docker and Docker Compose
- npm or yarn

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development environment:
   ```bash
   docker-compose up -d
   ```

4. Access the application:
   - Frontend: http://localhost:3000
   - Keycloak Admin Console: http://localhost:8080/admin
   
   Default Keycloak credentials:
   - Username: admin
   - Password: admin

## Development

- Run development server:
  ```bash
  npm run dev
  ```

- Run tests:
  ```bash
  npm test
  ```

## Building for Production

```bash
npm run build
```

## Docker Deployment

```bash
docker-compose up -d --build
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/      # React contexts
├── hooks/         # Custom hooks
├── layouts/       # Layout components
├── pages/         # Page components
├── plugins/       # Sidebar plugin system
├── services/      # API and authentication services
├── theme/         # Chakra UI theme customization
└── utils/         # Utility functions
```

## UI Skinning System

The application supports dynamic UI skinning through a flexible theming system built on top of Chakra UI.

### Available Skins

1. **Modern**
   - Clean and minimalist design
   - Sharp corners and pronounced shadows
   - Vibrant color palette

2. **Classic**
   - Traditional design with serif fonts
   - Softer shadows and rounded corners
   - Muted color palette

### Adding a New Skin

1. Create a new skin file in `src/theme/skins/`:

```typescript
// src/theme/skins/your-skin.ts
import { extendTheme, type ThemeConfig } from '@chakra-ui/react';
import { SkinThemeConfig } from '../types';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: true,
};

export const yourTheme: Partial<SkinThemeConfig> = {
  config,
  fonts: {
    // Define your font families
  },
  colors: {
    // Define your color palette
  },
  components: {
    // Customize component styles
  },
  styles: {
    // Define global styles
  },
};

export const yourSkin = extendTheme(yourTheme);
```

2. Register the skin in `src/theme/skin-context.tsx`:

```typescript
export const AVAILABLE_SKINS: SkinConfig[] = [
  // ... existing skins
  {
    name: 'your-skin',
    label: 'Your Skin Name',
    description: 'Description of your skin',
  },
];

// Add to getThemeBySkin function
const getThemeBySkin = (skin: SkinName) => {
  switch (skin) {
    case 'your-skin':
      return yourSkin;
    // ... other cases
  }
};
```

### Enabling Skin Selection

Set the environment variable in your `.env` file:
```
VITE_ENABLE_SKINS=true
```

## Role-Based Access Control (RBAC)

The application implements a comprehensive RBAC system for managing user permissions.

### RBAC Components

1. **RBACContext**
   - Manages user roles and permissions
   - Provides hooks for role-based checks

2. **Restricted Component**
   - Conditional rendering based on roles
   - Supports multiple role requirements

3. **ProtectedRoute**
   - Route-level access control
   - Redirects unauthorized users

### Usage Examples

1. **Protecting a Route**:
```typescript
// In your router configuration
import { ProtectedRoute } from './components/ProtectedRoute';

<Route
  path="/admin"
  element={
    <ProtectedRoute roles={['admin']}>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
```

2. **Conditional Rendering**:
```typescript
import { Restricted } from './components/Restricted';

// Single role
<Restricted role="admin">
  <AdminPanel />
</Restricted>

// Multiple roles (any)
<Restricted roles={['admin', 'manager']}>
  <SettingsPanel />
</Restricted>

// Multiple roles (all)
<Restricted roles={['admin', 'finance']} requireAll>
  <FinancialReport />
</Restricted>
```

3. **Using RBAC Hook**:
```typescript
import { useRBAC } from './services/rbac/rbac-context';

function MyComponent() {
  const { hasRole, hasAnyRole } = useRBAC();

  // Check single role
  if (hasRole('admin')) {
    return <AdminContent />;
  }

  // Check multiple roles
  if (hasAnyRole(['manager', 'supervisor'])) {
    return <ManagerContent />;
  }

  return <RegularContent />;
}
```

4. **Plugin Registration with RBAC**:
```typescript
// In your plugin registry
pluginRegistry.registerPlugin({
  id: 'admin',
  name: 'Administration',
  icon: FiSettings,
  path: '/administration',
  component: AdminDashboard,
  requiredRoles: ['admin'], // Only admins can access
  order: 4
});
```

### Best Practices

1. **Role Definition**
   - Keep roles granular and specific
   - Use descriptive names
   - Document role permissions

2. **Access Control**
   - Always implement both frontend and backend checks
   - Never rely solely on UI restrictions
   - Use role combinations for complex permissions

3. **Error Handling**
   - Provide clear feedback for unauthorized access
   - Implement graceful fallbacks
   - Log access violations

## Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

