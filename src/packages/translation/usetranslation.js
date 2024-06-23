import { useContext } from "react";
import { TranslationContext } from "./translationprovider";

export const useTranslation = () => {
  // get the context
  const context = useContext(TranslationContext);

  // if `undefined`, throw an error
  if (!context) {
    throw new Error("useTranslation was used outside of its Provider");
  }
  const { locale, setLocale, t } = context;

  return { locale, setLocale, t };
};

export default useTranslation;
