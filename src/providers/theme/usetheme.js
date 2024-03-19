import { useContext } from "react";
import { ThemeContext } from "./themeprovider";

export const useTheme = () => {
    // get the context
    const context = useContext(ThemeContext);
  
    // if `undefined`, throw an error
    if (!context) {
      throw new Error("useTheme was used outside of its Provider");
    }
    const { theme, setTheme } = context;
  
    return { theme, setTheme };
  };