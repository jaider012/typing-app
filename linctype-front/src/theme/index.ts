import { createSystem, defaultConfig } from "@chakra-ui/react";

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        mono: {
          value:
            '"Fira Code", "Roboto Mono", Consolas, "Liberation Mono", Menlo, monospace',
        },
        heading: {
          value: '"Fira Code", "Roboto Mono", Consolas, monospace',
        },
        body: {
          value: '"Inter", "Roboto", system-ui, sans-serif',
        },
      },
      colors: {
        primary: {
          50: { value: "#fffbea" },
          100: { value: "#fef3c7" },
          200: { value: "#fde68a" },
          300: { value: "#fcd34d" },
          400: { value: "#fbbf24" },
          500: { value: "#f59e0b" },
          600: { value: "#d97706" },
          700: { value: "#b45309" },
          800: { value: "#92400e" },
          900: { value: "#78350f" },
        },
        gray: {
          50: { value: "#f9fafb" },
          100: { value: "#f3f4f6" },
          200: { value: "#e5e7eb" },
          300: { value: "#d1d5db" },
          400: { value: "#9ca3af" },
          500: { value: "#6b7280" },
          600: { value: "#4b5563" },
          700: { value: "#374151" },
          800: { value: "#1f2937" },
          900: { value: "#111827" },
        },
      },
    },
    semanticTokens: {
      colors: {
        // Backgrounds
        bg: { value: { base: "#fffbe7", _dark: "#0f0f0f" } },
        card: { value: { base: "#edecdc", _dark: "#1e1e1e" } },
        modal: { value: { base: "#ffffff", _dark: "#1e1e1e" } },
        textArea: { value: { base: "#f3f4f6", _dark: "#1a1a1a" } },

        // Text
        main: { value: { base: "#1f2937", _dark: "#f3f4f6" } },
        sub: { value: { base: "#6b7280", _dark: "#9ca3af" } },

        // Borders & UI
        border: { value: { base: "#e5e7eb", _dark: "#374151" } },
        caret: { value: { base: "#f59e0b", _dark: "#fbbf24" } },
        wordActive: { value: { base: "#f3f4f6", _dark: "#374151" } },

        // Typing character states
        correct: { value: { base: "#10b981", _dark: "#34d399" } },
        incorrect: { value: { base: "#ef4444", _dark: "#f87171" } },
        pending: { value: { base: "#9ca3af", _dark: "#6b7280" } },
        current: { value: { base: "#f59e0b", _dark: "#fbbf24" } },
      },
    },
  },
});
