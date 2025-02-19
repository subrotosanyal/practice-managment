import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Header } from '../Header';
import { useAuth } from '../../services/auth/auth-context';
import { vi } from 'vitest';

// Mock the auth context and i18n
vi.mock('../../services/auth/auth-context');
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// Mock Chakra UI components
vi.mock('@chakra-ui/react', () => {
  return {
    Box: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Flex: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Avatar: ({ size, name }: { size?: string, name?: string }) => (
      <div data-testid={`avatar-${size}`} aria-label={name}></div>
    ),
    HStack: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    IconButton: ({ onClick, 'aria-label': label }: { onClick: () => void, 'aria-label': string }) => (
      <button onClick={onClick} aria-label={label}>Icon</button>
    ),
    Button: ({ onClick, children }: { onClick?: () => void, children: React.ReactNode }) => (
      <button onClick={onClick}>{children}</button>
    ),
    Menu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    MenuButton: ({ children }: { children: React.ReactNode }) => <div data-testid="menu-button">{children}</div>,
    MenuList: ({ children }: { children: React.ReactNode }) => <div data-testid="menu-list">{children}</div>,
    MenuItem: ({ onClick, children }: { onClick?: () => void, children: React.ReactNode }) => (
      <button onClick={onClick}>{children}</button>
    ),
    MenuDivider: () => <hr />,
    useColorModeValue: (light: any) => light,
    useColorMode: () => ({ colorMode: 'light', toggleColorMode: vi.fn() }),
    Stack: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Center: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Text: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Spinner: () => <div data-testid="loading-spinner">Loading...</div>,
  };
});

describe('Header', () => {
  const mockOnOpen = vi.fn();
  const mockOnToggleSidebar = vi.fn();
  const mockLogout = vi.fn();

  const mockUser = {
    id: 'test-user',
    username: 'testuser',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    roles: ['admin']
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      logout: mockLogout,
      isLoading: false
    });
  });

  it('should render user avatar with correct initials', () => {
    render(<Header onOpen={mockOnOpen} onToggleSidebar={mockOnToggleSidebar} />);
    const avatar = screen.getByTestId('avatar-sm');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('aria-label', 'TU');
  });

  it('should show loading spinner when loading', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      logout: mockLogout,
      isLoading: true
    });
    render(<Header onOpen={mockOnOpen} onToggleSidebar={mockOnToggleSidebar} />);
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toBeInTheDocument();
  });

  it('should call logout when logout button is clicked', async () => {
    render(<Header onOpen={mockOnOpen} onToggleSidebar={mockOnToggleSidebar} />);
    const menuButton = screen.getByTestId('menu-button');
    fireEvent.click(menuButton);
    
    const logoutButton = screen.getByText('userMenu.logout');
    fireEvent.click(logoutButton);
    
    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
    });
  });

  it('should call onToggleSidebar when hamburger icon is clicked', () => {
    render(<Header onOpen={mockOnOpen} onToggleSidebar={mockOnToggleSidebar} />);
    const hamburgerButton = screen.getByLabelText('Toggle Navigation');
    fireEvent.click(hamburgerButton);
    expect(mockOnToggleSidebar).toHaveBeenCalled();
  });
});
