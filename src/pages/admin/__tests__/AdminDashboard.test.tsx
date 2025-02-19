import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../test/test-utils';
import { AdminDashboard } from '../AdminDashboard';

// Mock the environment variable
vi.stubEnv('VITE_USER_CONFIG', 'http://localhost:8080/admin/practice-management/console');

describe('AdminDashboard', () => {
  it('renders all tabs correctly', () => {
    render(<AdminDashboard />);
    
    expect(screen.getByText('admin.tabs.general')).toBeInTheDocument();
    expect(screen.getByText('admin.tabs.customization')).toBeInTheDocument();
    expect(screen.getByText('admin.tabs.users')).toBeInTheDocument();
  });

  it('opens user config in new tab', () => {
    render(<AdminDashboard />);
    
    const link = screen.getByText('admin.tabs.users').closest('a');
    expect(link).toHaveAttribute('href', 'http://localhost:8080/admin/practice-management/console');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('switches between tabs correctly', async () => {
    render(<AdminDashboard />);
    
    // Initially, general tab should be selected
    expect(screen.getByRole('tab', { name: 'admin.tabs.general', selected: true })).toBeInTheDocument();

    // Click customization tab
    fireEvent.click(screen.getByRole('tab', { name: 'admin.tabs.customization' }));
    expect(screen.getByRole('tab', { name: 'admin.tabs.customization', selected: true })).toBeInTheDocument();
    expect(screen.getByTestId('skin-manager')).toBeInTheDocument();

    // Click general tab
    fireEvent.click(screen.getByRole('tab', { name: 'admin.tabs.general' }));
    expect(screen.getByRole('tab', { name: 'admin.tabs.general', selected: true })).toBeInTheDocument();
  });
});
