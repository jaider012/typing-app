import { createSystem, defaultConfig } from '@chakra-ui/react';

// Crear el sistema de tema personalizado para Chakra UI v3
export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        mono: { value: '"Roboto Mono", "Fira Code", Consolas, "Liberation Mono", "Menlo", monospace' },
        heading: { value: '"Roboto Mono", "Fira Code", Consolas, monospace' },
        body: { value: '"Roboto Mono", "Fira Code", Consolas, monospace' },
      },
      colors: {
        // Primary colors (yellow theme)
        primary: {
          50: { value: '#fefce8' },
          100: { value: '#fef3c7' },
          200: { value: '#fde68a' },
          300: { value: '#fcd34d' },
          400: { value: '#fbbf24' },
          500: { value: '#f59e0b' },
          600: { value: '#d97706' },
          700: { value: '#b45309' },
          800: { value: '#92400e' },
          900: { value: '#78350f' },
        },
      },
    },
    semanticTokens: {
      colors: {
        // Background colors
        bg: { 
          value: { base: '#ffffff', _dark: '#0f0f0f' } 
        },
        card: { 
          value: { base: '#ffffff', _dark: '#1a1a1a' } 
        },
        modal: { 
          value: { base: '#ffffff', _dark: '#1a1a1a' } 
        },
        textArea: { 
          value: { base: '#f8f9fa', _dark: '#1a1a1a' } 
        },
        
        // Text colors
        main: { 
          value: { base: '#1a1a1a', _dark: '#e5e5e5' } 
        },
        sub: { 
          value: { base: '#6b7280', _dark: '#9ca3af' } 
        },
        
        // UI elements
        border: { 
          value: { base: '#e5e7eb', _dark: '#374151' } 
        },
        caret: { 
          value: { base: '#f59e0b', _dark: '#fbbf24' } 
        },
        wordActive: { 
          value: { base: '#f3f4f6', _dark: '#374151' } 
        },
        
        // Character states
        correct: { 
          value: { base: '#10b981', _dark: '#34d399' } 
        },
        incorrect: { 
          value: { base: '#ef4444', _dark: '#f87171' } 
        },
        pending: { 
          value: { base: '#9ca3af', _dark: '#6b7280' } 
        },
        current: {
          value: { base: '#f59e0b', _dark: '#fbbf24' }
        }
      }
    }
  }
});