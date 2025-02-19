import React, { createContext, useContext, useMemo } from 'react';
import { RBACContextType, Role } from './types';
import { useAuth } from '../auth/auth-context';

const RBACContext = createContext<RBACContextType | undefined>(undefined);

export const RBACProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const contextValue = useMemo(() => {
    const hasRole = (role: Role | Role[]): boolean => {
      if (!user?.roles) return false;
      if (Array.isArray(role)) {
        return role.some(r => user.roles.includes(r));
      }
      return user.roles.includes(role);
    };

    const hasAnyRole = (roles: Role[]): boolean => {
      if (!user?.roles) return false;
      return roles.some(role => user.roles.includes(role));
    };

    const hasAllRoles = (roles: Role[]): boolean => {
      if (!user?.roles) return false;
      return roles.every(role => user.roles.includes(role));
    };

    return {
      user,
      roles: user?.roles || [],
      hasRole,
      hasAnyRole,
      hasAllRoles,
    };
  }, [user]);

  return (
    <RBACContext.Provider value={contextValue}>
      {children}
    </RBACContext.Provider>
  );
};

export const useRBAC = (): RBACContextType => {
  const context = useContext(RBACContext);
  if (context === undefined) {
    throw new Error('useRBAC must be used within a RBACProvider');
  }
  return context;
};
