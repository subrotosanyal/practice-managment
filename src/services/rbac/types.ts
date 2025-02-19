import { AuthUser } from '../auth/types';

export type Role = string;

export interface RBACContextType {
  user: AuthUser | null;
  roles: Role[];
  hasRole: (role: Role | Role[]) => boolean;
  hasAnyRole: (roles: Role[]) => boolean;
  hasAllRoles: (roles: Role[]) => boolean;
}

export interface RestrictedProps {
  /**
   * Roles required to render the children
   */
  roles: Role[];
  /**
   * Optional element to render when access is denied
   */
  fallback?: React.ReactNode;
  /**
   * Whether to check if user has all roles (true) or any role (false)
   */
  requireAll?: boolean;
  /**
   * Content to render when user has required role(s)
   */
  children: React.ReactNode;
}
