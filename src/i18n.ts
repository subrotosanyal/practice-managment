import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      'Practice Management': 'Practice Management',
      welcome: 'Welcome',
      sidebar: {
        patient: 'Patient',
        accounting: 'Accounting',
        reporting: 'Reporting',
        administration: 'Administration',
        practitioner: 'Practitioner',
        appointment: 'Appointment',
        analytics: 'Analytics',
        settings: 'Settings',
      },
      userMenu: {
        profile: 'Profile',
        settings: 'Settings',
        logout: 'Logout'
      },
      theme: {
        light: 'Light',
        dark: 'Dark',
        system: 'System'
      },
      admin: {
        title: 'Administration',
        tabs: {
          general: 'General',
          customization: 'Customization',
          users: 'User Management'
        },
        skins: {
          title: 'Application Theme',
          description: 'Choose a theme that best suits your preferences. Changes will be applied immediately.',
          disabled: 'Theme customization is currently disabled.',
          changed: 'Theme Updated',
          changedDescription: 'Your theme preferences have been saved.'
        }
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;
