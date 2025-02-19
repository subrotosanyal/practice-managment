import { extendTheme, type ThemeConfig } from '@chakra-ui/react';
import { SkinThemeConfig } from '../types';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: true,
};

export const classicTheme: Partial<SkinThemeConfig> = {
  config,
  fonts: {
    body: "'Merriweather Sans', Georgia, serif",
    heading: "'Merriweather', Georgia, serif",
    mono: "'Courier Prime', monospace",
  },
  colors: {
    primary: {
      50: '#F5F9FF',
      100: '#E6F0FF',
      200: '#BFDBFE',
      300: '#93C5FD',
      400: '#60A5FA',
      500: '#3B82F6',
      600: '#2563EB',
      700: '#1D4ED8',
      800: '#1E40AF',
      900: '#1E3A8A',
    },
    secondary: {
      50: '#FAFAF9',
      100: '#F5F5F4',
      200: '#E7E5E4',
      300: '#D6D3D1',
      400: '#A8A29E',
      500: '#78716C',
      600: '#57534E',
      700: '#44403C',
      800: '#292524',
      900: '#1C1917',
    },
    accent: {
      50: '#FDF2F8',
      100: '#FCE7F3',
      200: '#FBCFE8',
      300: '#F9A8D4',
      400: '#F472B6',
      500: '#EC4899',
      600: '#DB2777',
      700: '#BE185D',
      800: '#9D174D',
      900: '#831843',
    },
    background: {
      light: '#FFFBF5',
      dark: '#1A1814',
      default: {
        light: '#FDFAF5',
        dark: '#1A1814',
      },
      elevated: {
        light: '#FFFFFF',
        dark: '#2D2925',
      },
    },
    text: {
      primary: {
        light: '#1A1814',
        dark: '#F5F5F4',
      },
      secondary: {
        light: '#2D2925',
        dark: '#E7E5E4',
      },
      light: {
        light: '#4A4541',
        dark: '#A8A29E',
      },
      inverse: {
        light: '#FFFFFF',
        dark: '#1A1814',
      },
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'primary',
      },
      baseStyle: {
        fontWeight: 'medium',
        borderRadius: 'md',
      },
      sizes: {
        lg: {
          fontSize: 'lg',
          px: 6,
          py: 3,
        },
        md: {
          fontSize: 'md',
          px: 4,
          py: 2,
        },
        sm: {
          fontSize: 'sm',
          px: 3,
          py: 1,
        },
      },
      variants: {
        solid: ({ colorScheme }) => ({
          bg: `${colorScheme}.600`,
          color: 'white',
          _hover: {
            bg: `${colorScheme}.700`,
          },
          _dark: {
            bg: `${colorScheme}.500`,
            _hover: {
              bg: `${colorScheme}.400`,
            },
          },
        }),
        outline: ({ colorScheme }) => ({
          borderColor: `${colorScheme}.600`,
          color: `${colorScheme}.600`,
          _hover: {
            bg: `${colorScheme}.50`,
          },
          _dark: {
            color: `${colorScheme}.200`,
            borderColor: `${colorScheme}.200`,
            _hover: {
              bg: `${colorScheme}.900`,
            },
          },
        }),
      },
    },
    Card: {
      parts: ['container', 'header', 'body', 'footer'],
      baseStyle: {
        container: {
          bg: 'white',
          borderRadius: 'md',
          boxShadow: 'base',
          border: '1px solid',
          borderColor: 'gray.200',
          _dark: {
            bg: 'gray.900',
            borderColor: 'whiteAlpha.300',
            boxShadow: 'dark-lg',
          },
        },
      },
    },
    Input: {
      defaultProps: {
        variant: 'outline',
      },
      baseStyle: {
        field: {
          borderRadius: 'md',
          _dark: {
            borderColor: 'whiteAlpha.300',
          },
        },
      },
      variants: {
        outline: {
          field: {
            borderRadius: 'md',
            borderWidth: '1px',
            _focus: {
              borderColor: 'primary.600',
              boxShadow: '0 0 0 1px var(--chakra-colors-primary-600)',
            },
            _dark: {
              borderColor: 'whiteAlpha.300',
              _focus: {
                borderColor: 'primary.300',
                boxShadow: '0 0 0 1px var(--chakra-colors-primary-300)',
              },
            },
          },
        },
      },
    },
  },
  styles: {
    global: ({ colorMode }: { colorMode: 'light' | 'dark' }) => ({
      body: {
        bg: colorMode === 'dark' ? 'gray.900' : 'white',
        color: colorMode === 'dark' ? 'whiteAlpha.900' : 'gray.900',
      },
      '*::placeholder': {
        color: colorMode === 'dark' ? 'whiteAlpha.400' : 'gray.500',
      },
      '*, *::before, *::after': {
        borderColor: colorMode === 'dark' ? 'whiteAlpha.300' : 'gray.200',
      },
    }),
  },
};

export const classic = extendTheme(classicTheme);
