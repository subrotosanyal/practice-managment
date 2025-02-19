import { render, screen, fireEvent } from '../../test/test-utils';
import { Sidebar } from '../Sidebar';
import { describe, it, expect, vi } from 'vitest';

// Mock the plugins registry
vi.mock('../../plugins/registry', () => ({
  pluginRegistry: {
    getPlugins: vi.fn().mockReturnValue([
      {
        id: 'home',
        name: 'Home',
        path: '/',
        icon: () => <span data-testid="home-icon">Home Icon</span>,
        requiredRoles: ['user']
      }
    ])
  }
}));

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual as object,
    useLocation: () => ({ pathname: '/' })
  };
});

describe('Sidebar', () => {
  it('renders plugin items', () => {
    render(<Sidebar isMobileOpen={true} onMobileClose={() => {}} isExpanded={true} />);
    expect(screen.getAllByText('sidebar.home')[0]).toBeInTheDocument();
    expect(screen.getAllByTestId('home-icon')[0]).toBeInTheDocument();
  });

  it('calls onClose when mobile close button is clicked', () => {
    const onMobileClose = vi.fn();
    render(<Sidebar isMobileOpen={true} onMobileClose={onMobileClose} isExpanded={true} />);
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    expect(onMobileClose).toHaveBeenCalled();
  });

  it('highlights active route', () => {
    render(<Sidebar isMobileOpen={false} onMobileClose={() => {}} isExpanded={true} />);
    const activeLink = screen.getByText('sidebar.home').closest('a');
    expect(activeLink).toHaveClass('active');
  });
});
