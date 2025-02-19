import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../test/test-utils';
import { SkinManager } from '../SkinManager';
import * as skinContext from '../../../theme/skin-context';

vi.mock('../../../theme/skin-context');

describe('SkinManager', () => {
  beforeEach(() => {
    vi.spyOn(skinContext, 'useSkin').mockReturnValue({
      currentSkin: 'modern',
      setSkin: vi.fn(),
      isEnabled: true,
      availableSkins: [
        {
          name: 'modern',
          label: 'admin.skins.modern',
          description: 'admin.skins.modernDescription'
        },
        {
          name: 'classic',
          label: 'admin.skins.classic',
          description: 'admin.skins.classicDescription'
        }
      ]
    });
  });

  it('renders available skins when enabled', () => {
    render(<SkinManager />);
    expect(screen.getByText('admin.skins.modern')).toBeInTheDocument();
    expect(screen.getByText('admin.skins.classic')).toBeInTheDocument();
  });

  it('shows disabled message when skins are disabled', () => {
    vi.spyOn(skinContext, 'useSkin').mockReturnValue({
      currentSkin: 'modern',
      setSkin: vi.fn(),
      isEnabled: false,
      availableSkins: []
    });
    render(<SkinManager />);
    expect(screen.getByText('admin.skins.disabled')).toBeInTheDocument();
  });

  it('changes skin when selected', () => {
    const setSkin = vi.fn();
    vi.spyOn(skinContext, 'useSkin').mockReturnValue({
      currentSkin: 'modern',
      setSkin,
      isEnabled: true,
      availableSkins: [
        {
          name: 'modern',
          label: 'admin.skins.modern',
          description: 'admin.skins.modernDescription'
        },
        {
          name: 'classic',
          label: 'admin.skins.classic',
          description: 'admin.skins.classicDescription'
        }
      ]
    });

    render(<SkinManager />);
    fireEvent.click(screen.getByRole('radio', { name: /admin\.skins\.classic admin\.skins\.classicDescription/i }));
    expect(setSkin).toHaveBeenCalledWith('classic');
  });

  it('shows current skin as selected', () => {
    render(<SkinManager />);
    const modernRadio = screen.getByRole('radio', { name: /admin\.skins\.modern admin\.skins\.modernDescription/i });
    expect(modernRadio).toBeChecked();
  });

  it('displays skin descriptions', () => {
    render(<SkinManager />);
    expect(screen.getByText('admin.skins.modernDescription')).toBeInTheDocument();
    expect(screen.getByText('admin.skins.classicDescription')).toBeInTheDocument();
  });
});
