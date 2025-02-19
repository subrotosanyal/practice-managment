import { ThemeConfig, ComponentStyleConfig } from '@chakra-ui/react';

export type SkinName = 'modern' | 'classic';

export interface SkinConfig {
  name: SkinName;
  label: string;
  description: string;
  preview?: string;
}

interface ColorModeStyles {
  light: string;
  dark: string;
}

export interface SkinThemeConfig extends ThemeConfig {
  config: ThemeConfig;
  fonts: {
    body: string;
    heading: string;
    mono: string;
  };
  colors: {
    primary: Record<string | number, string>;
    secondary: Record<string | number, string>;
    accent: Record<string | number, string>;
    background: {
      light: string;
      dark: string;
      default: ColorModeStyles;
      elevated: ColorModeStyles;
    };
    text: {
      primary: ColorModeStyles;
      secondary: ColorModeStyles;
      light: ColorModeStyles;
      inverse: ColorModeStyles;
    };
  };
  components: {
    Button: ComponentStyleConfig;
    Card: ComponentStyleConfig;
    Input: ComponentStyleConfig;
  };
  styles: {
    global: Record<string, any>;
  };
}
