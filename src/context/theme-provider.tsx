
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = "light" | "dark" | "system";

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
}

const initialState: ThemeProviderState = {
  theme: "light", // Changed default initial state for SSR or pre-mount
  setTheme: () => null,
  resolvedTheme: "light", 
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "light", // Changed default prop value to "light"
  storageKey = "conceito-psi-theme", 
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return defaultTheme;
    }
    try {
      const storedTheme = localStorage.getItem(storageKey) as Theme;
      return storedTheme || defaultTheme;
    } catch (e) {
      // If localStorage is not available or reading fails
      return defaultTheme;
    }
  });

  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(() => {
     // Initial resolved theme before effect runs
     if (typeof window !== "undefined") {
        const initialValue = theme === "system"
            ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
            : theme; // If theme is "light" (from localStorage or default), it's "light"
        return initialValue === "dark" ? "dark" : "light";
     }
     return defaultTheme === "dark" ? "dark" : "light"; // Default for SSR, respecting the new defaultTheme
  });


  useEffect(() => {
    const root = window.document.documentElement;
    
    const currentThemeToApply = theme === "system"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : theme;

    root.classList.remove("light", "dark");
    root.classList.add(currentThemeToApply);
    setResolvedTheme(currentThemeToApply);

    try {
      localStorage.setItem(storageKey, theme);
    } catch (e) {
      // localStorage not available
      console.warn(`localStorage not available, theme preference for '${storageKey}' not saved.`);
    }
  }, [theme, storageKey]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        const newResolvedTheme = mediaQuery.matches ? "dark" : "light";
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(newResolvedTheme);
        setResolvedTheme(newResolvedTheme);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]); // Rerun if user's choice of 'theme' changes (e.g. from light to system)

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

