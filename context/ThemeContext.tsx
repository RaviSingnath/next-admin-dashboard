"use client";

import type React from "react";
import { createContext, useState, useContext, useEffect } from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Helper to get the initial theme — safe for SSR
function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light"; // SSR guard

  // 1. Respect saved user preference
  const saved = localStorage.getItem("theme");
  if (saved === "dark" || saved === "light") return saved;

  // 2. Fall back to OS/system preference
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";

  // 3. Default to light
  return "light";
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Lazy initializer — runs once before first render, no effect needed
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // Sync theme to localStorage and <html> class whenever it changes
  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};