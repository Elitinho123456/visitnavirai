// src/lib/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importando os arquivos de tradução (vamos criá-los no próximo passo)
import pt from '../locales/pt.json';
import en from '../locales/en.json';
import es from '../locales/es.json';

i18n
  .use(LanguageDetector) // Detecta o idioma do navegador automaticamente
  .use(initReactI18next)
  .init({
    resources: {
      pt: { translation: pt },
      en: { translation: en },
      es: { translation: es }
    },
    fallbackLng: 'pt', // Se não encontrar o idioma, usa PT
    interpolation: {
      escapeValue: false // React já protege contra XSS
    }
  });

export default i18n;