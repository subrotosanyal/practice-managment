import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Role } from '../services/rbac/types';
import { useRBAC } from '../services/rbac/rbac-context';

interface ProtectedRouteProps {
  roles: Role[];
  requireAll?: boolean;
  children: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  roles,
  requireAll = false,
  children,
  redirectTo = '/dashboard',
}) => {
  const { hasAnyRole, hasAllRoles } = useRBAC();
  const location = useLocation();

  const hasAccess = requireAll ? hasAllRoles(roles) : hasAnyRole(roles);

  if (!hasAccess) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
