import { extendTheme, type ThemeConfig } from '@chakra-ui/react';
import { SkinThemeConfig } from '../types';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: true,
};

export const modernTheme: Partial<SkinThemeConfig> = {
  config,
  fonts: {
    body: "'Inter', -apple-system, system-ui, sans-serif",
    heading: "'Inter', -apple-system, system-ui, sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  colors: {
    primary: {
      50: '#E6F6FF',
      100: '#BAE3FF',
      200: '#7CC4FA',
      300: '#47A3F3',
      400: '#2186EB',
      500: '#0967D2',
      600: '#0552B5',
      700: '#03449E',
      800: '#01337D',
      900: '#002159',
    },
    secondary: {
      50: '#F5F7FA',
      100: '#E4E7EB',
      200: '#CBD2D9',
      300: '#9AA5B1',
      400: '#7B8794',
      500: '#616E7C',
      600: '#52606D',
      700: '#3E4C59',
      800: '#323F4B',
      900: '#1F2933',
    },
    accent: {
      50: '#FFE3EC',
      100: '#FFB8D2',
      200: '#FF8CBA',
      300: '#F364A2',
      400: '#E8368F',
      500: '#DA127D',
      600: '#BC0A6F',
      700: '#A30664',
      800: '#870557',
      900: '#620042',
    },
    background: {
      light: '#FFFFFF',
      dark: '#1A202C',
      default: {
        light: '#F7FAFC',
        dark: '#171923',
      },
      elevated: {
        light: '#FFFFFF',
        dark: '#2D3748',
      },
    },
    text: {
      primary: {
        light: '#2D3748',
        dark: '#F7FAFC',
      },
      secondary: {
        light: '#4A5568',
        dark: '#E2E8F0',
      },
      light: {
        light: '#718096',
        dark: '#A0AEC0',
      },
      inverse: {
        light: '#FFFFFF',
        dark: '#1A202C',
      },
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'primary',
      },
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'lg',
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
          bg: `${colorScheme}.500`,
          color: 'white',
          _hover: {
            bg: `${colorScheme}.600`,
          },
          _dark: {
            _hover: {
              bg: `${colorScheme}.400`,
            },
          },
        }),
        outline: ({ colorScheme }) => ({
          borderColor: `${colorScheme}.500`,
          color: `${colorScheme}.500`,
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
          borderRadius: 'xl',
          boxShadow: 'lg',
          _dark: {
            bg: 'gray.800',
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
          borderRadius: 'lg',
          _dark: {
            borderColor: 'whiteAlpha.300',
          },
        },
      },
      variants: {
        outline: {
          field: {
            borderRadius: 'lg',
            _focus: {
              borderColor: 'primary.500',
              boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
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
        bg: colorMode === 'dark' ? 'gray.800' : 'white',
        color: colorMode === 'dark' ? 'whiteAlpha.900' : 'gray.800',
      },
      '*::placeholder': {
        color: colorMode === 'dark' ? 'whiteAlpha.400' : 'gray.400',
      },
      '*, *::before, *::after': {
        borderColor: colorMode === 'dark' ? 'whiteAlpha.300' : 'gray.200',
      },
    }),
  },
};

export const modern = extendTheme(modernTheme);
