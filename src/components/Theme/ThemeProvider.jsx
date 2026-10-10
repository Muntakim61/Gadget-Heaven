import { createContext, useCallback, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "gh-theme";

const ThemeContext = createContext({ theme: "dark", toggleTheme: () => {} });

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Seed from the DOM rather than recomputing. The inline script in index.html
  // already resolved the theme before paint, so reading it back keeps React's
  // first render in agreement with what is on screen.
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme || "dark"
  );

  const applyTheme = useCallback((next) => {
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    setTheme(next);
  }, []);

  const toggleTheme = useCallback(() => {
    const next = theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private mode or blocked storage: the theme still applies for this session.
    }
    applyTheme(next);
  }, [theme, applyTheme]);

  // Track the OS preference, but only while the user has no explicit override.
  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event) => {
      let stored = null;
      try {
        stored = localStorage.getItem(STORAGE_KEY);
      } catch {
        stored = null;
      }
      if (stored === "light" || stored === "dark") return;
      applyTheme(event.matches ? "dark" : "light");
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [applyTheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
