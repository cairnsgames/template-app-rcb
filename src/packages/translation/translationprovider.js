import { useState, createContext, useEffect, useMemo } from "react";
import { locales } from "./locales";

export const TranslationContext = createContext();

export const TranslationProvider = ({ children, ...props }) => {
  const [defaultLocale, setDefaultLocale] = useState(props.defaultLocale ?? "en");
  const [locale, setLocale] = useState(props.locale ?? props.defaultLocale ?? "en");

  const t = (key, loc) => {
    console.log("Locales: ", locales[loc])
    if (!loc) {
     return locales[locale][key] ?? locales[defaultLocale][key] ?? key;
    }
    console.log(loc, key, locales[loc][key])
    return locales[loc][key] ?? locales[defaultLocale][key] ?? key;
  }

  const translationValues = useMemo(() => {
    return {
      locale,
      setLocale,
      t,
    };
  }, [locale, t]);

  return (
    <TranslationContext.Provider value={translationValues}>
      {children}
    </TranslationContext.Provider>
  );
};

export default TranslationProvider;
