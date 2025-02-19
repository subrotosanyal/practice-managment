import React from 'react';
import { RestrictedProps } from '../services/rbac/types';
import { useRBAC } from '../services/rbac/rbac-context';

export const Restricted: React.FC<RestrictedProps> = ({
  roles,
  fallback = null,
  requireAll = false,
  children,
}) => {
  const { hasAnyRole, hasAllRoles } = useRBAC();
  const hasAccess = requireAll ? hasAllRoles(roles) : hasAnyRole(roles);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
