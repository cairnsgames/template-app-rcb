import React, { createContext, useEffect, useState } from "react";

const ThemeContext = createContext({ Theme: "" });

const ThemeProvider = (props) => {
  const { children } = props;

  const [theme, setTheme] = useState();

  useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setTheme("dark");
    } else {
      setTheme(localStorage.getItem("theme") || "light");
    }
  }, []);

  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute("data-bs-theme", theme);
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };
