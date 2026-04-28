"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "dark" | "light" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
  resolvedTheme: "dark" | "light";
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  setTheme: () => {},
  resolvedTheme: "dark",
});

const DARK_TOKENS: Record<string, string> = {
  "--bg": "#0a0a0c",
  "--bg-elevated": "#101014",
  "--surface": "rgba(255,255,255,0.04)",
  "--surface-2": "rgba(255,255,255,0.08)",
  "--border": "rgba(255,255,255,0.08)",
  "--border-strong": "rgba(255,255,255,0.14)",
  "--text": "#fafafa",
  "--text-muted": "#a1a1aa",
  "--text-faint": "#52525b",
  "--nav-bg": "rgba(9,9,11,0.55)",
};

const LIGHT_TOKENS: Record<string, string> = {
  "--bg": "#f0f0f3",
  "--bg-elevated": "#ffffff",
  "--surface": "rgba(0,0,0,0.05)",
  "--surface-2": "rgba(0,0,0,0.09)",
  "--border": "rgba(0,0,0,0.10)",
  "--border-strong": "rgba(0,0,0,0.18)",
  "--text": "#09090b",
  "--text-muted": "#52525b",
  "--text-faint": "#a1a1aa",
  "--nav-bg": "rgba(240,240,243,0.82)",
};

function applyTokens(tokens: Record<string, string>) {
  const html = document.documentElement;
  Object.entries(tokens).forEach(([prop, value]) => {
    html.style.setProperty(prop, value);
  });
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [systemIsDark, setSystemIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("campus-theme") as Theme | null;
    if (stored && ["dark", "light", "system"].includes(stored)) {
      setThemeState(stored);
    }
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemIsDark(mq.matches);
    const handler = (e: MediaQueryListEvent) => setSystemIsDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const resolvedTheme: "dark" | "light" =
    theme === "system" ? (systemIsDark ? "dark" : "light") : theme;

  useEffect(() => {
    if (!mounted) return;
    applyTokens(resolvedTheme === "light" ? LIGHT_TOKENS : DARK_TOKENS);
    document.documentElement.setAttribute("data-theme", resolvedTheme);
  }, [resolvedTheme, mounted]);

  function setTheme(t: Theme) {
    setThemeState(t);
    localStorage.setItem("campus-theme", t);
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
