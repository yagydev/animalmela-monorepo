import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      english: 'English',
      hindi: 'Hindi',
      marathi: 'Marathi',
      punjabi: 'Punjabi',
      // Add more translations as needed
    },
  },
  hi: {
    translation: {
      english: 'अंग्रेजी',
      hindi: 'हिंदी',
      marathi: 'मराठी',
      punjabi: 'पंजाबी',
    },
  },
  mr: {
    translation: {
      english: 'इंग्रजी',
      hindi: 'हिंदी',
      marathi: 'मराठी',
      punjabi: 'पंजाबी',
    },
  },
  pa: {
    translation: {
      english: 'ਅੰਗਰੇਜ਼ੀ',
      hindi: 'ਹਿੰਦੀ',
      marathi: 'ਮਰਾਠੀ',
      punjabi: 'ਪੰਜਾਬੀ',
    },
  },
};

// Initialize i18n
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already does escaping
    },
  });

export default i18n;

