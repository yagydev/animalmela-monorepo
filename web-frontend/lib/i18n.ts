import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      welcome: 'Welcome',
      home: 'Home',
      farmersMarket: 'Farmers Market',
      farmersManagement: 'Farmers Management',
      services: 'Services',
      about: 'About',
      contact: 'Contact',
      login: 'Sign In',
      register: 'Sign Up',
      english: 'English',
      hindi: 'Hindi',
      marathi: 'Marathi',
      punjabi: 'Punjabi',
      dashboard: 'Dashboard',
      monthly_visits: 'Monthly Visits',
      training_registrations: 'Training Registrations',
      total_farmers: 'Total Farmers',
      active_events: 'Active Events',
      completed_events: 'Completed Events'
    }
  },
  hi: {
    translation: {
      welcome: 'स्वागत',
      home: 'होम',
      farmersMarket: 'किसान बाजार',
      farmersManagement: 'किसान प्रबंधन',
      services: 'सेवाएं',
      about: 'के बारे में',
      contact: 'संपर्क',
      login: 'साइन इन',
      register: 'साइन अप',
      english: 'अंग्रेजी',
      hindi: 'हिंदी',
      marathi: 'मराठी',
      punjabi: 'पंजाबी'
    }
  },
  mr: {
    translation: {
      welcome: 'स्वागत',
      home: 'होम',
      farmersMarket: 'शेतकरी बाजार',
      farmersManagement: 'शेतकरी व्यवस्थापन',
      services: 'सेवा',
      about: 'बद्दल',
      contact: 'संपर्क',
      login: 'साइन इन',
      register: 'साइन अप',
      english: 'इंग्रजी',
      hindi: 'हिंदी',
      marathi: 'मराठी',
      punjabi: 'पंजाबी'
    }
  },
  pa: {
    translation: {
      welcome: 'ਸਵਾਗਤ',
      home: 'ਹੋਮ',
      farmersMarket: 'ਕਿਸਾਨ ਬਾਜ਼ਾਰ',
      farmersManagement: 'ਕਿਸਾਨ ਪ੍ਰਬੰਧਨ',
      services: 'ਸੇਵਾਵਾਂ',
      about: 'ਬਾਰੇ',
      contact: 'ਸੰਪਰਕ',
      login: 'ਸਾਈਨ ਇਨ',
      register: 'ਸਾਈਨ ਅੱਪ',
      english: 'ਅੰਗਰੇਜ਼ੀ',
      hindi: 'ਹਿੰਦੀ',
      marathi: 'ਮਰਾਠੀ',
      punjabi: 'ਪੰਜਾਬੀ'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    
    react: {
      useSuspense: false,
    }
  });

export default i18n;
