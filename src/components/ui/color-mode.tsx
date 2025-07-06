import React, { createContext, useContext, useEffect, useState } from "react";

interface ColorModeContextType {
  colorMode: "light" | "dark";
  toggleColorMode: () => void;
  setColorMode: (mode: "light" | "dark") => void;
}

const ColorModeContext = createContext<ColorModeContextType | undefined>(
  undefined
);

export function ColorModeProvider({ children }: { children: React.ReactNode }) {
  const [colorMode, setColorModeState] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("chakra-ui-color-mode");
      if (saved === "light" || saved === "dark") return saved;
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  });

  const setColorMode = (mode: "light" | "dark") => {
    setColorModeState(mode);
    localStorage.setItem("chakra-ui-color-mode", mode);
    document.documentElement.classList.toggle("dark", mode === "dark");
  };

  const toggleColorMode = () => {
    setColorMode(colorMode === "light" ? "dark" : "light");
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", colorMode === "dark");
  }, [colorMode]);

  return (
    <ColorModeContext.Provider
      value={{ colorMode, toggleColorMode, setColorMode }}
    >
      {children}
    </ColorModeContext.Provider>
  );
}

export function useColorMode() {
  const context = useContext(ColorModeContext);
  if (!context) {
    throw new Error("useColorMode must be used within ColorModeProvider");
  }
  return context;
}

export function useColorModeValue<T>(light: T, dark: T) {
  const { colorMode } = useColorMode();
  return colorMode === "light" ? light : dark;
}
