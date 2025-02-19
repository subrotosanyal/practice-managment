import { render, screen } from '@testing-library/react';
import { Restricted } from '../Restricted';
import { useRBAC } from '../../services/rbac/rbac-context';
import { vi } from 'vitest';

// Mock the RBAC context
vi.mock('../../services/rbac/rbac-context');

describe('Restricted', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render children when user has required role (any)', () => {
    (useRBAC as jest.Mock).mockReturnValue({
      hasAnyRole: () => true,
      hasAllRoles: () => false
    });

    render(
      <Restricted roles={['admin']}>
        <div>Restricted Content</div>
      </Restricted>
    );

    expect(screen.getByText('Restricted Content')).toBeInTheDocument();
  });

  it('should render children when user has all required roles', () => {
    (useRBAC as jest.Mock).mockReturnValue({
      hasAnyRole: () => true,
      hasAllRoles: () => true
    });

    render(
      <Restricted roles={['admin', 'user']} requireAll>
        <div>Restricted Content</div>
      </Restricted>
    );

    expect(screen.getByText('Restricted Content')).toBeInTheDocument();
  });

  it('should render fallback when user lacks required role', () => {
    (useRBAC as jest.Mock).mockReturnValue({
      hasAnyRole: () => false,
      hasAllRoles: () => false
    });

    render(
      <Restricted roles={['admin']} fallback={<div>Access Denied</div>}>
        <div>Restricted Content</div>
      </Restricted>
    );

    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.queryByText('Restricted Content')).not.toBeInTheDocument();
  });

  it('should render nothing when no fallback is provided and user lacks access', () => {
    (useRBAC as jest.Mock).mockReturnValue({
      hasAnyRole: () => false,
      hasAllRoles: () => false
    });

    const { container } = render(
      <Restricted roles={['admin']}>
        <div>Restricted Content</div>
      </Restricted>
    );

    expect(container.firstChild).toBeNull();
  });
});
