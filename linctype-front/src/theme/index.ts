import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: true,
};

export const theme = extendTheme({
  config,
  fonts: {
    mono: '"Roboto Mono", "Fira Code", Consolas, "Liberation Mono", "Menlo", monospace',
    heading: '"Roboto Mono", "Fira Code", Consolas, monospace',
    body: '"Roboto Mono", "Fira Code", Consolas, monospace',
  },
  
  semanticTokens: {
    colors: {
      // Background colors
      bg: { 
        default: 'gray.900', 
        _light: 'gray.50' 
      },
      card: { 
        default: 'gray.800', 
        _light: 'white' 
      },
      modal: { 
        default: 'gray.800', 
        _light: 'white' 
      },
      textArea: { 
        default: 'gray.800', 
        _light: 'gray.100' 
      },
      
      // Text colors
      main: { 
        default: 'gray.100', 
        _light: 'gray.800' 
      },
      sub: { 
        default: 'gray.500', 
        _light: 'gray.600' 
      },
      
      // UI elements
      border: { 
        default: 'gray.700', 
        _light: 'gray.200' 
      },
      caret: { 
        default: 'yellow.400', 
        _light: 'yellow.500' 
      },
      wordActive: { 
        default: 'gray.700', 
        _light: 'gray.200' 
      },
      
      // Character states
      correct: { 
        default: 'green.400', 
        _light: 'green.500' 
      },
      incorrect: { 
        default: 'red.400', 
        _light: 'red.500' 
      },
      pending: { 
        default: 'gray.600', 
        _light: 'gray.400' 
      },
      current: {
        default: 'yellow.300',
        _light: 'yellow.600'
      }
    }
  },
  
  components: {
    Button: {
      variants: {
        primary: {
          bg: 'yellow.400',
          color: 'gray.900',
          fontFamily: 'mono',
          fontWeight: 'semibold',
          _hover: { 
            bg: 'yellow.300',
            transform: 'translateY(-1px)',
          },
          _active: {
            bg: 'yellow.500',
            transform: 'translateY(0)',
          }
        },
        secondary: {
          bg: 'gray.600',
          color: 'white',
          fontFamily: 'mono',
          _hover: { 
            bg: 'gray.500' 
          },
          _dark: {
            bg: 'gray.600',
            _hover: { bg: 'gray.500' }
          }
        },
        ghost: {
          color: 'sub',
          fontFamily: 'mono',
          _hover: { 
            bg: 'card', 
            color: 'main' 
          }
        },
        danger: {
          bg: 'red.500',
          color: 'white',
          fontFamily: 'mono',
          _hover: { 
            bg: 'red.400' 
          }
        }
      }
    },
    
    Text: {
      baseStyle: {
        fontFamily: 'mono',
      }
    },
    
    Heading: {
      baseStyle: {
        fontFamily: 'mono',
        fontWeight: 'bold',
      }
    }
  },
  
  styles: {
    global: (props: any) => ({
      body: {
        bg: 'bg',
        color: 'main',
        fontFamily: 'mono',
      },
      '*::placeholder': {
        color: 'sub',
      },
      '*, *::before, &::after': {
        borderColor: 'border',
      },
    }),
  },
});