import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

i18n
  .use(HttpApi) // loads translations from your server or public folder
  .use(LanguageDetector) // detects user language
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    supportedLngs: ['en', 'pt', 'fr', 'es'], // languages you support
    fallbackLng: 'en',           // fallback language
    debug: true,
    interpolation: {
      escapeValue: false,        // React already escapes by default
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json', // path to your translation files
    },
  });

export default i18n;
