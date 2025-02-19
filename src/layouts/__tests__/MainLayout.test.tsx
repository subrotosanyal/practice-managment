import { render, screen, fireEvent } from '@testing-library/react';
import { MainLayout } from '../MainLayout';
import { vi } from 'vitest';

// Mock child components and hooks
vi.mock('../../components/Header', () => ({
  Header: ({ onOpen, onToggleSidebar }: { onOpen: () => void; onToggleSidebar: () => void }) => (
    <div>
      Header
      <button onClick={onOpen} data-testid="mobile-menu">Mobile Menu</button>
      <button onClick={onToggleSidebar} data-testid="toggle-sidebar">Toggle Sidebar</button>
    </div>
  )
}));

vi.mock('../../components/Sidebar', () => ({
  Sidebar: ({ isMobileOpen, onMobileClose, isExpanded }: { isMobileOpen: boolean; onMobileClose: () => void; isExpanded: boolean }) => (
    <div data-testid="sidebar" data-is-open={isMobileOpen} data-is-expanded={isExpanded}>
      Sidebar
      <button onClick={onMobileClose}>Close</button>
    </div>
  )
}));

vi.mock('react-router-dom', () => ({
  Outlet: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="content-area">{children || 'Test Content'}</div>
  )
}));

let disclosureCounter = 0;

const mockDisclosure = {
  isOpen: false,
  onOpen: vi.fn(),
  onClose: vi.fn(),
  onToggle: vi.fn(),
};

const mockExpandedDisclosure = {
  isOpen: true,
  onOpen: vi.fn(),
  onClose: vi.fn(),
  onToggle: vi.fn(),
};

vi.mock('@chakra-ui/react', () => ({
  Box: ({ children, minH, ml, p, mt, transition, ...props }: any) => (
    <div 
      data-testid="main-container" 
      style={{ 
        minHeight: minH, 
        marginLeft: ml, 
        padding: p, 
        marginTop: mt,
        transition
      }} 
      {...props}
    >
      {children}
    </div>
  ),
  useBreakpointValue: () => false,
  useDisclosure: () => {
    // First call is for mobile menu, second for sidebar expansion
    disclosureCounter++;
    const disclosure = disclosureCounter % 2 === 1 ? mockDisclosure : mockExpandedDisclosure;
    return {
      ...disclosure,
      isOpen: disclosureCounter % 2 === 1 ? false : true
    };
  }
}));

describe('MainLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    disclosureCounter = 0;
  });

  it('should render all components', () => {
    render(<MainLayout />);

    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('content-area')).toHaveTextContent('Test Content');
  });

  it('should handle mobile sidebar open/close', () => {
    render(<MainLayout />);

    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar.getAttribute('data-is-open')).toBe('false');

    // Open mobile menu
    const mobileMenuButton = screen.getByTestId('mobile-menu');
    fireEvent.click(mobileMenuButton);
    expect(mockDisclosure.onOpen).toHaveBeenCalled();

    // Close sidebar
    fireEvent.click(screen.getByText('Close'));
    expect(mockDisclosure.onClose).toHaveBeenCalled();
  });

  it('should handle sidebar expansion toggle', () => {
    render(<MainLayout />);

    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar.getAttribute('data-is-expanded')).toBe('true');

    // Toggle sidebar expansion
    const toggleButton = screen.getByTestId('toggle-sidebar');
    fireEvent.click(toggleButton);
    expect(mockExpandedDisclosure.onToggle).toHaveBeenCalled();
  });

  it('should have correct layout structure', () => {
    render(<MainLayout />);

    // Check for content area
    const contentArea = screen.getByTestId('content-area');
    expect(contentArea).toBeInTheDocument();
    expect(contentArea).toHaveTextContent('Test Content');
  });
});
