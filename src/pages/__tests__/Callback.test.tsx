import { render, screen } from '@testing-library/react';
import { Callback } from '../Callback';
import { useAuth } from '../../services/auth/auth-context';
import { useNavigate } from 'react-router-dom';
import { vi } from 'vitest';

// Mock the auth context
vi.mock('../../services/auth/auth-context');
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

// Mock Chakra UI components
vi.mock('@chakra-ui/react', () => {
  return {
    Center: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Spinner: () => <div data-testid="loading-spinner">Loading...</div>,
  };
});

describe('Callback', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  it('should show loading spinner when not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false });
    render(<Callback />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('should redirect to dashboard when authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true });
    render(<Callback />);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
  });
});
