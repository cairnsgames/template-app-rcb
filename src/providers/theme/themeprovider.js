import React, { createContext, useEffect, useState } from "react";

const ThemeContext = createContext({ theme: "light", setTheme: () => {} });

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => 
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleThemeChange = (e) => {
      setTheme(e.matches ? "dark" : "light");
    };

    // Listen for changes in system theme
    mediaQuery.addEventListener("change", handleThemeChange);

    // Cleanup event listener on unmount
    return () => {
      mediaQuery.removeEventListener("change", handleThemeChange);
    };
  }, []);

  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute("data-bs-theme", theme);
      document.body.setAttribute("data-bs-theme", theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };
